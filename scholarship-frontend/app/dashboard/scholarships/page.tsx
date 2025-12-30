"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchScholarships } from "@/src/store/slices/scholarship.slice";
import { submitApplication, resetSubmitSuccess } from "@/src/store/slices/application.slice";
import ScholarshipCard from "@/src/components/ui/ScholarshipCard";
import Modal from "@/src/components/ui/Modal";
import Button from "@/src/components/ui/Button";
import ScholarshipFilter from "@/src/components/ui/ScholarshipFilter";

export default function ScholarshipsPage() {
    const dispatch = useAppDispatch();
    const { list: scholarships, loading, error } = useAppSelector((s) => s.scholarships);
    const { submitSuccess, error: applicationError } = useAppSelector((s) => s.applications);

    const [selectedScholarship, setSelectedScholarship] = useState<string | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        dispatch(fetchScholarships());
    }, [dispatch]);

    useEffect(() => {
        if (submitSuccess) {
            setSelectedScholarship(null);
            setShowSuccessModal(true);
            dispatch(resetSubmitSuccess());
        }
    }, [submitSuccess, dispatch]);

    const handleApplyClick = (id: string) => {
        console.log("Applying to scholarship:", id);
        setSelectedScholarship(id);
    };

    const confirmApply = () => {
        if (selectedScholarship) {
            dispatch(submitApplication(selectedScholarship));
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Discover financial aid opportunities tailored for you.</h1>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <ScholarshipFilter />
                </div>

                {/* Main Grid */}
                <div className="lg:col-span-3 space-y-6">
                    {loading && <div className="text-center text-white">Loading scholarships...</div>}

                    {error && (
                        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-200">
                            {error}
                        </div>
                    )}

                    {!loading && scholarships.length === 0 && (
                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                            <p className="text-gray-400">No active scholarships found at the moment.</p>
                        </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-6">
                        {scholarships.map((sch) => (
                            <ScholarshipCard
                                key={sch._id}
                                scholarship={sch}
                                onApply={handleApplyClick}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {selectedScholarship && (() => {
                const sch = scholarships.find(s => s._id === selectedScholarship);
                return (
                    <Modal
                        isOpen={!!selectedScholarship}
                        onClose={() => setSelectedScholarship(null)}
                        title="Confirm Application"
                        footer={
                            <>
                                <Button variant="outline" onClick={() => setSelectedScholarship(null)}>
                                    Cancel
                                </Button>
                                <Button onClick={confirmApply}>
                                    Confirm Apply
                                </Button>
                            </>
                        }
                    >
                        <div className="space-y-4">
                            <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                                <h4 className="text-lg font-bold text-white">{sch?.title}</h4>
                                <p className="text-gray-400 text-sm">{sch?.provider}</p>
                                <div className="mt-2 text-indigo-300 font-semibold">${sch?.amount}</div>
                            </div>
                            <p className="text-gray-300">
                                Are you sure you want to apply for this scholarship?
                                By clicking confirm, you agree to submit your profile for review.
                            </p>
                            <div className="flex items-center gap-2 p-3 bg-indigo-500/10 rounded border border-indigo-500/20">
                                <span className="text-indigo-400">ℹ️</span>
                                <p className="text-xs text-indigo-200">
                                    Your application will be set to <strong>SUBMITTED</strong> status immediately.
                                </p>
                            </div>
                        </div>
                    </Modal>
                );
            })()}

            {/* Success Modal */}
            <Modal
                isOpen={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                title="🎉 Application Submitted!"
                footer={
                    <Button onClick={() => setShowSuccessModal(false)} className="w-full">
                        Close
                    </Button>
                }
            >
                <div className="space-y-4 text-center">
                    <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                        <span className="text-4xl">✅</span>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white mb-2">Successfully Applied!</h3>
                        <p className="text-gray-300">
                            Your scholarship application has been submitted successfully.
                            You can track its status in the "My Applications" section.
                        </p>
                    </div>
                    <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
                        <p className="text-sm text-indigo-200">
                            <strong>What's next?</strong><br />
                            The admissions team will review your application. You'll be notified once a decision is made.
                        </p>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
