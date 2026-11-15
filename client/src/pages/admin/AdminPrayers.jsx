import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Sparkles,
  Compass,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Clock,
  Save,
  CheckCircle,
} from 'lucide-react';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';

const AdminPrayers = () => {
  const [activeTab, setActiveTab] = useState('japamala'); // 'japamala' | 'kurisinte-vazhi'
  const [prayers, setPrayers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Timing states
  const [timingText, setTimingText] = useState('');
  const [savingTiming, setSavingTiming] = useState(false);

  // Form states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [title, setTitle] = useState('');
  const [titleMl, setTitleMl] = useState('');
  const [body, setBody] = useState('');
  const [order, setOrder] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Delete modal states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { addToast } = useToast();

  const fetchPrayers = async () => {
    setLoading(true);
    try {
      const [prayersRes, timingRes] = await Promise.all([
        api.get(`/prayers?type=${activeTab}`),
        api.get(`/timings?type=${activeTab}`),
      ]);
      setPrayers(prayersRes.data || []);
      setTimingText(timingRes.data?.text || '');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to fetch prayer data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, [activeTab]);

  const handleTimingSubmit = async (e) => {
    e.preventDefault();
    setSavingTiming(true);
    try {
      await api.put(`/admin/timings/${activeTab}`, {
        type: activeTab,
        text: timingText,
      });
      addToast('Parish timing updated successfully', 'success');
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update timing', 'error');
    } finally {
      setSavingTiming(false);
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setTitleMl('');
    setBody('Admin: add the approved prayer text here');
    setOrder(prayers.length + 1);
    setImageFile(null);
    setImagePreview(null);
    setRemoveExistingImage(false);
    setIsFormOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setTitle(item.title || '');
    setTitleMl(item.titleMl || '');
    setBody(item.body || '');
    setOrder(item.order !== undefined ? item.order : 0);
    setImageFile(null);
    setImagePreview(item.imageUrl || null);
    setRemoveExistingImage(false);
    setIsFormOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('Image must be smaller than 5 MB', 'error');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setRemoveExistingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('type', activeTab);
      formData.append('title', title);
      formData.append('titleMl', titleMl);
      formData.append('body', body);
      formData.append('order', String(order));

      if (imageFile) {
        formData.append('image', imageFile);
      }
      if (removeExistingImage) {
        formData.append('removeImage', 'true');
      }

      if (editingItem) {
        await api.put(`/admin/prayers/${editingItem._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        addToast('Prayer record updated successfully', 'success');
      } else {
        await api.post('/admin/prayers', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        addToast('Prayer record added successfully', 'success');
      }

      setIsFormOpen(false);
      fetchPrayers();
    } catch (err) {
      const msg = err.response?.data?.details?.join(', ') || err.response?.data?.error || 'Failed to save prayer record';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setSubmitting(true);
    try {
      await api.delete(`/admin/prayers/${itemToDelete._id}`);
      addToast('Prayer record deleted successfully', 'success');
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchPrayers();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to delete prayer record', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Liturgical Prayers & Devotions
          </h2>
          <p className="text-sm text-slate-500">
            Manage prayer texts, mysteries, 14 Stations of the Cross, and parish timings.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="btn-gold px-5 py-2.5 text-sm font-semibold flex items-center justify-center self-start sm:self-center"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Prayer / Station
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/70 p-1.5 rounded-2xl border border-cream-300 w-fit">
        <button
          onClick={() => setActiveTab('japamala')}
          className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center ${
            activeTab === 'japamala'
              ? 'bg-gold-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          Japamala (ജപമാല)
        </button>
        <button
          onClick={() => setActiveTab('kurisinte-vazhi')}
          className={`px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center ${
            activeTab === 'kurisinte-vazhi'
              ? 'bg-gold-500 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Compass className="w-4 h-4 mr-1.5" />
          Kurisinte Vazhi (കുരിശിന്റെ വഴി)
        </button>
      </div>

      {/* Timing Editor Card */}
      <div className="glass-card p-6 border border-cream-300 space-y-4">
        <div className="flex items-center space-x-2 text-slate-800">
          <Clock className="w-4 h-4 text-gold-600" />
          <h3 className="font-heading font-semibold text-sm sm:text-base">
            Parish Schedule for {activeTab === 'japamala' ? 'Japamala' : 'Kurisinte Vazhi'}
          </h3>
        </div>
        <form onSubmit={handleTimingSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={timingText}
            onChange={(e) => setTimingText(e.target.value)}
            placeholder="e.g. Daily at 06:00 PM / Every Friday in Great Lent at 04:30 PM..."
            required
            className="flex-1 px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-ml"
          />
          <button
            type="submit"
            disabled={savingTiming}
            className="btn-gold px-5 py-2.5 text-xs sm:text-sm font-semibold flex items-center justify-center disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-1.5" />
            Save Schedule
          </button>
        </form>
      </div>

      {/* Prayer List */}
      <div className="glass-card p-6 border border-cream-300 space-y-4">
        <h3 className="font-heading font-semibold text-base text-slate-900">
          Registered Prayers & Stations ({prayers.length})
        </h3>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Loading prayers...</div>
        ) : prayers.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            No entries found. Click "Add Prayer / Station" above to create one.
          </div>
        ) : (
          <div className="divide-y divide-cream-200">
            {prayers.map((item) => (
              <div
                key={item._id}
                className="py-4 flex flex-col sm:flex-row items-start justify-between gap-4"
              >
                <div className="flex items-start space-x-3 max-w-2xl">
                  <span className="w-7 h-7 rounded-xl bg-gold-100 text-gold-700 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {item.order}
                  </span>
                  <div>
                    <h4 className="font-heading font-semibold text-slate-900 text-sm sm:text-base">
                      {item.title}
                    </h4>
                    {item.titleMl && (
                      <p className="font-ml text-xs text-gold-700 font-medium">{item.titleMl}</p>
                    )}
                    <p className="text-xs text-slate-600 font-ml line-clamp-2 mt-1 whitespace-pre-line">
                      {item.body}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-center">
                  {item.imageUrl && (
                    <img
                      src={item.imageUrl}
                      alt="Thumbnail"
                      className="w-10 h-10 object-cover rounded-lg border border-cream-300"
                    />
                  )}
                  <button
                    onClick={() => openEditModal(item)}
                    className="p-2 text-slate-600 hover:text-gold-600 hover:bg-cream-200 rounded-lg transition-colors"
                    title="Edit Record"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setItemToDelete(item);
                      setDeleteModalOpen(true);
                    }}
                    className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-fadeIn">
          <div className="glass-panel bg-white/95 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-cream-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                {editingItem ? 'Edit Liturgical Entry' : 'Add New Entry'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Title (English) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Station 1: Jesus is condemned to death"
                  required
                  className="w-full px-4 py-2 rounded-xl border border-cream-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Title (Malayalam)
                </label>
                <input
                  type="text"
                  value={titleMl}
                  onChange={(e) => setTitleMl(e.target.value)}
                  placeholder="e.g. ഒന്നാം സ്ഥലം: ഈശോമിശിഹാ മരണത്തിന് വിധിക്കപ്പെടുന്നു"
                  className="w-full px-4 py-2 rounded-xl border border-cream-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-ml"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Order Index (Number) *
                </label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  required
                  className="w-full px-4 py-2 rounded-xl border border-cream-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Prayer / Meditation Text (Rendered Plain Text with Line Breaks) *
                </label>
                <textarea
                  rows={5}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Admin: add the approved prayer text here..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-gold-500 font-ml whitespace-pre-line"
                />
              </div>

              {/* Station Image */}
              {activeTab === 'kurisinte-vazhi' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Station Image (Optional - JPG/PNG/WebP, max 5MB)
                  </label>
                  {imagePreview ? (
                    <div className="flex items-center space-x-3 p-3 bg-cream-50 rounded-xl border border-cream-200">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                          setRemoveExistingImage(true);
                        }}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="border border-dashed border-cream-300 rounded-xl p-3 text-center bg-white">
                      <label className="cursor-pointer text-xs font-semibold text-gold-600 hover:text-gold-700">
                        <span>Click to choose image</span>
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3 pt-3 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-cream-200 text-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold px-5 py-2 text-xs font-semibold flex items-center"
                >
                  {submitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Prayer / Station"
        message={`Are you sure you want to delete "${itemToDelete?.title}"?`}
        confirmText="Confirm Delete"
        danger={true}
        loading={submitting}
      />
    </div>
  );
};

export default AdminPrayers;
