import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getScholarshipsApi, Scholarship } from "@/src/lib/scholarship.api";

interface ScholarshipState {
    list: Scholarship[];
    loading: boolean;
    error: string | null;
}

const initialState: ScholarshipState = {
    list: [],
    loading: false,
    error: null,
};

export const fetchScholarships = createAsyncThunk(
    "scholarships/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getScholarshipsApi();
            return response;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch scholarships");
        }
    }
);

const scholarshipSlice = createSlice({
    name: "scholarships",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchScholarships.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchScholarships.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.docs || [];
            })
            .addCase(fetchScholarships.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default scholarshipSlice.reducer;
