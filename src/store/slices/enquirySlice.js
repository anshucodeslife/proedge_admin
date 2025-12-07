import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios'; // Assuming axios instance

export const fetchEnquiries = createAsyncThunk('enquiries/fetchEnquiries', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/enquiries');
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch enquiries');
    }
});

export const updateEnquiryStatus = createAsyncThunk('enquiries/updateStatus', async ({ id, status }, { rejectWithValue }) => {
    try {
        const response = await api.put(`/enquiries/${id}/status`, { status });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update status');
    }
});

export const deleteEnquiry = createAsyncThunk('enquiries/deleteEnquiry', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/enquiries/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete enquiry');
    }
});

const enquirySlice = createSlice({
    name: 'enquiries',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchEnquiries.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEnquiries.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchEnquiries.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update Status
            .addCase(updateEnquiryStatus.fulfilled, (state, action) => {
                const index = state.list.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteEnquiry.fulfilled, (state, action) => {
                state.list = state.list.filter(item => item.id !== action.payload);
            });
    },
});

export default enquirySlice.reducer;
