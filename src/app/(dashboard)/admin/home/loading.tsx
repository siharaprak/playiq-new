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

        {/* Stats grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card p-6 !rounded-none border border-slate-800 space-y-3">
              <div className="h-4 w-24 bg-slate-800/60 animate-pulse" />
              <div className="h-8 w-16 bg-slate-800 animate-pulse" />
              <div className="h-3 w-32 bg-slate-800/40 animate-pulse" />
            </div>
          ))}
        </div>

        {/* Section title */}
        <div className="h-6 w-48 bg-slate-800/70 animate-pulse mb-6" />

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="glass-card p-6 !rounded-none border border-slate-800 space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-slate-800/50 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-slate-800 animate-pulse" />
                  <div className="h-3 w-40 bg-slate-800/50 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
