import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import useStore from '../store/useStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const setUser = useStore(state => state.setUser);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      setUser(res.data, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="min-h-screen bg-neo-white flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border-brutal-lg shadow-brutal p-8 relative">
        <div className="absolute -top-4 -right-4 bg-neo-yellow border-brutal px-4 py-1 font-bold transform rotate-6">
          Access
        </div>
        <h2 className="text-4xl font-black mb-6 uppercase">Login</h2>
        
        {error && <div className="bg-neo-red text-white p-3 mb-4 font-bold border-brutal">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-bold mb-2">Email</label>
            <input 
              type="email" 
              className="w-full border-brutal p-3 outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-bold mb-2">Password</label>
            <input 
              type="password" 
              className="w-full border-brutal p-3 outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-neo-blue text-white border-brutal shadow-brutal hover:shadow-brutal-hover hover:-translate-y-1 transition-all p-3 font-bold text-xl uppercase mt-4 cursor-pointer">
            Enter
          </button>
        </form>
        
        <p className="mt-6 font-medium text-center">
          Don't have an account? <Link to="/register" className="font-bold underline hover:text-neo-blue">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
