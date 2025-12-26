"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/src/lib/api";
import StatusBadge from "@/src/components/ui/StatusBadge";
import { Application } from "@/src/lib/application.api";

export default function AdminApplicationsPage() {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/applications?limit=100")
            .then(res => setApplications(res.data.docs || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Student Applications</h1>

            <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="w-full text-left text-gray-300">
                    <thead className="bg-white/5 text-xs uppercase font-semibold text-gray-400">
                        <tr>
                            <th className="p-4">Applicant</th>
                            <th className="p-4">Scholarship</th>
                            <th className="p-4">Date</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>
                        ) : applications.length === 0 ? (
                            <tr><td colSpan={5} className="p-4 text-center">No applications found.</td></tr>
                        ) : (
                            applications.map((app: any) => (
                                <tr key={app._id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{app.applicant?.email || app.applicant}</td>
                                    <td className="p-4">{app.scholarship?.title || "Unknown Scholarship"}</td>
                                    <td className="p-4">{new Date(app.createdAt).toLocaleDateString()}</td>
                                    <td className="p-4"><StatusBadge status={app.status} /></td>
                                    <td className="p-4">
                                        <Link
                                            href={`/admin/applications/${app._id}`}
                                            className="text-indigo-400 hover:text-indigo-300 font-medium text-sm"
                                        >
                                            Review
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
