import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchReferrals = createAsyncThunk('referrals/fetchReferrals', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/referrals');
        return response.data; // Adjusted as per typical response structure
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch referrals');
    }
});

export const createReferral = createAsyncThunk('referrals/createReferral', async (data, { rejectWithValue }) => {
    try {
        const response = await api.post('/referrals/generate', data);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create referral');
    }
});

export const deleteReferral = createAsyncThunk('referrals/deleteReferral', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/referrals/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete referral');
    }
});

const referralSlice = createSlice({
    name: 'referrals',
    initialState: {
        list: [],
        stats: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchReferrals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReferrals.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.referrals || [];
                state.stats = action.payload.stats || null;
            })
            .addCase(fetchReferrals.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createReferral.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            .addCase(deleteReferral.fulfilled, (state, action) => {
                state.list = state.list.filter(item => item.id !== action.payload);
            });
    },
});

export default referralSlice.reducer;
