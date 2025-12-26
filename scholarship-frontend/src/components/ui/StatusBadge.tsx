import React from "react";

type StatusType = "DRAFT" | "SUBMITTED" | "IN_REVIEW" | "SHORTLISTED" | "AWARDED" | "REJECTED" | "ARCHIVED";

const statusColors: Record<StatusType, string> = {
    DRAFT: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    SUBMITTED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    IN_REVIEW: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    SHORTLISTED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    AWARDED: "bg-green-500/10 text-green-400 border-green-500/20",
    REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
    ARCHIVED: "bg-gray-700/10 text-gray-500 border-gray-700/20",
};

export default function StatusBadge({ status }: { status: string }) {
    const safeStatus = (status as StatusType) || "DRAFT";
    const styles = statusColors[safeStatus] || statusColors.DRAFT;

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles}`}>
            {status.replace("_", " ")}
        </span>
    );
}
