import api from "./api";

export interface Scholarship {
    _id: string;
    title: string;
    provider: string;
    description: string;
    amount: number;
    seats: number;
    startDate: string;
    endDate: string;
    deadline?: string;
    educationLevel?: string;
    criteria?: {
        minScore?: number;
        minIncome?: number;
    };
    status: "DRAFT" | "PUBLISHED" | "CLOSED";
    createdAt: string;
}

export const getScholarshipsApi = async () => {
    const res = await api.get("/scholarships");
    return res.data; // Expecting { success: true, count: number, data: Scholarship[] }
};

export const getScholarshipByIdApi = async (id: string) => {
    const res = await api.get(`/scholarships/${id}`);
    return res.data;
};
