import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Image as ImageIcon, Layers } from 'lucide-react';
import Lightbox from '../components/Lightbox';
import { EmptyState } from '../components/Skeleton';

const Gallery = () => {
  const [items, setItems] = useState([]);
  const [albums, setAlbums] = useState(['All']);
  const [selectedAlbum, setSelectedAlbum] = useState('All');
  const [loading, setLoading] = useState(true);

  // Lightbox
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
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
        console.error('Error fetching gallery:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [selectedAlbum]);

  const openPhoto = (index) => {
    setCurrentIdx(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900">
          Parish Photo Gallery
        </h1>
        <p className="font-ml text-gold-700 font-semibold text-lg">
          ദൈവാലയ ചിത്രശാല
        </p>
        <p className="text-sm sm:text-base text-slate-600">
          Explore moments of devotion, sacraments, annual feasts, church celebrations, and parish community events.
        </p>
      </div>

      {/* Album Filters */}
      {albums.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {albums.map((album) => (
            <button
              key={album}
              onClick={() => setSelectedAlbum(album)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                selectedAlbum === album
                  ? 'bg-gold-500 text-white shadow-xs'
                  : 'bg-cream-200/80 text-slate-700 hover:bg-cream-300'
              }`}
            >
              {album}
            </button>
          ))}
        </div>
      )}

      {/* Photo Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-cream-200 rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          icon={ImageIcon}
          title="No Photos in this Album"
          message="There are currently no photos found in the selected album."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item, index) => (
            <div
              key={item._id}
              onClick={() => openPhoto(index)}
              className="group bg-cream-50 rounded-2xl overflow-hidden border border-cream-200 shadow-soft hover:shadow-soft-lg transition-all cursor-pointer flex flex-col"
            >
              <div className="relative h-60 overflow-hidden bg-cream-200">
                <img
                  src={item.image?.url}
                  alt={item.caption || item.album || 'Church photo'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900/70 text-white backdrop-blur-xs">
                    {item.album || 'General'}
                  </span>
                </div>
              </div>

              {item.caption && (
                <div className="p-4 bg-cream-50 flex-1 flex items-center">
                  <p className="text-xs sm:text-sm text-slate-700 line-clamp-2 leading-relaxed">
                    {item.caption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        images={items}
        currentIndex={currentIdx}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNavigate={setCurrentIdx}
      />
    </div>
  );
};

export default Gallery;

