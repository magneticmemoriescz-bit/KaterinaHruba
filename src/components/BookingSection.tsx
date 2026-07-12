import React, { useState, useEffect } from 'react';
import { SERVICES } from '../data/servicesData';
import { Booking } from '../types';
import { Calendar, Clock, User, Phone, Mail, CheckCircle, ChevronLeft, ChevronRight, CalendarHeart } from 'lucide-react';
import { createBooking, deleteBooking } from '../lib/firebaseService';

interface BookingSectionProps {
  selectedServiceId: string;
  setSelectedServiceId: (id: string) => void;
  bookings: Booking[];
  refreshBookings: () => Promise<void>;
  availableSlots: { date: string; time: string }[];
  refreshAvailableSlots: () => Promise<void>;
}

export default function BookingSection({
  selectedServiceId,
  setSelectedServiceId,
  bookings,
  refreshBookings,
  availableSlots,
  refreshAvailableSlots
}: BookingSectionProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState('');
  const [clientSurname, setClientSurname] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [notes, setNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [lastCreatedBooking, setLastCreatedBooking] = useState<Booking | null>(null);

  // States for live cancellation testing in success card
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState(false);

  // Get Monday of the current week as initial start
  const getMondayOfCurrentWeek = () => {
    const d = new Date();
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday to get previous Monday
    const monday = new Date(d.setDate(diff));
    monday.setHours(0, 0, 0, 0);
    return monday;
  };

  const [weekStart, setWeekStart] = useState<Date>(getMondayOfCurrentWeek);

  // Compute the 7 days of the active week
  const getDaysOfWeek = (startDate: Date) => {
    const days = [];
    const dayNamesShort = ['Po', 'Út', 'St', 'Čt', 'Pá', 'So', 'Ne'];
    const dayNamesFull = ['Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota', 'Neděle'];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i);
      
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      const valueStr = `${yyyy}-${mm}-${dd}`;
      
      days.push({
        value: valueStr,
        dayNameShort: dayNamesShort[i],
        dayNameFull: dayNamesFull[i],
        dayNum: d.getDate(),
        monthNum: d.getMonth() + 1,
        dateObj: d
      });
    }
    return days;
  };

  const weekDays = getDaysOfWeek(weekStart);

  // Initialize selected date to today or next available
  useEffect(() => {
    if (!selectedDate) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setSelectedDate(`${yyyy}-${mm}-${dd}`);
    }
    refreshAvailableSlots();
  }, []);

  const selectedService = SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0];

  // Format calculation helpers
  function timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  function minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  function checkOverlap(
    start1: string,
    end1: string,
    start2: string,
    end2: string,
    buffer: number = 15
  ): boolean {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);
    return !(s2 >= e1 + buffer || s1 >= e2 + buffer);
  }

  const serviceDuration = selectedService ? selectedService.duration : 60;

  // Detailed slots at 15-minute intervals for a pristine, granular booking experience
  const timeRows = [
    '09:00', '09:15', '09:30', '09:45',
    '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15', '11:30', '11:45',
    '12:00', '12:15', '12:30', '12:45',
    '13:00', '13:15', '13:30', '13:45',
    '14:00', '14:15', '14:30', '14:45',
    '15:00', '15:15', '15:30', '15:45',
    '16:00', '16:15', '16:30', '16:45',
    '17:00', '17:15', '17:30', '17:45',
    '18:00', '18:15'
  ];

  // Helper to retrieve cell state
  const getCellState = (dayValue: string, timeStr: string) => {
    const hasSlot = availableSlots.some(s => s.date === dayValue && s.time === timeStr);
    if (!hasSlot) return { type: 'empty' as const };

    const startMin = timeToMinutes(timeStr);
    const endMin = startMin + serviceDuration;
    const endTimeStr = minutesToTime(endMin);

    // Check conflict with any existing bookings on that date (15-min buffer)
    const conflict = bookings.find((b) => {
      if (b.date !== dayValue) return false;
      return checkOverlap(timeStr, endTimeStr, b.startTime, b.endTime, 15);
    });

    if (conflict) {
      return {
        type: 'reserved' as const,
        details: conflict.clientName === 'Osobní volno' ? 'Osobní volno' : 'Obsazeno'
      };
    }

    return { type: 'free' as const };
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !clientName || !clientSurname || !clientPhone || !clientEmail) {
      setErrorMsg('Prosím, vyplňte všechna povinná pole.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    const startMin = timeToMinutes(selectedTime);
    const endMin = startMin + serviceDuration;
    const endTime = minutesToTime(endMin);

    const bookingPayload = {
      serviceId: selectedService.id,
      date: selectedDate,
      startTime: selectedTime,
      endTime,
      clientName,
      clientSurname,
      clientPhone,
      clientEmail,
      notes
    };

    try {
      const newBooking = await createBooking(bookingPayload);
      setSuccess(true);
      setCancelSuccess(false);
      setLastCreatedBooking(newBooking);
      await refreshBookings();
      // Clear form
      setClientName('');
      setClientSurname('');
      setClientPhone('');
      setClientEmail('');
      setNotes('');
      setSelectedTime('');
    } catch (err) {
      console.error('Firestore error booking:', err);
      setErrorMsg('Nepodařilo se uložit rezervaci. Zkuste to prosím znovu.');
    } finally {
      setLoading(false);
    }
  };

  // Live simulation cancellation trigger on success panel
  const handleCancelCreatedBooking = async (id: string) => {
    if (!window.confirm('Opravdu si přejete zrušit tuto nově vytvořenou rezervaci termínu?')) {
      return;
    }
    setCancelLoading(true);
    try {
      await deleteBooking(id);
      setCancelSuccess(true);
      await refreshBookings();
    } catch (err) {
      console.error('Error cancelling in success view:', err);
      alert('Chyba při rušení termínu.');
    } finally {
      setCancelLoading(false);
    }
  };

  // Human-readable selected date for the booking card
  const activeDayObj = weekDays.find(d => d.value === selectedDate) || { dayNameFull: 'Vybraný den', dayNum: '', monthNum: '' };
  const selectedDateLabel = activeDayObj.dayNum ? `${activeDayObj.dayNameFull} ${activeDayObj.dayNum}. ${activeDayObj.monthNum}.` : selectedDate;

  // Navigation limits
  const currentWeekMonday = getMondayOfCurrentWeek();
  const isPrevWeekDisabled = weekStart.getTime() <= currentWeekMonday.getTime();

  // 1. SUCCESS STATE with simulated email confirmation inbox copy
  if (success && lastCreatedBooking) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in" id="booking-success-outer">
        {/* Banner Success Card */}
        <div className="bg-white p-8 rounded-3xl border border-[#E6D9C9] text-center space-y-6 shadow-sm" id="booking-success-container">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif font-light text-stone-900">Rezervace úspěšně uložena</h2>
            <p className="text-stone-500 font-light text-sm max-w-lg mx-auto">
              Váš termín byl zaznamenán do systému. Kateřina Hrubá i vy jste obdrželi notifikační e-mail o této schůzce.
            </p>
          </div>
          <div className="flex justify-center">
            <button
              id="booking-success-new-btn"
              onClick={() => {
                setSuccess(false);
                setLastCreatedBooking(null);
                setCancelSuccess(false);
              }}
              className="px-6 py-2.5 rounded-full bg-[#53331F] text-white text-xs font-semibold hover:bg-[#3F2212] uppercase tracking-wider transition-all shadow-xs"
            >
              Vytvořit další rezervaci
            </button>
          </div>
        </div>

        {/* E-MAIL CONFIRMATION SIMULATOR PANEL */}
        <div className="bg-stone-900 rounded-3xl overflow-hidden border border-stone-800 shadow-xl" id="email-confirmation-simulator">
          {/* Email client top bar header */}
          <div className="bg-stone-850 px-6 py-3.5 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400 font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
              <span className="pl-2 text-stone-300 font-sans font-medium">Doručená pošta — Simulační náhled potvrzení</span>
            </div>
            <span className="hidden sm:inline">Právě teď</span>
          </div>

          {/* Email envelope headers */}
          <div className="p-6 bg-stone-900 border-b border-stone-800/60 text-xs space-y-1.5 font-light text-stone-400">
            <p><strong className="text-stone-300 font-normal">Odesílatel:</strong> Kateřina Hrubá &lt;<span className="text-[#B38B6D] hover:underline">magnetic.memories.cz@gmail.com</span>&gt;</p>
            <p><strong className="text-stone-300 font-normal">Příjemce:</strong> {lastCreatedBooking.clientName} {lastCreatedBooking.clientSurname} &lt;<span className="text-[#B38B6D] hover:underline">{lastCreatedBooking.clientEmail}</span>&gt;</p>
            <p><strong className="text-stone-300 font-normal">Předmět:</strong> <span className="text-white font-medium">Potvrzení rezervace péče na venkovském statku v Salajně</span></p>
          </div>

          {/* Email body (letter aesthetic) */}
          <div className="p-8 bg-white text-stone-800 text-sm font-sans leading-relaxed space-y-6">
            <div className="space-y-2">
              <p className="font-serif text-base font-semibold text-stone-950">Vážená klientko, vážený kliente,</p>
              <p className="font-light text-stone-600">
                velmi děkuji za Váš zájem a důvěru. Tímto potvrzuji přijetí Vašeho vybraného termínu do mého rezervačního kalendáře. Těším se na společné setkání v oáze klidu a bezpečí.
              </p>
            </div>

            {/* Structured details card */}
            <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#E6D9C9]/60 space-y-3 text-xs font-light text-stone-700">
              <h4 className="font-serif font-semibold text-stone-950 text-sm border-b border-[#E6D9C9] pb-2">Podrobnosti ošetření:</h4>
              <p><strong className="font-serif text-stone-900 font-medium">Vybraná péče:</strong> {selectedService.name}</p>
              <p><strong className="font-serif text-stone-900 font-medium">Datum setkání:</strong> {lastCreatedBooking.date}</p>
              <p><strong className="font-serif text-stone-900 font-medium">Přesný čas:</strong> {lastCreatedBooking.startTime} – {lastCreatedBooking.endTime} <span className="text-[10px] text-stone-500 font-sans italic">(včetně 15minutové klidové pauzy pro uvolnění a přípravu studia)</span></p>
              <p><strong className="font-serif text-stone-900 font-medium">Délka péče:</strong> {selectedService.duration} minut</p>
              <p><strong className="font-serif text-stone-900 font-medium">Odhadovaná cena:</strong> {selectedService.price} Kč</p>
              <p><strong className="font-serif text-stone-900 font-medium">Místo konání:</strong> <span className="text-stone-950 font-medium">Salajna 17, 350 02 Dolní Žandov</span> (historický venkovský statek se zázemím masérského studia. Můžete dojet autem přímo na místo a zaparkovat tam.)</p>
              {lastCreatedBooking.notes && (
                <p><strong className="font-serif text-stone-900 font-medium">Vaše poznámka:</strong> {lastCreatedBooking.notes}</p>
              )}
            </div>

            {/* Cancellation block with Interactive Live link */}
            <div className="border-t border-stone-100 pt-6 space-y-4">
              <p className="text-xs text-stone-500 font-light">
                Chápeme, že život přináší neočekávané změny. Pokud potřebujete tento termín přesunout nebo bezplatně zrušit, učiňte tak prosím nejpozději <strong className="text-stone-850 font-semibold">24 hodin před ošetřením</strong>, aby byl čas nabídnut dalším zájemcům.
              </p>

              {cancelSuccess ? (
                <div className="bg-red-50 text-red-800 p-4 rounded-xl text-xs font-semibold text-center border border-red-100 animate-pulse">
                  Tento termín byl právě úspěšně zrušen (smazán z databáze). Kalendář je opět volný.
                </div>
              ) : (
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-stone-900">Simulace odkazu pro zrušení:</p>
                    <p className="text-[10px] text-stone-400 font-mono break-all">{window.location.origin}?cancelBooking={lastCreatedBooking.id}</p>
                  </div>
                  <button
                    type="button"
                    disabled={cancelLoading}
                    onClick={() => handleCancelCreatedBooking(lastCreatedBooking.id)}
                    className="px-5 py-2.5 bg-red-650 hover:bg-red-750 text-white rounded-lg text-xs font-semibold tracking-wider transition-all disabled:opacity-50 shrink-0 text-center cursor-pointer"
                  >
                    {cancelLoading ? 'Ruším termín...' : 'Zrušit termín ošetření'}
                  </button>
                </div>
              )}
            </div>

            {/* Signature */}
            <div className="text-xs text-stone-400 border-t border-stone-100 pt-5 font-light">
              <p className="font-serif text-stone-800 font-medium">S úctou a přáním krásného dne,</p>
              <p className="text-stone-900 mt-1">Kateřina Hrubá – Péče o tělo i duši</p>
              <p>Salajna 17, Dolní Žandov | Telefon: +420 732 984 105</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. MAIN BOOKING CALENDAR LAYOUT
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-fade-in" id="booking-section-container">
      {/* Dynamic Intro */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h2 className="text-xs tracking-widest text-[#53331F] font-bold uppercase">Rezervační systém</h2>
        <p className="text-3xl font-serif text-stone-900 font-light">Objednejte se na ošetření</p>
        <p className="text-stone-500 text-sm font-light leading-relaxed">
          Zvolte péči z nabídky, klikněte na libovolný volný čas v týdenním přehledu a doplňte své kontaktní údaje.
        </p>
        <div className="w-12 h-0.5 bg-[#B38B6D] mx-auto rounded-full mt-4"></div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: Service Selector & Weekly Calendar Grid */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Step 1: Select Service */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6D9C9] space-y-4">
            <label className="block text-sm font-serif font-medium text-stone-850" htmlFor="booking-service-select">
              1. Vyberte požadovanou péči:
            </label>
            <select
              id="booking-service-select"
              value={selectedServiceId}
              onChange={(e) => {
                setSelectedServiceId(e.target.value);
                setSelectedTime('');
              }}
              className="w-full p-4 rounded-xl border border-[#E6D9C9] bg-[#FAF6F0]/30 text-stone-850 shadow-2xs focus:ring-1 focus:ring-[#53331F] focus:border-transparent transition-all outline-none text-sm cursor-pointer"
            >
              {SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.duration} min – {s.price} Kč)
                </option>
              ))}
            </select>
          </div>

          {/* Steps 2 & 3 Combined: Weekly Calendar Grid */}
          <div className="space-y-4">
            <span className="block text-sm font-serif font-medium text-stone-850 px-1">
              2. Zvolte den a volný čas :
            </span>

            {/* Calendar Box wrapper */}
            <div className="bg-white rounded-3xl border border-[#E6D9C9] overflow-hidden shadow-2xs">
              
              {/* Table Header Accent banner */}
              <div className="bg-[#53331F] text-white px-5 py-4 font-serif text-xs tracking-wider uppercase font-semibold flex items-center justify-between" id="online-booking-banner">
                <span className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 absolute"></span>
                  <span className="pl-2">AKTUÁLNÍ ROZPIS VOLNÝCH TERMÍNŮ</span>
                </span>
              </div>

              {/* Sub-header navigation control bar */}
              <div className="border-b border-[#E6D9C9] p-4 bg-[#FAF6F0]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs" id="booking-calendar-nav">
                <div className="flex items-center space-x-2.5">
                  <span className="text-sm font-serif font-semibold text-stone-900">Vyberte volný slot</span>
                  <button
                    type="button"
                    onClick={() => {
                      setWeekStart(getMondayOfCurrentWeek());
                      const today = new Date();
                      const yyyy = today.getFullYear();
                      const mm = String(today.getMonth() + 1).padStart(2, '0');
                      const dd = String(today.getDate()).padStart(2, '0');
                      setSelectedDate(`${yyyy}-${mm}-${dd}`);
                      setSelectedTime('');
                    }}
                    className="px-3 py-1 bg-white border border-[#E6D9C9] hover:bg-[#FAF6F0] rounded-lg text-[10px] uppercase font-bold text-stone-600 transition-all cursor-pointer shadow-3xs"
                  >
                    Tento týden
                  </button>
                </div>

                {/* Week switcher arrows */}
                <div className="flex items-center space-x-2.5">
                  <button
                    type="button"
                    disabled={isPrevWeekDisabled}
                    onClick={() => {
                      const prev = new Date(weekStart);
                      prev.setDate(weekStart.getDate() - 7);
                      setWeekStart(prev);
                    }}
                    className="p-1.5 rounded-lg border border-[#E6D9C9] bg-white text-stone-600 hover:bg-[#FAF6F0] hover:text-[#53331F] disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-stone-600 transition-all cursor-pointer"
                    title="Předchozí týden"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="font-mono font-bold text-stone-700 bg-stone-100/80 border border-stone-200/50 px-3 py-1.5 rounded-lg flex items-center space-x-2">
                    <Calendar className="w-3.5 h-3.5 text-[#53331F]" />
                    <span>Týden: {weekDays[0].dayNum}. {weekDays[0].monthNum}. – {weekDays[6].dayNum}. {weekDays[6].monthNum}.</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const next = new Date(weekStart);
                      next.setDate(weekStart.getDate() + 7);
                      setWeekStart(next);
                    }}
                    className="p-1.5 rounded-lg border border-[#E6D9C9] bg-white text-stone-600 hover:bg-[#FAF6F0] hover:text-[#53331F] transition-all cursor-pointer"
                    title="Další týden"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Table / Grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[700px] flex flex-col" id="weekly-calendar-table">
                  {/* Table Headers (Po - Ne) */}
                  <div className="grid grid-cols-7 bg-[#FAF6F0] divide-x divide-[#E6D9C9] text-center border-b border-[#E6D9C9]">
                    {weekDays.map((day) => {
                      const todayStr = new Date().toISOString().split('T')[0];
                      const isToday = day.value === todayStr;
                      
                      return (
                        <div key={day.value} className={`py-4 px-1 flex flex-col items-center justify-center ${isToday ? 'bg-[#F5EBE0]/40' : ''}`}>
                          <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-widest">{day.dayNameShort}</span>
                          <span className="text-base font-serif font-bold text-stone-900 mt-1 leading-none">{day.dayNum}. {day.monthNum}.</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Scrollable Rows of Times */}
                  <div className="divide-y divide-stone-100 bg-white max-h-[420px] overflow-y-auto">
                    {timeRows.map((time) => (
                      <div key={time} className="grid grid-cols-7 divide-x divide-[#E6D9C9] hover:bg-[#FAF6F0]/20 transition-all">
                        {weekDays.map((day) => {
                          const state = getCellState(day.value, time);
                          const isSelected = selectedDate === day.value && selectedTime === time;

                          if (state.type === 'empty') {
                            return (
                              <div key={day.value} className="h-14 bg-stone-50/20" title="Žádný vypsaný čas k dispozici"></div>
                            );
                          }

                          if (state.type === 'reserved') {
                            return (
                              <div key={day.value} className="h-14 p-1 flex items-center justify-center bg-striped select-none" title="Tento časový blok je již rezervován">
                                <span className="text-[9px] uppercase font-bold text-stone-400 tracking-wider">Obsazeno</span>
                              </div>
                            );
                          }

                          return (
                            <div key={day.value} className="h-14 p-1 flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDate(day.value);
                                  setSelectedTime(time);
                                }}
                                className={`w-full h-full rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer shadow-3xs flex flex-col items-center justify-center border ${
                                  isSelected
                                    ? 'bg-[#53331F] text-white border-[#53331F] shadow-sm scale-[1.01]'
                                    : 'bg-white border-[#E6D9C9] text-stone-800 hover:border-[#53331F] hover:bg-[#FAF6F0]'
                                }`}
                              >
                                <span className="font-mono text-xs font-bold leading-none">{time}</span>
                                <span className={`text-[8px] uppercase tracking-wider mt-1 ${isSelected ? 'text-white/80' : 'text-stone-400 font-normal'}`}>
                                  {isSelected ? 'Vybráno' : 'Volno'}
                                </span>
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>

                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT: Selected Details & Customer Information Form */}
        <div className="lg:col-span-4">
          <div className="bg-white p-6 rounded-3xl border border-[#E6D9C9] sticky top-24 space-y-5" id="booking-form-panel">
            <h3 className="font-serif font-medium text-stone-900 border-b border-[#E6D9C9] pb-3 text-lg">Informace o rezervaci</h3>

            {selectedTime ? (
              <div className="bg-[#FAF6F0] p-4.5 rounded-2xl text-stone-800 space-y-2.5 text-xs font-light border border-[#E6D9C9]/60">
                <p className="font-semibold text-[#53331F] font-serif text-sm">Zvolený termín</p>
                <div className="space-y-1">
                  <p>Služba: <strong className="font-medium text-stone-900">{selectedService.name}</strong></p>
                  <p>Datum: <strong className="font-medium text-stone-900">{selectedDateLabel}</strong></p>
                  <p>Čas: <strong className="font-medium text-stone-900 font-mono text-sm">{selectedTime} – {minutesToTime(timeToMinutes(selectedTime) + serviceDuration)}</strong></p>
                  <p className="text-[10px] text-stone-400 italic font-sans leading-relaxed pt-1.5">
                    * Zahrnuje ošetření ({serviceDuration} min) a 15 min hygienickou pauzu.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50/50 p-4.5 rounded-2xl text-amber-800 flex items-start space-x-2.5 text-xs font-light border border-amber-100">
                <Clock className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                <span className="leading-relaxed">Klikněte prosím na libovolné světlé tlačítko času v tabulce vlevo a vyberte si termín.</span>
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Křestní jméno:</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-3.5 w-3.5 text-stone-400" />
                    <input
                      type="text"
                      required
                      disabled={!selectedTime}
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Kateřina"
                      className="w-full pl-8.5 pr-3 py-2.5 rounded-xl border border-[#E6D9C9] bg-white text-stone-850 text-xs focus:ring-1 focus:ring-[#53331F] outline-none disabled:bg-stone-50 disabled:text-stone-300"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Příjmení:</label>
                  <div>
                    <input
                      type="text"
                      required
                      disabled={!selectedTime}
                      value={clientSurname}
                      onChange={(e) => setClientSurname(e.target.value)}
                      placeholder="Hrubá"
                      className="w-full px-3 py-2.5 rounded-xl border border-[#E6D9C9] bg-white text-stone-850 text-xs focus:ring-1 focus:ring-[#53331F] outline-none disabled:bg-stone-50 disabled:text-stone-300"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Telefonní číslo:</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-3.5 w-3.5 text-stone-400" />
                  <input
                    type="tel"
                    required
                    disabled={!selectedTime}
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+420 732 984 105"
                    className="w-full pl-8.5 pr-3 py-2.5 rounded-xl border border-[#E6D9C9] bg-white text-stone-850 text-xs focus:ring-1 focus:ring-[#53331F] outline-none disabled:bg-stone-50 disabled:text-stone-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">E-mailová adresa:</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-3.5 w-3.5 text-stone-400" />
                  <input
                    type="email"
                    required
                    disabled={!selectedTime}
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="katerina.hruba@seznam.cz"
                    className="w-full pl-8.5 pr-3 py-2.5 rounded-xl border border-[#E6D9C9] bg-white text-stone-850 text-xs focus:ring-1 focus:ring-[#53331F] outline-none disabled:bg-stone-50 disabled:text-stone-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Poznámka (volitelné):</label>
                <textarea
                  disabled={!selectedTime}
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Zadejte doplňující informace pro ošetření..."
                  className="w-full p-3 rounded-xl border border-[#E6D9C9] bg-white text-stone-850 text-xs focus:ring-1 focus:ring-[#53331F] outline-none disabled:bg-stone-50 disabled:text-stone-300 resize-none"
                />
              </div>

              {errorMsg && (
                <p className="text-red-600 text-xs font-semibold text-center bg-red-55 p-2 rounded-xl">
                  {errorMsg}
                </p>
              )}

              <button
                id="booking-submit-btn"
                disabled={!selectedTime || loading}
                type="submit"
                className="w-full py-3 rounded-full text-center text-xs font-bold uppercase tracking-wider bg-[#53331F] text-white hover:bg-[#3F2212] transition-all shadow-xs hover:shadow-md disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center space-x-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Odesílám...</span>
                  </>
                ) : (
                  <span>Rezervovat termín</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
