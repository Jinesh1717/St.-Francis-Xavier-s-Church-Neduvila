import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, Navigation, ExternalLink } from 'lucide-react';
import { CHURCH_CONFIG } from '../config/church';

const About = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        setSettings(res.data || null);
      } catch (err) {
        console.error('Error fetching settings:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const massTimings = settings?.massTimings || [
    { day: "Sunday (ഞായർ)", time: "06:30 AM & 09:30 AM", description: "വിശുദ്ധ കുർബാന & വചനസന്ദേശം (Solemn Mass)" },
    { day: "Monday to Thursday (തിങ്കൾ - വ്യാഴം)", time: "06:30 AM", description: "വിശുദ്ധ കുർബാന (Morning Mass)" },
    { day: "Friday (വെള്ളി)", time: "06:30 AM & 05:00 PM", description: "വിശുദ്ധ കുർബാന & നിത്യസഹായ മാതാവിന്റെ നൊവേന (Novena & Adoration)" },
    { day: "Saturday (ശനി)", time: "06:45 AM", description: "വിശുദ്ധ കുർബാന & മരിയൻ പ്രാർത്ഥന" },
  ];

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900">
          About Our Parish & Contact
        </h1>
        <p className="font-ml text-gold-700 font-semibold text-lg">
          ഇടവക ചരിത്രവും സമ്പർക്ക വിവരങ്ങളും
        </p>
        <p className="text-sm sm:text-base text-slate-600">
          Learn about our rich spiritual heritage, patron saint St. Francis Xavier, liturgical timings, and how to reach our parish church in Neduvila.
        </p>
      </div>

      {/* History Card */}
      <section className="bg-cream-50 rounded-3xl p-8 sm:p-12 border border-cream-200/90 shadow-soft space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-skyblue-100 text-skyblue-700 flex items-center justify-center font-bold">
            ✝
          </div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Parish History & Heritage
          </h2>
        </div>

        <div className="space-y-4 text-slate-700 leading-relaxed sm:text-base text-sm">
          <p className="font-ml text-slate-800 bg-cream-100/80 p-5 rounded-2xl border border-cream-200 leading-loose">
            {settings?.historyTextMalayalam ||
              "തലമുറകളായി വിശ്വാസത്തിന്റെയും സ്നേഹത്തിന്റെയും ദീപസ്തംഭമായി നെടുവില വിശുദ്ധ ഫ്രാൻസിസ് സേവ്യർ ദൈവാലയം നിലകൊള്ളുന്നു. വിശുദ്ധ ഫ്രാൻസിസ് സേവ്യറുടെ മധ്യസ്ഥതയിൽ സ്ഥാപിതമായ ഈ ഇടവക പ്രാർത്ഥനയിലും അഗതികൾക്കായുള്ള ജീവകാരുണ്യ പ്രവർത്തനങ്ങളിലും സജീവമാണ്."}
          </p>

          <p>
            {settings?.historyText ||
              "St. Francis Xavier's Church, Neduvila has been a beacon of faith, hope, and charity for generations. Established under the Archdiocese, our parish family gathers in prayer and communion, dedicated to the patron saint of missionaries, St. Francis Xavier. We are devoted to pastoral care, catechism, community outreach, and spiritual renewal."}
          </p>
        </div>
      </section>

      {/* Mass Timings Section */}
      <section className="bg-cream-50 rounded-3xl p-8 sm:p-12 border border-cream-200/90 shadow-soft space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-slate-900">
              Holy Mass & Devotional Timings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              ദിവ്യബലി സമയക്രമം (Daily and weekly schedule of Eucharistic celebrations)
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-cream-300 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Day</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Liturgy / Devotion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200 text-sm">
              {massTimings.map((t, idx) => (
                <tr key={idx} className="hover:bg-cream-100/60 transition-colors">
                  <td className="py-4 px-4 font-semibold text-slate-900">{t.day}</td>
                  <td className="py-4 px-4 font-medium text-gold-700 whitespace-nowrap">{t.time}</td>
                  <td className="py-4 px-4 text-slate-600">{t.description || 'Holy Mass'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Contact & Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Info Card */}
        <section className="bg-cream-50 rounded-3xl p-8 border border-cream-200/90 shadow-soft flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="text-2xl font-heading font-bold text-slate-900 flex items-center">
              <MapPin className="w-6 h-6 mr-2 text-gold-600" />
              Parish Office & Rectory
            </h2>

            <div className="space-y-5 text-sm sm:text-base text-slate-700">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Address:</p>
                  <p className="text-slate-600 mt-0.5">
                    {settings?.address || "Neduvila, Alappuzha District, Kerala, India - 688531"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-5 h-5 mr-3 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Parish Phone:</p>
                  <p className="text-slate-600 mt-0.5">
                    {settings?.phone || "+91 94470 23456 / 0477 2289123"}
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="w-5 h-5 mr-3 text-slate-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Email:</p>
                  <a
                    href={`mailto:${settings?.email || 'parish@stfrancisneduvila.org'}`}
                    className="text-gold-600 hover:text-gold-700 underline mt-0.5 block"
                    rel="noopener noreferrer"
                  >
                    {settings?.email || "parish@stfrancisneduvila.org"}
                  </a>
                </div>
              </div>

              <div className="pt-4 border-t border-cream-200 text-xs text-slate-500">
                <p>Office Hours: Tuesday to Saturday (09:00 AM – 12:30 PM, 04:00 PM – 06:00 PM)</p>
                <p className="mt-1">Parish Vicar is available for pastoral consultations and house blessings.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Embedded Google Map */}
        <section className="bg-cream-50 rounded-3xl p-4 sm:p-6 border border-cream-200/90 shadow-soft overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 px-2">
              <h3 className="font-heading font-semibold text-base text-slate-800">
                Location Map (Neduvila, Kerala)
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {CHURCH_CONFIG.coordinates.lat}, {CHURCH_CONFIG.coordinates.lng}
              </span>
            </div>
            <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-cream-200 shadow-inner bg-cream-100">
              <iframe
                src={CHURCH_CONFIG.map.embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={CHURCH_CONFIG.map.title}
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-cream-200/80 flex flex-wrap gap-3">
            <a
              href={CHURCH_CONFIG.map.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs sm:text-sm font-semibold shadow-xs flex items-center justify-center transition-all"
            >
              <Navigation className="w-4 h-4 mr-1.5" />
              Get Directions
            </a>
            <a
              href={CHURCH_CONFIG.map.googleMapsPlaceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[140px] px-4 py-2.5 rounded-xl bg-cream-200 hover:bg-cream-300 text-slate-800 text-xs sm:text-sm font-semibold border border-cream-300 flex items-center justify-center transition-all"
            >
              <ExternalLink className="w-4 h-4 mr-1.5 text-gold-600" />
              Open in Google Maps
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;

