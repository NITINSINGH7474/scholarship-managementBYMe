"use client";

import { useEffect, useState } from "react";
import api from "@/src/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalApplications: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd have a dedicated stats endpoint.
    // For now, we'll fetch list and count manually or mock it.
    // Let's mock fetching applications list to count stats for demonstration
    // or assume we add a stats endpoint later. 
    // We will simulate fetching stats here.

    api.get("/applications?limit=1000") // Fetch all for stats (simplified)
      .then(res => {
        const apps: any[] = res.data.docs || [];
        setStats({
          totalApplications: apps.length,
          pending: apps.filter(a => a.status === 'SUBMITTED' || a.status === 'IN_REVIEW').length,
          approved: apps.filter(a => a.status === 'AWARDED' || a.status === 'SHORTLISTED').length,
          rejected: apps.filter(a => a.status === 'REJECTED').length,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-white">Loading stats...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-white">Dashboard Overview</h2>
        <p className="text-gray-400">Welcome back, Admin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value={stats.totalApplications}
          icon="📝"
          color="bg-blue-500/10 border-blue-500/20 text-blue-400"
        />
        <StatsCard
          title="Pending Review"
          value={stats.pending}
          icon="⏳"
          color="bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
        />
        <StatsCard
          title="Approved"
          value={stats.approved}
          icon="✅"
          color="bg-green-500/10 border-green-500/20 text-green-400"
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          icon="❌"
          color="bg-red-500/10 border-red-500/20 text-red-400"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors">
            Create Scholarship
          </button>
          <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors">
            Review Pending
          </button>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, color }: any) {
  return (
    <div className={`p-6 rounded-2xl border ${color} flex items-center justify-between`}>
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-bold">{value}</h3>
      </div>
      <div className="text-4xl opacity-80">{icon}</div>
    </div>
  );
}
