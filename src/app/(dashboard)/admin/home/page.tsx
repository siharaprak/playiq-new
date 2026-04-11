import { Users, Truck, Activity, Filter } from 'lucide-react';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdminDashboard({ searchParams }: { searchParams: { status?: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Enforce Admin Role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  
  if (profile?.role !== 'admin') {
    // If a parent or student tries to access, bounce them to their respective home
    redirect(`/${profile?.role || 'parent'}/home`);
  }

  // Fetch Beta Applications
  let query = supabase.from('beta_applications').select('*');
  
  if (searchParams?.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status);
  }

  const { data: applications, error } = await query.order('created_at', { ascending: false });

  // For metrics, fetch raw total pending (optional, using applications map for now)
  const { data: allApps } = await supabase.from('beta_applications').select('status');
  const pendingCount = allApps?.filter(a => a.status === 'pending').length || 0;
  const totalCount = allApps?.length || 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-12 border-b border-slate-200 pb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">PlayIQ <span className="bg-slate-800 text-white text-xs px-2 py-1 rounded">ADMIN</span></h1>
            <p className="text-slate-500 text-sm mt-1">{user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button className="text-sm border border-slate-300 bg-white px-4 py-2 rounded shadow-sm hover:bg-slate-50 transition-colors">
              Sign Out
            </button>
          </form>
        </header>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-indigo-100 rounded-lg text-indigo-700"><Users className="w-6 h-6" /></div>
             <div>
               <p className="text-sm text-slate-500 font-medium">Total Applications</p>
               <p className="text-2xl font-bold text-slate-900">{totalCount} / 25</p>
             </div>
           </div>
           
           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-amber-100 rounded-lg text-amber-700"><Truck className="w-6 h-6" /></div>
             <div>
               <p className="text-sm text-slate-500 font-medium">Paid (Needs Fulfillment)</p>
               <p className="text-2xl font-bold text-slate-900">{allApps?.filter(a => a.status === 'paid').length || 0}</p>
             </div>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
             <div className="p-3 bg-emerald-100 rounded-lg text-emerald-700"><Activity className="w-6 h-6" /></div>
             <div>
               <p className="text-sm text-slate-500 font-medium">System Health</p>
               <p className="text-2xl font-bold text-slate-900">Nominal</p>
             </div>
           </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center overflow-x-auto">
            <h2 className="font-bold text-slate-800 whitespace-nowrap mr-4">Beta Cohort Intake</h2>
            <div className="flex bg-white rounded-md border border-slate-200 shadow-sm p-1 gap-1 text-sm whitespace-nowrap">
               <Link href="/admin/home" className={`px-3 py-1 rounded-md transition-colors ${!searchParams?.status || searchParams.status === 'all' ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}>All</Link>
               <Link href="/admin/home?status=paid" className={`px-3 py-1 rounded-md transition-colors ${searchParams?.status === 'paid' ? 'bg-emerald-100 font-semibold text-emerald-800' : 'text-slate-500 hover:bg-slate-50'}`}>Paid</Link>
               <Link href="/admin/home?status=checkout_started" className={`px-3 py-1 rounded-md transition-colors ${searchParams?.status === 'checkout_started' ? 'bg-amber-100 font-semibold text-amber-800' : 'text-slate-500 hover:bg-slate-50'}`}>Started</Link>
               <Link href="/admin/home?status=canceled" className={`px-3 py-1 rounded-md transition-colors ${searchParams?.status === 'canceled' ? 'bg-red-100 font-semibold text-red-800' : 'text-slate-500 hover:bg-slate-50'}`}>Canceled</Link>
            </div>
          </div>
          
          {applications && applications.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3">Parent Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Teen Age Band</th>
                    <th className="px-6 py-3">Shipping Zip</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Applied At</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b border-slate-100 hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">{app.parent_full_name}</td>
                      <td className="px-6 py-4 text-slate-600">{app.email}</td>
                      <td className="px-6 py-4 text-slate-600">{app.child_age_band}</td>
                      <td className="px-6 py-4 text-slate-600">{app.shipping_zip_code}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                          ${app.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : ''}
                          ${app.status === 'checkout_started' ? 'bg-amber-100 text-amber-800' : ''}
                          ${app.status === 'canceled' ? 'bg-red-100 text-red-800' : ''}
                          ${app.status === 'pending' ? 'bg-slate-200 text-slate-700' : ''}
                          ${app.status === 'fulfilled' ? 'bg-indigo-100 text-indigo-800' : ''}
                        `}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(app.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center">
              <Filter className="w-8 h-8 text-slate-300 mb-3" />
              <p>No applications found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
