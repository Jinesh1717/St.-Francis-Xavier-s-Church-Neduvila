import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { CardSkeleton, EmptyState } from '../components/Skeleton';

const Events = () => {
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/events?type=${activeTab}`);
        setEvents(res.data || []);
      } catch (err) {
        console.error('Error fetching events:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [activeTab]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900">
          Church Events & Liturgies
        </h1>
        <p className="font-ml text-gold-700 font-semibold text-lg">
          ദൈവാലയ തിരുനാളുകളും പരിപാടികളും
        </p>
        <p className="text-sm sm:text-base text-slate-600">
          Stay connected with our liturgical celebrations, feast days, parish conventions, and prayer gatherings.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex bg-cream-200/80 p-1.5 rounded-2xl border border-cream-300">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'upcoming'
                ? 'bg-white text-slate-900 shadow-sm border border-cream-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upcoming Events (വരാനിരിക്കുന്നവ)
          </button>
          <button
            onClick={() => setActiveTab('past')}
            className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              activeTab === 'past'
                ? 'bg-white text-slate-900 shadow-sm border border-cream-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Past Events (കഴിഞ്ഞവ)
          </button>
        </div>
      </div>

      {/* Events List */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : events.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title={activeTab === 'upcoming' ? 'No Upcoming Events' : 'No Past Events Recorded'}
          message={
            activeTab === 'upcoming'
              ? 'There are currently no upcoming events scheduled on the calendar. Please check back soon or visit our Notices page.'
              : 'There are no past events currently in the archives.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((evt) => (
            <article
              key={evt._id}
              className="bg-cream-50 rounded-2xl border border-cream-200 overflow-hidden shadow-soft hover:shadow-soft-lg transition-all flex flex-col group"
            >
              {evt.posterImage?.url ? (
                <div className="h-52 overflow-hidden bg-cream-200 relative">
                  <img
                    src={evt.posterImage.url}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 text-xs font-semibold text-slate-900 shadow-xs">
                    {new Date(evt.date).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              ) : (
                <div className="h-32 bg-skyblue-100 flex items-center justify-between px-6 border-b border-skyblue-200">
                  <Calendar className="w-8 h-8 text-skyblue-600" />
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/95 text-slate-800 shadow-xs">
                    {new Date(evt.date).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-heading font-semibold text-xl text-slate-900 mb-3 leading-snug">
                    {evt.title}
                  </h2>

                  <div className="space-y-2 text-xs sm:text-sm text-slate-600 mb-4 bg-cream-100 p-3.5 rounded-xl border border-cream-200">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2.5 text-gold-600 flex-shrink-0" />
                      <span className="font-medium text-slate-900">{formatDate(evt.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2.5 text-gold-600 flex-shrink-0" />
                      <span>{evt.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2.5 text-gold-600 flex-shrink-0" />
                      <span>{evt.venue}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {evt.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-cream-200/80 flex items-center justify-between text-xs text-slate-400">
                  <span>Archdiocese Calendar</span>
                  <span className="capitalize">{activeTab} Event</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;

