import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send } from 'lucide-react';
import Avatar from '../common/Avatar.jsx';

export default function ReelCard({ reel }) {
  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.55 }}
      className="relative mx-auto h-[72vh] max-h-[704px] min-h-[560px] w-full max-w-[464px] overflow-hidden rounded-[24px] bg-slate-900 shadow-[0_20px_34px_rgba(15,23,42,0.18)]"
    >
      <img src={reel.image} alt={reel.caption} className="h-full w-full object-cover opacity-25 saturate-50" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#151515]/96 via-[#202020]/90 to-[#111111]/96" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/62 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-20 p-5 text-white">
        <div className="mb-3 flex items-center gap-3">
          <Avatar src={reel.author.avatar} name={reel.author.name} size="sm" />
          <div>
            <h3 className="text-sm font-bold leading-none">{reel.author.name}</h3>
            <p className="text-xs text-white/70">@{reel.author.username}</p>
          </div>
        </div>
        <p className="text-sm font-medium leading-5 text-white/95">{reel.caption}</p>
      </div>
      <div className="absolute bottom-16 right-5 flex flex-col gap-5 text-white">
        <button className="grid place-items-center gap-2 text-sm font-bold">
          <span className="grid h-13 w-13 place-items-center rounded-full bg-white/18 shadow-[0_10px_18px_rgba(0,0,0,0.18)] backdrop-blur">
            <Heart size={28} />
          </span>
          <span>{reel.likes}</span>
        </button>
        <button className="grid place-items-center gap-2 text-sm font-bold">
          <span className="grid h-13 w-13 place-items-center rounded-full bg-white/18 shadow-[0_10px_18px_rgba(0,0,0,0.18)] backdrop-blur">
            <MessageCircle size={28} />
          </span>
          <span>{reel.comments}</span>
        </button>
        <button className="grid place-items-center gap-2 text-sm font-bold">
          <span className="grid h-13 w-13 place-items-center rounded-full bg-white/18 shadow-[0_10px_18px_rgba(0,0,0,0.18)] backdrop-blur">
            <Send size={28} />
          </span>
          <span>Share</span>
        </button>
      </div>
    </motion.article>
  );
}
