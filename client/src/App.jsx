import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './components/Toast';

// Public Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Public Pages
import Home from './pages/Home';
import Events from './pages/Events';
import Japamala from './pages/Japamala';
import KurisinteVazhi from './pages/KurisinteVazhi';
import Gallery from './pages/Gallery';
import Notices from './pages/Notices';
import About from './pages/About';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminEvents from './pages/admin/AdminEvents';
import AdminPrayers from './pages/admin/AdminPrayers';
import AdminGallery from './pages/admin/AdminGallery';
import AdminNotices from './pages/admin/AdminNotices';
import AdminSettings from './pages/admin/AdminSettings';

// Public Page Layout with Ambient Floating Mesh Blobs
const PublicLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative selection:bg-skyblue-100 selection:text-slate-900">
      {/* Background Animated Gradient Mesh */}
      <div className="mesh-bg">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Routes>
          {/* Public Website Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/japamala" element={<Japamala />} />
            <Route path="/kurisinte-vazhi" element={<KurisinteVazhi />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/notices" element={<Notices />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Admin Login (Modal-style card, no robots indexing) */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Protected Admin Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="overview" element={<AdminOverview />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="prayers" element={<AdminPrayers />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="notices" element={<AdminNotices />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
