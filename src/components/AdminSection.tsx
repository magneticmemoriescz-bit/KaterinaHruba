import React, { useState } from 'react';
import { SERVICES } from '../data/servicesData';
import { Booking } from '../types';
import { Calendar, Trash2, ShieldAlert, Plus, Check, Clock, User, Filter, AlertCircle, Sparkles, Search, X } from 'lucide-react';

interface AdminSectionProps {
  bookings: Booking[];
  refreshBookings: () => Promise<void>;
  availableSlots: { date: string; time: string }[];
  refreshAvailableSlots: () => Promise<void>;
}

export default function AdminSection({ 
  bookings, 
  refreshBookings,
  availableSlots,
  refreshAvailableSlots
}: AdminSectionProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [blockStart, setBlockStart] = useState('12:00');
  const [blockEnd, setBlockEnd] = useState('13:00');
  const [blockNotes, setBlockNotes] = useState('Obědová pauza / Osobní volno');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Filter states for chronological booking list
  const [bookingFilter, setBookingFilter] = useState<'all' | 'client' | 'block'>('all');
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingSort, setBookingSort] = useState<'asc' | 'desc'>('asc');
  const [showFilterBar, setShowFilterBar] = useState(false);

  // Služba lookup dictionary
  const getServiceName = (id: string) => {
    if (id === 'block-personal') return 'Osobní volno / Blokace';
    return SERVICES.find(s => s.id === id)?.name || id;
  };

  // Convert time to minutes for sorting/math
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Handle deleting a booking
  const handleDeleteBooking = async (id: string) => {
    if (!window.confirm('Opravdu chcete zrušit/smazat tuto schůzku?')) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setSuccessMsg('Schůzka byla úspěšně smazána z kalendáře.');
        await refreshBookings();
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(result.error || 'Něco se nepodařilo zrušit.');
        setTimeout(() => setErrorMsg(''), 4000);
      }
    } catch (err) {
      console.error('Error deleting booking:', err);
      setErrorMsg('Chyba komunikace se serverem.');
      setTimeout(() => setErrorMsg(''), 4500);
    } finally {
      setLoading(false);
    }
  };

  // Create manual personal block block (treated as a special booking)
  const handleCreateBlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !blockStart || !blockEnd) return;
    
    setLoading(true);
    setErrorMsg('');

    const payload = {
      serviceId: 'block-personal',
      date: selectedDate,
      startTime: blockStart,
      endTime: blockEnd,
      clientName: 'Osobní volno',
      clientSurname: '(Administrátor)',
      clientPhone: '-',
      clientEmail: 'magnetic.memories.cz@gmail.com',
      notes: blockNotes
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (response.ok && result.success) {
        setSuccessMsg('Časový úsek byl zablokován jako osobní volno.');
        await refreshBookings();
        setBlockNotes('Obědová pauza / Osobní volno');
        setTimeout(() => setSuccessMsg(''), 4000);
      } else {
        setErrorMsg(result.error || 'Koliduje s jiným obsazeným časem.');
      }
    } catch (err) {
      console.error('Error blocking slot:', err);
      setErrorMsg('Chyba při propojování se serverem.');
    } finally {
      setLoading(false);
    }
  };

  // All 15-minute interval candidate slots
  const candidateTimes = [
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

  // Derive morning and afternoon subsets dynamically
  const morningSlots = candidateTimes.filter(t => t <= '12:00');
  const afternoonSlots = candidateTimes.filter(t => t >= '12:00');

  // Get active available slots defined by admin for the selected date
  const activeSlotsForDay = availableSlots
    .filter(slot => slot.date === selectedDate)
    .map(slot => slot.time);

  // Derive preset status
  const isMorningActive = activeSlotsForDay.length > 0 &&
    activeSlotsForDay.length === morningSlots.length &&
    morningSlots.every(t => activeSlotsForDay.includes(t));

  const isAfternoonActive = activeSlotsForDay.length > 0 &&
    activeSlotsForDay.length === afternoonSlots.length &&
    afternoonSlots.every(t => activeSlotsForDay.includes(t));

  const isAllActive = activeSlotsForDay.length > 0 &&
    activeSlotsForDay.length === candidateTimes.length &&
    candidateTimes.every(t => activeSlotsForDay.includes(t));

  // Toggle availability of a slot for the selected date
  const handleToggleSlotAvailability = async (time: string) => {
    setLoading(true);
    const isCurrentlyActive = activeSlotsForDay.includes(time);
    const newTimesForDay = isCurrentlyActive
      ? activeSlotsForDay.filter(t => t !== time)
      : [...activeSlotsForDay, time];

    try {
      const response = await fetch('/api/available-slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: selectedDate,
          times: newTimesForDay
        })
      });
      if (response.ok) {
        await refreshAvailableSlots();
      } else {
        setErrorMsg('Chyba při ukládání volného termínu.');
        setTimeout(() => setErrorMsg(''), 3000);
      }
    } catch (err) {
      console.error('Error toggling slot:', err);
      setErrorMsg('Chyba připojení k serveru.');
      setTimeout(() => setErrorMsg(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Quick preset actions to open standard shifts
  const handleApplyPresetTimes = async (presetType: 'morning' | 'afternoon' | 'all' | 'clear') => {
    setLoading(true);
    let timesToSet: string[] = [];

    if (presetType === 'morning') {
      timesToSet = morningSlots;
    } else if (presetType === 'afternoon') {
      timesToSet = afternoonSlots;
    } else if (presetType === 'all') {
      timesToSet = candidateTimes;
    } else if (presetType === 'clear') {
      timesToSet = [];
    }

    try {
      const response = await fetch('/api/available-slots', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          date: selectedDate,
          times: timesToSet
        })
      });
      if (response.ok) {
        await refreshAvailableSlots();
        setSuccessMsg('Šablona volných termínů byla aplikována.');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      console.error('Preset error:', err);
    } finally {
      setLoading(false);
    }
  };

  const baselineDuration = 60;

  const checkOverlap = (
    start1: string,
    end1: string,
    start2: string,
    end2: string,
    buffer: number = 15
  ): boolean => {
    const s1 = timeToMinutes(start1);
    const e1 = timeToMinutes(end1);
    const s2 = timeToMinutes(start2);
    const e2 = timeToMinutes(end2);
    return !(s2 >= e1 + buffer || s1 >= e2 + buffer);
  };

  // Generate overview of slots status
  const dailySlotsOverview = candidateTimes.map(startTime => {
    const startMin = timeToMinutes(startTime);
    const endMin = startMin + baselineDuration;
    const endTime = minutesToTime(endMin);

    const conflict = bookings.find(b => {
      if (b.date !== selectedDate) return false;
      return checkOverlap(startTime, endTime, b.startTime, b.endTime, 15);
    });

    return {
      startTime,
      endTime,
      isAvailable: !conflict,
      booking: conflict || null
    };
  });

  const freeSlotsOnly = dailySlotsOverview.filter(s => s.isAvailable);

  // Filter and sort bookings chronologically
  const filteredAndSortedBookings = [...bookings]
    .filter((b) => {
      // 1. Filter by type
      if (bookingFilter === 'client' && b.serviceId === 'block-personal') return false;
      if (bookingFilter === 'block' && b.serviceId !== 'block-personal') return false;

      // 2. Filter by search query
      if (bookingSearch.trim() !== '') {
        const query = bookingSearch.toLowerCase();
        const name = `${b.clientName} ${b.clientSurname}`.toLowerCase();
        const serviceName = getServiceName(b.serviceId).toLowerCase();
        const notes = (b.notes || '').toLowerCase();
        const email = b.clientEmail.toLowerCase();
        const phone = b.clientPhone.toLowerCase();
        const date = b.date.toLowerCase();
        
        return (
          name.includes(query) ||
          serviceName.includes(query) ||
          notes.includes(query) ||
          email.includes(query) ||
          phone.includes(query) ||
          date.includes(query)
        );
      }
      return true;
    })
    .sort((a, b) => {
      // 3. Sort chronologically
      let dateComparison = 0;
      if (a.date !== b.date) {
        dateComparison = a.date.localeCompare(b.date);
      } else {
        dateComparison = a.startTime.localeCompare(b.startTime);
      }
      return bookingSort === 'asc' ? dateComparison : -dateComparison;
    });

  return (
    <div className="space-y-10 animate-fade-in" id="admin-panel">
      {/* Admin header */}
      <div className="bg-[#53331F] text-white rounded-3xl p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="inline-block px-3 py-1 bg-[#3F2212] rounded-full text-xs font-semibold tracking-wider uppercase mb-2">
            Administrátorský panel
          </span>
          <h2 className="text-3xl font-serif font-light">
            Vítejte zpět, Kateřino
          </h2>
          <p className="text-stone-200 text-sm font-light max-w-xl mt-1">
            Zde můžete definovat volné termíny pro jednotlivé dny, blokovat časy jako osobní volno a prohlížet si detailní seznam všech objednaných klientů.
          </p>
        </div>
        <div className="flex bg-[#3F2212]/60 p-3 rounded-2xl items-center space-x-4 shrink-0 border border-stone-700/30 text-center md:text-left">
          <div>
            <span className="text-2xl font-bold font-serif">{bookings.length}</span>
            <p className="text-[10px] uppercase font-semibold text-stone-300 tracking-wide mt-0.5">Celkem rezervací</p>
          </div>
          <div className="border-l border-stone-700 pl-4">
            <span className="text-2xl font-bold font-serif">
              {bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length}
            </span>
            <p className="text-[10px] uppercase font-semibold text-stone-300 tracking-wide mt-0.5">Dnes ošetření</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl flex items-center space-x-2 text-sm shadow-sm">
          <Check className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-xl flex items-center space-x-2 text-sm shadow-sm">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Layout Grid */}
      <div className="grid lg:grid-cols-12 gap-8" id="admin-layout-grid">
        
        {/* LEFT PANEL: Available slot management & Date select */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Main date and slot manager card */}
          <div className="bg-white p-6 rounded-2xl border border-[#E6D9C9] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div>
                <h3 className="font-serif font-medium text-stone-900 text-lg">Vypisování volných termínů</h3>
                <p className="text-xs text-stone-500 font-light mt-0.5">Zvolte datum a vyklikejte časy, které chcete nabídnout klientům k rezervaci</p>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2.5 rounded-lg border border-[#E6D9C9] text-sm text-stone-800 focus:ring-1 focus:ring-[#53331F] outline-none"
              />
            </div>

            {/* QUICK PRESETS */}
            <div className="bg-[#FAF6F0] p-3.5 rounded-xl border border-[#E6D9C9] space-y-2">
              <span className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block">Rychlé šablony pro vybraný den:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleApplyPresetTimes('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isAllActive
                      ? 'bg-[#53331F] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Celý den
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetTimes('morning')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isMorningActive
                      ? 'bg-[#53331F] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Dopoledne (do 12:00)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetTimes('afternoon')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isAfternoonActive
                      ? 'bg-[#53331F] text-white shadow-sm'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  Odpoledne (od 12:00)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPresetTimes('clear')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    activeSlotsForDay.length === 0
                      ? 'bg-red-200 text-red-900 shadow-xs font-bold'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  Smazat všechny
                </button>
              </div>
            </div>

            {/* THE INTERACTIVE TOGGLE GRID */}
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase text-stone-500 tracking-wider block">
                Zvolte volné časy pro {selectedDate}:
              </span>
              <p className="text-[11px] text-stone-400 font-light italic">
                Kliknutím na časový úsek jej aktivujete (zobrazí se hnědě) nebo deaktivujete pro klientské rezervace. Změny se ukládají automaticky.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {candidateTimes.map((time) => {
                  const isActive = activeSlotsForDay.includes(time);
                  return (
                    <button
                      type="button"
                      key={time}
                      onClick={() => handleToggleSlotAvailability(time)}
                      disabled={loading}
                      className={`p-3 rounded-xl border text-center transition-all ${
                        isActive
                          ? 'bg-[#53331F] border-[#53331F] text-[#FAF6F0] font-semibold'
                          : 'bg-white border-stone-200 text-stone-500 hover:border-stone-400 hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <span className="text-sm font-mono">{time}</span>
                      <span className="block text-[9px] uppercase font-semibold mt-1 opacity-75">
                        {isActive ? 'Volný ✓' : 'Neaktivní'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* OBSAZENÉ TERMÍNY (Occupied term list) */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <span className="text-xs font-semibold uppercase text-stone-500 tracking-wider block">
                🔴 OBSAZENÉ / rezervované TERMÍNY ({bookings.filter(b => b.date === selectedDate).length})
              </span>
              {bookings.filter(b => b.date === selectedDate).length === 0 ? (
                <p className="text-xs text-stone-400 italic font-light">Žádné aktivní schůzky ani blokace na tento den.</p>
              ) : (
                <div className="space-y-2.5" id="admin-reserved-slots-list">
                  {bookings
                    .filter(b => b.date === selectedDate)
                    .sort((a,b) => a.startTime.localeCompare(b.startTime))
                    .map(b => (
                      <div key={b.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-semibold bg-stone-200 px-1.5 py-0.5 rounded text-stone-800">
                              {b.startTime} - {b.endTime}
                            </span>
                            <span className="font-serif font-medium text-stone-900">
                              {b.clientName} {b.clientSurname}
                            </span>
                          </div>
                          <p className="text-stone-500 font-light">
                            {getServiceName(b.serviceId)} {b.clientPhone !== '-' && `(Tel: ${b.clientPhone}, Email: ${b.clientEmail})`}
                          </p>
                          {b.notes && <p className="text-stone-700 italic bg-[#F5EBE0] p-1.5 rounded">Poznámka: {b.notes}</p>}
                        </div>

                        <button
                          id={`admin-del-booking-${b.id}`}
                          onClick={() => handleDeleteBooking(b.id)}
                          className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg self-end sm:self-center transition-colors shadow-xs"
                          title="Smazat rezervaci a uvolnit termín"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Section: Time Blocker (Osobní volno builder) */}
          <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#E6D9C9] shadow-xs">
            <h3 className="font-serif font-medium text-stone-900 text-lg mb-3">Zablokovat čas / Osobní volno</h3>
            <p className="text-xs text-stone-500 font-light mb-4">
              Vytvořte speciální blokaci času (např. lékař, schůzka, dovolená). Tento časový úsek se v rezervačním kalendáři zobrazí jako obsazený, i kdyby byl jinak aktivní.
            </p>

            <form onSubmit={handleCreateBlock} className="grid sm:grid-cols-12 gap-4">
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[10px] font-semibold tracking-wider text-stone-500 uppercase">Začátek času:</label>
                <input
                  type="time"
                  required
                  value={blockStart}
                  onChange={(e) => setBlockStart(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E6D9C9] bg-white text-sm outline-none focus:ring-1 focus:ring-[#53331F]"
                />
              </div>
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[10px] font-semibold tracking-wider text-stone-500 uppercase">Konec času:</label>
                <input
                  type="time"
                  required
                  value={blockEnd}
                  onChange={(e) => setBlockEnd(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#E6D9C9] bg-white text-sm outline-none focus:ring-1 focus:ring-[#53331F]"
                />
              </div>
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[10px] font-semibold tracking-wider text-stone-500 uppercase">Poznámka:</label>
                <input
                  type="text"
                  value={blockNotes}
                  onChange={(e) => setBlockNotes(e.target.value)}
                  placeholder="Obědová pauza"
                  className="w-full p-2.5 rounded-lg border border-[#E6D9C9] bg-white text-sm outline-none focus:ring-1 focus:ring-[#53331F]"
                />
              </div>
              <div className="sm:col-span-12">
                <button
                  id="admin-create-block-btn"
                  disabled={loading}
                  type="submit"
                  className="w-full py-3 rounded-lg text-center text-xs font-semibold tracking-wider text-white bg-[#53331F] hover:bg-[#3F2212] disabled:bg-stone-300 transition-all uppercase flex items-center justify-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Vytvořit blokaci času</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT PANEL: Chronological Booking Master List (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-[#E6D9C9]">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
            <div>
              <h3 className="font-serif font-medium text-stone-900 text-lg">Všechny nadcházející události</h3>
              <p className="text-xs text-stone-500 font-light mt-0.5">Chronologický přehled všech naplánovaných setkání</p>
            </div>
            <button
              onClick={() => setShowFilterBar(!showFilterBar)}
              className={`p-2 rounded-xl transition-all flex items-center space-x-1.5 border text-xs font-semibold ${
                showFilterBar || bookingFilter !== 'all' || bookingSearch
                  ? 'bg-[#53331F] text-white border-[#53331F] shadow-xs'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:text-stone-800 hover:bg-stone-100'
              }`}
              title="Zobrazit filtry a vyhledávání"
            >
              <Filter className="w-3.5 h-3.5" />
              <span>Filtry</span>
              {(bookingFilter !== 'all' || bookingSearch) && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>
          </div>

          {/* Filter Bar (Toggled) */}
          {showFilterBar && (
            <div className="bg-[#FAF6F0] p-4 rounded-xl border border-[#E6D9C9] mb-5 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Vyhledávání a filtrování</span>
                <button 
                  onClick={() => {
                    setBookingFilter('all');
                    setBookingSearch('');
                    setBookingSort('asc');
                  }}
                  className="text-[10px] text-stone-500 hover:text-red-700 underline font-medium"
                >
                  Resetovat
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Hledat klienta, službu, datum, poznámku..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-lg border border-[#E6D9C9] bg-white text-xs outline-none focus:ring-1 focus:ring-[#53331F]"
                />
                {bookingSearch && (
                  <button 
                    onClick={() => setBookingSearch('')}
                    className="absolute right-2.5 top-2.5 p-0.5 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Type and Sorting selectors */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-semibold text-stone-500 uppercase tracking-wide">Typ události:</label>
                  <select
                    value={bookingFilter}
                    onChange={(e: any) => setBookingFilter(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#E6D9C9] bg-white text-xs outline-none focus:ring-1 focus:ring-[#53331F]"
                  >
                    <option value="all">Všechny události</option>
                    <option value="client">Pouze rezervace</option>
                    <option value="block">Pouze osobní volno</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-semibold text-stone-500 uppercase tracking-wide">Řazení:</label>
                  <select
                    value={bookingSort}
                    onChange={(e: any) => setBookingSort(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#E6D9C9] bg-white text-xs outline-none focus:ring-1 focus:ring-[#53331F]"
                  >
                    <option value="asc">Od nejbližšího (Po - Ne)</option>
                    <option value="desc">Od nejvzdálenějšího</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3.5 max-h-[620px] overflow-y-auto pr-1" id="admin-all-bookings-stream">
            {filteredAndSortedBookings.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <AlertCircle className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-stone-400 text-xs italic font-light">
                  {bookings.length === 0 
                    ? 'Zatím nebyly vytvořeny žádné rezervace.' 
                    : 'Zadanému filtru neodpovídá žádná událost.'}
                </p>
              </div>
            ) : (
              filteredAndSortedBookings.map((b) => (
                <div key={b.id} className="p-4 bg-[#FAF6F0] hover:bg-stone-100/40 rounded-xl border border-[#E6D9C9] text-xs space-y-2 transition-colors">
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-semibold text-[#53331F] bg-[#F5EBE0] px-2 py-0.5 rounded tracking-wide">
                      {b.date}
                    </span>
                    <span className="font-mono text-[#53331F] bg-[#F5EBE0]/80 font-semibold px-2 py-0.5 rounded">
                      {b.startTime} - {b.endTime}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-stone-950 text-sm">
                      {b.clientName} {b.clientSurname}
                    </h4>
                    <p className="text-stone-600 font-light mt-0.5">
                      <strong className="font-serif font-medium text-stone-800">Služba:</strong> {getServiceName(b.serviceId)}
                    </p>
                    {b.clientPhone !== '-' && (
                      <p className="text-stone-500 font-light font-mono mt-0.5">
                        ☎ {b.clientPhone} | ✉ {b.clientEmail}
                      </p>
                    )}
                    {b.notes && (
                      <p className="mt-1.5 p-1.5 bg-stone-50 border-l-2 border-[#53331F] text-stone-600 font-light italic leading-relaxed">
                        Poznámka: {b.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      id={`admin-stream-del-${b.id}`}
                      onClick={() => handleDeleteBooking(b.id)}
                      className="text-[10px] font-semibold tracking-wider text-stone-400 hover:text-red-700 transition-colors uppercase flex items-center space-x-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Smazat</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
