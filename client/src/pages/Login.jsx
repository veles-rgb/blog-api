import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

export default function Login({ onAuthSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    setErrMsg('');

    try {
      const payload = { username, password };

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Login failed (${res.status})`);
      }

      const data = await res.json();

      onAuthSuccess(data.user, data.token);

      navigate('/');
    } catch (err) {
      setErrMsg(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main>
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        {errMsg && <p style={{ color: 'red' }}>{errMsg}</p>}
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p>
          Don't have an account? <a href="/register">Register</a>.
        </p>
      </form>
    </main>
  );
}
