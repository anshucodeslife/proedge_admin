import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchAdmissions = createAsyncThunk('admissions/fetchAdmissions', async (_, { rejectWithValue }) => {
    try {
        const response = await api.get('/admissions');
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch admissions');
    }
});

export const updateAdmission = createAsyncThunk('admissions/updateAdmission', async (data, { rejectWithValue }) => {
    try {
        const response = await api.put(`/admissions/${data.id}`, data);
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update admission');
    }
});

export const deleteAdmission = createAsyncThunk('admissions/deleteAdmission', async (id, { rejectWithValue }) => {
    try {
        await api.delete(`/admissions/${id}`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete admission');
    }
});

const admissionSlice = createSlice({
    name: 'admissions',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdmissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdmissions.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload.data || action.payload; // Support both structures
            })
            .addCase(fetchAdmissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAdmission.fulfilled, (state, action) => {
                const index = state.list.findIndex(item => item.id === action.payload.id);
                if (index !== -1) state.list[index] = action.payload;
            })
            .addCase(deleteAdmission.fulfilled, (state, action) => {
                state.list = state.list.filter(item => item.id !== action.payload);
            });
    },
});

export default admissionSlice.reducer;
