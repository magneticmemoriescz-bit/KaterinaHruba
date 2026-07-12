import React from 'react';
import { Calendar, Heart, Shield, Award, Users } from 'lucide-react';
import heroImg from '../assets/images/serene_wellness_hero_1781810051825.jpg';

interface HomeSectionProps {
  setActiveTab: (tab: string) => void;
}

export default function HomeSection({ setActiveTab }: HomeSectionProps) {
  return (
    <div className="space-y-16 animate-fade-in" id="home-section">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#E6D9C9] rounded-3xl" id="hero-banner">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Péče a masáže Kateřina Hrubá"
            className="w-full h-full object-cover opacity-35 filter mix-blend-multiply"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0]/90 via-[#FAF6F0]/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-16 md:py-24 md:px-12 lg:px-16 flex flex-col justify-center min-h-[500px]">
          <span className="inline-flex items-center space-x-2 text-[#53331F] text-xs font-semibold tracking-widest uppercase mb-4 bg-[#FAF6F0]/80 px-3 py-1.5 rounded-full backdrop-blur-sm self-start shadow-xs">
            <Heart className="w-3.5 h-3.5" />
            <span>Bezpečný přístav pro vaše tělo i mysl</span>
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-stone-900 leading-tight mb-6">
            Péče o tělo a duši,<br />
            <span className="font-serif italic text-[#53331F]">která vás vrátí do rovnováhy</span>
          </h1>
          <p className="text-base md:text-lg text-stone-700 max-w-xl leading-relaxed mb-10">
            Jmenuji se <strong className="text-stone-800 font-medium">Kateřina Hrubá</strong>. Jako komunitní porodní asistentka a terapeutka vás provázím skrze jemné doteky, kraniosakrální biodynamiku, hluboké relaxační masáže a ošetření i integraci jizev k uvolnění, uzdravení a znovunalezení klidu a rovnováhy.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              id="hero-booking-btn"
              onClick={() => setActiveTab('booking')}
              className="px-8 py-4 rounded-full bg-[#53331F] text-white font-medium hover:bg-[#3F2212] shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Rezervovat termín</span>
            </button>
            <button
              id="hero-services-btn"
              onClick={() => setActiveTab('services')}
              className="px-8 py-4 rounded-full bg-white/80 backdrop-blur-xs text-[#53331F] border border-[#53331F]/20 font-medium hover:bg-stone-50 hover:border-[#53331F]/50 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Seznámit se se službami</span>
            </button>
          </div>
        </div>
      </section>

      {/* Philosophy / About Section */}
      <section className="max-w-5xl mx-auto px-4" id="philosophy">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs tracking-widest text-[#53331F] font-semibold uppercase mb-2">Moje vize</h2>
          <p className="text-3xl font-serif text-stone-900 font-light">
            Vnímám tělo jako moudrý systém, který touží po harmonii
          </p>
          <div className="w-16 h-1 bg-[#B38B6D] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6 text-stone-700 leading-relaxed font-light">
            <p>
              Věřím, že každé napětí, bolest nebo jizva v sobě nesou svůj jedinečný příběh. Ve své praxi neposkytuji univerzální návody ani mechanické služby. Mé ošetření kombinuje odborné vědecké poznatky o lidském těle s hlubokou citlivostí, respektem a intuicí.
            </p>
            <p>
              Ať už procházíte obdobím těhotenství, hojíte se po narození miminka, zotavujete se po operačním zákroku (císařský řez, gynekologické operace aj.), nebo jen hledáte pevný opěrný bod uprostřed každodenního shonu, mým přáním je vytvořit pro vás bezpečný a tichý prostor, kde se můžete opravdu zastavit a být sami sebou.
            </p>
            <p className="italic text-stone-800 font-medium font-serif border-l-2 border-[#53331F] pl-4">
              „Skrze jemný a plně přítomný dotek můžeme rozpustit i to nejhlubší stažení. Tělo pak dokáže znovu povolat své vlastní samoléčebné schopnosti.“
            </p>
          </div>

          <div className="bg-[#FAF6F0] p-8 rounded-2xl border border-[#E6D9C9] grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-xl border border-[#E6D9C9] flex flex-col justify-between">
              <Shield className="w-8 h-8 text-[#53331F] mb-3" />
              <div>
                <h3 className="font-serif font-medium text-stone-900 mb-1">Bezpečný prostor</h3>
                <p className="text-xs text-stone-500">Nikoho nesoudím, plně respektuji vaši cestu a tempo.</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E6D9C9] flex flex-col justify-between">
              <Award className="w-8 h-8 text-[#B38B6D] mb-3" />
              <div>
                <h3 className="font-serif font-medium text-stone-900 mb-1">Odbornost</h3>
                <p className="text-xs text-stone-500">Licencovaná porodní asistence s klinickým i doplňkovým vzdělávaním.</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E6D9C9] flex flex-col justify-between">
              <Users className="w-8 h-8 text-[#53331F] mb-3" />
              <div>
                <h3 className="font-serif font-medium text-stone-900 mb-1">Individuální přístup</h3>
                <p className="text-xs text-stone-500">Každé setkání se ladí podle vaší okamžité tělesné i duševní formy.</p>
              </div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-[#E6D9C9] flex flex-col justify-between">
              <Heart className="w-8 h-8 text-[#B38B6D] mb-3" />
              <div>
                <h3 className="font-serif font-medium text-stone-900 mb-1">Hojení jizev</h3>
                <p className="text-xs text-stone-500">Jedinečný celostní přístup integrující emoce i fyzické tkáně.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Teaser */}
      <section className="bg-[#FAF6F0] py-16 px-4 rounded-3xl border border-[#E6D9C9]" id="featured-teasers">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs tracking-widest text-[#53331F] font-semibold uppercase mb-2">Čemu se věnuji</h2>
              <h3 className="text-3xl font-serif text-stone-900 font-light">Představení klíčové péče</h3>
            </div>
            <button
              id="teaser-view-all-services"
              onClick={() => setActiveTab('services')}
              className="text-[#53331F] hover:text-[#3F2212] font-medium text-sm transition-colors mt-4 md:mt-0 flex items-center space-x-1"
            >
              <span>Zobrazit všechny služby</span>
              <span>→</span>
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-[#E6D9C9] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#B38B6D] p-3 mb-4 flex items-center justify-center font-bold">
                  01
                </div>
                <h4 className="text-lg font-serif font-medium text-stone-900 mb-2">Péče o jizvu (My scar)</h4>
                <p className="text-stone-600 text-sm font-light leading-relaxed mb-4">
                  Základní pilíř mé péče. Pomocí hmatů, uvolnění fascií a energetické podpory vracím život a citlivost do míst, kde proběhl chirurgický řez.
                </p>
              </div>
              <button
                id="teaser-scars-btn"
                onClick={() => setActiveTab('services')}
                className="text-xs font-semibold text-[#53331F] hover:underline uppercase tracking-wide self-start mt-4"
              >
                Více o péči →
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6D9C9] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#53331F] p-3 mb-4 flex items-center justify-center font-bold">
                  02
                </div>
                <h4 className="text-lg font-serif font-medium text-stone-900 mb-2">Kraniosakrální biodynamika</h4>
                <p className="text-stone-600 text-sm font-light leading-relaxed mb-4">
                  Komunikační cesta s autonomním nervovým systémem. Pomocí přítomného napojení zklidníme přetížení a podpoříme hlubší samoregulaci těla.
                </p>
              </div>
              <button
                id="teaser-cranio-btn"
                onClick={() => setActiveTab('services')}
                className="text-xs font-semibold text-[#53331F] hover:underline uppercase tracking-wide self-start mt-4"
              >
                Více o péči →
              </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#E6D9C9] shadow-xs flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#B38B6D] p-3 mb-4 flex items-center justify-center font-bold">
                  03
                </div>
                <h4 className="text-lg font-serif font-medium text-stone-900 mb-2">Porodní asistentka</h4>
                <p className="text-stone-600 text-sm font-light leading-relaxed mb-4">
                  Odborné i emocionální doprovázení na posvátné plodné cestě mateřství v radostném i náročném období zrodu miminka a nové rodiny.
                </p>
              </div>
              <button
                id="teaser-midwifery-btn"
                onClick={() => setActiveTab('services')}
                className="text-xs font-semibold text-[#53331F] hover:underline uppercase tracking-wide self-start mt-4"
              >
                Více o péči →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Banner */}
      <section className="text-center bg-[#53331F] text-white py-12 px-6 rounded-3xl" id="quote-strip">
        <p className="font-serif italic text-xl md:text-2xl font-light mb-4">
          „Klid v duši začíná uvolněním v těle.“
        </p>
        <p className="text-xs uppercase tracking-widest text-[#E6D9C9] font-semibold">
          — Kateřina Hrubá
        </p>
      </section>
    </div>
  );
}
