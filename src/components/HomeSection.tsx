import React, { useState, useEffect } from 'react';
import { Calendar, Heart, Shield, Award, Users, Play, Pause, RefreshCw, Wind, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import heroImg from '../assets/images/serene_wellness_hero_1781810051825.jpg';

const Mandala = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 200 200"
      className={`text-[#B38B6D] pointer-events-none select-none ${className || 'opacity-25'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
    >
      {/* Concentric circles */}
      <circle cx="100" cy="100" r="95" strokeDasharray="2,2" />
      <circle cx="100" cy="100" r="80" />
      <circle cx="100" cy="100" r="65" strokeDasharray="3,3" />
      <circle cx="100" cy="100" r="50" />
      <circle cx="100" cy="100" r="35" strokeDasharray="1,1" />
      <circle cx="100" cy="100" r="18" />
      <circle cx="100" cy="100" r="4" fill="currentColor" />

      {/* Repeated rotated paths */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        return (
          <g key={i} transform={`rotate(${angle} 100 100)`}>
            {/* Elegant petal shape */}
            <path d="M 100 10 C 105 40, 115 50, 100 75 C 85 50, 95 40, 100 10 Z" />
            <path d="M 100 25 C 103 45, 108 52, 100 65 C 92 52, 97 45, 100 25 Z" opacity="0.7" />
            <line x1="100" y1="10" x2="100" y2="100" strokeDasharray="4,4" opacity="0.3" />
            {/* Outer small circles */}
            <circle cx="100" cy="10" r="1.5" fill="currentColor" />
          </g>
        );
      })}
      {/* A second layer of offset petals */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 360) / 12 + 15;
        return (
          <g key={`l2-${i}`} transform={`rotate(${angle} 100 100)`}>
            <path d="M 100 40 C 108 60, 108 70, 100 90 C 92 70, 92 60, 100 40 Z" strokeWidth="0.75" />
          </g>
        );
      })}
    </svg>
  );
};

const HandDrawnMandala = ({ className, delay = 0.5 }: { className?: string; delay?: number }) => {
  const total = 11;
  const getLoopProps = (start: number, drawDuration: number) => {
    const t0 = 0;
    const t1 = start;
    const t2 = start + drawDuration;
    const t3 = 8.0;
    const t4 = 9.0;
    const t5 = total;

    const times = [t0 / total, t1 / total, t2 / total, t3 / total, t4 / total, t5 / total];

    return {
      animate: {
        pathLength: [0, 0, 1, 1, 0, 0],
        opacity: [0, 0, 1, 1, 0, 0],
      },
      transition: {
        duration: total,
        times,
        ease: ["linear", "easeInOut", "linear", "easeInOut", "linear", "linear"],
        repeat: Infinity,
      }
    };
  };

  const centralProps = getLoopProps(0.3, 1.2);
  const l1Props = getLoopProps(1.1, 1.4);
  const l2Props = getLoopProps(2.1, 1.4);
  const l3Props = getLoopProps(3.1, 1.4);
  const l4Props = getLoopProps(4.1, 1.4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.svg
      viewBox="0 0 100 100"
      className={`text-[#B38B6D] pointer-events-none select-none ${className || 'w-24 h-24'}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="0.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      {/* Central intricate pistil / spiral */}
      <motion.circle
        cx="50"
        cy="50"
        r="2"
        animate={centralProps.animate}
        transition={centralProps.transition}
      />

      {/* Layer 1: Core flower petals (6-fold) */}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = i * 60;
        return (
          <g key={`l1-${i}`} transform={`rotate(${angle} 50 50)`}>
            {/* Elegant teardrop loop */}
            <motion.path
              d="M 50 48 C 52 45, 52 42, 50 40 C 48 42, 48 45, 50 48"
              animate={l1Props.animate}
              transition={l1Props.transition}
              strokeWidth="0.5"
            />
          </g>
        );
      })}

      {/* Layer 2: Botanical leaves / stems (8-fold, offset) */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = i * 45 + 15;
        return (
          <g key={`l2-${i}`} transform={`rotate(${angle} 50 50)`}>
            {/* Soft waving leaves with central veins */}
            <motion.path
              d="M 50 48 C 54 44, 56 38, 50 30 C 44 38, 46 44, 50 48"
              animate={l2Props.animate}
              transition={l2Props.transition}
              strokeWidth="0.6"
            />
            <motion.path
              d="M 50 44 L 50 34"
              animate={l2Props.animate}
              transition={l2Props.transition}
              strokeWidth="0.4"
              strokeDasharray="1,1.5"
            />
          </g>
        );
      })}

      {/* Layer 3: Flowing swirls and tendrils (12-fold) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = i * 30;
        return (
          <g key={`l3-${i}`} transform={`rotate(${angle} 50 50)`}>
            {/* Organic spiral scroll */}
            <motion.path
              d="M 50 34 C 54 32, 58 26, 55 20 C 52 14, 48 18, 50 24"
              animate={l3Props.animate}
              transition={l3Props.transition}
              strokeWidth="0.5"
            />
            {/* Delicate leaf shoot off the side */}
            <motion.path
              d="M 52 25 C 55 24, 57 21, 56 18"
              animate={l3Props.animate}
              transition={l3Props.transition}
              strokeWidth="0.4"
            />
          </g>
        );
      })}

      {/* Layer 4: Delicate outer crown lace & droplets (24-fold) */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = i * 15 + 7.5;
        return (
          <g key={`l4-${i}`} transform={`rotate(${angle} 50 50)`}>
            {/* Fine outer arch / ray pointing outwards */}
            <motion.path
              d="M 50 20 C 51.5 16, 51.5 12, 50 8 C 48.5 12, 48.5 16, 50 20"
              animate={l4Props.animate}
              transition={l4Props.transition}
              strokeWidth="0.4"
            />
            {/* Little dewdrops at the tips */}
            <motion.circle
              cx="50"
              cy="5"
              r="0.8"
              fill="currentColor"
              animate={l4Props.animate}
              transition={l4Props.transition}
            />
          </g>
        );
      })}
    </motion.svg>
  );
};

interface HomeSectionProps {
  setActiveTab: (tab: string) => void;
}

export default function HomeSection({ setActiveTab }: HomeSectionProps) {
  // Breathing exercise states for 4-7-8 technique (Inhale 4s, Hold 7s, Exhale 8s)
  const [isPlaying, setIsPlaying] = useState(true);
  const [elapsedTime, setElapsedTime] = useState(0); // in tenths of a second (0 to 190)

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setElapsedTime((prev) => (prev + 1) % 190);
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getBreathingData = () => {
    const totalTime = elapsedTime / 10; // in seconds (0.0 to 19.0)
    
    if (totalTime < 4) {
      // Nádech (0 - 4s)
      const progress = totalTime / 4;
      return {
        step: 0,
        subText: 'Nádech...',
        title: 'Nádech (4 vteřiny)',
        desc: 'Úplně vydechněte ústy, zavřete je a pomalu se nadechujte nosem, zatímco v duchu počítáte do čtyř.',
        color: 'text-emerald-800',
        ringScale: 1.0 + progress * 0.5, // Smoothly scales from 1.0 to 1.5
        progressText: `${Math.floor(totalTime) + 1}s / 4s`,
      };
    } else if (totalTime < 11) {
      // Zádrž (4 - 11s)
      const phaseTime = totalTime - 4;
      const progress = phaseTime / 7;
      return {
        step: 1,
        subText: 'Zádrž...',
        title: 'Zádrž (7 vteřin)',
        desc: 'Zadržte dech a v duchu napočítejte do sedmi.',
        color: 'text-[#53331F]',
        ringScale: 1.5, // Fully expanded
        progressText: `${Math.floor(phaseTime) + 1}s / 7s`,
      };
    } else {
      // Výdech (11 - 19s)
      const phaseTime = totalTime - 11;
      const progress = phaseTime / 8;
      return {
        step: 2,
        subText: 'Výdech...',
        title: 'Výdech (8 vteřin)',
        desc: 'Pomalu a slyšitelně vydechujte ústy a počítejte do osmi.',
        color: 'text-orange-700',
        ringScale: 1.5 - progress * 0.5, // Smoothly scales down from 1.5 to 1.0
        progressText: `${Math.floor(phaseTime) + 1}s / 8s`,
      };
    }
  };

  const activePhase = getBreathingData();

  // Animation variants for staggered lists
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 14
      }
    }
  };

  return (
    <div className="relative overflow-x-hidden" id="home-section">
      {/* Soft floating background decorative blobs & Rotating Mandalas */}
      <div className="absolute inset-x-0 top-0 overflow-hidden -z-10 pointer-events-none h-full">
        {/* Ambient Blobs */}
        <motion.div
          className="absolute -top-16 -left-20 w-80 h-80 rounded-full bg-[#E6D9C9]/25 blur-3xl"
          animate={{
            x: [0, 40, -10, 0],
            y: [0, 30, 50, 0],
            scale: [1, 1.12, 0.93, 1]
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute top-1/3 right-[-100px] w-[500px] h-[500px] rounded-full bg-[#FAF6F0] blur-3xl opacity-90"
          animate={{
            x: [0, -50, 20, 0],
            y: [0, -60, -20, 0],
            scale: [1, 1.08, 0.96, 1]
          }}
          transition={{
            duration: 28,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full bg-[#B38B6D]/8 blur-3xl"
          animate={{
            x: [0, 60, -30, 0],
            y: [0, 50, -40, 0],
            scale: [1, 1.15, 0.9, 1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Large Elegant Mandala on the Left Side (Visible on all screens, overlapping edges beautifully) */}
        <div className="absolute left-[-160px] sm:left-[-100px] md:left-[-80px] lg:left-[-40px] top-[180px] opacity-[0.16] sm:opacity-[0.20]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
          >
            <Mandala className="w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px]" />
          </motion.div>
        </div>

        {/* Large Elegant Mandala on the Right Side (Visible on all screens, overlapping edges beautifully) */}
        <div className="absolute right-[-160px] sm:right-[-100px] md:right-[-80px] lg:right-[-40px] top-[560px] opacity-[0.14] sm:opacity-[0.18]">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 220, repeat: Infinity, ease: "linear" }}
          >
            <Mandala className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[480px] md:h-[480px]" />
          </motion.div>
        </div>
      </div>

      {/* Main content wrapper - First child has no unexpected sibling margins */}
      <div className="space-y-16 md:space-y-24">
        {/* Hero Section with custom motion animation */}
        <motion.section 
          className="relative overflow-hidden bg-[#FAF6F0] rounded-3xl border border-[#E6D9C9] shadow-sm" 
          id="hero-banner"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Soft slow-breathing background image with peaceful panning */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <motion.img
              src={heroImg}
              alt="Péče a masáže Kateřina Hrubá"
              className="w-full h-full object-cover opacity-35 filter mix-blend-multiply"
              referrerPolicy="no-referrer"
              animate={{
                scale: [1, 1.05, 1.01, 1.06, 1],
                x: [0, 8, -4, 6, 0],
                y: [0, -4, 4, -2, 0],
              }}
              transition={{
                duration: 28,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            {/* Subtle gradient overlay to smoothly transition the image into soft light */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAF6F0]/95 via-[#FAF6F0]/70 to-transparent"></div>

            {/* Gentle moving warm light leaks to simulate morning sun and healing energy */}
            <motion.div 
              className="absolute -top-12 -left-12 w-96 h-96 rounded-full bg-orange-200/20 blur-3xl mix-blend-screen pointer-events-none"
              animate={{
                x: [0, 40, -20, 0],
                y: [0, 20, 40, 0],
                opacity: [0.3, 0.6, 0.4, 0.3]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute bottom-[-100px] right-20 w-[400px] h-[400px] rounded-full bg-[#B38B6D]/15 blur-3xl pointer-events-none"
              animate={{
                x: [0, -30, 20, 0],
                y: [0, -40, 10, 0],
                scale: [1, 1.15, 0.9, 1]
              }}
              transition={{
                duration: 24,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto px-6 pt-10 pb-14 md:pt-12 md:pb-20 md:px-12 lg:px-16 flex flex-col justify-center min-h-[460px]">
            <motion.span 
              className="inline-flex items-center space-x-2 text-[#53331F] text-xs font-semibold tracking-widest uppercase mb-6 bg-[#FAF6F0]/90 px-3.5 py-2 rounded-full border border-[#E6D9C9]/50 backdrop-blur-sm self-start shadow-2xs"
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.0, ease: "easeOut" }}
            >
              <Heart className="w-3.5 h-3.5 text-[#B38B6D] fill-[#B38B6D]/20 animate-pulse" />
              <span>Bezpečný přístav pro vaše tělo i mysl</span>
            </motion.span>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-light text-stone-900 leading-tight mb-6"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Péče o tělo a duši,<br />
              <span className="font-serif italic text-[#53331F] relative inline-block">
                která vás vrátí do rovnováhy
                <motion.span 
                  className="absolute left-0 bottom-1 w-full h-[3px] bg-[#B38B6D]/20 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1.2, duration: 1.5, ease: "easeInOut" }}
                />
              </span>
            </motion.h1>

            <motion.p 
              className="text-base md:text-lg text-stone-700 max-w-xl leading-relaxed mb-10 font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              Jmenuji se <strong className="text-stone-800 font-medium">Kateřina Hrubá</strong>. Jako komunitní porodní asistentka a terapeutka vás provázím skrze jemné doteky, kraniosakrální biodynamiku, hluboké relaxační masáže a ošetření i integraci jizev k uvolnění, uzdravení a znovunalezení klidu a rovnováhy.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1.0, ease: "easeOut" }}
            >
              <button
                id="hero-booking-btn"
                onClick={() => setActiveTab('booking')}
                className="px-8 py-4 rounded-full bg-[#53331F] text-white font-medium hover:bg-[#3F2212] shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Calendar className="w-5 h-5" />
                <span>Rezervovat termín</span>
              </button>
              <button
                id="hero-services-btn"
                onClick={() => setActiveTab('services')}
                className="px-8 py-4 rounded-full bg-white/90 backdrop-blur-xs text-[#53331F] border border-[#53331F]/20 font-medium hover:bg-stone-50 hover:border-[#53331F]/50 shadow-xs hover:shadow-md transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>Seznámit se se službami</span>
              </button>
            </motion.div>
          </div>
        </motion.section>

      {/* Philosophy / About Section */}
      <section className="max-w-5xl mx-auto px-4 relative py-6 isolate" id="philosophy">
        {/* Giant intricate hand-drawn mandala progressively rendered in the background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 select-none overflow-visible">
          <div className="opacity-[0.32] sm:opacity-[0.40]">
            <HandDrawnMandala className="w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] md:w-[900px] md:h-[900px] text-[#B38B6D]" delay={0.1} />
          </div>
        </div>

        <div className="text-center max-w-2xl mx-auto mb-8 relative z-10">
          <span className="inline-block text-xs tracking-widest text-[#53331F] font-semibold uppercase mb-2">Moje vize</span>
          <h2 className="text-3xl font-serif text-stone-900 font-light">
            Vnímám tělo jako moudrý systém, který touží po harmonii
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="space-y-6 text-stone-700 leading-relaxed font-light"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <p>
              Věřím, že každé napětí, bolest nebo jizva v sobě nesou svůj jedinečný příběh. Ve své praxi neposkytuji univerzální návody ani mechanické služby. Mé ošetření kombinuje odborné vědecké poznatky o lidském těle s hlubokou citlivostí, respektem a intuicí.
            </p>
            <p>
              Ať už procházíte obdobím těhotenství, hojíte se po narození miminka, zotavujete se po operačním zákroku (císařský řez, gynekologické operace aj.), nebo jen hledáte pevný opěrný bod uprostřed každodenního shonu, mým přáním je vytvořit pro vás bezpečný a tichý prostor, kde se můžete opravdu zastavit a být sami sebou.
            </p>
            <div className="bg-stone-50 border-l-2 border-[#53331F] pl-4 py-1 italic text-stone-800 font-medium font-serif">
              „Skrze jemný a plně přítomný dotek můžeme rozpustit i to nejhlubší stažení. Tělo pak dokáže znovu povolat své vlastní samoléčebné schopnosti.“
            </div>
          </motion.div>

          <motion.div 
            className="bg-stone-50 p-6 md:p-8 rounded-3xl border border-[#E6D9C9]/60 grid grid-cols-2 gap-4 shadow-xs"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div 
              className="bg-white p-5 rounded-2xl border border-[#E6D9C9]/40 flex flex-col justify-between hover:shadow-xs transition-shadow"
              variants={itemVariants}
            >
              <Shield className="w-7 h-7 text-[#53331F] mb-3 opacity-90" />
              <div>
                <h3 className="font-serif font-medium text-stone-900 mb-1 text-sm">Bezpečný prostor</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed">Nikoho nesoudím, plně respektuji vaši vlastní cestu a tempo.</p>
              </div>
            </motion.div>
            <motion.div 
              className="bg-white p-5 rounded-2xl border border-[#E6D9C9]/40 flex flex-col justify-between hover:shadow-xs transition-shadow"
              variants={itemVariants}
            >
              <Award className="w-7 h-7 text-[#B38B6D] mb-3 opacity-90" />
              <div>
                <h3 className="font-serif font-medium text-stone-900 mb-1 text-sm">Odbornost</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed">Licencovaná porodní asistence s klinickým i doplňkovým vzděláním.</p>
              </div>
            </motion.div>
            <motion.div 
              className="bg-white p-5 rounded-2xl border border-[#E6D9C9]/40 flex flex-col justify-between hover:shadow-xs transition-shadow"
              variants={itemVariants}
            >
              <Users className="w-7 h-7 text-[#53331F] mb-3 opacity-90" />
              <div>
                <h3 className="font-serif font-medium text-stone-900 mb-1 text-sm">Individuální přístup</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed">Každé setkání se ladí podle vaší okamžité tělesné i duševní formy.</p>
              </div>
            </motion.div>
            <motion.div 
              className="bg-white p-5 rounded-2xl border border-[#E6D9C9]/40 flex flex-col justify-between hover:shadow-xs transition-shadow"
              variants={itemVariants}
            >
              <Heart className="w-7 h-7 text-[#B38B6D] mb-3 opacity-90" />
              <div>
                <h3 className="font-serif font-medium text-stone-900 mb-1 text-sm">Hojení jizev</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed">Jedinečný celostní přístup integrující emoce i fyzické tkáně.</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Interactive Breathing Oasis Widget - Calm Moving Element */}
      <section className="max-w-5xl mx-auto px-4" id="breathing-oasis">
        <motion.div 
          className="bg-gradient-to-br from-white to-[#FAF6F0] rounded-3xl border border-[#E6D9C9] p-8 md:p-12 shadow-sm relative overflow-hidden flex flex-col lg:flex-row items-center gap-10"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9 }}
        >
          {/* Left Text content */}
          <div className="flex-1 space-y-6 z-10 text-center lg:text-left">
            <span className="inline-flex items-center space-x-1.5 text-xs text-[#B38B6D] uppercase font-semibold tracking-wider bg-[#FAF6F0]/80 border border-[#E6D9C9]/50 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Oáza vnitřního klidu</span>
            </span>
            <h3 className="text-2xl md:text-3xl font-serif text-stone-950 font-light">
              Zpomalte svůj den a jen dýchejte
            </h3>
            <p className="text-stone-600 text-sm leading-relaxed max-w-lg font-light">
              Tento dechový asistent vás provede světoznámou zklidňující technikou dýchání **4-7-8**. Pomáhá uvolnit napětí v nervové soustavě, zklidnit mysl a připravit tělo na hlubokou regeneraci.
            </p>

            <div className="space-y-3.5 border-t border-[#E6D9C9]/50 pt-4 mt-2 text-left">
              <p className="text-xs text-[#53331F] uppercase tracking-wider font-semibold">Průvodce fázemi cyklu:</p>
              <div className="space-y-2 text-xs text-stone-600">
                <div className={`p-3 rounded-xl border transition-all duration-300 ${activePhase.step === 0 ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950 shadow-2xs' : 'bg-white/40 border-stone-100'}`}>
                  <strong>Nádech (4 vteřiny):</strong> Úplně vydechněte ústy, zavřete je a pomalu se nadechujte nosem, zatímco v duchu počítáte do čtyř.
                </div>
                <div className={`p-3 rounded-xl border transition-all duration-300 ${activePhase.step === 1 ? 'bg-stone-50 border-stone-200 text-stone-900 shadow-2xs' : 'bg-white/40 border-stone-100'}`}>
                  <strong>Zádrž (7 vteřin):</strong> Zadržte dech a v duchu napočítejte do sedmi.
                </div>
                <div className={`p-3 rounded-xl border transition-all duration-300 ${activePhase.step === 2 ? 'bg-orange-50/60 border-orange-200 text-orange-950 shadow-2xs' : 'bg-white/40 border-stone-100'}`}>
                  <strong>Výdech (8 vteřin):</strong> Pomalu a slyšitelně vydechujte ústy a počítejte do osmi.
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-start space-x-3 pt-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3.5 rounded-full bg-[#53331F] text-white hover:bg-[#3F2212] transition-colors shadow-xs cursor-pointer flex items-center justify-center"
                title={isPlaying ? 'Pozastavit' : 'Spustit'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              <button
                onClick={() => {
                  setElapsedTime(0);
                }}
                className="p-3.5 rounded-full bg-white border border-[#E6D9C9] text-stone-600 hover:bg-stone-50 transition-colors shadow-xs cursor-pointer flex items-center justify-center"
                title="Restartovat"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <span className="text-xs text-stone-500 italic pl-1">
                {isPlaying ? 'Aktivní cvičení v běhu...' : 'Cvičení pozastaveno'}
              </span>
            </div>
          </div>

          {/* Right Breathing Circle graphic */}
          <div className="w-72 h-72 flex items-center justify-center relative flex-shrink-0">
            {/* Pulsing Concentric Aura Waves */}
            <AnimatePresence mode="popLayout">
              <motion.div
                key={`wave-1-${activePhase.step}`}
                className={`absolute rounded-full opacity-10`}
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: activePhase.step === 0 ? '#10b981' : activePhase.step === 1 ? '#B38B6D' : '#ea580c'
                }}
                animate={{
                  scale: activePhase.ringScale * 1.35,
                  opacity: isPlaying ? [0.15, 0.25, 0] : 0.08
                }}
                transition={{
                  duration: isPlaying ? (activePhase.step === 0 ? 4 : activePhase.step === 1 ? 7 : 8) : 4,
                  ease: "easeInOut",
                  repeat: Infinity
                }}
              />
            </AnimatePresence>

            <motion.div
              className="absolute rounded-full bg-[#B38B6D]/5"
              animate={{
                scale: activePhase.ringScale * 1.6,
                opacity: [0.1, 0.05, 0.1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              style={{ width: '100%', height: '100%' }}
            />

            {/* Pulsing Core Circle with dynamic colors */}
            <motion.div
              className={`absolute rounded-full flex flex-col items-center justify-center z-10 text-center shadow-lg border border-[#E6D9C9]/50`}
              animate={{
                scale: activePhase.ringScale,
              }}
              transition={{
                type: "tween",
                ease: "linear",
                duration: 0.1
              }}
              style={{
                width: '190px',
                height: '190px',
                backgroundColor: '#ffffff'
              }}
            >
              <motion.div
                animate={{
                  y: isPlaying && activePhase.step === 0 ? [0, -4, 0] : isPlaying && activePhase.step === 2 ? [0, 4, 0] : 0
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Wind className="w-5 h-5 text-[#B38B6D] mb-1.5 opacity-90" />
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.span
                  key={activePhase.subText}
                  initial={{ opacity: 0, scale: 0.9, y: 5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -5 }}
                  transition={{ duration: 0.4 }}
                  className={`text-base font-serif font-semibold tracking-wide ${activePhase.color}`}
                >
                  {activePhase.subText}
                </motion.span>
              </AnimatePresence>

              <span className="text-[10px] text-stone-400 font-mono mt-1 font-light tracking-wider">
                {activePhase.progressText}
              </span>

              {/* Step indicator pills */}
              <div className="flex space-x-1 mt-3">
                {[0, 1, 2].map((step) => (
                  <div
                    key={step}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      activePhase.step === step ? 'bg-[#53331F] scale-125' : 'bg-stone-200'
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Dynamic description of the current breath phase below circle on small devices, or within cards */}
        <div className="max-w-xl mx-auto text-center mt-6 h-12">
          <AnimatePresence mode="wait">
            <motion.p
              key={activePhase.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-xs ${activePhase.color} font-medium tracking-wide uppercase mb-1`}
            >
              {activePhase.title}
            </motion.p>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.p
              key={activePhase.desc}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-stone-500 font-light max-w-md mx-auto leading-relaxed"
            >
              {activePhase.desc}
            </motion.p>
          </AnimatePresence>
        </div>
      </section>

      {/* Featured Services Teaser */}
      <section className="bg-[#FAF6F0] py-16 px-4 rounded-3xl border border-[#E6D9C9]" id="featured-teasers">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="inline-block text-xs tracking-widest text-[#53331F] font-semibold uppercase mb-2">Čemu se věnuji</span>
              <h3 className="text-3xl font-serif text-stone-900 font-light">Představení klíčové péče</h3>
            </div>
            <button
              id="teaser-view-all-services"
              onClick={() => setActiveTab('services')}
              className="text-[#53331F] hover:text-[#3F2212] font-semibold text-sm transition-colors mt-4 md:mt-0 flex items-center space-x-1.5 cursor-pointer hover:translate-x-1 duration-200"
            >
              <span>Zobrazit všechny služby</span>
              <span className="text-lg">→</span>
            </button>
          </div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* Card 1 */}
            <motion.div 
              className="bg-white p-6 rounded-2xl border border-[#E6D9C9] shadow-xs flex flex-col justify-between hover:shadow-md hover:border-[#B38B6D]/50 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#B38B6D] mb-4 flex items-center justify-center font-serif font-bold text-sm">
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
                className="text-xs font-semibold text-[#53331F] hover:text-[#B38B6D] transition-colors uppercase tracking-wide self-start mt-4 cursor-pointer"
              >
                Více o péči →
              </button>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              className="bg-white p-6 rounded-2xl border border-[#E6D9C9] shadow-xs flex flex-col justify-between hover:shadow-md hover:border-[#B38B6D]/50 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-[#53331F] mb-4 flex items-center justify-center font-serif font-bold text-sm">
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
                className="text-xs font-semibold text-[#53331F] hover:text-[#B38B6D] transition-colors uppercase tracking-wide self-start mt-4 cursor-pointer"
              >
                Více o péči →
              </button>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              className="bg-white p-6 rounded-2xl border border-[#E6D9C9] shadow-xs flex flex-col justify-between hover:shadow-md hover:border-[#B38B6D]/50 transition-all duration-300"
              variants={itemVariants}
              whileHover={{ y: -4 }}
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#B38B6D] mb-4 flex items-center justify-center font-serif font-bold text-sm">
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
                className="text-xs font-semibold text-[#53331F] hover:text-[#B38B6D] transition-colors uppercase tracking-wide self-start mt-4 cursor-pointer"
              >
                Více o péči →
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Quote Banner with gentle scale in viewport */}
      <motion.section 
        className="text-center bg-[#53331F] text-white py-14 px-6 rounded-3xl relative overflow-hidden" 
        id="quote-strip"
        initial={{ scale: 0.95, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#B38B6D,transparent_55%)] opacity-20 pointer-events-none" />
        <p className="font-serif italic text-xl md:text-2xl font-light mb-4 relative z-10 max-w-xl mx-auto">
          „Klid v duši začíná uvolněním v těle.“
        </p>
        <p className="text-xs uppercase tracking-widest text-[#E6D9C9] font-semibold relative z-10">
          — Kateřina Hrubá
        </p>
      </motion.section>
      </div>
    </div>
  );
}
