import { Inbox } from 'lucide-react';

export default function EmptyState({ title, message }) {
  return (
    <div className="rounded-[2rem] border border-border/60 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-hover text-accent">
        <Inbox size={22} />
      </div>
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{message}</p>
    </div>
  );
}
