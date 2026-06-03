import { motion } from 'framer-motion';

export default function MemoryCard({ memory, compact = false }) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-sm"
    >
      <img src={memory.image} alt={memory.title} className={`${compact ? 'h-44' : 'h-64'} w-full object-cover`} />
      <div className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full bg-hover px-3 py-1 text-xs font-bold text-accent">{memory.type}</span>
          <span className="text-xs font-bold text-muted">{memory.year}</span>
        </div>
        <h3 className="text-base font-extrabold">{memory.title}</h3>
        <p className="mt-2 text-xs leading-5 text-muted">{memory.note}</p>
      </div>
    </motion.article>
  );
}
