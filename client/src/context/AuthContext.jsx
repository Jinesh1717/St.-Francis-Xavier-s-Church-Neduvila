import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const inactivityTimerRef = useRef(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get('/admin/me');
      if (res.data?.authenticated) {
        setAdmin(res.data.admin);
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async (isAuto = false) => {
    try {
      await api.post('/admin/logout');
    } catch (err) {
      console.warn('Logout error:', err.message);
    } finally {
      setAdmin(null);
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
      if (isAuto) {
        alert('You have been logged out due to 30 minutes of inactivity.');
      }
    }
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/admin/login', { username, password });
    if (res.data?.admin) {
      setAdmin(res.data.admin);
      resetInactivityTimer();
    }
    return res.data;
  };

  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    if (admin) {
      // 30 minutes = 30 * 60 * 1000 ms
      inactivityTimerRef.current = setTimeout(() => {
        logout(true);
      }, 30 * 60 * 1000);
    }
  }, [admin, logout]);

  // Set up activity listeners when logged in
  useEffect(() => {
    if (!admin) return;

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    const handleActivity = () => resetInactivityTimer();

    events.forEach((event) => window.addEventListener(event, handleActivity));
    resetInactivityTimer();

    return () => {
      events.forEach((event) => window.removeEventListener(event, handleActivity));
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [admin, resetInactivityTimer]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ admin, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

