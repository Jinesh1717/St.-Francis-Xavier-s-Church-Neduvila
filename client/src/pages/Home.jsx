import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Calendar, Clock, MapPin, Bell, ArrowRight, Image as ImageIcon, Heart, Sparkles, Navigation } from 'lucide-react';
import { CardSkeleton, NoticeSkeleton } from '../components/Skeleton';
import Lightbox from '../components/Lightbox';
import { CHURCH_CONFIG } from '../config/church';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [notices, setNotices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lightbox state for gallery preview
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, noticesRes, galleryRes, settingsRes] = await Promise.all([
          api.get('/events?type=upcoming'),
          api.get('/notices'),
          api.get('/gallery'),
          api.get('/settings'),
        ]);

        setEvents(eventsRes.data?.slice(0, 3) || []);
        setNotices(noticesRes.data?.filter((n) => n.isPinned).slice(0, 3) || []);
        setGallery(galleryRes.data?.items?.slice(0, 6) || []);
        setSettings(settingsRes.data || null);
      } catch (err) {
        console.error('Error loading homepage data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openLightbox = (index) => {
    setCurrentPhotoIdx(index);
    setLightboxOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl glass-panel p-8 sm:p-14 lg:p-20 text-center shadow-glass border border-white/80">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gold-100/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-skyblue-200/40 blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto space-y-6">
          {/* Church Patron Saint Logo / Emblem */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full p-1 bg-white/90 shadow-glass border-2 border-gold-400/80 backdrop-blur-xs flex items-center justify-center ring-4 ring-gold-200/50 overflow-hidden">
            <img
              src={CHURCH_CONFIG.logo || '/logo.png'}
              alt="St. Francis Xavier Logo"
              className="w-full h-full rounded-full object-cover"
            />
          </div>

          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/80 border border-gold-300/80 shadow-2xs text-xs sm:text-sm text-gold-800 font-semibold backdrop-blur-xs">
            <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
            <span>Welcome to St. Francis Xavier's Parish Community</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif-church font-bold text-slate-900 tracking-tight leading-tight">
            St. Francis Xavier's Church
          </h1>

          <p className="font-ml text-xl sm:text-2xl lg:text-3xl text-gold-700 font-semibold">
            വിശുദ്ധ ഫ്രാൻസിസ് സേവ്യർ ദൈവാലയം, നെടുവില
          </p>

          <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed font-normal">
            "Go into the whole world and proclaim the gospel to every creature." — St. Francis Xavier.
            We warmly welcome you to prayer, holy masses, Marian devotion, and fellowship in Neduvila, Kerala.
          </p>

          {/* Call-to-action buttons (Events, Japamala, Directions) */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/events"
              className="btn-gold px-7 py-3.5 text-sm flex items-center shadow-md"
            >
              <Calendar className="w-4 h-4 mr-2" />
              View Events
            </Link>
            <Link
              to="/japamala"
              className="btn-glass px-7 py-3.5 text-sm flex items-center"
            >
              <Sparkles className="w-4 h-4 mr-2 text-gold-600" />
              Japamala / ജപമാല
            </Link>
            <a
              href={CHURCH_CONFIG.map.directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-glass px-7 py-3.5 text-sm flex items-center"
            >
              <Navigation className="w-4 h-4 mr-2 text-gold-600" />
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* 2. Important Notices (Pinned) */}
      {notices.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-2xl font-heading font-bold text-slate-900">
                  Important Notices
                </h2>
                <p className="text-sm text-slate-500">
                  പ്രധാന അറിയിപ്പുകൾ (Key parish announcements)
                </p>
              </div>
            </div>
            <Link
              to="/notices"
              className="text-sm font-semibold text-gold-700 hover:text-gold-800 flex items-center"
            >
              All Notices <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notices.map((notice) => (
              <div
                key={notice._id}
                className="glass-card rounded-2xl p-6 border-l-4 border-l-gold-500 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-700">
                      Pinned Notice
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(notice.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3 className="font-heading font-semibold text-base text-slate-900 mb-2">
                    {notice.title}
                  </h3>
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {notice.message}
                  </p>
                </div>
                {notice.expiryDate && (
                  <p className="mt-4 text-xs text-slate-400 italic">
                    Valid till: {new Date(notice.expiryDate).toLocaleDateString('en-IN')}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Upcoming Events Preview */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading font-bold text-slate-900">
              Upcoming Events & Liturgies
            </h2>
            <p className="text-sm text-slate-500">
              വരാനിരിക്കുന്ന പരിപാടികൾ (Join us in our upcoming parish celebrations)
            </p>
          </div>
          <Link
            to="/events"
            className="text-sm font-semibold text-skyblue-700 hover:text-skyblue-800 flex items-center"
          >
            Full Calendar <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <CardSkeleton count={3} />
        ) : events.length === 0 ? (
          <div className="bg-cream-50 rounded-2xl p-8 text-center border border-dashed border-cream-300 text-slate-500">
            No upcoming events scheduled right now. Check back soon!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.map((evt) => (
              <div
                key={evt._id}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group"
              >
                {evt.posterImage?.url ? (
                  <div className="h-48 overflow-hidden bg-cream-200 relative">
                    <img
                      src={evt.posterImage.url}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 text-xs font-semibold text-slate-900 shadow-xs">
                      {formatDate(evt.date)}
                    </div>
                  </div>
                ) : (
                  <div className="h-28 bg-skyblue-100 flex items-center justify-between px-6 border-b border-skyblue-200">
                    <Calendar className="w-8 h-8 text-skyblue-600" />
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-slate-800 shadow-xs">
                      {formatDate(evt.date)}
                    </span>
                  </div>
                )}

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-lg text-slate-900 mb-2 leading-snug">
                      {evt.title}
                    </h3>
                    <div className="space-y-1.5 text-xs text-slate-600 mb-4">
                      <div className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-2 text-gold-500 flex-shrink-0" />
                        <span>{evt.time}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-2 text-gold-500 flex-shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {evt.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-cream-200 flex justify-end">
                    <Link
                      to="/events"
                      className="text-xs font-semibold text-gold-600 hover:text-gold-700 flex items-center"
                    >
                      More Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Gallery Preview (6 Photos) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading font-bold text-slate-900">
              Parish Gallery Preview
            </h2>
            <p className="text-sm text-slate-500">
              ദൈവാലയ ചിത്രങ്ങൾ (Glimpses of sacred worship and parish life)
            </p>
          </div>
          <Link
            to="/gallery"
            className="text-sm font-semibold text-gold-700 hover:text-gold-800 flex items-center"
          >
            View All Photos <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {gallery.length === 0 ? (
          <div className="bg-cream-50 rounded-2xl p-8 text-center border border-dashed border-cream-300 text-slate-500">
            No gallery photos added yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {gallery.map((item, idx) => (
              <div
                key={item._id}
                onClick={() => openLightbox(idx)}
                className="group relative h-40 rounded-2xl overflow-hidden bg-cream-200 cursor-pointer shadow-soft hover:shadow-soft-lg transition-all"
              >
                <img
                  src={item.image?.url}
                  alt={item.caption || 'Parish photo'}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                  <span className="text-xs text-white font-medium line-clamp-2">
                    {item.caption || item.album}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Short About Parish Section */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-600 bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
              About Our Church
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900 leading-snug">
              A Haven of Prayer and Spiritual Fellowship in Neduvila
            </h2>
            <p className="font-ml text-base text-slate-700 leading-relaxed">
              വിശുദ്ധ ഫ്രാൻസിസ് സേവ്യറുടെ സംരക്ഷണയിൽ പടുത്തുയർത്തിയ നെടുവില ഇടവക വിശ്വാസ സാക്ഷ്യത്തിന്റെ തിളക്കമുള്ള അടയാളമാണ്.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {settings?.historyText ||
                "St. Francis Xavier's Church, Neduvila has been a beacon of faith, hope, and charity for generations. Established under the Archdiocese, our parish family gathers in prayer and communion, dedicated to the patron saint of missionaries, St. Francis Xavier."}
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center text-sm font-semibold text-gold-700 hover:text-gold-800"
              >
                Read parish history & view location on Google Map <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>

          <div className="bg-skyblue-50 rounded-2xl p-6 sm:p-8 border border-skyblue-100 space-y-4">
            <h3 className="font-heading font-semibold text-lg text-slate-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gold-600" />
              Sunday & Weekday Holy Masses
            </h3>
            <div className="space-y-3 text-sm text-slate-700">
              <div className="p-3 bg-white rounded-xl border border-skyblue-200/60 shadow-2xs">
                <p className="font-semibold text-slate-900">Sunday Mass (ഞായർ കുർബാന)</p>
                <p className="text-xs text-slate-600">06:30 AM & 09:30 AM (Solemn High Mass & Catechism)</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-skyblue-200/60 shadow-2xs">
                <p className="font-semibold text-slate-900">Friday Devotions (വെള്ളി)</p>
                <p className="text-xs text-slate-600">06:30 AM & 05:00 PM (Holy Mass & Novena of Our Lady)</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-skyblue-200/60 shadow-2xs">
                <p className="font-semibold text-slate-900">Confessions (കുമ്പസാരം)</p>
                <p className="text-xs text-slate-600">Every Saturday from 05:00 PM to 06:30 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox for preview */}
      <Lightbox
        images={gallery}
        currentIndex={currentPhotoIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentPhotoIdx}
      />
    </div>
  );
};

export default Home;

