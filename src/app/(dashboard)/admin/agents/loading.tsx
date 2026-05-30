export default function Loading() {
  return (
    <div className="min-h-screen bg-[#020617] text-[var(--text-primary)] font-mono">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* Header skeleton */}
        <div className="mb-10 border-b border-slate-800 pb-6">
          <div className="h-4 w-32 bg-slate-800 animate-pulse mb-3" />
          <div className="h-8 w-60 bg-slate-800 animate-pulse mb-2" />
          <div className="h-3 w-40 bg-slate-800/50 animate-pulse" />
        </div>

        {/* Filters */}
        <div className="mb-8 flex gap-4 bg-slate-900/40 p-4 border border-slate-800">
          <div className="flex-1 h-9 bg-slate-800/60 animate-pulse" />
          <div className="h-9 w-24 bg-slate-800 animate-pulse" />
        </div>

        {/* Agents grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card !rounded-none border border-slate-800 p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="h-4 w-36 bg-slate-800 animate-pulse" />
                  <div className="h-3 w-28 bg-slate-800/50 animate-pulse" />
                </div>
                <div className="h-5 w-16 bg-slate-800/40 animate-pulse" />
              </div>
              <div className="h-16 w-full bg-slate-850 animate-pulse" />
              <div className="h-3 w-40 bg-slate-800/30 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
