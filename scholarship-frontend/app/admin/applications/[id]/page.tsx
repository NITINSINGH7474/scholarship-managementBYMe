"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/src/lib/api";
import Button from "@/src/components/ui/Button";
import StatusBadge from "@/src/components/ui/StatusBadge";
import Modal from "@/src/components/ui/Modal";

export default function ApplicationReviewPage() {
    const params = useParams();
    const router = useRouter();
    const [app, setApp] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [remarkModalOpen, setRemarkModalOpen] = useState(false);
    const [actionType, setActionType] = useState<"AWARDED" | "REJECTED" | null>(null);
    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        if (params.id) {
            // Fetch application
            api.get(`/applications/${params.id}`)
                .then(async (res) => {
                    const application = res.data.application;
                    setApp(application);
                    // Try fetch profile if applicant exists
                    if (application.applicant?._id || application.applicant) {
                        const userId = application.applicant._id || application.applicant;
                        try {
                            const profRes = await api.get(`/profile/${userId}`);
                            setProfile(profRes.data.profile);
                        } catch (e) { console.log('Profile fetch failed', e) }
                    }
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [params.id]);

    const handleActionClick = (type: "AWARDED" | "REJECTED") => {
        setActionType(type);
        setRemarks("");
        setRemarkModalOpen(true);
    };

    const confirmAction = async () => {
        if (!actionType || !app) return;
        try {
            await api.put(`/applications/${app._id}/status`, { // Need to ensure backend supports generic status update or specific endpoint
                status: actionType,
                remarks: remarks
            });
            alert(`Application ${actionType === 'AWARDED' ? 'Approved' : 'Rejected'} successfully!`);
            setRemarkModalOpen(false);
            router.refresh();
            router.push("/admin/applications");
        } catch (err) {
            alert("Failed to update status");
        }
    };

    if (loading || !app) return <div className="p-8 text-white">Loading details...</div>;

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Application Review</h1>
                    <div className="flex items-center gap-3">
                        <span className="text-gray-400">ID: {app._id}</span>
                        <StatusBadge status={app.status} />
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleActionClick("AWARDED")}
                    >
                        Approve
                    </Button>
                    <Button
                        className="bg-red-600 hover:bg-red-700"
                        onClick={() => handleActionClick("REJECTED")}
                    >
                        Reject
                    </Button>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid md:grid-cols-3 gap-6">

                {/* Left Col: Applicant Info */}
                <div className="col-span-2 space-y-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl space-y-4">
                        <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2">Applicant Details</h3>
                        {profile ? (
                            <div className="grid grid-cols-2 gap-4 text-gray-300">
                                <div>
                                    <span className="text-gray-500 text-sm block">Full Name</span>
                                    {profile.extra?.fullName || "N/A"}
                                </div>
                                <div>
                                    <span className="text-gray-500 text-sm block">Email</span>
                                    {app.applicant?.email || "N/A"}
                                </div>
                                <div>
                                    <span className="text-gray-500 text-sm block">Phone</span>
                                    {profile.extra?.phone || "N/A"}
                                </div>
                                <div>
                                    <span className="text-gray-500 text-sm block">Family Income</span>
                                    ${profile.family?.annualIncome || 0}
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-400">No profile data available for this user.</p>
                        )}
                    </div>

                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2 mb-4">Scholarship Info</h3>
                        <div className="text-gray-300">
                            <p><strong className="text-white">Title:</strong> {app.scholarship?.title}</p>
                            <p><strong className="text-white">Provider:</strong> {app.scholarship?.provider}</p>
                            <p><strong className="text-white">Amount:</strong> ${app.scholarship?.amount}</p>
                        </div>
                    </div>
                </div>

                {/* Right Col: Documents / Remarks */}
                <div className="space-y-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-xl">
                        <h3 className="text-xl font-bold text-white border-b border-white/10 pb-2 mb-4">Documents</h3>
                        {app.documents && app.documents.length > 0 ? (
                            <ul className="space-y-2">
                                {app.documents.map((doc: any) => (
                                    <li key={doc._id}>
                                        <a
                                            href={`/api/documents/${doc._id}`}
                                            target="_blank"
                                            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-2"
                                        >
                                            📄 {doc.originalName || "Document"}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic">No documents uploaded.</p>
                        )}
                    </div>

                    {app.remarks && (
                        <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                            <h4 className="text-yellow-400 font-bold mb-1">Admin Remarks</h4>
                            <p className="text-yellow-100 text-sm">{app.remarks}</p>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={remarkModalOpen}
                onClose={() => setRemarkModalOpen(false)}
                title={actionType === "AWARDED" ? "Approve Application" : "Reject Application"}
                footer={
                    <div className="flex justify-end gap-2 w-full">
                        <Button variant="secondary" onClick={() => setRemarkModalOpen(false)}>Cancel</Button>
                        <Button
                            className={actionType === "AWARDED" ? "bg-green-600" : "bg-red-600"}
                            onClick={confirmAction}
                        >
                            Confirm {actionType === "AWARDED" ? "Approve" : "Reject"}
                        </Button>
                    </div>
                }
            >
                <div className="space-y-3">
                    <p className="text-gray-300">
                        Are you sure you want to {actionType?.toLowerCase()} this application?
                        Please add remarks below.
                    </p>
                    <textarea
                        className="w-full bg-black/30 border border-white/20 rounded p-3 text-white focus:ring-2 ring-indigo-500"
                        rows={4}
                        placeholder="Enter remarks here..."
                        value={remarks}
                        onChange={(e) => setRemarks(e.target.value)}
                    />
                </div>
            </Modal>
        </div>
    );
}
