"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Button from "@/src/components/ui/Button";
import api from "@/src/lib/api";

interface Scholarship {
  _id: string;
  title: string;
  description: string;
  amount: number;
}

export default function Home() {
  const [featured, setFeatured] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch random featured scholarships
    api.get("/scholarships?limit=3")
      .then(res => setFeatured(res.data.docs || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-10 px-6">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto text-center space-y-8 py-20">
        <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 animate-in fade-in slide-in-from-bottom-5 duration-1000">
          Unlock Your Future <br /> With The Right Scholarship
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
          We bridge the gap between talent and opportunity. Explore thousands of scholarships tailored to your academic profile.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Link href="/dashboard/scholarships">
            <Button className="px-8 py-4 text-lg">
              Find Scholarships
            </Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary" className="px-8 py-4 text-lg">
              Create Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Featured Section */}
      <div className="max-w-6xl mx-auto mt-20">
        <h2 className="text-3xl font-bold text-white mb-8 border-l-4 border-indigo-500 pl-4">
          Featured Opportunities
        </h2>

        {loading ? (
          <div className="text-white text-center">Loading opportunities...</div>
        ) : featured.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map((sch) => (
              <div key={sch._id} className="glass p-6 rounded-2xl border border-white/10 hover:-translate-y-1 transition-transform duration-300">
                <div className="h-12 w-12 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-4 text-2xl">
                  🎓
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{sch.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-3 mb-4 h-15">
                  {sch.description}
                </p>
                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  <span className="text-indigo-300 font-bold">${sch.amount}</span>
                  <Link href="/dashboard/scholarships">
                    <span className="text-sm text-gray-400 hover:text-white transition-colors">View Details →</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-400 text-center">Check back soon for new scholarships!</div>
        )}
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto mt-24 mb-12 grid md:grid-cols-3 gap-8 text-center glass p-10 rounded-3xl border border-white/5">
        <div>
          <h3 className="text-4xl font-bold text-white mb-2">$5M+</h3>
          <p className="text-indigo-300">Scholarships Awarded</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-white mb-2">10k+</h3>
          <p className="text-indigo-300">Active Students</p>
        </div>
        <div>
          <h3 className="text-4xl font-bold text-white mb-2">98%</h3>
          <p className="text-indigo-300">Success Rate</p>
        </div>
      </div>
    </div>
  );
}
