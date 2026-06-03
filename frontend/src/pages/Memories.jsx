import { useEffect, useState } from 'react';
import MemoryCard from '../components/memories/MemoryCard.jsx';
import { getMemories } from '../services/memoryService.js';
import { normalizeMemory } from '../utils/normalize.js';
import { memories as mockMemories } from '../utils/mockData.js';

export default function Memories() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await getMemories({ limit: 20 });
        if (!cancelled) setMemories(data.data?.map(normalizeMemory) || data.data || []);
      } catch {
        if (!cancelled) setMemories(mockMemories);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const display = loading ? mockMemories : memories;

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold text-accent">Memory vault</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">Old photos, before vs now, and campus legends.</h1>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {display.map((memory) => <MemoryCard key={memory.id} memory={memory} />)}
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_360px]">
        <div className="rounded-[2rem] border border-border/60 bg-white p-5 shadow-sm">
          <h2 className="text-base font-extrabold">Memory timeline</h2>
          <div className="mt-5 space-y-4">
            {['2026', '2025', '2023', '2021'].map((year, index) => (
              <div key={year} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-accent text-sm font-black text-white">{year.slice(2)}</span>
                  {index < 3 && <span className="h-14 w-px bg-border/60" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold">{year}</h3>
                  <p className="text-xs leading-5 text-muted">Photos, reels, and funny moments from this class era.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] border border-border/60 bg-white p-5 shadow-sm">
          <h2 className="text-base font-extrabold">Trending memories</h2>
          <div className="mt-4 space-y-3">
            {display.map((memory) => <MemoryCard key={memory.id} memory={memory} compact />)}
          </div>
        </div>
      </section>
    </div>
  );
}
