import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  Upload,
  X,
} from 'lucide-react';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [removeExistingPoster, setRemoveExistingPoster] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { addToast } = useToast();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await api.get('/events');
      setEvents(res.data || []);
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to fetch events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const openAddModal = () => {
    setEditingEvent(null);
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('09:30 AM');
    setVenue('St. Francis Xavier Church, Neduvila');
    setDescription('');
    setPosterFile(null);
    setRemoveExistingPoster(false);
    setPreviewUrl(null);
    setIsFormOpen(true);
  };

  const openEditModal = (evt) => {
    setEditingEvent(evt);
    setTitle(evt.title || '');
    setDate(evt.date ? new Date(evt.date).toISOString().split('T')[0] : '');
    setTime(evt.time || '');
    setVenue(evt.venue || '');
    setDescription(evt.description || '');
    setPosterFile(null);
    setRemoveExistingPoster(false);
    setPreviewUrl(evt.posterImage?.url || null);
    setIsFormOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        addToast('Poster image must be smaller than 5 MB', 'error');
        return;
      }
      setPosterFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRemoveExistingPoster(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('date', date);
      formData.append('time', time);
      formData.append('venue', venue);
      formData.append('description', description);

      if (posterFile) {
        formData.append('poster', posterFile);
      }
      if (removeExistingPoster) {
        formData.append('removePoster', 'true');
      }

      if (editingEvent) {
        await api.put(`/admin/events/${editingEvent._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        addToast('Event updated successfully', 'success');
      } else {
        await api.post('/admin/events', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        addToast('Event created successfully', 'success');
      }

      setIsFormOpen(false);
      fetchEvents();
    } catch (err) {
      const msg = err.response?.data?.details?.join(', ') || err.response?.data?.error || 'Failed to save event';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!eventToDelete) return;
    setSubmitting(true);
    try {
      await api.delete(`/admin/events/${eventToDelete._id}`);
      addToast('Event deleted successfully', 'success');
      setDeleteModalOpen(false);
      setEventToDelete(null);
      fetchEvents();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to delete event', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter & Pagination
  const filteredEvents = events.filter((evt) => {
    const query = searchQuery.toLowerCase();
    return (
      evt.title?.toLowerCase().includes(query) ||
      evt.venue?.toLowerCase().includes(query) ||
      evt.description?.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage) || 1;
  const paginatedEvents = filteredEvents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Parish Events Management
          </h2>
          <p className="text-sm text-slate-500">
            Create, update, or remove liturgical events and feast day celebrations.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Event
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center bg-white rounded-2xl border border-cream-300 p-2 shadow-xs">
        <Search className="w-5 h-5 text-slate-400 ml-3 mr-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search events by title, venue, or description..."
          className="w-full bg-transparent text-sm text-slate-900 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-slate-400 hover:text-slate-600 mr-2 text-xs"
          >
            Clear
          </button>
        )}
      </div>

      {/* Events Table / Card View */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-cream-200">
          Loading events...
        </div>
      ) : paginatedEvents.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-cream-200">
          No events found matching your search.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-cream-200 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm divide-y divide-cream-200">
              <thead className="bg-cream-100 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Event Details</th>
                  <th className="py-3.5 px-4">Date & Time</th>
                  <th className="py-3.5 px-4">Venue</th>
                  <th className="py-3.5 px-4">Poster</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {paginatedEvents.map((evt) => (
                  <tr key={evt._id} className="hover:bg-cream-50/80 transition-colors">
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-semibold text-slate-900 truncate">{evt.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {evt.description}
                      </p>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <p className="font-medium text-slate-800">
                        {new Date(evt.date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="text-xs text-slate-500">{evt.time}</p>
                    </td>
                    <td className="py-4 px-4 max-w-[200px] truncate text-slate-600">
                      {evt.venue}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {evt.posterImage?.url ? (
                        <img
                          src={evt.posterImage.url}
                          alt="Poster thumbnail"
                          className="w-10 h-10 object-cover rounded-lg border border-cream-300"
                        />
                      ) : (
                        <span className="text-xs text-slate-400">None</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openEditModal(evt)}
                        className="p-1.5 text-slate-600 hover:text-gold-600 hover:bg-cream-200 rounded-lg transition-colors"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEventToDelete(evt);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-cream-200 flex items-center justify-between text-xs text-slate-600">
              <span>
                Page {currentPage} of {totalPages} ({filteredEvents.length} total events)
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg border border-cream-300 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg border border-cream-300 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add / Edit Event Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-cream-50 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-cream-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <h3 className="font-heading font-bold text-xl text-slate-900">
                {editingEvent ? 'Edit Event' : 'Create New Event'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Event Title (English or Malayalam) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Parish Feast of St. Francis Xavier / തിരുനാൾ മഹോത്സവം"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                    Time *
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 09:30 AM"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Venue / Location *
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="e.g. Main Church Altar / Parish Hall, Neduvila"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Description / Liturgy Details *
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed schedule, celebrants, novena timings, or meal arrangements..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>

              {/* Poster Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Poster Image (Optional - JPG, PNG, WebP up to 5MB)
                </label>

                {previewUrl ? (
                  <div className="flex items-center space-x-4 p-3 bg-white rounded-xl border border-cream-300">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 text-xs text-slate-600">
                      <p className="font-semibold">Selected Poster</p>
                      <button
                        type="button"
                        onClick={() => {
                          setPosterFile(null);
                          setPreviewUrl(null);
                          setRemoveExistingPoster(true);
                        }}
                        className="text-rose-600 hover:text-rose-700 underline mt-1"
                      >
                        Remove Poster
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-cream-300 rounded-xl p-4 text-center bg-white">
                    <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                    <label className="cursor-pointer text-xs font-medium text-gold-600 hover:text-gold-700">
                      <span>Click to upload image</span>
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

              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-cream-200 text-slate-700 text-sm font-medium hover:bg-cream-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-sm font-medium shadow-sm disabled:opacity-60 flex items-center"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : null}
                  {editingEvent ? 'Save Changes' : 'Publish Event'}
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
        title="Delete Event"
        message={`Are you sure you want to delete "${eventToDelete?.title}"? This will permanently remove the event and delete its poster from Cloudinary.`}
        confirmText="Confirm Delete"
        danger={true}
        loading={submitting}
      />
    </div>
  );
};

export default AdminEvents;

