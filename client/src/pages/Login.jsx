import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { API_BASE_URL } from '../config/api';

export default function Login() {
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

      // Send login request
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(payload),
      });

      // Handle bad responses
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Login failed ${res.status}`);
      }

      // Handle good response
      const data = await res.json();

      // Set token in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

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
        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </label>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>

        {errMsg && <div>{errMsg}</div>}
      </form>
    </main>
  );
}
