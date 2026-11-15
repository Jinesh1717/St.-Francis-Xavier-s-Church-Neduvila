import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/client';
import {
  Clock,
  Compass,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

const DEFAULT_STATIONS = [
  { num: 1, title: 'Jesus is condemned to death', titleMl: 'ഒന്നാം സ്ഥലം: ഈശോമിശിഹാ മരണത്തിന് വിധിക്കപ്പെടുന്നു', meditation: 'Consider how Jesus, scourged and crowned with thorns, was unjustifiably judged to death.' },
  { num: 2, title: 'Jesus carries His cross', titleMl: 'രണ്ടാം സ്ഥലം: ഈശോമിശിഹാ കുരിശു ചുമക്കുന്നു', meditation: 'Consider Jesus as He walked this road with the Cross upon His wounded shoulders.' },
  { num: 3, title: 'Jesus falls the first time', titleMl: 'മൂന്നാം സ്ഥലം: ഈശോമിശിഹാ ഒന്നാം പ്രാവശ്യം വീഴുന്നു', meditation: 'Consider the first fall of Jesus under His Cross.' },
  { num: 4, title: 'Jesus meets His mother', titleMl: 'നാലാം സ്ഥലം: ഈശോ വഴിയിൽവച്ചു തന്റെ മാതാവിനെ കാണുന്നു', meditation: 'Consider the sorrowful meeting of Jesus and His Holy Mother.' },
  { num: 5, title: 'Simon of Cyrene helps Jesus', titleMl: 'അഞ്ചാം സ്ഥലം: ശിമയോൻ ഈശോയെ സഹായിക്കുന്നു', meditation: 'Consider how the soldiers compel Simon of Cyrene to carry the Cross behind the Lord.' },
  { num: 6, title: 'Veronica wipes the face of Jesus', titleMl: 'ആറാം സ്ഥലം: വേറോനിക്ക ഈശോയുടെ മുഖം തുടയ്ക്കുന്നു', meditation: 'Consider how the holy woman Veronica bravely wiped the face of Jesus.' },
  { num: 7, title: 'Jesus falls the second time', titleMl: 'ഏഴാം സ്ഥലം: ഈശോമിശിഹാ രണ്ടാം പ്രാവശ്യം വീഴുന്നു', meditation: 'Consider how the cruel load and exhaustion cause Jesus to fall again.' },
  { num: 8, title: 'Jesus meets the women of Jerusalem', titleMl: 'എട്ടാം സ്ഥലം: ഈശോ യെരുശലേം നഗരിയിലെ സ്ത്രീകളെ ആശ്വസിപ്പിക്കുന്നു', meditation: 'Consider Jesus consoling the weeping women of Jerusalem.' },
  { num: 9, title: 'Jesus falls the third time', titleMl: 'ഒൻപതാം സ്ഥലം: ഈശോമിശിഹാ മൂന്നാം പ്രാവശ്യം വീഴുന്നു', meditation: 'Consider the third fall of our Lord Jesus Christ, weakened to death.' },
  { num: 10, title: 'Jesus is stripped of His garments', titleMl: 'പത്താം സ്ഥലം: ഈശോയുടെ വസ്ത്രങ്ങൾ ഉരിയപ്പെടുന്നു', meditation: 'Consider how Jesus was cruelly stripped of His garments by the executioners.' },
  { num: 11, title: 'Jesus is nailed to the cross', titleMl: 'പതിനൊന്നാം സ്ഥലം: ഈശോ കുരിശിൽ തറയ്ക്കപ്പെടുന്നു', meditation: 'Consider Jesus thrown upon the Cross, His hands and feet pierced with iron nails.' },
  { num: 12, title: 'Jesus dies on the cross', titleMl: 'പന്ത്രണ്ടാം സ്ഥലം: ഈശോ കുരിശിൽ മരിക്കുന്നു', meditation: 'Consider Jesus, after three hours of agony on the Cross, yielding up His Spirit.' },
  { num: 13, title: 'Jesus is taken down from the cross', titleMl: 'പതിമൂന്നാം സ്ഥലം: ഈശോയുടെ തിരുശരീരം മാതാവിന്റെ മടിയിൽ കിടത്തുന്നു', meditation: 'Consider Jesus taken down from the Cross and placed in the arms of His afflicted Mother.' },
  { num: 14, title: 'Jesus is laid in the tomb', titleMl: 'പതിനാലാം സ്ഥലം: ഈശോയുടെ തിരുശരീരം കല്ലറയിൽ അടക്കുന്നു', meditation: 'Consider the disciples carrying the Body of Jesus to lay Him in the rock tomb.' },
];

const KurisinteVazhi = () => {
  const [stations, setStations] = useState([]);
  const [timing, setTiming] = useState(null);
  const [loading, setLoading] = useState(true);

  // "Walk the Stations" mode state
  const [walkMode, setWalkMode] = useState(false);
  const [currentStationIndex, setCurrentStationIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stationsRes, timingRes] = await Promise.all([
          api.get('/prayers?type=kurisinte-vazhi'),
          api.get('/timings?type=kurisinte-vazhi'),
        ]);

        if (stationsRes.data && stationsRes.data.length > 0) {
          setStations(stationsRes.data);
        } else {
          // Fallback to default 14 station list
          setStations(
            DEFAULT_STATIONS.map((s, idx) => ({
              _id: `default-${s.num}`,
              order: s.num,
              title: `Station ${s.num}: ${s.title}`,
              titleMl: s.titleMl,
              body: 'Admin: add the approved prayer text here',
            }))
          );
        }

        setTiming(timingRes.data || null);
      } catch (err) {
        console.error('Error fetching Kurisinte Vazhi data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Keyboard navigation for Walk the Stations mode
  const handleNextStation = useCallback(() => {
    if (stations.length > 0) {
      setCurrentStationIndex((prev) => Math.min(stations.length - 1, prev + 1));
    }
  }, [stations.length]);

  const handlePrevStation = useCallback(() => {
    if (stations.length > 0) {
      setCurrentStationIndex((prev) => Math.max(0, prev - 1));
    }
  }, [stations.length]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!walkMode) return;
      if (e.key === 'ArrowRight') handleNextStation();
      if (e.key === 'ArrowLeft') handlePrevStation();
      if (e.key === 'Escape') setWalkMode(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [walkMode, handleNextStation, handlePrevStation]);

  const currentStation = stations[currentStationIndex] || stations[0];

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-gold-300 shadow-xs text-xs font-semibold text-gold-700">
          <Compass className="w-4 h-4 text-gold-600" />
          <span>Via Crucis • പാപപരിഹാര പ്രാർത്ഥന</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-church font-bold text-slate-900 tracking-tight">
          Kurisinte Vazhi / കുരിശിന്റെ വഴി
        </h1>
        <p className="font-ml text-gold-700 font-semibold text-lg sm:text-xl">
          നമ്മുടെ കർത്താവായ ഈശോമിശിഹായുടെ പീഡാനുഭവ സ്മരണ
        </p>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Walk the 14 Stations of the Cross with our Savior, recalling His supreme love, suffering, and redemption on Mount Calvary for the salvation of all humanity.
        </p>
      </div>

      {/* Parish Schedule Banner */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-gold-500">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-slate-900 text-sm sm:text-base">
              Lenten Devotion Timings (നോമ്പുകാല കുരിശിന്റെ വഴി)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-ml mt-0.5">
              {timing?.text || 'Every Friday during Great Lent (വലിയ നോമ്പിലെ എല്ലാ വെള്ളിയാഴ്ചകളിലും) at 04:30 PM followed by Holy Mass & Adoration.'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setCurrentStationIndex(0);
            setWalkMode(true);
          }}
          className="btn-gold px-6 py-2.5 text-xs sm:text-sm whitespace-nowrap flex items-center shadow-md"
        >
          <Maximize2 className="w-4 h-4 mr-1.5" />
          "Walk the Stations" Mode
        </button>
      </div>

      {/* Fullscreen "Walk the Stations" Mode */}
      {walkMode && currentStation && (
        <section className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
          <div className="glass-panel bg-white/95 max-w-3xl w-full rounded-3xl p-6 sm:p-10 shadow-2xl border border-gold-300 relative max-h-[90vh] overflow-y-auto">
            {/* Top Bar with Close */}
            <div className="flex items-center justify-between pb-4 border-b border-cream-300">
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gold-500 text-white">
                  Station {currentStationIndex + 1} of {stations.length}
                </span>
                <span className="text-xs text-slate-500 hidden sm:inline">
                  (Use Arrow Keys or buttons below)
                </span>
              </div>
              <button
                onClick={() => setWalkMode(false)}
                className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-cream-200 transition-colors"
                aria-label="Exit Walk Mode"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden mt-4">
              <div
                className="bg-gold-500 h-full transition-all duration-300"
                style={{ width: `${((currentStationIndex + 1) / stations.length) * 100}%` }}
              />
            </div>

            {/* Station Image if available */}
            {currentStation.imageUrl && (
              <div className="mt-6 h-56 sm:h-64 rounded-2xl overflow-hidden bg-cream-100 border border-cream-200">
                <img
                  src={currentStation.imageUrl}
                  alt={currentStation.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Station Content */}
            <div className="py-6 space-y-4 text-center">
              <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
                {currentStation.title}
              </h2>
              {currentStation.titleMl && (
                <p className="font-ml text-lg sm:text-xl text-gold-700 font-semibold">
                  {currentStation.titleMl}
                </p>
              )}

              {/* Liturgical Prayer Plain Text */}
              <div className="bg-cream-100/80 p-6 rounded-2xl border border-cream-300 text-left mt-6 shadow-inner">
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-ml whitespace-pre-line">
                  {currentStation.body || 'Admin: add the approved prayer text here'}
                </p>
              </div>
            </div>

            {/* Station Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-cream-300">
              <button
                onClick={handlePrevStation}
                disabled={currentStationIndex === 0}
                className="btn-glass px-5 py-2.5 text-xs sm:text-sm flex items-center disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous Station
              </button>
              <button
                onClick={() => setCurrentStationIndex(0)}
                className="p-2.5 rounded-full bg-cream-200 text-slate-600 hover:text-slate-900"
                title="Return to Station 1"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextStation}
                disabled={currentStationIndex === stations.length - 1}
                className="btn-gold px-6 py-2.5 text-xs sm:text-sm flex items-center disabled:opacity-40"
              >
                Next Station
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 14 Stations Vertical Timeline Card Grid */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
            The 14 Stations of the Cross
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            പതിനാല് സ്ഥലങ്ങളുടെ ധ്യാനവും പ്രാർത്ഥനയും
          </p>
        </div>

        <div className="space-y-6">
          {stations.map((station, idx) => (
            <article
              key={station._id || idx}
              className="glass-card p-6 sm:p-8 flex flex-col md:flex-row items-start gap-6 relative overflow-hidden"
            >
              {/* Station Number Badge */}
              <div className="w-12 h-12 rounded-2xl bg-gold-100 text-gold-700 font-heading font-bold text-xl flex items-center justify-center flex-shrink-0 shadow-xs border border-gold-300">
                {station.order || idx + 1}
              </div>

              {/* Station Info */}
              <div className="flex-1 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <h3 className="font-heading font-bold text-xl text-slate-900">
                    {station.title}
                  </h3>
                  <button
                    onClick={() => {
                      setCurrentStationIndex(idx);
                      setWalkMode(true);
                    }}
                    className="text-xs font-semibold text-gold-700 hover:text-gold-800 flex items-center self-start sm:self-center"
                  >
                    Walk this Station <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </button>
                </div>

                {station.titleMl && (
                  <p className="font-ml text-sm sm:text-base text-gold-700 font-medium">
                    {station.titleMl}
                  </p>
                )}

                {/* Plain text body preserving line breaks */}
                <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed font-ml bg-white/60 p-4 rounded-xl border border-cream-200">
                  {station.body || 'Admin: add the approved prayer text here'}
                </p>
              </div>

              {/* Station Image Thumbnail if uploaded */}
              {station.imageUrl && (
                <div className="w-full md:w-44 h-36 rounded-2xl overflow-hidden bg-cream-200 flex-shrink-0 border border-cream-300">
                  <img
                    src={station.imageUrl}
                    alt={station.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default KurisinteVazhi;
