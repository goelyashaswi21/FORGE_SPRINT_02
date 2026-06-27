import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Login() {
  const [email, setEmail] = useState('admin@acme.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <form onSubmit={handleLogin} className="p-8 bg-white shadow rounded-lg w-96">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">PulseDesk</h1>
        {error && <div className="text-red-500 mb-4 font-semibold text-sm">{error}</div>}
        <input className="w-full border p-2 mb-4 rounded bg-gray-50" 
               type="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border p-2 mb-6 rounded bg-gray-50" 
               type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition p-2 rounded" type="submit">Log In</button>
      </form>
    </div>
  );
}
