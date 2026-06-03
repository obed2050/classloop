import { Send } from 'lucide-react';
import Avatar from '../common/Avatar.jsx';

export default function ChatWindow({ conversation }) {
  return (
    <section className="flex min-h-[680px] flex-col rounded-[2rem] border border-border/60 bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-border/60 p-4">
        <Avatar src={conversation.user.avatar} name={conversation.user.name} />
        <div>
          <h2 className="text-sm font-bold">{conversation.user.name}</h2>
          <p className="text-xs text-muted">Online now</p>
        </div>
      </header>

      <div className="flex-1 space-y-3 overflow-y-auto p-4">
        {conversation.messages.map((message) => (
          <div key={message.id} className={`flex ${message.from === 'me' ? 'justify-end' : 'justify-start'}`}>
            <p
              className={`max-w-[78%] rounded-[1.25rem] px-4 py-3 text-xs leading-5 ${
                message.from === 'me' ? 'bg-accent text-white' : 'bg-hover text-slate-900'
              }`}
            >
              {message.text}
            </p>
          </div>
        ))}
      </div>

      <form className="flex gap-3 border-t border-border/60 p-4">
        <input className="h-11 flex-1 rounded-full bg-hover px-5 text-sm outline-none focus:ring-2 focus:ring-accent" placeholder="Write a message" />
        <button className="grid h-12 w-12 place-items-center rounded-full bg-accent text-white transition hover:bg-accent-dark">
          <Send size={19} />
        </button>
      </form>
    </section>
  );
}
