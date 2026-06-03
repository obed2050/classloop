import { useEffect, useState } from 'react';
import Avatar from '../components/common/Avatar.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import PostCard from '../components/feed/PostCard.jsx';
import { useApp } from '../context/AppContext.jsx';
import { searchUsers } from '../services/userService.js';
import { searchPosts } from '../services/postService.js';
import { normalizeUser, normalizePost } from '../utils/normalize.js';
import { people as mockPeople, posts as mockPosts } from '../utils/mockData.js';

export default function Search() {
  const { searchQuery } = useApp();
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchQuery) {
      setUsers(mockPeople);
      setPosts(mockPosts.slice(0, 2));
      return;
    }
    let cancelled = false;
    const search = async () => {
      setLoading(true);
      try {
        const [uRes, pRes] = await Promise.all([searchUsers(searchQuery), searchPosts(searchQuery)]);
        if (!cancelled) {
          setUsers(uRes.data.data?.users || uRes.data.data || []);
          setPosts(pRes.data.data?.posts || pRes.data.data || []);
        }
      } catch {
        if (!cancelled) {
          setUsers(mockPeople);
          setPosts(mockPosts.slice(0, 2));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    search();
    return () => { cancelled = true; };
  }, [searchQuery]);

  const displayUsers = users.length > 0 ? users : mockPeople;
  const displayPosts = posts.length > 0 ? posts : mockPosts.slice(0, 2);

  return (
    <div className="space-y-6">
      <header className="rounded-[2rem] border border-border/60 bg-white p-6 shadow-sm">
        <p className="text-xs font-bold text-accent">Search</p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight">{searchQuery ? `Results for "${searchQuery}"` : 'Discover classmates and moments'}</h1>
      </header>

      <section className="rounded-[2rem] border border-border/60 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-base font-extrabold">People</h2>
        <div className="grid gap-3 md:grid-cols-2">
          {displayUsers.map((person) => {
            const p = person.full_name ? normalizeUser(person) : person;
            return (
              <div key={p.id} className="flex items-center gap-3 rounded-3xl bg-hover p-3">
                <Avatar src={p.avatar} name={p.name} />
                <div>
                  <p className="text-sm font-bold">{p.name}</p>
                  <p className="text-xs text-muted">@{p.username}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {displayPosts.length ? (
        <section className="grid gap-5 lg:grid-cols-2">
          {displayPosts.map((post) => <PostCard key={post.id} post={post} />)}
        </section>
      ) : (
        <EmptyState title="No results yet" message="Try searching a classmate, memory year, or reel caption." />
      )}
    </div>
  );
}
