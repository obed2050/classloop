import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Avatar from '../components/common/Avatar.jsx';
import Button from '../components/common/Button.jsx';
import { SkeletonCard } from '../components/common/Skeleton.jsx';
import CreatePost from '../components/feed/CreatePost.jsx';
import PostCard from '../components/feed/PostCard.jsx';
import StoryCard from '../components/memories/StoryCard.jsx';
import { getFeed } from '../services/postService.js';
import { getSuggested } from '../services/userService.js';
import { normalizePost, normalizeUser } from '../utils/normalize.js';
import { people as mockPeople, posts as mockPosts, stories } from '../utils/mockData.js';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [feedRes, suggestedRes] = await Promise.all([getFeed(1), getSuggested()]);
        if (!cancelled) {
          setPosts(feedRes.data.data?.map(normalizePost) || feedRes.data.data || []);
          setSuggested((suggestedRes.data.data?.users || suggestedRes.data.data || []).map(normalizeUser));
        }
      } catch {
        if (!cancelled) {
          setPosts(mockPosts);
          setSuggested(mockPeople);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="space-y-5">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-border/60 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold text-accent">Today on ClassLoop</p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-[28px]">Relive the moments that made school unforgettable.</h1>
        </motion.div>

        <div className="flex gap-4 overflow-x-auto rounded-[2rem] border border-border/60 bg-white p-4 shadow-sm no-scrollbar">
          {stories.map((story) => <StoryCard key={story.id} story={story} />)}
        </div>

        <CreatePost />

        <div className="space-y-5">
          {loading
            ? Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} />)
            : posts.map((post) => <PostCard key={post.id} post={post} />)}
        </div>
      </section>

      <aside className="hidden space-y-5 xl:block">
        <section className="rounded-[2rem] border border-border/60 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-base font-extrabold">Suggested students</h2>
          <div className="space-y-3">
            {(loading ? mockPeople : suggested).map((person) => (
              <div key={person.id} className="flex items-center gap-3">
                <Avatar src={person.avatar} name={person.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{person.name}</p>
                  <p className="truncate text-xs text-muted">{person.school}</p>
                </div>
                <Button variant="secondary" className="px-4 py-2">Follow</Button>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
