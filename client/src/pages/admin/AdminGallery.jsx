import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import {
  Upload,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Plus,
  X,
  Layers,
  Filter,
} from 'lucide-react';
import { useToast } from '../../components/Toast';
import Modal from '../../components/Modal';

const AdminGallery = () => {
  const [items, setItems] = useState([]);
  const [albums, setAlbums] = useState(['All']);
  const [selectedAlbum, setSelectedAlbum] = useState('All');
  const [loading, setLoading] = useState(true);

  // Upload modal states
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadAlbum, setUploadAlbum] = useState('General');
  const [uploadCaption, setUploadCaption] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit item state
  const [editingItem, setEditingItem] = useState(null);
  const [editCaption, setEditCaption] = useState('');
  const [editAlbum, setEditAlbum] = useState('General');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const { addToast } = useToast();

  const fetchGallery = async () => {
    setLoading(true);
    try {
      const url = selectedAlbum === 'All' ? '/gallery' : `/gallery?album=${encodeURIComponent(selectedAlbum)}`;
      const res = await api.get(url);
      setItems(res.data?.items || []);
      if (res.data?.albums) {
        setAlbums(res.data.albums);
      }
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to fetch photos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, [selectedAlbum]);

  const handleFilesSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      addToast('Maximum 10 photos can be uploaded at once', 'error');
      return;
    }
    const oversized = files.some((f) => f.size > 5 * 1024 * 1024);
    if (oversized) {
      addToast('Each image must be smaller than 5 MB', 'error');
      return;
    }
    setSelectedFiles(files);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      addToast('Please select at least one photo to upload', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('album', uploadAlbum);
      formData.append('caption', uploadCaption);

      selectedFiles.forEach((file) => {
        formData.append('images', file);
      });

      const res = await api.post('/admin/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      addToast(res.data?.message || 'Photos uploaded successfully', 'success');
      setUploadModalOpen(false);
      setSelectedFiles([]);
      setUploadCaption('');
      fetchGallery();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to upload photos', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    setSubmitting(true);
    try {
      await api.put(`/admin/gallery/${editingItem._id}`, {
        caption: editCaption,
        album: editAlbum,
      });
      addToast('Photo details updated successfully', 'success');
      setEditingItem(null);
      fetchGallery();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to update photo', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setSubmitting(true);
    try {
      await api.delete(`/admin/gallery/${itemToDelete._id}`);
      addToast('Photo deleted successfully from gallery and Cloudinary', 'success');
      setDeleteModalOpen(false);
      setItemToDelete(null);
      fetchGallery();
    } catch (err) {
      addToast(err.response?.data?.error || 'Failed to delete photo', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-900">
            Parish Gallery Management
          </h2>
          <p className="text-sm text-slate-500">
            Upload multiple photos to albums, set captions, and manage parish memories.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedFiles([]);
            setUploadCaption('');
            setUploadModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white font-semibold text-sm shadow-sm transition-all flex items-center justify-center"
        >
          <Upload className="w-4 h-4 mr-1.5" />
          Upload Photos
        </button>
      </div>

      {/* Album Filter Bar */}
      {albums.length > 1 && (
        <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-cream-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase mr-2 flex items-center">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Filter by Album:
          </span>
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => setSelectedAlbum(album)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedAlbum === album
                  ? 'bg-gold-500 text-white shadow-2xs'
                  : 'bg-cream-100 text-slate-700 hover:bg-cream-200'
              }`}
            >
              {album}
            </button>
          ))}
        </div>
      )}

      {/* Photos Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-cream-200">
          Loading gallery photos...
        </div>
      ) : items.length === 0 ? (
        <div className="p-12 text-center text-slate-500 bg-white rounded-2xl border border-cream-200">
          No photos found. Click "Upload Photos" to add church pictures.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl border border-cream-200 shadow-soft overflow-hidden flex flex-col group"
            >
              <div className="relative h-56 bg-cream-200 overflow-hidden">
                <img
                  src={item.image?.url}
                  alt={item.caption || 'Church Photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-white backdrop-blur-xs">
                    {item.album || 'General'}
                  </span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs sm:text-sm text-slate-700 line-clamp-2">
                  {item.caption || <span className="text-slate-400 italic">No caption set</span>}
                </p>

                <div className="mt-4 pt-3 border-t border-cream-200 flex items-center justify-between">
                  <span className="text-2xs text-slate-400">
                    {new Date(item.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setEditCaption(item.caption || '');
                        setEditAlbum(item.album || 'General');
                      }}
                      className="p-1.5 text-slate-600 hover:text-gold-600 hover:bg-cream-100 rounded-lg transition-colors"
                      title="Edit Caption / Album"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setItemToDelete(item);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Multi-Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-cream-50 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-cream-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <h3 className="font-heading font-bold text-xl text-slate-900">
                Upload Photos to Gallery
              </h3>
              <button
                onClick={() => setUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Photos (Max 10 files, JPG/PNG/WebP, max 5MB each) *
                </label>
                <div className="border-2 border-dashed border-cream-300 rounded-2xl p-6 text-center bg-white">
                  <Upload className="w-8 h-8 mx-auto text-gold-500 mb-2" />
                  <label className="cursor-pointer">
                    <span className="px-4 py-2 rounded-xl bg-cream-200 text-xs font-semibold text-slate-800 hover:bg-cream-300 transition-colors inline-block">
                      Browse Photos
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFilesSelect}
                      className="hidden"
                    />
                  </label>
                  {selectedFiles.length > 0 && (
                    <p className="mt-3 text-xs font-semibold text-emerald-700">
                      ✓ {selectedFiles.length} file(s) selected
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Album / Category Name
                </label>
                <input
                  type="text"
                  value={uploadAlbum}
                  onChange={(e) => setUploadAlbum(e.target.value)}
                  placeholder="e.g. Feast Celebrations, Choir, Sanctuary, Youth"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Caption (Optional)
                </label>
                <input
                  type="text"
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Optional caption in English or Malayalam"
                  className="w-full px-4 py-2.5 rounded-xl border border-cream-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end space-x-3 pt-4 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-cream-200 text-slate-700 text-sm font-medium hover:bg-cream-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || selectedFiles.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-sm font-medium shadow-sm disabled:opacity-60 flex items-center"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : null}
                  Start Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Photo Details Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-cream-50 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-cream-200">
            <div className="flex items-center justify-between pb-4 border-b border-cream-200">
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Edit Photo Details
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Album Name
                </label>
                <input
                  type="text"
                  value={editAlbum}
                  onChange={(e) => setEditAlbum(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-cream-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Caption
                </label>
                <textarea
                  rows={3}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-cream-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-gold-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-cream-200">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl bg-cream-200 text-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-600 text-white text-xs font-medium shadow-xs"
                >
                  Update Photo
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
        title="Delete Photo"
        message="Are you sure you want to permanently delete this photo? It will also be deleted from Cloudinary storage."
        confirmText="Confirm Delete"
        danger={true}
        loading={submitting}
      />
    </div>
  );
};

export default AdminGallery;

