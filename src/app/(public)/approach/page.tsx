import Link from 'next/link';

export default function Approach() {
  return (
    <main className="w-full">
      <section className="px-6 py-20 bg-emerald-900 border-b border-emerald-800 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
          A guide. Never a crutch.
        </h1>
        <p className="text-xl text-emerald-100 max-w-3xl mx-auto">
          We designed our app to teach resilience, not dependency. We demand effort before delivering answers.
        </p>
      </section>

      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Effort-based learning</h2>
              <p className="text-lg text-gray-600 mb-4">
                Most educational software lets a teenager click a button and instantly receive the answer. That is outsourcing cognition. It creates weaker thinkers.
              </p>
              <p className="text-lg text-gray-600">
                PlayIQ’s app is purposefully gated by effort.
              </p>
            </div>
            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center border border-gray-200 overflow-hidden shadow-inner">
              <img src="/images/tier2-effort-gating-app.png" alt="Effort Gated App Interaction" className="w-full h-full object-cover bg-gray-50" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 bg-gray-50 border-t border-gray-200">
         <div className="mx-auto max-w-7xl">
           <div className="grid md:grid-cols-3 gap-8">
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-xl mb-4">1</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Effort Required Before Answers</h3>
                <p className="text-gray-600">When they ask for help, the app responds: <em>"Show me what you've tried."</em> They must engage their own reasoning before receiving assistance.</p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-xl mb-4">2</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Guiding Questions</h3>
                <p className="text-gray-600">The guide limits itself to asking questions or delivering small hints. The final breakthrough must always be earned by the teen.</p>
             </div>
             <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center font-bold text-xl mb-4">3</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Teach-Back Verification</h3>
                <p className="text-gray-600">After solving a tough challenge, the guide sometimes asks them to explain how they solved it to prove they actually retained the logic.</p>
             </div>
           </div>
         </div>
      </section>

       <section className="px-6 py-20 bg-white text-center">
         <Link href="/beta" className="text-indigo-600 font-bold hover:text-indigo-500 text-lg">
            See the guide in action in our early access Pilot &rarr;
         </Link>
      </section>
    </main>
  );
}
