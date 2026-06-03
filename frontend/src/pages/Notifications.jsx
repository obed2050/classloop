import { useEffect, useState } from 'react';
import Avatar from '../components/common/Avatar.jsx';
import Button from '../components/common/Button.jsx';
import { getNotifications } from '../services/notificationService.js';
import { normalizeNotification } from '../utils/normalize.js';
import { notifications as mockNotifications } from '../utils/mockData.js';

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await getNotifications();
        if (!cancelled) setItems((data.data || []).map(normalizeNotification));
      } catch {
        if (!cancelled) setItems(mockNotifications);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const display = loading ? mockNotifications : items;

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold text-accent">Activity</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Notifications</h1>
      </header>

      <section className="space-y-3">
        {display.map((item) => (
            <article key={item.id} className="flex items-center gap-3 rounded-[2rem] border border-border/60 bg-white p-4 shadow-sm">
            <Avatar src={item.user.avatar} name={item.user.name} />
            <div className="min-w-0 flex-1">
              <p className="text-sm"><strong>{item.user.name}</strong> {item.text}</p>
              <p className="text-xs text-muted">{item.time}</p>
            </div>
            <Button variant="secondary" className="hidden px-4 py-2 sm:inline-flex">View</Button>
          </article>
        ))}
      </section>
    </div>
  );
}
