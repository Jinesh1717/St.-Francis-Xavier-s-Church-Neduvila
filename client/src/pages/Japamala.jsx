import React, { useState, useEffect, useMemo } from 'react';
import api from '../api/client';
import {
  Sparkles,
  Clock,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle,
  BookOpen,
  Info,
} from 'lucide-react';

const MYSTERIES = [
  {
    id: 'joyful',
    name: 'Joyful Mysteries',
    nameMl: 'സന്തോഷകരമായ രഹസ്യങ്ങൾ',
    days: 'Mondays & Saturdays',
    dayIndexes: [1, 6], // 1 = Monday, 6 = Saturday
    items: [
      { num: 1, title: 'The Annunciation to Mary', titleMl: 'ദൈവദൂതൻ മറിയത്തെ അറിയിക്കുന്നു', meditation: 'The Angel Gabriel announces the incarnation of our Lord to the Virgin Mary.' },
      { num: 2, title: 'The Visitation to Elizabeth', titleMl: 'പരിശുദ്ധ മറിയം എലീസബത്തിനെ സന്ദർശിക്കുന്നു', meditation: 'Mary visits her cousin Elizabeth who is carrying John the Baptist.' },
      { num: 3, title: 'The Nativity of our Lord', titleMl: 'ഉണ്ണീശോയുടെ തിരുപ്പിറവി', meditation: 'Jesus is born in poverty in the manger of Bethlehem.' },
      { num: 4, title: 'The Presentation in the Temple', titleMl: 'ഉണ്ണീശോയെ ദൈവാലയത്തിൽ കാഴ്ചവയ്ക്കുന്നു', meditation: 'Mary and Joseph present the child Jesus to God in Jerusalem.' },
      { num: 5, title: 'The Finding in the Temple', titleMl: 'ദേവാലയത്തിൽ ഈശോയെ കണ്ടെത്തുന്നു', meditation: 'The boy Jesus is found in the temple listening to the teachers.' },
    ],
  },
  {
    id: 'luminous',
    name: 'Luminous Mysteries',
    nameMl: 'പ്രകാശത്തിന്റെ രഹസ്യങ്ങൾ',
    days: 'Thursdays',
    dayIndexes: [4], // 4 = Thursday
    items: [
      { num: 1, title: 'The Baptism in the Jordan', titleMl: 'യോർദ്ദാനിലെ മാമോദീസ', meditation: 'Jesus is baptized by John and the Father proclaims Him as His beloved Son.' },
      { num: 2, title: 'The Wedding at Cana', titleMl: 'കാനായിലെ അത്ഭുതം', meditation: 'At Mary’s intercession, Jesus changes water into wine.' },
      { num: 3, title: 'The Proclamation of the Kingdom', titleMl: 'ദൈവരാജ്യ പ്രഘോഷണം', meditation: 'Jesus preaches the Good News and calls all to repentance.' },
      { num: 4, title: 'The Transfiguration', titleMl: 'താബോറിലെ രൂപാന്തരീകരണം', meditation: 'Jesus reveals His glory on Mount Tabor to Peter, James, and John.' },
      { num: 5, title: 'The Institution of the Eucharist', titleMl: 'വിശുദ്ധ കുർബാന സ്ഥാപനം', meditation: 'At the Last Supper, Jesus gives His Body and Blood for our salvation.' },
    ],
  },
  {
    id: 'sorrowful',
    name: 'Sorrowful Mysteries',
    nameMl: 'ദുഃഖകരമായ രഹസ്യങ്ങൾ',
    days: 'Tuesdays & Fridays',
    dayIndexes: [2, 5], // 2 = Tuesday, 5 = Friday
    items: [
      { num: 1, title: 'The Agony in the Garden', titleMl: 'ഗെത്ശെമനിയിലെ പ്രാർത്ഥന', meditation: 'Jesus sweats blood in the Garden of Gethsemane.' },
      { num: 2, title: 'The Scourging at the Pillar', titleMl: 'ഈശോയുടെ ചമ്മട്ടിയടി', meditation: 'Jesus is cruelly bound and scourged by soldiers.' },
      { num: 3, title: 'The Crowning with Thorns', titleMl: 'മുള്ളുമുടി ധരിപ്പിക്കൽ', meditation: 'Soldiers mock Jesus with a crown of sharp thorns.' },
      { num: 4, title: 'The Carrying of the Cross', titleMl: 'കുരിശുമരണ യാത്ര', meditation: 'Jesus carries His heavy cross to Mount Calvary.' },
      { num: 5, title: 'The Crucifixion and Death', titleMl: 'കുരിശുമരണവും ജീവത്യാഗവും', meditation: 'Jesus offers His life on the Cross for the salvation of the world.' },
    ],
  },
  {
    id: 'glorious',
    name: 'Glorious Mysteries',
    nameMl: 'മഹിമയുടെ രഹസ്യങ്ങൾ',
    days: 'Wednesdays & Sundays',
    dayIndexes: [3, 0], // 3 = Wednesday, 0 = Sunday
    items: [
      { num: 1, title: 'The Resurrection', titleMl: 'ഈശോയുടെ ഉത്ഥാനം', meditation: 'Jesus rises triumphantly from the dead on Easter Sunday.' },
      { num: 2, title: 'The Ascension into Heaven', titleMl: 'സ്വർഗ്ഗാരോഹണം', meditation: 'Jesus ascends into Heaven in the presence of His disciples.' },
      { num: 3, title: 'The Descent of the Holy Spirit', titleMl: 'പരിശുദ്ധാത്മാവിന്റെ ആഗമനം', meditation: 'The Holy Spirit descends upon Mary and the Apostles on Pentecost.' },
      { num: 4, title: 'The Assumption of Mary', titleMl: 'മാതാവിന്റെ സ്വർഗ്ഗാരോപണം', meditation: 'Mary is assumed body and soul into heavenly glory.' },
      { num: 5, title: 'The Coronation of Mary', titleMl: 'സ്വർഗ്ഗരാജ്ഞിയായുള്ള മകുടധാരണം', meditation: 'Mary is crowned Queen of Heaven and Earth.' },
    ],
  },
];

const Japamala = () => {
  const currentDayIndex = new Date().getDay();

  // Find mystery recommended for today
  const todaysMysteryId = useMemo(() => {
    const found = MYSTERIES.find((m) => m.dayIndexes.includes(currentDayIndex));
    return found ? found.id : 'joyful';
  }, [currentDayIndex]);

  const [activeTab, setActiveTab] = useState(todaysMysteryId);
  const [prayers, setPrayers] = useState([]);
  const [timing, setTiming] = useState(null);
  const [loading, setLoading] = useState(true);

  // "Pray Along" Mode State
  const [prayAlongActive, setPrayAlongActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prayersRes, timingsRes] = await Promise.all([
          api.get('/prayers?type=japamala'),
          api.get('/timings?type=japamala'),
        ]);
        setPrayers(prayersRes.data || []);
        setTiming(timingsRes.data || null);
      } catch (err) {
        console.error('Error fetching Japamala data:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const activeMystery = useMemo(() => {
    return MYSTERIES.find((m) => m.id === activeTab) || MYSTERIES[0];
  }, [activeTab]);

  // Construct steps for Pray Along mode
  const prayAlongSteps = useMemo(() => {
    const steps = [
      {
        id: 'sign-of-cross',
        title: 'Sign of the Cross (കുരിശടയാളം)',
        decade: 0,
        bead: 0,
        desc: 'In the name of the Father, and of the Son, and of the Holy Spirit. Amen.',
      },
      {
        id: 'creed',
        title: "Apostles' Creed (വിശ്വാസപ്രമാണം)",
        decade: 0,
        bead: 0,
        desc: "I believe in God, the Father Almighty, Creator of Heaven and earth...",
      },
      {
        id: 'our-father-intro',
        title: 'Our Father (സ്വർഗ്ഗസ്ഥനായ ഞങ്ങളുടെ പിതാവേ)',
        decade: 0,
        bead: 0,
        desc: 'For the intentions of the Holy Father.',
      },
      {
        id: 'hail-mary-faith',
        title: 'Hail Mary (നന്മനിറഞ്ഞ മറിയമേ) — For Faith (വിശ്വാസം)',
        decade: 0,
        bead: 1,
        desc: 'Hail Mary, full of grace, the Lord is with thee...',
      },
      {
        id: 'hail-mary-hope',
        title: 'Hail Mary (നന്മനിറഞ്ഞ മറിയമേ) — For Hope (ശരണം)',
        decade: 0,
        bead: 2,
        desc: 'Hail Mary, full of grace, the Lord is with thee...',
      },
      {
        id: 'hail-mary-charity',
        title: 'Hail Mary (നന്മനിറഞ്ഞ മറിയമേ) — For Charity (സ്നേഹം)',
        decade: 0,
        bead: 3,
        desc: 'Hail Mary, full of grace, the Lord is with thee...',
      },
      {
        id: 'glory-be-intro',
        title: 'Glory Be (ത്രീത്വസ്തുതി)',
        decade: 0,
        bead: 0,
        desc: 'Glory be to the Father, and to the Son, and to the Holy Spirit...',
      },
    ];

    // Decades 1 to 5
    activeMystery.items.forEach((mystery, dIdx) => {
      const decadeNum = dIdx + 1;
      // Mystery Announcement
      steps.push({
        id: `mystery-${decadeNum}`,
        title: `Decade ${decadeNum}: ${mystery.title}`,
        titleMl: `${mystery.titleMl}`,
        decade: decadeNum,
        bead: 0,
        desc: mystery.meditation,
        isMysteryAnnouncement: true,
      });

      // Our Father
      steps.push({
        id: `our-father-${decadeNum}`,
        title: `Decade ${decadeNum} — Our Father (സ്വർഗ്ഗസ്ഥനായ ഞങ്ങളുടെ പിതാവേ)`,
        decade: decadeNum,
        bead: 0,
        desc: 'Our Father, who art in heaven, hallowed be Thy name...',
      });

      // 10 Hail Marys
      for (let b = 1; b <= 10; b++) {
        steps.push({
          id: `d${decadeNum}-bead-${b}`,
          title: `Decade ${decadeNum} — Hail Mary ${b} of 10`,
          titleMl: `നന്മനിറഞ്ഞ മറിയമേ (${b}/10)`,
          decade: decadeNum,
          bead: b,
          desc: `Reflect on: ${mystery.title} (${mystery.titleMl})`,
        });
      }

      // Glory Be & Fatima Prayer
      steps.push({
        id: `fatima-${decadeNum}`,
        title: `Decade ${decadeNum} — Glory Be & Fatima Prayer (ഓ എന്റെ ഈശോയെ)`,
        decade: decadeNum,
        bead: 0,
        desc: 'O My Jesus, forgive us our sins, save us from the fires of hell, lead all souls to Heaven, especially those most in need of Thy mercy.',
      });
    });

    // Concluding Prayer
    steps.push({
      id: 'salve-regina',
      title: 'Hail Holy Queen / Salve Regina (എത്രയും ദയയുള്ള മാതാവേ)',
      decade: 5,
      bead: 0,
      desc: 'Hail, holy Queen, mother of mercy, our life, our sweetness, and our hope...',
    });

    return steps;
  }, [activeMystery]);

  const currentStep = prayAlongSteps[stepIndex] || prayAlongSteps[0];

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/70 border border-gold-300 shadow-xs text-xs font-semibold text-gold-700">
          <Sparkles className="w-4 h-4 text-gold-600" />
          <span>Marian Devotion • മാതൃഭക്തി</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif-church font-bold text-slate-900 tracking-tight">
          Japamala / വിശുദ്ധ ജപമാല
        </h1>
        <p className="font-ml text-gold-700 font-semibold text-lg sm:text-xl">
          പരിശുദ്ധ കന്യകാമറിയത്തോടൊപ്പമുള്ള പ്രാർത്ഥന
        </p>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          The Holy Rosary is a contemplative prayer guiding us through the mysteries of our salvation in Jesus Christ, through the maternal intercession of the Blessed Virgin Mary.
        </p>
      </div>

      {/* Parish Timings Banner */}
      <div className="glass-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-l-4 border-l-gold-500">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-full bg-gold-100 text-gold-600 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-slate-900 text-sm sm:text-base">
              Parish Rosary Schedule (ഇടവക ജപമാല സമയം)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-ml mt-0.5">
              {timing?.text || 'Daily parish community Rosary at 06:00 PM before evening prayers (പ്രതിദിന സമൂഹ ജപമാല).'}
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setPrayAlongActive(true);
            setStepIndex(0);
          }}
          className="btn-gold px-6 py-2.5 text-xs sm:text-sm whitespace-nowrap flex items-center shadow-md"
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          Start "Pray Along" Mode
        </button>
      </div>

      {/* Interactive Pray Along Mode Box */}
      {prayAlongActive && (
        <section className="glass-panel rounded-3xl p-6 sm:p-10 shadow-glass-lg border border-gold-300 animate-fadeIn">
          <div className="flex items-center justify-between pb-4 border-b border-cream-300">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Pray Along with the Rosary ({activeMystery.name})
              </h2>
            </div>
            <button
              onClick={() => setPrayAlongActive(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3 py-1.5 rounded-full bg-cream-200"
            >
              Close Counter
            </button>
          </div>

          <div className="py-8 text-center space-y-6 max-w-2xl mx-auto">
            {/* Decade badge */}
            <div className="flex items-center justify-center gap-2">
              {currentStep.decade > 0 ? (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-skyblue-100 text-skyblue-800 border border-skyblue-200">
                  Decade {currentStep.decade} of 5
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cream-200 text-slate-700">
                  Introductory Prayers
                </span>
              )}
              {currentStep.bead > 0 && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-700 border border-gold-200">
                  Hail Mary Bead {currentStep.bead} / 10
                </span>
              )}
            </div>

            {/* Current Prayer Card */}
            <div className="space-y-3">
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-slate-900">
                {currentStep.title}
              </h3>
              {currentStep.titleMl && (
                <p className="text-base sm:text-lg font-ml text-gold-700 font-semibold">
                  {currentStep.titleMl}
                </p>
              )}
              <div className="bg-white/80 p-6 rounded-2xl border border-cream-300/80 shadow-inner mt-4">
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal whitespace-pre-line">
                  {currentStep.desc}
                </p>
              </div>
            </div>

            {/* Bead visualization for decade */}
            {currentStep.decade > 0 && currentStep.bead > 0 && (
              <div className="flex items-center justify-center gap-2 pt-2">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`w-4 h-4 rounded-full transition-all duration-300 ${
                      idx + 1 === currentStep.bead
                        ? 'bg-gold-500 ring-4 ring-gold-200 scale-125'
                        : idx + 1 < currentStep.bead
                        ? 'bg-emerald-500'
                        : 'bg-cream-300'
                    }`}
                    title={`Bead ${idx + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Step Controls */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setStepIndex((prev) => Math.max(0, prev - 1))}
                disabled={stepIndex === 0}
                className="btn-glass px-5 py-2.5 text-xs sm:text-sm flex items-center disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous Prayer
              </button>
              <button
                onClick={() => setStepIndex(0)}
                className="p-2.5 rounded-full bg-cream-200 text-slate-600 hover:text-slate-900"
                title="Restart from beginning"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setStepIndex((prev) => Math.min(prayAlongSteps.length - 1, prev + 1))}
                disabled={stepIndex === prayAlongSteps.length - 1}
                className="btn-gold px-6 py-2.5 text-xs sm:text-sm flex items-center disabled:opacity-40"
              >
                Next Prayer
                <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Step {stepIndex + 1} of {prayAlongSteps.length}
            </p>
          </div>
        </section>
      )}

      {/* Four Mysteries Tabs */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-slate-900">
            The Mysteries of the Holy Rosary
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            രഹസ്യങ്ങളുടെ ധ്യാനം (Select a set of mysteries below. Today's mystery is highlighted.)
          </p>
        </div>

        {/* Tab Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {MYSTERIES.map((mystery) => {
            const isToday = mystery.id === todaysMysteryId;
            const isSelected = mystery.id === activeTab;

            return (
              <button
                key={mystery.id}
                onClick={() => setActiveTab(mystery.id)}
                className={`p-4 rounded-2xl text-left border transition-all relative ${
                  isSelected
                    ? 'glass-card border-gold-500 bg-white shadow-soft ring-1 ring-gold-400'
                    : 'bg-white/60 hover:bg-white border-cream-200 text-slate-700'
                }`}
              >
                {isToday && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-2xs font-bold uppercase tracking-wider bg-gold-500 text-white shadow-2xs">
                    Today
                  </span>
                )}
                <p className="text-xs font-semibold text-gold-700">{mystery.days}</p>
                <p className="font-heading font-bold text-base text-slate-900 mt-1">
                  {mystery.name}
                </p>
                <p className="font-ml text-xs text-slate-600 mt-0.5">
                  {mystery.nameMl}
                </p>
              </button>
            );
          })}
        </div>

        {/* Active Mystery Card List */}
        <div className="glass-card p-6 sm:p-8 space-y-6 border border-cream-300/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-cream-200">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gold-600">
                Traditional Schedule: {activeMystery.days}
              </span>
              <h3 className="text-2xl font-heading font-bold text-slate-900 mt-0.5">
                {activeMystery.name}
              </h3>
              <p className="font-ml text-gold-700 font-medium text-sm">
                {activeMystery.nameMl}
              </p>
            </div>
            <button
              onClick={() => {
                setPrayAlongActive(true);
                setStepIndex(0);
              }}
              className="btn-gold px-5 py-2 text-xs font-semibold self-start sm:self-center"
            >
              Pray this Mystery
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeMystery.items.map((item) => (
              <div
                key={item.num}
                className="bg-white/70 p-5 rounded-2xl border border-cream-200 hover:border-gold-300 transition-all space-y-1.5 shadow-2xs"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-gold-100 text-gold-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {item.num}
                  </span>
                  <h4 className="font-heading font-semibold text-slate-900 text-sm sm:text-base">
                    {item.title}
                  </h4>
                </div>
                <p className="font-ml text-xs text-gold-700 font-medium pl-8">
                  {item.titleMl}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 pl-8 leading-relaxed">
                  {item.meditation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide: How to Pray the Rosary */}
      <section className="glass-card p-6 sm:p-8 space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-skyblue-100 text-skyblue-700 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-bold text-slate-900">
              How to Pray the Rosary (ജപമാല ക്രമം)
            </h3>
            <p className="text-xs text-slate-500">
              The order of prayers traditionally offered in the Catholic Church
            </p>
          </div>
        </div>

        <ol className="space-y-4 text-sm text-slate-700">
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-cream-200 text-slate-800 font-bold text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              1
            </span>
            <div>
              <p className="font-semibold text-slate-900">The Sign of the Cross & Creed (കുരിശടയാളവും വിശ്വാസപ്രമാണവും)</p>
              <p className="text-xs text-slate-600 mt-0.5">Holding the crucifix, make the Sign of the Cross and recite the Apostles' Creed.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-cream-200 text-slate-800 font-bold text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              2
            </span>
            <div>
              <p className="font-semibold text-slate-900">Our Father & 3 Hail Marys (സ്വർഗ്ഗസ്ഥനായ പിതാവേ & 3 നന്മനിറഞ്ഞ മറിയമേ)</p>
              <p className="text-xs text-slate-600 mt-0.5">On the first large bead, pray the Our Father. On the next 3 small beads, pray Hail Mary for the virtues of Faith, Hope, and Charity, followed by Glory Be.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-cream-200 text-slate-800 font-bold text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              3
            </span>
            <div>
              <p className="font-semibold text-slate-900">The 5 Decades (അഞ്ച് രഹസ്യങ്ങൾ)</p>
              <p className="text-xs text-slate-600 mt-0.5">For each of the 5 decades: Announce the Mystery, pray 1 Our Father on the large bead, 10 Hail Marys on the small beads, and conclude with the Glory Be and Fatima Prayer.</p>
            </div>
          </li>
          <li className="flex items-start">
            <span className="w-6 h-6 rounded-full bg-cream-200 text-slate-800 font-bold text-xs flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
              4
            </span>
            <div>
              <p className="font-semibold text-slate-900">Concluding Prayers (സമാപന പ്രാർത്ഥനകൾ)</p>
              <p className="text-xs text-slate-600 mt-0.5">Recite Hail Holy Queen (എത്രയും ദയയുള്ള മാതാവേ) and end with the Sign of the Cross.</p>
            </div>
          </li>
        </ol>
      </section>

      {/* Admin Seeded/Custom Prayers Display (Rendered Plain Text with pre-line) */}
      {prayers.length > 0 && (
        <section className="glass-card p-6 sm:p-8 space-y-4">
          <div className="flex items-center space-x-2 text-slate-800">
            <Info className="w-5 h-5 text-gold-600" />
            <h3 className="font-heading font-semibold text-base">
              Parish Approved Liturgical Prayers (ഇടവക പ്രാർത്ഥനകൾ)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prayers.map((p) => (
              <div key={p._id} className="p-4 bg-white/70 rounded-2xl border border-cream-200 space-y-1.5">
                <p className="font-heading font-semibold text-sm text-slate-900">{p.title}</p>
                {p.titleMl && <p className="font-ml text-xs text-gold-700 font-medium">{p.titleMl}</p>}
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed font-ml">
                  {p.body}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Japamala;
