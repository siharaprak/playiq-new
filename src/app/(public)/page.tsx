import Link from 'next/link';

export default function Home() {
  return (
    <main className="w-full">
      {/* 1. Hero */}
      <section className="relative px-6 py-24 md:py-32 bg-gray-50 border-b border-gray-100 overflow-hidden">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-indigo-600/20 bg-indigo-50/50 px-3 py-1 text-sm font-medium text-indigo-600 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 mr-2"></span>
            Course 1 Pilot: Now accepting 25 families
          </div>
          <h1 className="mt-4 text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900">
            Real STEM building.<br className="hidden md:block"/> Guided screen time that actually teaches.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            PlayIQ pairs a premium physical building kit with guided digital support for ages 13–17. They build with their hands, think through challenges, and you see real progress.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2">
			      <p className="text-sm font-semibold text-indigo-600">Hands-on builds. Guided help. Visible progress for parents.</p>
		      </div>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/beta" className="w-full sm:w-auto rounded-full bg-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
              Apply for the Paid Beta
            </Link>
            <Link href="/how-it-works" className="w-full sm:w-auto rounded-full bg-white border border-gray-300 px-8 py-4 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-50 transition-colors">
              See How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* 2. What PlayIQ Is */}
      <section className="px-6 py-24 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">What is PlayIQ?</h2>
              <p className="mt-6 text-lg text-gray-600">
                Passive videos and disposable kits don't hold their attention. PlayIQ bridges the physical and digital world to make engineering engaging.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm mt-1">1</span>
                  <p className="ml-4 text-gray-700"><strong className="text-gray-900">The Hardware</strong> (Tier 1 Asset Placeholder): Premium, durable physical kits designed for structural problem solving.</p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm mt-1">2</span>
                  <p className="ml-4 text-gray-700"><strong className="text-gray-900">The Guide</strong>: An interactive app that gives hints, not answers. Effort is required before they can move forward.</p>
                </li>
                <li className="flex items-start">
                  <span className="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center font-bold text-sm mt-1">3</span>
                  <p className="ml-4 text-gray-700"><strong className="text-gray-900">The Proof</strong>: Photographic updates sent directly to you, so you know exactly what they learned.</p>
                </li>
              </ul>
            </div>
            <div className="bg-gray-100 rounded-2xl h-96 flex items-center justify-center border border-gray-200 overflow-hidden shadow-inner">
              <img src="/images/tier1-hardware-hero.png" alt="PlayIQ Premium Hardware Build" className="w-full h-full object-cover bg-gray-100" />
            </div>
          </div>
        </div>
      </section>

      {/* 3 & 4. Why Kids Stick With It & What They Learn */}
      <section className="px-6 py-24 bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Why teens won't put it down.</h2>
            <p className="mt-4 text-lg text-slate-300">PlayIQ operates on earned progress. They have to prove they understand the current challenge before the next one unlocks.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-3">Earned Progress</h3>
              <p className="text-slate-400">Lock-and-key mechanics mean they stay engaged trying to solve the puzzle, building resilience.</p>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-3">Guided Mentorship</h3>
              <p className="text-slate-400">If they get stuck, the app provides smart hints, ensuring they do the thinking, not the software.</p>
            </div>
            <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-xl font-bold text-white mb-3">Real-World Skills</h3>
              <p className="text-slate-400">Learning physics, structural design, and logic through hands-on play that lives in the physical world.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Parent Trust / Safety / Proof */}
      <section className="px-6 py-24 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="w-full md:w-1/2 bg-gray-50 rounded-2xl h-96 flex items-center justify-center border border-gray-200 overflow-hidden shadow-inner">
              <img src="/images/tier2-parent-proof-dash.png" alt="Parent View Dashboard" className="w-full h-full object-cover bg-gray-50" />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">Total visibility into their learning.</h2>
              <p className="mt-6 text-lg text-gray-600">
                You shouldn't have to guess if an educational tool is working. With PlayIQ, you receive a continuous <strong>Parent Proof Packet</strong>.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                Instead of a generic screen saying "100% complete," you see the actual photos of the structures they engineered, proving they grasped the concept.
              </p>
              <div className="mt-8">
                <Link href="/parents" className="text-indigo-600 font-semibold hover:text-indigo-500 inline-flex items-center gap-1">
                  See how we verify progress &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Replayability */}
      <section className="px-6 py-24 bg-gray-50">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">More ways to build.</h2>
          <p className="text-lg text-gray-600 mb-12">The physical kit doesn't end when the course does. The hardware is a lifelong platform for invention.</p>
          <div className="bg-white rounded-2xl h-80 flex items-center justify-center border border-gray-200 shadow-sm overflow-hidden">
             <img src="/images/tier3-teen-creative-build.png" alt="Teen Engineering Custom Build" className="w-full h-full object-cover bg-gray-50" />
          </div>
        </div>
      </section>

      {/* 7 & 8 & 9. FAQ Preview & Final CTA */}
      <section className="px-6 py-24 bg-white">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-12">Ready to reshape how they learn?</h2>
          <Link href="/beta" className="rounded-full bg-indigo-600 px-10 py-5 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors inline-block mb-16">
            Apply for the Paid Beta
          </Link>
          
          <div className="text-left max-w-2xl mx-auto space-y-8 mt-12 bg-gray-50 p-8 rounded-2xl border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 border-b pb-4">Frequently Asked Questions</h3>
            <div>
              <h4 className="font-semibold text-gray-900 text-lg">What age group is this for?</h4>
              <p className="text-gray-600 mt-2">Course 1: Apprentice is optimized for ages 13–17, introducing advanced structural concepts and logic.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 text-lg">Do they need their own tablet?</h4>
              <p className="text-gray-600 mt-2">A screen is used briefly to receive missions and snap photos of their builds. The heavy lifting happens strictly offline on the desk.</p>
            </div>
            <Link href="/contact" className="text-indigo-600 font-semibold mt-4 block">Read all FAQs &rarr;</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
