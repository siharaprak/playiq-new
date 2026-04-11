export default function Contact() {
  return (
    <main className="w-full">
      <section className="px-6 py-20 bg-slate-900 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-6">
          Support & FAQs
        </h1>
      </section>

      <section className="px-6 py-20 bg-white">
        <div className="mx-auto max-w-4xl grid md:grid-cols-2 gap-16">
          
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Us</h2>
            <p className="text-gray-600 mb-8">We respond to all parent inquiries within 24 hours.</p>
            <form className="space-y-4">
               <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-indigo-500 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows={4} className="w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-indigo-500 focus:ring-indigo-500"></textarea>
              </div>
              <button type="button" className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-md shadow hover:bg-indigo-500 transition-colors">
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
            <div className="space-y-6">
               <div className="border-l-4 border-indigo-600 pl-4 py-1">
                 <h3 className="font-bold text-gray-900">What is the return policy?</h3>
                 <p className="text-gray-600 mt-1 text-sm">During the pilot launch, if your teen does not engage with the kit within the first 14 days, you may return the hardware for a full refund.</p>
               </div>
               <div className="border-l-4 border-indigo-600 pl-4 py-1">
                 <h3 className="font-bold text-gray-900">When does the hardware ship?</h3>
                 <p className="text-gray-600 mt-1 text-sm">We process cohort hardware shipments within 48 hours. Transit generally takes 3-5 business days.</p>
               </div>
               <div className="border-l-4 border-indigo-600 pl-4 py-1">
                 <h3 className="font-bold text-gray-900">Do they need their own iPad?</h3>
                 <p className="text-gray-600 mt-1 text-sm">The digital app handles missions and artifact capture, so any modern smartphone or tablet with a camera will work perfectly.</p>
               </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
