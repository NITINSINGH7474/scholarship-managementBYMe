import api from "./api";

export interface Application {
    _id: string;
    scholarship: {
        _id: string;
        title: string;
        provider: string;
    };
    applicant: string; // User ID
    status: "DRAFT" | "SUBMITTED" | "IN_REVIEW" | "SHORTLISTED" | "AWARDED" | "REJECTED" | "ARCHIVED";
    submittedAt: string;
}

export const getMyApplicationsApi = async () => {
    const res = await api.get("/applications/my-applications");
    return res.data; // Expecting { success: true, count: number, data: Application[] }
};

export const createApplicationApi = async (scholarshipId: string) => {
    // 1. Create Draft
    const res = await api.post(`/scholarships/${scholarshipId}/apply`, {});
    const applicationId = res.data.application._id;

    // 2. Submit Draft (Auto-submit for now to simplify UI)
    const submitRes = await api.post(`/applications/${applicationId}/submit`, {});
    return submitRes.data;
};
