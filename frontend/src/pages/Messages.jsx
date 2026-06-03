import { useEffect, useMemo, useState } from 'react';
import ConversationList from '../components/chat/ConversationList.jsx';
import ChatWindow from '../components/chat/ChatWindow.jsx';
import { getConversations } from '../services/chatService.js';
import { normalizeConversation } from '../utils/normalize.js';
import { conversations as mockConversations } from '../utils/mockData.js';

export default function Messages() {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await getConversations();
        if (!cancelled) {
          const items = (data.data || []).map(normalizeConversation);
          setConversations(items);
          if (items.length > 0) setActiveId(items[0].id);
        }
      } catch {
        if (!cancelled) {
          setConversations(mockConversations);
          setActiveId(mockConversations[0].id);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const active = useMemo(() => conversations.find((item) => item.id === activeId), [activeId, conversations]);
  const display = loading ? mockConversations : conversations;

  return (
    <div className="grid gap-5 lg:grid-cols-[360px_minmax(0,1fr)]">
      <ConversationList conversations={display} activeId={activeId} onSelect={setActiveId} />
      {(active || display[0]) && <ChatWindow conversation={active || display[0]} />}
    </div>
  );
}
