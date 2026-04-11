import Link from 'next/link';

export default function HowItWorks() {
  return (
    <main className="w-full">
      <section className="px-6 py-20 bg-slate-900 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
          The PlayIQ Loop
        </h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          A seamless flow between building with your hands and validating with the app.
        </p>
      </section>

      <section className="px-6 py-24 bg-white">
        <div className="mx-auto max-w-4xl">
          <div className="relative border-l-2 border-indigo-200 ml-4 md:ml-0 md:pl-8 space-y-16">
            
            <div className="relative">
              <div className="absolute -left-[25px] md:-left-[41px] bg-indigo-600 w-4 h-4 rounded-full mt-1.5 shadow-[0_0_0_4px_white]"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">1. Get the Mission</h3>
              <p className="text-lg text-gray-600">
                They check the app for a clear engineering goal. For example, "Construct a tower capable of bearing weight." After reading the instructions, the screen goes away. The heavy lifting happens strictly offline using the hardware.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] md:-left-[41px] bg-indigo-600 w-4 h-4 rounded-full mt-1.5 shadow-[0_0_0_4px_white]"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">2. Guided Help if Stuck</h3>
              <p className="text-lg text-gray-600">
                If they get stuck, they don't just get an instant answer. Our smart guide demands effort first ("What have you tried so far?"). We ask guiding questions to help them think it through themselves.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] md:-left-[41px] bg-indigo-600 w-4 h-4 rounded-full mt-1.5 shadow-[0_0_0_4px_white]"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">3. Verified Learning</h3>
              <p className="text-lg text-gray-600">
                They solve the puzzle and physically build it. They use their device to snap a photo proving the structure works. The app verifies the submission against the initial goal.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] md:-left-[41px] bg-indigo-600 w-4 h-4 rounded-full mt-1.5 shadow-[0_0_0_4px_white]"></div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">4. Progress Reports</h3>
              <p className="text-lg text-gray-600">
                That photo—along with stats on how much effort they exerted—is instantly organized into a Parent Proof Packet on your dashboard. They hit the next skill stage and unlock the next challenge.
              </p>
            </div>

          </div>
        </div>
      </section>
      
      <section className="px-6 py-20 bg-indigo-600 text-center">
         <h2 className="text-3xl font-bold text-white mb-6">Experience the process</h2>
         <Link href="/beta" className="rounded-full bg-white px-8 py-4 text-base font-bold text-indigo-600 shadow-sm hover:bg-gray-50 transition-colors inline-block">
            Join the Launch Pilot
         </Link>
      </section>
    </main>
  );
}
