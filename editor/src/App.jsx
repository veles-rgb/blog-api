import { useEffect, useState, useCallback } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from './config/api';

import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import NewPost from './pages/NewPost';

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
  const [authError, setAuthError] = useState('');

  const logout = useCallback(
    (redirectTo = '/login') => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      navigate(redirectTo, { replace: true });
    },
    [navigate],
  );

  const isEditorUser = (u) => Boolean(u?.isAdmin || u?.isAuthor);

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
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          if (!cancelled) logout('/login');
          return;
        }

        const data = await res.json().catch(() => null);

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

        if (!isEditorUser(safeUser)) {
          if (!cancelled) {
            setAuthError('You do not have access to the editor.');
            logout('/login');
          }
          return;
        }

        if (!cancelled) setUser(safeUser);
      } finally {
        if (!cancelled) setAuthLoading(false);
      }
    }

    verifyOnBoot();

    return () => {
      cancelled = true;
    };
  }, [logout]);

  const onAuthSuccess = useCallback((nextUser, token) => {
    if (!isEditorUser(nextUser)) {
      setAuthError('You do not have access to the editor.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      return false;
    }

    setAuthError('');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(nextUser));
    setUser(nextUser);
    return true;
  }, []);

  if (authLoading) return null;

  return (
    <>
      <Header user={user} onLogout={logout} />
      <Routes>
        <Route
          path="/"
          element={
            user ? <Home user={user} /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <Login onAuthSuccess={onAuthSuccess} authError={authError} />
            )
          }
        />

        <Route
          path="/new"
          element={user ? <NewPost /> : <Navigate to="/login" replace />}
        />
      </Routes>
    </>
  );
}
