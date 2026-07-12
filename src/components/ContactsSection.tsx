import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { submitContactMessage } from '../lib/firebaseService';

export default function ContactsSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setErrorMsg('Vyplňte prosím všechna povinná pole.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await submitContactMessage({ name, email, phone, message });
      setSuccess(true);
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setTimeout(() => setSuccess(false), 9000);
    } catch (err) {
      console.error('Error submitting feedback form:', err);
      setErrorMsg('Něco se nepodařilo odeslat. Zkuste to prosím znovu nebo napište přímo na email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in" id="contacts-section">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-xs tracking-widest text-[#53331F] font-semibold uppercase mb-2">Jak mne kontaktovat</h2>
        <p className="text-3xl md:text-4xl font-serif text-stone-900 font-light mb-4">
          Napište mi nebo mě navštivte v mém studiu
        </p>
        <p className="text-stone-600 font-light max-w-xl mx-auto text-sm leading-relaxed">
          Těším se na setkání s vámi. Ať už máte dotaz, přání ohledně doprovázení, nebo si chcete rovnou domluvit ošetření.
        </p>
        <div className="w-16 h-1 bg-[#B38B6D] mx-auto mt-6 rounded-full"></div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10 items-start max-w-5xl mx-auto" id="contacts-grid-container">
        {/* LEFT: Cards description (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E6D9C9] space-y-5">
            <h3 className="font-serif font-medium text-stone-900 text-lg border-b border-stone-100 pb-3">
              Kateřina Hrubá
            </h3>
            
            <div className="space-y-4 font-light text-stone-700 text-sm">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-[#53331F] shrink-0 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-stone-950 font-serif">Adresa studia:</h4>
                  <p className="mt-0.5">Salajna 17<br />350 02 Dolní Žandov, Česká republika</p>
                  <p className="text-xs text-stone-500 mt-1.5 italic">Můžete dojet autem přímo na místo a bezplatně zaparkovat přímo u objektu.</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-5 h-5 text-[#53331F] shrink-0 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-stone-950 font-serif">Telefonní kontakt:</h4>
                  <p className="mt-0.5">+420 732 984 105</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="w-5 h-5 text-[#53331F] shrink-0 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-stone-950 font-serif">E-mail:</h4>
                  <p className="mt-0.5 hover:underline">
                    <a href="mailto:magnetic.memories.cz@gmail.com">magnetic.memories.cz@gmail.com</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Clock className="w-5 h-5 text-[#53331F] shrink-0 mr-3 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-stone-950 font-serif">Provozní doba:</h4>
                  <p className="mt-0.5">Pondělí – Pátek: 09:00 – 18:00<br />Sobota: Podle předchozí domluvy</p>
                  <p className="text-xs text-stone-400 mt-1 italic">Návštěvy pouze po předchozí rezervaci.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#E6D9C9] font-light text-stone-600 text-xs leading-relaxed space-y-2">
            <p className="font-serif font-medium text-stone-800 text-sm">Kde mne najdete?</p>
            <p>Studio se nachází v klidném a harmonickém venkovském prostředí tradičního chebského statku v obci Salajna. Je to ideální oáza klidu pro vaše zklidnění, odpočinek a péči o tělo i jizvy daleko od ruchu velkoměsta. <strong>Můžete dojet autem přímo na místo a pohodlně zaparkovat tam (bezplatné parkování přímo u objektu).</strong></p>
          </div>
        </div>

        {/* RIGHT: Netlify Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-[#E6D9C9] shadow-xs">
          <h3 className="font-serif font-medium text-stone-950 text-xl mb-6">Kontaktní formulář</h3>

          <form
            name="contact"
            method="POST"
            data-netlify="true"
            onSubmit={handleSubmit}
            className="space-y-4"
            id="netlify-contact-form"
          >
            <input type="hidden" name="form-name" value="contact" />

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-500" htmlFor="contact-name">
                  Celé Jméno: *
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  id="contact-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Kateřina Hrubá"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D9C9] rounded-lg text-sm text-stone-800 outline-none focus:ring-1 focus:ring-[#53331F]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-500" htmlFor="contact-phone">
                  Telefon (nepovinné):
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="contact-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+420"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E6D9C9] rounded-lg text-sm text-stone-800 outline-none focus:ring-1 focus:ring-[#53331F]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500" htmlFor="contact-email">
                E-mailová adresa: *
              </label>
              <input
                required
                type="email"
                name="email"
                id="contact-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="katerina@priklad.cz"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E6D9C9] rounded-lg text-sm text-stone-800 outline-none focus:ring-1 focus:ring-[#53331F]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-500" htmlFor="contact-message">
                Vaše zpráva: *
              </label>
              <textarea
                required
                name="message"
                id="contact-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Dobrý den, chtěla bych se zeptat na možnosti..."
                className="w-full p-3.5 bg-white border border-[#E6D9C9] rounded-lg text-sm text-stone-800 outline-none focus:ring-1 focus:ring-[#53331F] resize-none"
              />
            </div>

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-lg text-xs flex items-center space-x-1.5">
                <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>Formulář byl úspěšně odeslán. Budu vás co nejdříve kontaktovat!</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-800 rounded-lg text-xs flex items-center space-x-1.5">
                <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              id="contact-submit-btn"
              disabled={loading}
              type="submit"
              className="w-full py-3.5 bg-[#53331F] border-none text-white font-serif font-medium hover:bg-[#3F2212] rounded-full text-sm transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Hlásím do systému...' : 'Odeslat dotaz'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Interactive Map Iframe */}
      <div className="max-w-5xl mx-auto space-y-3" id="map-wrap">
        <span className="text-xs font-semibold uppercase tracking-widest text-stone-500 block">🗺️ Umístění studia na mapě – Salajna, Dolní Žandov</span>
        <div className="w-full h-80 rounded-3xl overflow-hidden border border-[#E6D9C9] shadow-xs">
          <iframe
            src="https://maps.google.com/maps?q=Salajna%2017,%20Doln%C3%AD%20%C5%BDandov&t=&z=14&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Studio Kateřina Hrubá Salajna mapa"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
