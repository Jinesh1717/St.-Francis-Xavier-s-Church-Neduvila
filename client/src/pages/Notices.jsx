import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Bell, Pin, Calendar, AlertCircle } from 'lucide-react';
import { NoticeSkeleton, EmptyState } from '../components/Skeleton';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await api.get('/notices');
        setNotices(res.data || []);
      } catch (err) {
        console.error('Error fetching notices:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900">
          Parish Announcements & Notices
        </h1>
        <p className="font-ml text-gold-700 font-semibold text-lg">
          ഇടവക അറിയിപ്പുകൾ
        </p>
        <p className="text-sm sm:text-base text-slate-600">
          Official notices, sacrament schedules, ward prayer meetings, and catechism circulars for all parishioners.
        </p>
      </div>

      {/* Notices List */}
      {loading ? (
        <NoticeSkeleton count={5} />
      ) : notices.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="No Active Notices"
          message="There are currently no active parish notices published. Please check back later."
        />
      ) : (
        <div className="space-y-5">
          {notices.map((notice) => (
            <article
              key={notice._id}
              className={`rounded-2xl p-6 sm:p-7 border transition-all ${
                notice.isPinned
                  ? 'bg-gradient-to-r from-gold-50/60 to-cream-50 border-l-4 border-l-gold-500 border-gold-200 shadow-soft'
                  : 'bg-cream-50 border-cream-200/90 shadow-soft'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex items-center space-x-2">
                  {notice.isPinned && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gold-500 text-white shadow-2xs">
                      <Pin className="w-3 h-3 mr-1 fill-current" />
                      Pinned Announcement
                    </span>
                  )}
                  <span className="text-xs text-slate-500 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    Published: {formatDate(notice.createdAt)}
                  </span>
                </div>

                {notice.expiryDate && (
                  <span className="text-xs text-slate-500 italic bg-cream-200/60 px-2.5 py-1 rounded-full w-fit">
                    Active till: {formatDate(notice.expiryDate)}
                  </span>
                )}
              </div>

              <h2 className="font-heading font-semibold text-lg sm:text-xl text-slate-900 mb-3">
                {notice.title}
              </h2>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                {notice.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notices;

