import { Bell, Search } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar.jsx';
import BrandLogo from '../common/BrandLogo.jsx';
import { useApp } from '../../context/AppContext.jsx';

export default function Navbar() {
  const { user, isAuthenticated, searchQuery, setSearchQuery } = useApp();
  const navigate = useNavigate();

  const submitSearch = (event) => {
    event.preventDefault();
    navigate('/search');
  };

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-white/88 backdrop-blur-xl">
      <div className="flex h-[96px] items-center justify-between gap-4 px-4 sm:px-8 lg:px-12">
        <Link to="/" className="flex items-center gap-3 lg:hidden">
          <BrandLogo className="h-10 w-10" />
          <span className="hidden text-base font-extrabold tracking-tight text-slate-900 sm:block">ClassLoop</span>
        </Link>

        <form onSubmit={submitSearch} className="mx-auto hidden min-w-0 w-full max-w-[730px] flex-1 md:block">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-muted/70" size={22} />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search friends, memories, reels"
              className="h-11 w-full rounded-full border border-border/60 bg-hover pl-14 pr-5 text-sm outline-none transition placeholder:text-muted/60 focus:border-accent focus:bg-white focus:shadow-[0_8px_22px_rgba(15,23,42,0.06)]"
            />
          </label>
        </form>

        {isAuthenticated ? (
          <div className="flex items-center gap-5">
            <Link to="/notifications" className="relative grid h-11 w-11 place-items-center rounded-full text-slate-900 transition hover:bg-hover">
              <Bell size={28} strokeWidth={1.9} />
              <span className="absolute right-2 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-accent" />
            </Link>
            <Link to="/profile">
              <Avatar src={user.avatar} name={user.name} size="md" />
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-full px-4 py-2 text-sm font-semibold text-muted transition hover:bg-hover hover:text-slate-900">
              Log in
            </Link>
            <Link to="/register" className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-dark">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
