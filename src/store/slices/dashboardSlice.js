import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            // Use Promise.allSettled to ensure that if one call fails (e.g. traffic), the other proceeds
            const results = await Promise.allSettled([
                api.get('/admin/stats/overview'),
                api.post('/system/track', { page: 'dashboard' }).then(() => api.get('/system/traffic'))
            ]);

            const statsRes = results[0];
            const trafficRes = results[1];

            // Debug logging for failures
            if (statsRes.status === 'rejected') {
                console.error('Dashboard Stats Failed:', statsRes.reason);
            }
            if (trafficRes.status === 'rejected') {
                console.error('Dashboard Traffic Failed:', trafficRes.reason);
            }

            return {
                stats: statsRes.status === 'fulfilled' ? (statsRes.value.data.data || statsRes.value.data) : null,
                traffic: trafficRes.status === 'fulfilled' ? (trafficRes.value.data.data || trafficRes.value.data) : null
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch dashboard stats');
        }
    }
);

const initialState = {
    stats: null,
    traffic: null,
    loading: false,
    error: null,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.stats;
                state.traffic = action.payload.traffic;
            })
            .addCase(fetchStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;
