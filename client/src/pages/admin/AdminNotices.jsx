import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Bell,
  Pin,
  Plus,
  Edit2,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Calendar,
} from 'lucide-react';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';

const AdminNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Form modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  const { addToast } = useToast();

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/notices');
      setNotices(res.data || []);
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to fetch notices', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openAddModal = () => {
    setEditingNotice(null);
    setTitle('');
    setMessage('');
    setIsPinned(false);
    setExpiryDate('');
    setIsFormOpen(true);
  };

  const openEditModal = (notice) => {
    setEditingNotice(notice);
    setTitle(notice.title || '');
    setMessage(notice.message || '');
    setIsPinned(Boolean(notice.isPinned));
    setExpiryDate(notice.expiryDate ? new Date(notice.expiryDate).toISOString().split('T')[0] : '');
    setIsFormOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title,
        message,
        isPinned,
        expiryDate: expiryDate ? expiryDate : null,
      };

      if (editingNotice) {
        await api.put(`/admin/notices/${editingNotice._id}`, payload);
        addToast('Notice updated successfully', 'success');
      } else {
        await api.post('/admin/notices', payload);
        addToast('Notice published successfully', 'success');
      }

      setIsFormOpen(false);
      fetchNotices();
    } catch (err) {
      const msg = err.response?.data?.details?.join(', ') || err.response?.data?.error || 'Failed to save notice';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!noticeToDelete) return;
    setSubmitting(true);
    try {
      await api.delete(`/admin/notices/${noticeToDelete._id}`);
      addToast('Notice deleted successfully', 'success');
      setDeleteModalOpen(false);
      setNoticeToDelete(null);
      fetchNotices();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to delete notice', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter & Pagination
  const filteredNotices = notices.filter((n) => {
    const query = searchQuery.toLowerCase();
    return n.title?.toLowerCase().includes(query) || n.message?.toLowerCase().includes(query);
  });

  const totalPages = Math.ceil(filteredNotices.length / itemsPerPage) || 1;
  const paginatedNotices = filteredNotices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Parish Notices & Circulars
          </h2>
          <p className="text-sm text-slate-500">
            Publish weekly announcements, pin important circulars, and manage expiry dates.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Create Announcement
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center bg-white rounded-2xl border border-cream-300 p-2 shadow-xs">
        <Search className="w-5 h-5 text-slate-400 ml-3 mr-2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search notices by title or content..."
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

      {/* Notices Table */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-cream-200">
          Loading notices...
        </div>
      ) : paginatedNotices.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-cream-200">
          No notices found matching your search.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-cream-200 shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm divide-y divide-cream-200">
              <thead className="bg-cream-100 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Notice Title & Text</th>
                  <th className="py-3.5 px-4">Status / Pinned</th>
                  <th className="py-3.5 px-4">Published Date</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200">
                {paginatedNotices.map((notice) => (
                  <tr key={notice._id} className="hover:bg-cream-50/80 transition-colors">
                    <td className="py-4 px-4 max-w-md">
                      <div className="flex items-center space-x-2">
                        {notice.isPinned && (
                          <span className="w-2 h-2 rounded-full bg-gold-500 flex-shrink-0" />
                        )}
                        <p className="font-semibold text-slate-900 truncate">{notice.title}</p>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {notice.message}
                      </p>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {notice.isPinned ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gold-100 text-gold-700">
                          <Pin className="w-3 h-3 mr-1 fill-current" />
                          Pinned
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-cream-200 text-slate-600">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600">
                      {new Date(notice.createdAt).toLocaleDateString('en-IN', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                      {notice.expiryDate ? (
                        new Date(notice.expiryDate).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      ) : (
                        <span className="text-slate-400 italic">No expiry</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openEditModal(notice)}
                        className="p-1.5 text-slate-600 hover:text-gold-600 hover:bg-cream-100 rounded-lg transition-colors"
                        title="Edit Notice"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setNoticeToDelete(notice);
                          setDeleteModalOpen(true);
                        }}
                        className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-cream-200 flex items-center justify-between text-xs text-slate-600">
              <span>
                Page {currentPage} of {totalPages} ({filteredNotices.length} total notices)
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

      {/* Add / Edit Notice Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-cream-50 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-cream-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <h3 className="font-heading font-bold text-xl text-slate-900">
                {editingNotice ? 'Edit Notice' : 'Post New Notice'}
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
                  Notice Title (English / Malayalam) *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Novena Schedule / ആദ്യകുർബാന അറിയിപ്പ്"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message / Details *
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter full announcement details. Supports both Malayalam and English text..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="w-4 h-4 rounded text-gold-600 focus:ring-gold-500 border-cream-300"
                />
                <label htmlFor="isPinned" className="text-sm font-medium text-slate-800 cursor-pointer">
                  Pin to top of website as Important Notice
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Notice will automatically hide from public view after this date. Leave blank to show indefinitely.
                </p>
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
                  {editingNotice ? 'Update Notice' : 'Publish Notice'}
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
        title="Delete Notice"
        message={`Are you sure you want to permanently delete notice "${noticeToDelete?.title}"?`}
        confirmText="Confirm Delete"
        danger={true}
        loading={submitting}
      />
    </div>
  );
};

export default AdminNotices;

