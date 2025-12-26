"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchMyApplications } from "@/src/store/slices/application.slice";
import StatusBadge from "@/src/components/ui/StatusBadge";

export default function MyApplicationsPage() {
    const dispatch = useAppDispatch();
    const { list: applications, loading, error } = useAppSelector((s) => s.applications);

    useEffect(() => {
        dispatch(fetchMyApplications());
    }, [dispatch]);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
                    My Applications
                </h1>
                <p className="text-gray-400 mt-2">
                    Track the status of your submitted applications.
                </p>
            </div>

            {loading && <div className="text-center text-white">Loading applications...</div>}

            {error && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200">
                    {error}
                </div>
            )}

            {!loading && applications.length === 0 && (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                    <p className="text-gray-400">You haven't submitted any applications yet.</p>
                </div>
            )}

            <div className="space-y-4">
                {applications.map((app) => (
                    <div
                        key={app._id}
                        className="glass p-6 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    >
                        <div>
                            <h3 className="text-lg font-bold text-white">{app.scholarship.title}</h3>
                            <p className="text-gray-400 text-sm">{app.scholarship.provider}</p>
                            <p className="text-gray-500 text-xs mt-2">
                                Applied on {new Date(app.submittedAt).toLocaleDateString()}
                            </p>
                        </div>
                        <StatusBadge status={app.status} />
                    </div>
                ))}
            </div>
        </div>
    );
}
