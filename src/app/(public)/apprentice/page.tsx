import Link from 'next/link';

export default function Apprentice() {
  return (
    <main className="w-full">
      {/* Hero / Offer Summary */}
      <section className="px-6 py-24 bg-slate-900 border-b border-slate-800">
        <div className="mx-auto max-w-5xl text-center">
          <span className="text-indigo-400 font-semibold tracking-wide uppercase text-sm">Course 1</span>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6">
            The Apprentice
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
            An engaging foundational journey blending physical structural hardware with adaptive, screen-free logic puzzles.
          </p>
          <Link href="/beta" className="rounded-full bg-indigo-500 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-400 transition-colors inline-block">
            Apply for Beta Access
          </Link>
        </div>
      </section>

      {/* Who it is for & What is included */}
      <section className="px-6 py-24 bg-white">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Who is this for?</h2>
            <p className="text-lg text-gray-600 mb-4">
              Designed for ages 13–17 who need a challenge that bridges the gap between passive apps and real-world engineering. 
              Perfect for hands-on teens and logical thinkers seeking engaging, tactile problem solving.
            </p>
            <div className="bg-gray-100 rounded-xl h-64 flex items-center justify-center border border-gray-200 mt-8 overflow-hidden shadow-inner">
               <img src="/images/tier3-apprentice-teen.png" alt="Teen engaging with Course 1 hardware build" className="w-full h-full object-cover bg-gray-50" />
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">What's Included</h2>
            <ul className="space-y-6">
              <li className="flex items-start">
                 <div className="bg-indigo-100 p-2 rounded-lg mr-4 mt-1">
                   <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-900 text-lg">Premium Hardware Kit</h3>
                   <p className="text-gray-600 mt-1">Hardware sets designed for structural engineering, shipped directly to your door.</p>
                 </div>
              </li>
              <li className="flex items-start">
                 <div className="bg-indigo-100 p-2 rounded-lg mr-4 mt-1">
                   <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-900 text-lg">Guided App Access</h3>
                   <p className="text-gray-600 mt-1">Digital access to the PlayIQ guide tracking their journey through the foundational course missions.</p>
                 </div>
              </li>
              <li className="flex items-start">
                 <div className="bg-indigo-100 p-2 rounded-lg mr-4 mt-1">
                   <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4C15.358 6.136 12.382 5 12 5s-3.358 1.136-5.427 3A14.996 14.996 0 0112 21c4.542-1.748 7.37-4.8 8.423-7.5" /></svg>
                 </div>
                 <div>
                   <h3 className="font-bold text-gray-900 text-lg">Parent Proof Packet</h3>
                   <p className="text-gray-600 mt-1">Continuous visual reports on your dashboard proving what they successfully engineered.</p>
                 </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it works / What parents see / Different */}
      <section className="px-6 py-24 bg-gray-50 border-t border-gray-200">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why it's distinctly different.</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">It's not just a box of generic parts. It's an engaging curriculum governed by real-world constraints.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">1. Screen-Free Execution</h3>
              <p className="text-gray-600">The app provides the blueprint and the goal. The actual failing, trying, and succeeding happens with real parts on the table.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">2. Smart Assistance</h3>
              <p className="text-gray-600">If they ask for the answer, the guide asks them what they tried first. We help them think; we don't spoon-feed solutions.</p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">3. Visible Progress</h3>
              <p className="text-gray-600">You log into your dashboard and see actual photos of what they built today, proving they earned their new skills.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA & Objection Handling */}
      <section className="px-6 py-24 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="bg-indigo-600 rounded-3xl p-10 md:p-16 text-center shadow-lg">
            <h2 className="text-3xl font-bold text-white mb-6">Join the Pilot Experience</h2>
            <p className="text-indigo-100 text-lg mb-10 max-w-xl mx-auto">
              We are opening a limited beta for 25 families. Secure early hardware delivery and heavily discounted access to the full course.
            </p>
            <Link href="/beta" className="rounded-full bg-white px-8 py-4 text-base font-bold text-indigo-600 shadow-sm hover:bg-gray-50 transition-colors inline-block mb-6">
              Apply for the Beta
            </Link>
            <p className="text-sm text-indigo-200">100% money-back guarantee if they don't stick with it.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
