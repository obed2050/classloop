import { Home, LogOut, MessageCircle, PlaySquare, Plus, Sparkles, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import BrandLogo from '../common/BrandLogo.jsx';
import { useApp } from '../../context/AppContext.jsx';

const items = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/memories', label: 'Memories', icon: Sparkles },
  { to: '/reels', label: 'Reels', icon: PlaySquare },
  { to: '/messages', label: 'Messages', icon: MessageCircle },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

export default function Sidebar() {
  const { isAuthenticated, logout } = useApp();

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[292px] border-r border-border/60 bg-white px-5 py-8 shadow-[12px_0_34px_rgba(15,23,42,0.06)] lg:flex lg:flex-col">
      <NavLink to="/" className="mb-16 flex items-center gap-3">
        <BrandLogo />
        <span className="text-lg font-extrabold tracking-tight text-slate-900">ClassLoop</span>
      </NavLink>

      <nav className="space-y-3">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex h-[56px] items-center gap-4 rounded-[18px] px-4 text-sm font-semibold transition ${
                isActive
                  ? 'bg-gradient-to-r from-accent to-[#EC4899] text-white shadow-[0_12px_22px_rgba(244,63,94,0.22)]'
                  : 'text-muted hover:bg-hover hover:text-slate-900'
              }`
            }
          >
            <Icon size={24} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-14 pb-2">
        {isAuthenticated ? (
          <div className="space-y-3">
            <button className="flex h-[64px] w-full items-center justify-center gap-3 rounded-2xl border border-border/60 bg-white px-5 text-sm font-bold text-accent shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition hover:border-accent/50 hover:bg-accent-light">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-accent to-[#EC4899] text-white">
                <Plus size={24} />
              </span>
              Create Post
            </button>
            <button
              onClick={logout}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-muted transition hover:bg-hover hover:text-slate-900"
            >
              <LogOut size={18} />
              Log out
            </button>
          </div>
        ) : (
          <div className="space-y-3 rounded-2xl border border-border/60 bg-surface p-3">
            <NavLink to="/login" className="flex h-11 items-center justify-center rounded-full text-sm font-semibold text-muted transition hover:bg-white hover:text-slate-900">
              Log in
            </NavLink>
            <NavLink to="/register" className="flex h-11 items-center justify-center rounded-full bg-accent text-sm font-semibold text-white transition hover:bg-accent-dark">
              Sign up
            </NavLink>
          </div>
        )}
        <div className="px-12 text-xs font-medium leading-6 text-muted">
          <p className="font-bold text-slate-900/70">© 2025 ClassLoop</p>
          <p>All rights reserved.</p>
        </div>
      </div>
    </aside>
  );
}
