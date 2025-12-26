import React from "react";
import Button from "./Button";
import { Scholarship } from "@/src/lib/scholarship.api";

interface ScholarshipCardProps {
    scholarship: Scholarship;
    onApply: (id: string) => void;
}

export default function ScholarshipCard({ scholarship, onApply }: ScholarshipCardProps) {
    return (
        <div className="glass p-6 rounded-2xl border border-white/10 hover:border-indigo-500/50 transition-all group">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                        {scholarship.title}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1">{scholarship.provider}</p>
                </div>
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-xs font-medium border border-indigo-500/20">
                    {scholarship.status}
                </span>
            </div>

            <p className="text-gray-300 text-sm line-clamp-2 mb-6 h-10">
                {scholarship.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                    <p className="text-gray-500 text-xs text-center border-b border-white/5 pb-1 mb-1">Amount</p>
                    <p className="text-white font-semibold text-center">${scholarship.amount}</p>
                </div>
                <div className="p-3 rounded-lg bg-black/20 border border-white/5">
                    <p className="text-gray-500 text-xs text-center border-b border-white/5 pb-1 mb-1">Deadline</p>
                    <p className="text-white font-semibold text-center">
                        {new Date(scholarship.endDate).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <Button
                onClick={() => onApply(scholarship._id)}
                className="w-full"
                disabled={scholarship.status === "CLOSED"}
            >
                {scholarship.status === "CLOSED" ? "Closed" : "Apply Now"}
            </Button>
        </div>
    );
}
