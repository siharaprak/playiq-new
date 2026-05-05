import { listDiscussionCategories } from '@/lib/data/discussions';
import Link from 'next/link';
import { Hash, ChevronRight, TrendingUp } from 'lucide-react';

export default async function DiscussionsIndex() {
  const categories = await listDiscussionCategories();

  return (
    <div className="space-y-3">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-lg p-5 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <h2 className="font-bold text-sm text-indigo-300">Welcome to PlayIQ Discussions</h2>
        </div>
        <p className="text-xs text-slate-400">Choose a category below to browse topics or start a new conversation.</p>
      </div>

      {/* Category list — Reddit subreddit style */}
      {categories.map((category: any) => (
        <Link 
          key={category.id} 
          href={`/discussions/${category.slug}`}
          className="flex items-center gap-4 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/50 hover:border-indigo-500/30 rounded-lg p-4 transition-all group"
        >
          <div className="w-10 h-10 bg-indigo-500/15 border border-indigo-500/25 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-indigo-500/25 transition-colors">
            <Hash className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors">{category.title}</h3>
            {category.description && (
              <p className="text-xs text-slate-500 mt-0.5 truncate">{category.description}</p>
            )}
          </div>
          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0" />
        </Link>
      ))}
    </div>
  );
}
