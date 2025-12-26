import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createApplicationApi, getMyApplicationsApi, Application } from "@/src/lib/application.api";

interface ApplicationState {
    list: Application[];
    loading: boolean;
    error: string | null;
    submitSuccess: boolean;
}

const initialState: ApplicationState = {
    list: [],
    loading: false,
    error: null,
    submitSuccess: false,
};

export const fetchMyApplications = createAsyncThunk(
    "applications/fetchMy",
    async (_, { rejectWithValue }) => {
        try {
            const response = await getMyApplicationsApi();
            return response;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to fetch applications");
        }
    }
);

export const submitApplication = createAsyncThunk(
    "applications/submit",
    async (scholarshipId: string, { rejectWithValue }) => {
        try {
            const response = await createApplicationApi(scholarshipId);
            return response.data;
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Failed to apply");
        }
    }
);

const applicationSlice = createSlice({
    name: "applications",
    initialState,
    reducers: {
        resetSubmitSuccess(state) {
            state.submitSuccess = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchMyApplications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyApplications.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.docs || [];
            })
            .addCase(fetchMyApplications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Submit
            .addCase(submitApplication.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.submitSuccess = false;
            })
            .addCase(submitApplication.fulfilled, (state) => {
                state.loading = false;
                state.submitSuccess = true;
            })
            .addCase(submitApplication.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { resetSubmitSuccess } = applicationSlice.actions;
export default applicationSlice.reducer;
