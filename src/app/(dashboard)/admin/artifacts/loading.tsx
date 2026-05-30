export default function Loading() {
  return (
    <div className="min-h-screen bg-[#020617] text-[var(--text-primary)] font-mono">
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        {/* Header skeleton */}
        <div className="mb-10 border-b border-slate-800 pb-6">
          <div className="h-4 w-28 bg-slate-800 animate-pulse mb-3" />
          <div className="h-8 w-72 bg-slate-800 animate-pulse mb-2" />
          <div className="h-3 w-56 bg-slate-800/50 animate-pulse" />
        </div>
        {/* Stats skeleton */}
        <div className="mb-8 flex gap-4">
          <div className="glass-card !rounded-none px-6 py-3 border-l-2 border-slate-700">
            <div className="h-7 w-10 bg-slate-800 animate-pulse mb-1" />
            <div className="h-3 w-24 bg-slate-800/50 animate-pulse" />
          </div>
          <div className="glass-card !rounded-none px-6 py-3 border-l-2 border-slate-700">
            <div className="h-7 w-10 bg-slate-800 animate-pulse mb-1" />
            <div className="h-3 w-20 bg-slate-800/50 animate-pulse" />
          </div>
        </div>
        {/* Artifact card skeletons */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-card !rounded-none border border-slate-800 p-6">
              <div className="flex gap-4">
                <div className="h-16 w-16 bg-slate-800 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-56 bg-slate-800 animate-pulse" />
                  <div className="h-3 w-40 bg-slate-800/50 animate-pulse" />
                  <div className="h-3 w-32 bg-slate-800/30 animate-pulse" />
                </div>
                <div className="flex gap-2">
                  <div className="h-8 w-20 bg-slate-800/40 animate-pulse" />
                  <div className="h-8 w-20 bg-slate-800/40 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
