import React, { useState } from 'react';
import { SERVICES } from '../data/servicesData';
import { Service } from '../types';
import { Clock, DollarSign, CheckCircle2 } from 'lucide-react';

interface ServicesSectionProps {
  setActiveTab: (tab: string) => void;
  setSelectedServiceId: (serviceId: string) => void;
}

export default function ServicesSection({ setActiveTab, setSelectedServiceId }: ServicesSectionProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'massage' | 'scars' | 'cranio' | 'pregnancy_birth'>('all');
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const filters = [
    { id: 'all', label: 'Všechny služby' },
    { id: 'scars', label: 'Péče o jizvu' },
    { id: 'massage', label: 'Masáže' },
    { id: 'cranio', label: 'Kraniosakrální terapie' },
    { id: 'pregnancy_birth', label: 'Těhotenství & Porod' },
  ];

  const filteredServices = SERVICES.filter(service => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'scars') return service.category === 'scars';
    if (activeFilter === 'massage') return service.category === 'massage';
    if (activeFilter === 'cranio') return service.category === 'cranio';
    if (activeFilter === 'pregnancy_birth') return service.category === 'pregnancy' || service.category === 'birth';
    return false;
  });

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'scars': return 'Péče o jizvu';
      case 'massage': return 'Masáže';
      case 'cranio': return 'Kraniosakrální terapie';
      case 'pregnancy': return 'Péče o maminky';
      case 'birth': return 'Porodnictví';
      default: return 'Ostatní péče';
    }
  };

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setSelectedService(null);
    setActiveTab('booking');
  };

  return (
    <div className="space-y-12 animate-fade-in" id="services-section">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-xs tracking-widest text-[#53331F] font-semibold uppercase mb-2">Nabídka péče</h2>
        <p className="text-3xl md:text-4xl font-serif text-stone-900 font-light mb-4">
          Přírodní dotyk a péče pro vaši fyzickou i mentální pohodu
        </p>
        <p className="text-stone-600 font-light max-w-xl mx-auto text-sm leading-relaxed">
          Zvolte si ošetření, které nejlépe vyhovuje vašim současným potřebám. Ráda vás provedu světem uvolnění, hojení a podpory.
        </p>
        <div className="w-16 h-1 bg-[#B38B6D] mx-auto mt-6 rounded-full"></div>
        <div className="mt-4 inline-flex items-center space-x-2 text-[#53331F] bg-[#F5EBE0] px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider">
          <span>✨ Masáže a Kraniosakrální terapie jsou plně vhodné i pro muže</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2" id="services-filter-buttons">
        {filters.map((filter) => (
          <button
            key={filter.id}
            id={`filter-btn-${filter.id}`}
            onClick={() => setActiveFilter(filter.id as any)}
            className={`px-5 py-2.5 rounded-full text-xs font-medium tracking-wide transition-all uppercase duration-300 cursor-pointer ${
              activeFilter === filter.id
                ? 'bg-[#53331F] text-white shadow-sm'
                : 'bg-white text-stone-600 border border-[#E6D9C9] hover:border-[#53331F]/50 hover:text-[#53331F]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" id="services-list-grid">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            id={`service-card-${service.id}`}
            className="bg-white rounded-2xl border border-[#E6D9C9] p-6 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-semibold tracking-wider text-[#B38B6D] uppercase bg-[#F5EBE0] px-2.5 py-1 rounded">
                  {getCategoryLabel(service.category)}
                </span>
                <span className="flex items-center text-xs text-stone-500 font-mono">
                  <Clock className="w-3.5 h-3.5 mr-1 text-stone-400" />
                  {service.duration} min
                </span>
              </div>
              <h3 className="text-xl font-serif font-medium text-stone-900 mb-3">{service.name}</h3>
              <p className="text-stone-600 text-sm font-light leading-relaxed mb-6">
                {service.shortDescription}
              </p>
            </div>

            <div className="border-t border-[#FAF6F0] pt-4 flex items-center justify-between">
              <span className="text-lg font-serif font-semibold text-stone-800">
                {service.price} Kč
              </span>
              <div className="flex space-x-2">
                <button
                  id={`service-detail-btn-${service.id}`}
                  onClick={() => setSelectedService(service)}
                  className="px-3.5 py-2 text-xs font-medium text-[#53331F] bg-stone-50 rounded-full border border-stone-100 hover:bg-[#53331F] hover:text-white transition-all duration-200 cursor-pointer"
                >
                  Bližší popis
                </button>
                <button
                  id={`service-book-btn-${service.id}`}
                  onClick={() => handleBookService(service.id)}
                  className="px-3.5 py-2 text-xs font-medium text-white bg-[#53331F] hover:bg-[#3F2212] rounded-full transition-all duration-200 cursor-pointer"
                >
                  Rezervovat
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal Overlay */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs animate-fade-in" id="service-detail-modal">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 max-h-[85vh] overflow-y-auto border border-[#E6D9C9] shadow-xl relative">
            <button
              id="modal-close-btn"
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-600 p-2 rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
            >
              ✕
            </button>

            <span className="text-xs font-semibold tracking-wider text-[#B38B6D] uppercase bg-[#F5EBE0] px-3 py-1.5 rounded self-start">
              {getCategoryLabel(selectedService.category)}
            </span>

            <h3 className="text-2xl md:text-3xl font-serif font-light text-stone-900 mt-4 mb-3">
              {selectedService.name}
            </h3>

            <div className="flex flex-wrap gap-4 text-sm text-stone-500 mb-6 border-b border-stone-100 pb-4">
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1.5 text-stone-400" />
                Doba ošetření: <strong>&nbsp;{selectedService.duration} minut</strong>&nbsp; (plus 15 minut klidná pauza pro vás)
              </span>
              <span className="flex items-center">
                <DollarSign className="w-4 h-4 mr-1 text-stone-400" />
                Cena: <strong>&nbsp;{selectedService.price} Kč</strong>
              </span>
            </div>

            <div className="space-y-6 text-stone-700 leading-relaxed font-light">
              <div>
                <h4 className="font-serif font-medium text-stone-900 mb-2 text-lg">O čem služba je?</h4>
                <p>{selectedService.longDescription}</p>
              </div>

              <div>
                <h4 className="font-serif font-medium text-stone-900 mb-2 text-lg">Co ošetření přináší a čeho docílíme?</h4>
                <ul className="grid sm:grid-cols-2 gap-2 text-sm mt-1">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#53331F] mr-2 shrink-0 mt-0.5" />
                    <span>Hluboké zklidnění nervové soustavy</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#53331F] mr-2 shrink-0 mt-0.5" />
                    <span>Jemné uvolnění svalových spasmů</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#53331F] mr-2 shrink-0 mt-0.5" />
                    <span>Úlevu od bolesti a pocitu těžkosti</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4.5 h-4.5 text-[#53331F] mr-2 shrink-0 mt-0.5" />
                    <span>Integrace prožitků, obnovení proudění v těle</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-serif font-medium text-stone-900 mb-1.5 text-lg">Průběh ošetření</h4>
                <p className="text-sm">
                  Každá návštěva u mě začíná krátkým povídáním nad teplým bylinným čajem. Zjistíme, jak se aktuálně cítíte a na jaké oblasti se dnes zaměříme. Samotné ošetření probíhá v naprostém tichu, za zvuku uklidňující relaxační hudby a v hřejivém prostředí. Po skončení u mě můžete v klidu ležet, vstřebávat prožitky a dopřát si zbylý čas k integraci před návratem do běžného dne.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-stone-100 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                id="modal-book-confirm-btn"
                onClick={() => handleBookService(selectedService.id)}
                className="flex-1 py-3 text-center rounded-full bg-[#53331F] text-white font-medium hover:bg-[#3F2212] shadow-md transition-all duration-300 cursor-pointer"
              >
                Rezervovat tuto péči
              </button>
              <button
                id="modal-back-btn"
                onClick={() => setSelectedService(null)}
                className="py-3 px-6 rounded-full border border-stone-200 text-stone-500 hover:bg-stone-50 font-medium transition-all cursor-pointer"
              >
                Zavřít detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
