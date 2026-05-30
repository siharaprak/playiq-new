export default function Loading() {
  return (
    <div className="min-h-screen bg-[#020617] text-[var(--text-primary)] font-mono">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* Header skeleton */}
        <div className="mb-10 border-b border-slate-800 pb-6">
          <div className="h-4 w-32 bg-slate-800 animate-pulse mb-3" />
          <div className="h-8 w-72 bg-slate-800 animate-pulse mb-2" />
          <div className="h-3 w-40 bg-slate-800/50 animate-pulse" />
        </div>
        {/* Search bar skeleton */}
        <div className="mb-8 flex gap-4 bg-slate-900/40 p-4 border border-slate-800">
          <div className="flex-1 h-9 bg-slate-800/60 animate-pulse" />
          <div className="h-9 w-20 bg-slate-800 animate-pulse" />
          <div className="h-9 w-16 bg-slate-800/40 animate-pulse" />
          <div className="h-9 w-16 bg-slate-800/40 animate-pulse" />
          <div className="h-9 w-20 bg-slate-800/40 animate-pulse" />
        </div>
        {/* Student card skeletons */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="glass-card !rounded-none border border-slate-800 overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-slate-800 bg-black/30">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-slate-800 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-40 bg-slate-800 animate-pulse" />
                    <div className="h-3 w-56 bg-slate-800/50 animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-6 w-28 bg-slate-800/40 animate-pulse" />
                  <div className="h-8 w-8 bg-slate-800/30 animate-pulse" />
                  <div className="h-8 w-8 bg-slate-800/30 animate-pulse" />
                </div>
              </div>
              <div className="px-6 py-4">
                <div className="flex gap-2">
                  {Array.from({ length: 11 }).map((_, j) => (
                    <div key={j} className="w-[68px] h-16 bg-slate-800/30 animate-pulse border border-slate-800" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
