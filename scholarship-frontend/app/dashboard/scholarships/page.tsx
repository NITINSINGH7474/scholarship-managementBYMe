"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { fetchScholarships } from "@/src/store/slices/scholarship.slice";
import { submitApplication, resetSubmitSuccess } from "@/src/store/slices/application.slice";
import ScholarshipCard from "@/src/components/ui/ScholarshipCard";
import Modal from "@/src/components/ui/Modal";
import Button from "@/src/components/ui/Button";

export default function ScholarshipsPage() {
    const dispatch = useAppDispatch();
    const { list: scholarships, loading, error } = useAppSelector((s) => s.scholarships);
    const { submitSuccess } = useAppSelector((s) => s.applications);

    useEffect(() => {
        dispatch(fetchScholarships());
    }, [dispatch]);

    useEffect(() => {
        if (submitSuccess) {
            alert("Application submitted successfully!");
            dispatch(resetSubmitSuccess());
        }
    }, [submitSuccess, dispatch]);

    const [selectedScholarship, setSelectedScholarship] = useState<string | null>(null);

    const handleApplyClick = (id: string) => {
        console.log("Applying to scholarship:", id);
        setSelectedScholarship(id);
    };

    const confirmApply = () => {
        if (selectedScholarship) {
            dispatch(submitApplication(selectedScholarship));
            setSelectedScholarship(null);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
                    Browse Scholarships
                </h1>
                <p className="text-gray-400 mt-2">
                    Find and apply for scholarships that match your profile.
                </p>
            </div>

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

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scholarships.map((sch) => (
                    <ScholarshipCard
                        key={sch._id}
                        scholarship={sch}
                        onApply={handleApplyClick}
                    />
                ))}
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
        </div>
    );
}
