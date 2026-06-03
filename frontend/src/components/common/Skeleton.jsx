export function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-[2rem] border border-border/60 bg-white p-4">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-11 w-11 rounded-full bg-hover" />
        <div className="space-y-2">
          <div className="h-3 w-32 rounded-full bg-hover" />
          <div className="h-3 w-20 rounded-full bg-hover" />
        </div>
      </div>
      <div className="h-72 rounded-[1.5rem] bg-hover" />
    </div>
  );
}
