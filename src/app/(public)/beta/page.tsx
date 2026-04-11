import Link from 'next/link';
import { BetaForm } from '@/components/forms/BetaForm';

export default function Beta() {
  return (
    <main className="w-full">
      <section className="px-6 py-20 bg-slate-900 text-center border-b border-slate-800">
        <div className="mx-auto max-w-3xl">
          <span className="text-indigo-400 font-semibold tracking-wide uppercase text-sm">Founding Cohort</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-6">
            Apply for Pilot Access
          </h1>
          <p className="text-xl text-slate-300">
            We are opening exactly <strong>25 spots</strong> for the inaugural launch of Course 1. 
            Because we rely heavily on direct feedback to improve the curriculum, we are keeping this first wave small and intimate.
          </p>
        </div>
      </section>

      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-5xl grid md:grid-cols-2 gap-16">
          
          <div>
             <h2 className="text-3xl font-bold text-gray-900 mb-6">What Families Receive</h2>
             <ul className="space-y-4 mb-8">
               <li className="flex items-center text-lg text-gray-600">
                 <span className="text-indigo-600 mr-3">✓</span> Full physical hardware kit shipped immediately.
               </li>
               <li className="flex items-center text-lg text-gray-600">
                 <span className="text-indigo-600 mr-3">✓</span> 12 weeks of access to the guided app.
               </li>
               <li className="flex items-center text-lg text-gray-600">
                 <span className="text-indigo-600 mr-3">✓</span> Live access to your Parent Proof Packet dashboard.
               </li>
               <li className="flex items-center text-lg text-gray-600">
                 <span className="text-indigo-600 mr-3">✓</span> Direct input into the evolution of Course 2.
               </li>
             </ul>
             
             <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-xl">
               <h3 className="font-bold text-indigo-900 text-lg">Pilot Pricing Structure</h3>
               <p className="text-indigo-800 mt-2"><strong>[Pricing Placeholder]</strong> includes all hardware and the software license. Hardware arrives in 3-5 business days.</p>
             </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Application</h3>
            <BetaForm />
          </div>
        </div>
      </section>
      
      <section className="px-6 py-20 bg-gray-50 border-t border-gray-200 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions before applying?</h2>
        <Link href="/contact" className="text-indigo-600 font-semibold text-lg hover:underline">
          View our FAQs and Contact Support
        </Link>
      </section>
    </main>
  );
}
