import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/common/Button.jsx';
import BrandLogo from '../components/common/BrandLogo.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function Register() {
  const { register, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', username: '', email: '', password: '', school_name: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-5 py-10">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm">
        <div className="mb-8 text-center">
          <BrandLogo className="mx-auto mb-4 h-14 w-14" />
          <p className="text-xs font-bold text-accent">Join your campus loop</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Create your ClassLoop account</h1>
        </div>
        {error && (
          <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-2 block text-sm font-bold">Full name</span>
            <input name="full_name" value={form.full_name} onChange={handleChange} className="h-12 w-full rounded-2xl border border-border/60 bg-hover px-4 outline-none focus:ring-2 focus:ring-accent" required />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">Username</span>
            <input name="username" value={form.username} onChange={handleChange} className="h-12 w-full rounded-2xl border border-border/60 bg-hover px-4 outline-none focus:ring-2 focus:ring-accent" required />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">Email</span>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="h-12 w-full rounded-2xl border border-border/60 bg-hover px-4 outline-none focus:ring-2 focus:ring-accent" required />
          </label>
          <label>
            <span className="mb-2 block text-sm font-bold">Password</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} className="h-12 w-full rounded-2xl border border-border/60 bg-hover px-4 outline-none focus:ring-2 focus:ring-accent" required />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm font-bold">School name</span>
            <input name="school_name" value={form.school_name} onChange={handleChange} className="h-12 w-full rounded-2xl border border-border/60 bg-hover px-4 outline-none focus:ring-2 focus:ring-accent" />
          </label>
        </div>
        <Button className="mt-6 w-full" disabled={busy}>{busy ? 'Creating account...' : 'Create account'}</Button>
        <p className="mt-5 text-center text-sm text-muted">
          Already have an account? <Link to="/login" className="font-bold text-accent">Login</Link>
        </p>
      </form>
    </main>
  );
}
