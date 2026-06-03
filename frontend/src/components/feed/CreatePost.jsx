import { Image, SmilePlus, Video } from 'lucide-react';
import Avatar from '../common/Avatar.jsx';
import Button from '../common/Button.jsx';
import { useApp } from '../../context/AppContext.jsx';

export default function CreatePost() {
  const { user } = useApp();

  return (
    <section className="rounded-[2rem] border border-border/60 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <Avatar src={user.avatar} name={user.name} />
        <button className="flex-1 rounded-full bg-hover px-5 text-left text-sm text-muted transition hover:bg-border">
          Share a memory, photo, or campus moment
        </button>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border/60 pt-3">
        <button className="flex items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold text-muted hover:bg-hover">
          <Image size={18} className="text-accent" /> Photo
        </button>
        <button className="flex items-center justify-center gap-2 rounded-full py-2 text-sm font-semibold text-muted hover:bg-hover">
          <Video size={18} className="text-accent" /> Reel
        </button>
        <Button variant="secondary" className="py-2">
          <SmilePlus size={18} /> Memory
        </Button>
      </div>
    </section>
  );
}
