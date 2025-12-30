"use client";

import Link from "next/link";
import StatsCard from "@/src/components/ui/StatsCard";
import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchMyApplications } from "@/src/store/slices/application.slice";


export default function Dashboard() {
  const dispatch = useAppDispatch();
  const { list: applications } = useAppSelector((s) => s.applications);

  useEffect(() => {
    dispatch(fetchMyApplications());
  }, [dispatch]);

  // Calculate stats from applications
  const stats = useMemo(() => {
    const total = applications.length;
    const pending = applications.filter(app =>
      app.status === 'SUBMITTED' || app.status === 'IN_REVIEW' || app.status === 'DRAFT'
    ).length;
    const approved = applications.filter(app =>
      app.status === 'AWARDED' || app.status === 'SHORTLISTED'
    ).length;
    const rejected = applications.filter(app => app.status === 'REJECTED').length;

    return { total, pending, approved, rejected };
  }, [applications]);
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="glass p-8 md:p-12 rounded-3xl border border-white/10 bg-gradient-to-r from-gray-900 via-indigo-950 to-gray-900 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Welcome back, <br />
            <span className="text-indigo-400">Student!</span>
          </h1>
          <p className="text-gray-300 text-lg max-w-xl mb-8">
            Track your applications, discover new opportunities, and achieve your academic goals.
          </p>
          <div className="flex gap-4">
            <Link
              href="/dashboard/scholarships"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/20"
            >
              Browse Scholarships
            </Link>
            <Link
              href="/dashboard/applications"
              className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-green-500/20"
            >
              My Applications
            </Link>
            <Link
              href="/dashboard/profile"
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-all border border-white/10"
            >
              View Profile
            </Link>
          </div>
        </div>
        {/* Abstract decorative circle */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Applications"
          value={stats.total}
          subtitle={`${stats.total} total`}
          icon="📄"
        />
        <StatsCard
          title="Pending Review"
          value={stats.pending}
          subtitle="Waiting for decision"
          icon="🕒"
        />
        <StatsCard
          title="Approved"
          value={stats.approved}
          subtitle="Scholarships awarded"
          icon="✅"
        />
        <StatsCard
          title="Rejected"
          value={stats.rejected}
          subtitle="Better luck next time"
          icon="❌"
        />
      </div>

      {/* Main Content Split */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Activity Chart Section (Placeholder) */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl border border-white/10 min-h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-indigo-400">📊</span> Application Activity
          </h3>
          <div className="h-64 flex items-center justify-center border-l border-b border-white/10">
            <p className="text-gray-500">Activity Chart Placeholder</p>
          </div>
        </div>

        {/* Recommended Section */}
        <div className="lg:col-span-1 glass p-6 rounded-2xl border border-white/10 bg-indigo-600">
          <h3 className="text-xl font-bold text-white mb-2">Recommended for You</h3>
          <p className="text-indigo-200 text-sm mb-6">Opportunities matching your profile</p>

          <div className="space-y-4">
            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
              <h4 className="font-bold text-white">Future Tech Scholarship</h4>
              <p className="text-indigo-200 text-xs mt-1">Deadline: Dec 29</p>
              <div className="mt-3 inline-block px-2 py-1 bg-white/20 rounded text-xs text-white font-mono">
                $5,000
              </div>
            </div>
            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
              <h4 className="font-bold text-white">Merit Excellence Award</h4>
              <p className="text-indigo-200 text-xs mt-1">Deadline: Jan 15</p>
              <div className="mt-3 inline-block px-2 py-1 bg-white/20 rounded text-xs text-white font-mono">
                $2,500
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
