import Avatar from '../common/Avatar.jsx';

export default function StoryCard({ story }) {
  return (
    <button className="w-24 shrink-0 text-left">
      <div className="accent-ring rounded-full">
        <img src={story.image} alt={story.label} className="h-24 w-24 rounded-full border-4 border-white object-cover" />
      </div>
      <p className="mt-2 truncate text-center text-xs font-bold text-slate-900">{story.user.name.split(' ')[0]}</p>
      <p className="truncate text-center text-[11px] text-accent">{story.label}</p>
    </button>
  );
}
