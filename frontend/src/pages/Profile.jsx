import { useEffect, useState } from 'react';
import MemoryCard from '../components/memories/MemoryCard.jsx';
import ProfileHeader from '../components/profile/ProfileHeader.jsx';
import PostsGrid from '../components/profile/PostsGrid.jsx';
import { getCurrentUser } from '../services/authService.js';
import { getUserPosts } from '../services/postService.js';
import { normalizeUser, normalizePost } from '../utils/normalize.js';
import { currentUser as mockUser, memories, posts as mockPosts } from '../utils/mockData.js';

export default function Profile() {
  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [meRes, postsRes] = await Promise.all([getCurrentUser(), getUserPosts(mockUser.id, 1)]);
        if (!cancelled) {
          const u = meRes.data.data?.user ? normalizeUser(meRes.data.data.user) : null;
          setProfileUser(u);
          const p = (postsRes.data.data || []).map(normalizePost);
          setUserPosts(p.length > 0 ? p : mockPosts);
        }
      } catch {
        if (!cancelled) {
          setProfileUser(mockUser);
          setUserPosts(mockPosts);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const user = profileUser || mockUser;

  return (
    <div className="space-y-6">
      <ProfileHeader user={user} />
      <section className="rounded-[2rem] border border-border/60 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <button className="rounded-full bg-accent px-5 py-2 text-sm font-bold text-white">Posts</button>
          <button className="rounded-full bg-hover px-5 py-2 text-sm font-bold">Memories</button>
          <button className="rounded-full bg-hover px-5 py-2 text-sm font-bold">Saved</button>
        </div>
        <PostsGrid items={userPosts} />
      </section>
      <section className="grid gap-4 md:grid-cols-3">
        {memories.map((memory) => <MemoryCard key={memory.id} memory={memory} compact />)}
      </section>
    </div>
  );
}
