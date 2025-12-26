import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="space-y-12">
      <div className="glass p-8 rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-300 text-lg max-w-2xl">
          Your central hub for managing scholarship applications. Browse opportunities, track your status, and stay updated.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Link
          href="/dashboard/scholarships"
          className="group glass p-8 rounded-2xl border border-white/10 hover:bg-white/5 transition-all"
        >
          <div className="h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            🔍
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Browse Scholarships</h2>
          <p className="text-gray-400">Explore available scholarships and apply today.</p>
        </Link>

        <Link
          href="/dashboard/applications"
          className="group glass p-8 rounded-2xl border border-white/10 hover:bg-white/5 transition-all"
        >
          <div className="h-12 w-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            📝
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">My Applications</h2>
          <p className="text-gray-400">Track the status of your submitted applications.</p>
        </Link>
      </div>
    </div>
  );
}
