import Link from 'next/link';

export default function Parents() {
  return (
    <main className="w-full">
      {/* Hero */}
      <section className="px-6 py-20 bg-slate-50 border-b border-gray-200">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6">
            Proof, not promises.
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Why hope they are learning when you can see it? PlayIQ shows you real progress through the Parent Proof Packet.
          </p>
        </div>
      </section>

      {/* Difference / Trust factor */}
      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-7xl grid md:grid-cols-2 gap-16 items-center">
           <div className="order-2 md:order-1 bg-gray-100 rounded-2xl h-80 flex items-center justify-center border border-gray-200 overflow-hidden shadow-inner">
            <img src="/images/tier2-parent-proof-packet.png" alt="Parent Proof Packet Snapshot" className="w-full h-full object-cover bg-gray-50" />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">You deserve to know what they're actually doing.</h2>
            <p className="text-lg text-gray-600 mb-6">
              When a teen uses a passive learning app, you usually just see a screen saying "100% complete." You have no idea if they just guessed their way to the end.
            </p>
            <p className="text-lg text-gray-600">
              PlayIQ requires them to physically build the solution and upload a photo. This verified update gets packaged directly into a distinct <strong>Parent Proof Packet</strong> on your dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* What parents can expect */}
      <section className="px-6 py-20 bg-indigo-50 border-y border-indigo-100">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold text-indigo-900 mb-12">What you'll see on your dashboard</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm text-left border border-indigo-100">
               <h3 className="font-bold text-gray-900 text-lg mb-2">Verified Photos</h3>
               <p className="text-gray-600 text-sm">See the real engineering structures they built with their own hands, side-by-side with the goal.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-left border border-indigo-100">
               <h3 className="font-bold text-gray-900 text-lg mb-2">Effort Indicators</h3>
               <p className="text-gray-600 text-sm">Transparent insights showing how hard they tried and how much they persevered before asking for hints.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-left border border-indigo-100">
               <h3 className="font-bold text-gray-900 text-lg mb-2">Skill Stages</h3>
               <p className="text-gray-600 text-sm">Clear visual indicators showing that they fully grasped one concept before the app allowed them to proceed.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 bg-white text-center">
         <div className="mx-auto max-w-2xl">
           <h2 className="text-3xl font-bold text-slate-900 mb-6">Stop guessing. Start verifying.</h2>
           <p className="text-lg text-slate-600 mb-10">Enroll in Course 1 to get access to the hardware kit and parental proof dashboard.</p>
           <Link href="/beta" className="rounded-full bg-indigo-600 px-8 py-4 text-base font-bold text-white shadow-sm hover:bg-indigo-500 transition-colors inline-block">
              Apply for the Pilot
           </Link>
         </div>
      </section>
    </main>
  );
}
