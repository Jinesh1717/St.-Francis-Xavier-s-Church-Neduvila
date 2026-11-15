import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { Settings, Clock, Plus, Trash2, Save } from 'lucide-react';
import { useToast } from '../../components/Toast';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [churchName, setChurchName] = useState('');
  const [churchNameMalayalam, setChurchNameMalayalam] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [historyText, setHistoryText] = useState('');
  const [historyTextMalayalam, setHistoryTextMalayalam] = useState('');
  const [mapEmbedUrl, setMapEmbedUrl] = useState('');
  const [massTimings, setMassTimings] = useState([]);

  const { addToast } = useToast();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/settings');
        const data = res.data || {};
        setSettings(data);
        setChurchName(data.churchName || "St. Francis Xavier's Church, Neduvila");
        setChurchNameMalayalam(data.churchNameMalayalam || "വിശുദ്ധ ഫ്രാൻസിസ് സേവ്യർ ദൈവാലയം, നെടുവില");
        setAddress(data.address || '');
        setPhone(data.phone || '');
        setEmail(data.email || '');
        setHistoryText(data.historyText || '');
        setHistoryTextMalayalam(data.historyTextMalayalam || '');
        setMapEmbedUrl(data.mapEmbedUrl || '');
        setMassTimings(data.massTimings || []);
      } catch (err) {
        addToast(err.response?.data?.error || 'Failed to load settings', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleAddTiming = () => {
    setMassTimings([...massTimings, { day: 'Sunday', time: '07:00 AM', description: 'Holy Mass' }]);
  };

  const handleTimingChange = (index, field, value) => {
    const updated = [...massTimings];
    updated[index][field] = value;
    setMassTimings(updated);
  };

  const handleRemoveTiming = (index) => {
    setMassTimings(massTimings.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.put('/admin/settings', {
        churchName,
        churchNameMalayalam,
        address,
        phone,
        email,
        historyText,
        historyTextMalayalam,
        mapEmbedUrl,
        massTimings,
      });
      addToast('Church settings & Mass timings saved successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to save settings', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-cream-200">
        Loading church settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-heading font-bold text-slate-900">
          Church Info & Mass Timings
        </h2>
        <p className="text-sm text-slate-500">
          Update parish contact numbers, mass schedule, history narrative, and map coordinates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-4">
          <h3 className="font-heading font-semibold text-lg text-slate-900">
            Parish Identification
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Church Name (English)
              </label>
              <input
                type="text"
                value={churchName}
                onChange={(e) => setChurchName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Church Name (Malayalam)
              </label>
              <input
                type="text"
                value={churchNameMalayalam}
                onChange={(e) => setChurchNameMalayalam(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none font-ml"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Phone Numbers
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 94470 12345"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Parish Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parish@stfrancisneduvila.org"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Postal Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Mass Timings Editor */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-semibold text-lg text-slate-900 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-gold-600" />
                Regular Mass Timings Schedule
              </h3>
              <p className="text-xs text-slate-500">
                These timings are displayed on the public Mass Timings table and page footer.
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddTiming}
              className="px-3 py-1.5 rounded-xl bg-cream-200 hover:bg-cream-300 text-slate-800 text-xs font-semibold flex items-center"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Row
            </button>
          </div>

          <div className="space-y-3">
            {massTimings.map((timing, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-cream-50 rounded-2xl border border-cream-200"
              >
                <input
                  type="text"
                  value={timing.day}
                  onChange={(e) => handleTimingChange(idx, 'day', e.target.value)}
                  placeholder="Day (e.g. Sunday)"
                  className="w-full sm:w-1/3 px-3 py-2 rounded-xl border border-cream-300 bg-white text-xs font-medium text-slate-900"
                  required
                />
                <input
                  type="text"
                  value={timing.time}
                  onChange={(e) => handleTimingChange(idx, 'time', e.target.value)}
                  placeholder="Time (e.g. 06:30 AM & 09:30 AM)"
                  className="w-full sm:w-1/3 px-3 py-2 rounded-xl border border-cream-300 bg-white text-xs font-medium text-gold-700"
                  required
                />
                <input
                  type="text"
                  value={timing.description || ''}
                  onChange={(e) => handleTimingChange(idx, 'description', e.target.value)}
                  placeholder="Notes (e.g. Solemn High Mass)"
                  className="w-full sm:w-1/3 px-3 py-2 rounded-xl border border-cream-300 bg-white text-xs text-slate-700"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveTiming(idx)}
                  className="p-2 text-slate-400 hover:text-rose-600 self-end sm:self-center"
                  title="Remove timing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* History Text */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-soft space-y-4">
          <h3 className="font-heading font-semibold text-lg text-slate-900">
            Parish History & Narrative
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Malayalam History Text
            </label>
            <textarea
              rows={3}
              value={historyTextMalayalam}
              onChange={(e) => setHistoryTextMalayalam(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none font-ml"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              English History Text
            </label>
            <textarea
              rows={4}
              value={historyText}
              onChange={(e) => setHistoryText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Google Maps Embed URL
            </label>
            <input
              type="text"
              value={mapEmbedUrl}
              onChange={(e) => setMapEmbedUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-cream-50 text-slate-900 text-xs focus:ring-2 focus:ring-gold-500 focus:outline-none font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-3 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm shadow-md transition-all flex items-center"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;

