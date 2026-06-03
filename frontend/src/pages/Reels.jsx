import { useEffect, useState } from 'react';
import ReelCard from '../components/reels/ReelCard.jsx';
import { getReels } from '../services/reelService.js';
import { normalizeReel } from '../utils/normalize.js';
import { reels as mockReels } from '../utils/mockData.js';

export default function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await getReels(1);
        if (!cancelled) setReels(data.data?.map(normalizeReel) || data.data || []);
      } catch {
        if (!cancelled) setReels(mockReels);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const display = loading ? mockReels : reels;

  return (
    <div className="min-h-[calc(100vh-124px)]">
      <header className="mx-auto mb-7 max-w-[620px] text-center">
        <p className="text-xs font-bold text-accent">ClassLoop Reels</p>
        <h1 className="mt-2 text-2xl font-extrabold leading-tight tracking-tight sm:text-[28px]">Campus moments in motion.</h1>
      </header>
      <section className="snap-y snap-mandatory space-y-10">
        {display.map((reel) => (
          <div key={reel.id} className="snap-start">
            <ReelCard reel={reel} />
          </div>
        ))}
      </section>
    </div>
  );
}
