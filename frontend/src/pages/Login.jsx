import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/common/Button.jsx';
import BrandLogo from '../components/common/BrandLogo.jsx';
import { useApp } from '../context/AppContext.jsx';

export default function Login() {
  const { login, isAuthenticated } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login({ email, password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigate('/', { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-2">
      <section className="hidden bg-slate-900 p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-3">
          <BrandLogo className="h-12 w-12" />
          <span className="text-xl font-extrabold">ClassLoop</span>
        </Link>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl">
          <p className="text-xs font-bold text-accent">Premium campus social</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight">Where school memories become a living archive.</h1>
        </motion.div>
        <p className="text-sm text-white/55">The social network for students, powered by memories.</p>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm">
          <div className="mb-8">
            <p className="text-xs font-bold text-accent">Welcome back</p>
            <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Log in to ClassLoop</h1>
          </div>
          {error && (
            <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600">{error}</p>
          )}
          <label className="mb-4 block">
            <span className="mb-2 block text-sm font-bold">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-2xl border border-border/60 bg-hover px-4 outline-none focus:ring-2 focus:ring-accent"
              placeholder="you@classloop.app"
              required
            />
          </label>
          <label className="mb-6 block">
            <span className="mb-2 block text-sm font-bold">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-2xl border border-border/60 bg-hover px-4 outline-none focus:ring-2 focus:ring-accent"
              placeholder="••••••••"
              required
            />
          </label>
          <Button className="w-full" disabled={busy}>{busy ? 'Logging in...' : 'Login'}</Button>
          <p className="mt-5 text-center text-sm text-muted">
            New here? <Link to="/register" className="font-bold text-accent">Create account</Link>
          </p>
        </form>
      </section>
    </main>
  );
}
