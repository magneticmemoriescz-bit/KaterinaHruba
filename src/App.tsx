import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeSection from './components/HomeSection';
import ServicesSection from './components/ServicesSection';
import PriceListSection from './components/PriceListSection';
import BookingSection from './components/BookingSection';
import AdminSection from './components/AdminSection';
import ContactsSection from './components/ContactsSection';
import { Booking } from './types';
import { Heart, MapPin, Mail, Phone, CalendarHeart } from 'lucide-react';
import { getBookings, getAvailableSlots, deleteBooking } from './lib/firebaseService';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string>('pece-o-jizvu');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableSlots, setAvailableSlots] = useState<{ date: string; time: string }[]>([]);

  // States for URL-based cancellation
  const [urlCancelBookingId, setUrlCancelBookingId] = useState<string | null>(null);
  const [urlCancelBookingData, setUrlCancelBookingData] = useState<Booking | null>(null);
  const [urlCancelSuccess, setUrlCancelSuccess] = useState<boolean>(false);
  const [urlCancelLoading, setUrlCancelLoading] = useState<boolean>(false);

  // Parse URL cancellation query parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cancelId = params.get('cancelBooking');
    if (cancelId) {
      setUrlCancelBookingId(cancelId);
      const found = bookings.find(b => b.id === cancelId);
      if (found) {
        setUrlCancelBookingData(found);
      }
    }
  }, [bookings]);

  // Local storage prefix/fallback key
  const LOCAL_STORAGE_KEY = 'katerina_hruba_bookings_fallback';

  // Scroll to top on active tab or admin view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab, isAdmin]);

  // Load bookings from Firestore with local storage fallback
  const refreshBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (err) {
      console.warn('Could not contact bookings Firestore, reading from localStorage fallback:', err);
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localData) {
        try {
          setBookings(JSON.parse(localData));
        } catch (parseErr) {
          console.error('Error parsing fallback local storage data:', parseErr);
        }
      }
    }
  };

  const refreshAvailableSlots = async () => {
    try {
      const data = await getAvailableSlots();
      setAvailableSlots(data);
    } catch (err) {
      console.warn('Could not contact available-slots Firestore:', err);
    }
  };

  useEffect(() => {
    refreshBookings();
    refreshAvailableSlots();
  }, []);

  const renderActiveSection = () => {
    if (isAdmin) {
      if (!isAdminUnlocked) {
        return (
          <div className="max-w-md mx-auto my-16 p-8 bg-white rounded-3xl border border-[#E6D9C9] shadow-sm space-y-6 text-center animate-fade-in" id="admin-password-gate">
            <h3 className="font-serif text-xl font-medium text-stone-800">Přihlášení do administrace</h3>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Tato sekce je určena pouze pro správce. Pro přístup zadejte bezpečnostní heslo.
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              if (adminPasswordInput === 'Soul') {
                setIsAdminUnlocked(true);
                setAdminPasswordInput('');
              } else {
                alert('Nesprávné přístupové heslo.');
              }
            }} className="space-y-4">
              <input
                type="password"
                placeholder="Zadejte heslo..."
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-[#E6D9C9] bg-white text-stone-800 text-sm focus:ring-1 focus:ring-[#53331F] outline-none"
                required
              />
              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#53331F] hover:bg-[#3F2212] text-white text-sm font-medium transition-all shadow-md"
              >
                Vstoupit
              </button>
            </form>
          </div>
        );
      }

      return (
        <AdminSection 
          bookings={bookings} 
          refreshBookings={refreshBookings} 
          availableSlots={availableSlots}
          refreshAvailableSlots={refreshAvailableSlots}
        />
      );
    }

    switch (activeTab) {
      case 'home':
        return <HomeSection setActiveTab={setActiveTab} />;
      case 'services':
        return (
          <ServicesSection
            setActiveTab={setActiveTab}
            setSelectedServiceId={setSelectedServiceId}
          />
        );
      case 'pricelist':
        return (
          <PriceListSection
            setActiveTab={setActiveTab}
            setSelectedServiceId={setSelectedServiceId}
          />
        );
      case 'booking':
        return (
          <BookingSection
            selectedServiceId={selectedServiceId}
            setSelectedServiceId={setSelectedServiceId}
            bookings={bookings}
            refreshBookings={refreshBookings}
            availableSlots={availableSlots}
            refreshAvailableSlots={refreshAvailableSlots}
          />
        );
      case 'contacts':
        return <ContactsSection />;
      default:
        return <HomeSection setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between" id="app-root-container">
      <div>
        {/* Transparent Banner Notification for admin preview comfort */}
        <div className="bg-[#3C2213] text-[#FAF6F0] text-center px-4 py-2 text-xs font-light tracking-wide flex items-center justify-center space-x-1.5" id="top-bar-announce">
          <CalendarHeart className="w-3.5 h-3.5 animate-pulse" />
          <span>Vítejte. Objevte klidnou náruč péče o tělo i o duši.</span>
        </div>

        {/* Global Navigation bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isAdmin={isAdmin}
          setIsAdmin={setIsAdmin}
        />

        {/* Main Content Area */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-10 md:pt-4 md:pb-14 flex-1">
          {renderActiveSection()}
        </main>
      </div>

      {/* Atmospheric Footer */}
      <footer className="bg-stone-900 text-stone-300 mt-16 border-t border-stone-800" id="global-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16 grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* Col 1: Bio */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#53331F] flex items-center justify-center text-white text-sm font-serif">
                KH
              </div>
              <span className="font-serif tracking-wider uppercase text-white font-medium text-sm">
                Kateřina Hrubá
              </span>
            </div>
            <p className="text-xs text-stone-400 font-light leading-relaxed">
              Profesionální komunitní porodní asistentka, průvodkyně ženstvím a terapeutka se specializací na jemné masáže, kraniosakrální biodynamiku a komplexní ošetření i integraci jizev.
            </p>
            <div className="flex space-x-1 text-[#53331F] text-xs">
              <Heart className="w-4 h-4 text-[#B38B6D] fill-[#B38B6D]" />
              <Heart className="w-4 h-4 text-[#B38B6D] fill-[#B38B6D]" />
              <Heart className="w-4 h-4 text-[#B38B6D] fill-[#B38B6D]" />
            </div>
          </div>

          {/* Col 2: Navigation link shortcuts */}
          <div className="space-y-3">
            <h4 className="font-serif text-white font-medium text-sm tracking-wide">Rychlé odkazy</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-light text-stone-400">
              <button onClick={() => { setIsAdmin(false); setActiveTab('home'); }} className="hover:text-white text-left transition-all duration-200 cursor-pointer hover:translate-x-1">Hlavní strana</button>
              <button onClick={() => { setIsAdmin(false); setActiveTab('services'); }} className="hover:text-white text-left transition-all duration-200 cursor-pointer hover:translate-x-1">Služby &amp; Detaily</button>
              <button onClick={() => { setIsAdmin(false); setActiveTab('pricelist'); }} className="hover:text-white text-left transition-all duration-200 cursor-pointer hover:translate-x-1">Ceník péče</button>
              <button onClick={() => { setIsAdmin(false); setActiveTab('booking'); }} className="hover:text-white text-left transition-all duration-200 cursor-pointer hover:translate-x-1">Objednat termín</button>
              <button onClick={() => { setIsAdmin(false); setActiveTab('contacts'); }} className="hover:text-white text-left transition-all duration-200 cursor-pointer hover:translate-x-1">Kontakty</button>
              <button onClick={() => { setIsAdmin(true); setActiveTab('admin'); }} className="hover:text-white text-left transition-all duration-200 text-stone-500 font-normal cursor-pointer hover:translate-x-1 hover:text-stone-300">Administrace</button>
            </div>
          </div>

          {/* Col 3: Contact overview */}
          <div className="space-y-3.5">
            <h4 className="font-serif text-white font-medium text-sm tracking-wide">Studio Salajna</h4>
            <div className="space-y-2 text-xs font-light text-stone-400">
              <p className="flex items-center">
                <MapPin className="w-3.5 h-3.5 text-[#53331F] mr-2" />
                <span>Salajna 17, 350 02 Dolní Žandov</span>
              </p>
              <p className="flex items-center">
                <Phone className="w-3.5 h-3.5 text-[#53331F] mr-2" />
                <span>+420 732 984 105</span>
              </p>
              <p className="flex items-center">
                <Mail className="w-3.5 h-3.5 text-[#53331F] mr-2" />
                <a href="mailto:magnetic.memories.cz@gmail.com" className="hover:text-white transition-colors">magnetic.memories.cz@gmail.com</a>
              </p>
            </div>
          </div>
        </div>

        {/* Footer legal & sub bar */}
        <div className="bg-stone-950 border-t border-stone-800/50 py-6 text-center text-[10px] text-stone-500 font-light font-sans tracking-wider" id="footer-bottom">
          <p className="mb-2">© {new Date().getFullYear()} Kateřina Hrubá. Všechna práva vyhrazena.</p>
          <p className="text-[12px] text-stone-300 font-normal">
            Designed by <a href="http://budumitweb.cz/" target="_blank" rel="noopener noreferrer" className="text-[#B38B6D] hover:text-[#e2be9f] font-bold transition-all duration-200 underline decoration-2 decoration-solid underline-offset-4 decoration-[#B38B6D]/70 hover:decoration-[#e2be9f]">BuduMítWeb</a>
          </p>
        </div>
      </footer>

      {/* URL Booking Cancellation Modal */}
      {urlCancelBookingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs animate-fade-in" id="global-cancellation-modal">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 border border-[#E6D9C9] shadow-xl space-y-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <CalendarHeart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-medium text-stone-900">Zrušení termínu ošetření</h3>
              <p className="text-stone-500 font-light text-xs mt-1">Stornování rezervace u Kateřiny Hrubé</p>
            </div>

            {urlCancelSuccess ? (
              <div className="space-y-4 text-center">
                <p className="text-emerald-800 text-sm font-medium bg-emerald-50 p-3.5 rounded-xl border border-emerald-100">
                  Rezervace byla úspěšně zrušena. Uvolněný termín je nyní opět k dispozici ostatním klientům.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    // Clear query params
                    window.history.replaceState({}, document.title, window.location.pathname);
                    setUrlCancelBookingId(null);
                    setUrlCancelSuccess(false);
                    setUrlCancelBookingData(null);
                  }}
                  className="w-full py-3 rounded-full bg-[#53331F] text-white font-medium hover:bg-[#3F2212] transition-all text-xs uppercase tracking-wider text-center"
                >
                  Rozumím a zavřít
                </button>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="bg-stone-50 p-4 rounded-xl text-xs space-y-2 text-stone-700 font-light border border-stone-100">
                  {urlCancelBookingData ? (
                    <>
                      <p><strong>Klient:</strong> {urlCancelBookingData.clientName} {urlCancelBookingData.clientSurname}</p>
                      <p><strong>Termín:</strong> {urlCancelBookingData.date} v {urlCancelBookingData.startTime} – {urlCancelBookingData.endTime}</p>
                      <p className="text-stone-400 italic mt-1 font-sans">Místo: Salajna 17, Dolní Žandov</p>
                    </>
                  ) : (
                    <p className="text-center text-stone-400 italic">Načítám detaily rezervace {urlCancelBookingId}...</p>
                  )}
                </div>

                <p className="text-xs text-stone-500 leading-relaxed text-center font-light">
                  Opravdu si přejete bezplatně zrušit tento termín ošetření? Storno je doporučeno provést nejpozději 24 hodin předem.
                </p>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    disabled={urlCancelLoading}
                    onClick={async () => {
                      setUrlCancelLoading(true);
                      try {
                        if (urlCancelBookingId) {
                          await deleteBooking(urlCancelBookingId);
                          setUrlCancelSuccess(true);
                          await refreshBookings();
                        }
                      } catch (err) {
                        console.error('Error in global cancellation call:', err);
                        alert('Chyba při rušení termínu.');
                      } finally {
                        setUrlCancelLoading(false);
                      }
                    }}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full text-xs uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    {urlCancelLoading ? 'Ruším...' : 'Ano, zrušit termín'}
                  </button>
                  <button
                    type="button"
                    disabled={urlCancelLoading}
                    onClick={() => {
                      window.history.replaceState({}, document.title, window.location.pathname);
                      setUrlCancelBookingId(null);
                    }}
                    className="px-5 py-3 border border-stone-200 text-stone-600 hover:bg-stone-50 rounded-full text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    Zpět
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
