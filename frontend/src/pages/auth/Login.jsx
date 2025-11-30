import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.email || !form.password) return;
    const ok = await login(form);
    if (ok) navigate('/profile');
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <h2 className="text-2xl font-semibold text-primary mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4 card">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-primary" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} className="w-full border rounded px-3 py-2 focus:outline-primary" required />
        </div>
        <button disabled={loading} className="btn-primary w-full">{loading ? 'Please wait...' : 'Login'}</button>
        <p className="text-sm text-center">No account? <Link to="/register" className="text-primary underline">Register</Link></p>
      </form>
    </div>
  );
}
