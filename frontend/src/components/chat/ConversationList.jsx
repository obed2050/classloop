import Avatar from '../common/Avatar.jsx';

export default function ConversationList({ conversations, activeId, onSelect }) {
  return (
    <aside className="rounded-[2rem] border border-border/60 bg-white p-3 shadow-sm">
      <h2 className="px-3 py-2 text-base font-extrabold">Messages</h2>
      <div className="space-y-1">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => onSelect(conversation.id)}
            className={`flex w-full items-center gap-3 rounded-3xl p-3 text-left transition ${
              activeId === conversation.id ? 'bg-accent text-white' : 'hover:bg-hover'
            }`}
          >
            <Avatar src={conversation.user.avatar} name={conversation.user.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold">{conversation.user.name}</p>
              <p className={`truncate text-xs ${activeId === conversation.id ? 'text-white/75' : 'text-muted'}`}>
                {conversation.last}
              </p>
            </div>
            {conversation.unread > 0 && (
              <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${activeId === conversation.id ? 'bg-white text-accent' : 'bg-accent text-white'}`}>
                {conversation.unread}
              </span>
            )}
          </button>
        ))}
      </div>
    </aside>
  );
}
