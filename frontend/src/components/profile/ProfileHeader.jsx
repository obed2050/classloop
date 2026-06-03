import Button from '../common/Button.jsx';
import Avatar from '../common/Avatar.jsx';

export default function ProfileHeader({ user }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-border/60 bg-white shadow-sm">
      <div className="h-52 bg-hover">
        <img src={user.cover} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="px-5 pb-5">
        <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <Avatar src={user.avatar} name={user.name} size="xl" ring />
          <Button>Edit profile</Button>
        </div>
        <div className="mt-4">
          <h1 className="text-2xl font-extrabold tracking-tight">{user.name}</h1>
          <p className="text-sm font-semibold text-accent">@{user.username}</p>
          <p className="mt-4 max-w-2xl text-xs leading-5 text-muted">{user.bio}</p>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3 rounded-[1.5rem] bg-hover p-3 text-center">
          <div><strong className="block text-base">{user.posts}</strong><span className="text-xs text-muted">Posts</span></div>
          <div><strong className="block text-base">{user.followers}</strong><span className="text-xs text-muted">Followers</span></div>
          <div><strong className="block text-base">{user.following}</strong><span className="text-xs text-muted">Following</span></div>
        </div>
      </div>
    </section>
  );
}
