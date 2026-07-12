import React from 'react';
import { SERVICES } from '../data/servicesData';
import { ShieldCheck, Heart, Info } from 'lucide-react';

interface PriceListSectionProps {
  setActiveTab: (tab: string) => void;
  setSelectedServiceId: (serviceId: string) => void;
}

export default function PriceListSection({ setActiveTab, setSelectedServiceId }: PriceListSectionProps) {
  const handleBook = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setActiveTab('booking');
  };

  const categories = [
    { id: 'scars', name: 'Specializovaná péče o jizvu' },
    { id: 'massage', name: 'Vyživující a relaxační masáže' },
    { id: 'cranio', name: 'Kraniosakrální biodynamika' },
    { id: 'pregnancy', name: 'Těhotenství a poporodní péče' },
    { id: 'birth', name: 'Doprovázení k porodu & Příprava' },
    { id: 'other', name: 'Doplňkové služby a rituály' },
  ];

  return (
    <div className="space-y-12 animate-fade-in" id="pricelist-section">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-xs tracking-widest text-[#53331F] font-semibold uppercase mb-2">Ceník služeb</h2>
        <p className="text-3xl md:text-4xl font-serif text-stone-900 font-light mb-4">
          Ceník opečování
        </p>
        <p className="text-stone-600 font-light max-w-xl mx-auto text-sm leading-relaxed">
          Ceny jsou navrženy s ohledem na vysokou kvalitu přírodních olejů, bylin a plně individuální přípravu každého ošetření. V ceně je vždy zahrnut bylinný čaj, aromaterapie a klidový odpočinek po zákroku.
        </p>
        <div className="w-16 h-1 bg-[#B38B6D] mx-auto mt-6 rounded-full"></div>
      </div>

      {/* Main Pricelist Tables */}
      <div className="max-w-4xl mx-auto space-y-12" id="pricelist-tables-container">
        {categories.map((cat) => {
          const catServices = SERVICES.filter(s => s.category === cat.id);
          if (catServices.length === 0) return null;

          return (
            <div key={cat.id} id={`pricelist-cat-${cat.id}`} className="bg-white rounded-2xl border border-[#E6D9C9] overflow-hidden shadow-xs">
              <div className="bg-[#E6D9C9] px-6 py-4 border-b border-[#E6D9C9]">
                <h3 className="font-serif font-medium text-stone-800 text-lg">{cat.name}</h3>
              </div>
              <div className="divide-y divide-[#FAF6F0]">
                {catServices.map((service) => (
                  <div key={service.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-[#FAF6F0]/50 transition-colors">
                    <div className="space-y-1.5 max-w-xl pr-4">
                      <h4 className="font-serif font-medium text-stone-950 text-base">{service.name}</h4>
                      <p className="text-xs text-stone-500 font-light leading-relaxed">{service.shortDescription}</p>
                      <span className="inline-flex items-center text-xs text-[#53331F] bg-[#FAF6F0] px-2 py-0.5 rounded font-mono">
                        {service.duration} minut ošetření
                      </span>
                    </div>

                    <div className="mt-4 sm:mt-0 flex items-center justify-between sm:justify-end sm:space-x-6 shrink-0">
                      <span className="text-xl font-serif font-semibold text-stone-900 whitespace-nowrap">
                        {service.price} Kč
                      </span>
                      <button
                        id={`pricelist-book-${service.id}`}
                        onClick={() => handleBook(service.id)}
                        className="px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#53331F] text-white hover:bg-[#3F2212] transition-all duration-300 cursor-pointer"
                      >
                        Rezervovat
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Benefits/Guarantee section */}
        <div className="bg-[#FAF6F0] p-6 rounded-3xl border border-[#E6D9C9] grid sm:grid-cols-2 gap-6 items-start" id="pricelist-guarantees">
          <div className="flex space-x-3">
            <ShieldCheck className="w-6 h-6 text-[#53331F] shrink-0 mt-1" />
            <div>
              <h4 className="font-serif font-medium text-stone-900 mb-1">Žádné skryté poplatky</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Všechny pomůcky,  prostěradla, organické oleje atd. jsou plně zahrnuty v koncové ceně.
              </p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Heart className="w-6 h-6 text-[#B38B6D] shrink-0 mt-1" />
            <div>
              <h4 className="font-serif font-medium text-stone-900 mb-1">Garance dárkových poukazů</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-light">
                Kteroukoliv z těchto úžasných služeb můžete zakoupit jako luxusní dárkový poukaz s platností 12 měsíců. Pro zakoupení mě stačí kontaktovat.
              </p>
            </div>
          </div>
        </div>

        {/* Storno Podmínky / Cancellation Policy */}
        <div className="border border-[#E6D9C9] rounded-2xl p-5 bg-amber-50/20 flex items-start space-x-3" id="pricelist-cancellation">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-stone-600 space-y-1">
            <strong className="text-stone-800 font-medium">Storno podmínky:</strong>
            <p className="font-light">
              Plánované setkání je možné bezplatně zrušit nebo přesunout nejpozději <strong className="text-stone-800 font-medium font-serif">24 hodin předem</strong>. V případě pozdějšího zrušení nebo nedostavení se je účtováno 100 % ceny z důvodu blokace termínu a nemožnosti nabídnout čas dalším čekajícím klientkám. Děkuji za pochopení a respektování mého i vašeho času.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
