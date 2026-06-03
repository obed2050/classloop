import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send } from 'lucide-react';
import Avatar from '../common/Avatar.jsx';

export default function PostCard({ post }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-sm"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar src={post.author.avatar} name={post.author.name} ring />
          <div>
            <h3 className="font-bold leading-tight">{post.author.name}</h3>
            <p className="text-xs text-muted">@{post.author.username} · {post.time}</p>
          </div>
        </div>
        <span className="rounded-full bg-hover px-3 py-1 text-xs font-semibold text-accent">Memory</span>
      </div>

      <div className="px-4 pb-4">
        <p className="text-sm leading-6 text-slate-900/80">{post.caption}</p>
      </div>

      <img src={post.image} alt={post.caption} className="aspect-[4/3] w-full object-cover" />

      <div className="grid grid-cols-3 gap-2 p-3">
        <button className="flex items-center justify-center gap-2 rounded-full py-2 text-sm font-bold transition hover:bg-hover">
          <Heart size={18} className="text-accent" /> {post.likes}
        </button>
        <button className="flex items-center justify-center gap-2 rounded-full py-2 text-sm font-bold transition hover:bg-hover">
          <MessageCircle size={18} /> {post.comments}
        </button>
        <button className="flex items-center justify-center gap-2 rounded-full py-2 text-sm font-bold transition hover:bg-hover">
          <Send size={18} /> {post.shares}
        </button>
      </div>
    </motion.article>
  );
}
