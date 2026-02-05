import { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from './config/api';

import Header from './components/Header';

import Home from './pages/Home';
import Post from './pages/Post';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';

export default function App() {
  const navigate = useNavigate();

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    try {
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);

    navigate('/');
  }, [navigate]);

  // check whether token exists AND backend accepts it
  useEffect(() => {
    let cancelled = false;

    async function verifyOnBoot() {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          if (!cancelled) setUser(null);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // token invalid/expired
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          if (!cancelled) setUser(null);
          return;
        }

        const data = await res.json().catch(() => null);

        // Prefer server-trusted user; fallback to localStorage if needed
        const safeUser =
          data?.user ??
          (() => {
            const stored = localStorage.getItem('user');
            try {
              return stored ? JSON.parse(stored) : null;
            } catch {
              return null;
            }
          })();

        if (!cancelled) setUser(safeUser);
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }

    verifyOnBoot();

    return () => {
      cancelled = true;
    };
  }, []);

  // Called by Login/Register after successful auth
  const onAuthSuccess = useCallback((nextUser, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  if (authLoading) return null;

  return (
    <>
      <Header user={user} onLogout={logout} />

      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/posts/:username/:slug" element={<Post user={user} />} />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login onAuthSuccess={onAuthSuccess} />
            )
          }
        />
        <Route
          path="/register"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Register onAuthSuccess={onAuthSuccess} />
            )
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
