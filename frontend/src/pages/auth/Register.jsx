import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Register() {
  const { register, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert('Passwords do not match');
    const ok = await register({ name: form.name, email: form.email, password: form.password });
    if (ok) navigate('/profile');
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-semibold text-primary mb-4">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4 card">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-primary" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-primary" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-primary" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-primary" required />
        </div>
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Please wait...' : 'Create Account'}</button>
        <p className="text-sm text-center">Have an account? <Link to="/login" className="text-primary underline">Login</Link></p>
      </form>
    </div>
  );
}
