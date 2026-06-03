import { Home, MessageCircle, PlaySquare, Sparkles, UserRound } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/memories', icon: Sparkles, label: 'Memories' },
  { to: '/reels', icon: PlaySquare, label: 'Reels' },
  { to: '/messages', icon: MessageCircle, label: 'Messages' },
  { to: '/profile', icon: UserRound, label: 'Profile' },
];

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-white/95 px-2 py-2 backdrop-blur-xl lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 rounded-2xl py-2 text-[11px] font-semibold transition ${
                isActive ? 'text-accent' : 'text-muted'
              }`
            }
          >
            <Icon size={21} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
