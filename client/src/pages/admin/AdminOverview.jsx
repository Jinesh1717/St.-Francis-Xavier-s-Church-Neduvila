import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { Calendar, Clock, Image as ImageIcon, Bell, ArrowRight, PlusCircle } from 'lucide-react';

const AdminOverview = () => {
  const [metrics, setMetrics] = useState({
    totalEvents: 0,
    upcomingEvents: 0,
    totalPhotos: 0,
    activeNotices: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await api.get('/admin/overview');
        setMetrics(res.data);
      } catch (err) {
        console.error('Error fetching overview metrics:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  const metricCards = [
    {
      title: 'Total Events',
      value: metrics.totalEvents,
      subtitle: `${metrics.upcomingEvents} upcoming on calendar`,
      icon: Calendar,
      color: 'bg-skyblue-100 text-skyblue-700',
      link: '/admin/events',
    },
    {
      title: 'Upcoming Events',
      value: metrics.upcomingEvents,
      subtitle: 'Requiring parish preparation',
      icon: Clock,
      color: 'bg-gold-100 text-gold-700',
      link: '/admin/events',
    },
    {
      title: 'Gallery Photos',
      value: metrics.totalPhotos,
      subtitle: 'Photos stored in Cloudinary',
      icon: ImageIcon,
      color: 'bg-purple-100 text-purple-700',
      link: '/admin/gallery',
    },
    {
      title: 'Active Notices',
      value: metrics.activeNotices,
      subtitle: 'Visible to parishioners',
      icon: Bell,
      color: 'bg-emerald-100 text-emerald-700',
      link: '/admin/notices',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-skyblue-100/80 via-cream-100 to-cream-50 p-6 sm:p-8 rounded-3xl border border-skyblue-200/60 shadow-soft">
        <h2 className="text-2xl font-heading font-bold text-slate-900">
          Welcome to Parish Management System
        </h2>
        <p className="text-sm text-slate-600 mt-1">
          Manage upcoming events, liturgical celebrations, community notices, and photos for St. Francis Xavier's Church, Neduvila.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link
              key={i}
              to={card.link}
              className="bg-cream-50 rounded-2xl p-6 border border-cream-200 shadow-soft hover:shadow-soft-lg transition-all group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-700">{card.title}</span>
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-heading font-bold text-slate-900">
                  {loading ? '—' : card.value}
                </p>
                <p className="text-xs text-slate-500 mt-1">{card.subtitle}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-cream-200 flex items-center text-xs font-semibold text-gold-600 group-hover:text-gold-700">
                <span>Manage {card.title}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="glass-card p-6 border border-cream-200 space-y-4">
        <h3 className="font-heading font-semibold text-lg text-slate-900">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/events"
            className="p-4 rounded-2xl bg-white/70 border border-cream-200 hover:border-gold-300 hover:shadow-xs transition-all flex items-center space-x-3 text-slate-800"
          >
            <PlusCircle className="w-5 h-5 text-gold-600 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold">Publish Event</p>
              <p className="text-xs text-slate-500">Liturgies & feasts</p>
            </div>
          </Link>

          <Link
            to="/admin/prayers"
            className="p-4 rounded-2xl bg-white/70 border border-cream-200 hover:border-gold-300 hover:shadow-xs transition-all flex items-center space-x-3 text-slate-800"
          >
            <PlusCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold">Prayers & Stations</p>
              <p className="text-xs text-slate-500">Rosary & Way of Cross</p>
            </div>
          </Link>

          <Link
            to="/admin/gallery"
            className="p-4 rounded-2xl bg-white/70 border border-cream-200 hover:border-gold-300 hover:shadow-xs transition-all flex items-center space-x-3 text-slate-800"
          >
            <PlusCircle className="w-5 h-5 text-skyblue-600 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold">Upload Photos</p>
              <p className="text-xs text-slate-500">Parish gallery</p>
            </div>
          </Link>

          <Link
            to="/admin/notices"
            className="p-4 rounded-2xl bg-white/70 border border-cream-200 hover:border-gold-300 hover:shadow-xs transition-all flex items-center space-x-3 text-slate-800"
          >
            <PlusCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-semibold">Post Notice</p>
              <p className="text-xs text-slate-500">Announcements</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

