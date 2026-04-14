import React from 'react';

export default async function AdminModule1Page() {
  return (
    <div className="flex flex-col min-h-screen px-6 py-12 max-w-6xl mx-auto">
      <header className="mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-500">Admin Operations • Module 1</h1>
        <p className="text-muted-foreground mt-2">Cohort overview for AI Learning Code.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Completion Rate</h3>
          <p className="text-3xl font-bold">42%</p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Avg Quiz Score</h3>
          <p className="text-3xl font-bold">88%</p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Boss Battle Pass</h3>
          <p className="text-3xl font-bold">91%</p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-1">Blocked Students</h3>
          <p className="text-3xl font-bold text-red-500">3</p>
        </div>
      </div>

      <section className="bg-card text-card-foreground p-6 rounded-xl border shadow-sm overflow-x-auto">
        <h2 className="text-xl font-bold mb-4 border-b pb-2">Student Ledger</h2>
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
            <tr>
              <th className="px-4 py-3 rounded-tl-lg">Student</th>
              <th className="px-4 py-3">Node Progress</th>
              <th className="px-4 py-3">Teach-Backs</th>
              <th className="px-4 py-3">Quiz</th>
              <th className="px-4 py-3 line-clamp-1">Artifact Status</th>
              <th className="px-4 py-3 rounded-tr-lg">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b last:border-0 hover:bg-muted/30">
              <td className="px-4 py-4 font-medium">Iris V.</td>
              <td className="px-4 py-4">4/4</td>
              <td className="px-4 py-4 text-green-500">All Passed</td>
              <td className="px-4 py-4 font-bold">95%</td>
              <td className="px-4 py-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Approved</span></td>
              <td className="px-4 py-4"><button className="text-indigo-500 font-medium hover:underline">View Profile</button></td>
            </tr>
            <tr className="border-b last:border-0 hover:bg-muted/30">
              <td className="px-4 py-4 font-medium">John D.</td>
              <td className="px-4 py-4">2/4</td>
              <td className="px-4 py-4 text-amber-500">1 Revise</td>
              <td className="px-4 py-4 text-muted-foreground">-</td>
              <td className="px-4 py-4"><span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Pending</span></td>
              <td className="px-4 py-4"><button className="text-indigo-500 font-medium hover:underline">View Profile</button></td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
