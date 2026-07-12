import React from 'react';
import { Sparkles, Calendar, Heart, Phone, DollarSign } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdmin: boolean;
  setIsAdmin: (admin: boolean) => void;
}

export default function Navbar({ activeTab, setActiveTab, isAdmin, setIsAdmin }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Domů', icon: Heart },
    { id: 'services', label: 'Služby', icon: Sparkles },
    { id: 'pricelist', label: 'Ceník', icon: DollarSign },
    { id: 'booking', label: 'Rezervace', icon: Calendar },
    { id: 'contacts', label: 'Kontakty', icon: Phone },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6F0]/90 backdrop-blur-md border-b border-[#E6D9C9] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Title */}
          <div 
            onClick={() => {
              setIsAdmin(false);
              setActiveTab('home');
            }} 
            className="flex items-center space-x-3 cursor-pointer group"
            id="nav-logo"
          >
            <div className="w-10 h-10 rounded-full bg-[#53331F] flex items-center justify-center text-[#FAF6F0] shadow-sm group-hover:bg-[#3F2212] transition-colors">
              <span className="font-serif text-lg font-semibold tracking-wider">KH</span>
            </div>
            <div>
              <h1 className="text-lg font-serif font-medium text-stone-800 tracking-wide uppercase">
                Kateřina Hrubá
              </h1>
              <p className="text-xs text-[#53331F] font-sans tracking-widest uppercase">
                Péče o tělo &amp; duši
              </p>
            </div>
          </div>

          {/* Nav Items (Desktop) */}
          <nav className="hidden md:flex space-x-1" id="desktop-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-btn-${item.id}`}
                  onClick={() => {
                    setIsAdmin(false);
                    setActiveTab(item.id);
                  }}
                  className={`flex items-center space-x-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 ${
                    isActive && !isAdmin
                      ? 'bg-[#53331F] text-[#FAF6F0] shadow-md scale-105'
                      : 'text-stone-600 hover:text-[#53331F] hover:bg-[#F5EBE0]/70'
                  }`}
                >
                  <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Booking Call-To-Action */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              id="mobile-nav-booking-btn"
              onClick={() => {
                setIsAdmin(false);
                setActiveTab('booking');
              }}
              className="bg-[#53331F] hover:bg-[#3F2212] text-white px-4 py-2 rounded-full text-xs font-semibold flex items-center space-x-1 cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Rezervace</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row (Below brand) */}
        <div className="md:hidden flex items-center justify-around border-t border-[#E6D9C9] py-2" id="mobile-nav-bar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`mobile-nav-item-${item.id}`}
                onClick={() => {
                  setIsAdmin(false);
                  setActiveTab(item.id);
                }}
                className={`flex flex-col items-center p-2 rounded-xl text-xs transition-all duration-250 cursor-pointer active:scale-90 hover:bg-[#F5EBE0]/40 ${
                  isActive && !isAdmin 
                    ? 'text-[#53331F] font-bold bg-[#FAF6F0] scale-105 shadow-xs' 
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon className={`w-4.5 h-4.5 transition-transform duration-300 ${isActive && !isAdmin ? 'scale-110' : 'group-hover:scale-105'}`} />
                <span className="mt-0.5 scale-90">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
