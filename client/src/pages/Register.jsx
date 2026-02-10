import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config/api';

export default function Register({ onAuthSuccess }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState('');

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setIsLoading(true);
    setErrMsg('');

    if (password !== confirmPassword) {
      setErrMsg('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      // Register
      const registerPayload = { username, email, password };

      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerPayload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `Register failed (${res.status})`);
      }

      // Login
      const loginPayload = { username, password };

      const loginRes = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginPayload),
      });

      if (!loginRes.ok) {
        const data = await loginRes.json().catch(() => null);
        throw new Error(data?.message || `Login failed (${loginRes.status})`);
      }

      const loginData = await loginRes.json();

      onAuthSuccess(loginData.user, loginData.token);

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
        <h1>Register</h1>
        {errMsg && <p style={{ color: 'red' }}>{errMsg}</p>}

        <label>
          Username
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Confirm password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
        <p>
          Already have an account? <a href="/login">Login</a>.
        </p>
      </form>
    </main>
  );
}
