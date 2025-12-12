import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

// Fetch tutors
export const fetchTutors = createAsyncThunk(
    'tutors/fetchTutors',
    async (search = '', { rejectWithValue }) => {
        try {
            const response = await api.get(`/admin/tutors`);
            return response.data.data; // Assuming returns array directly or { tutors: [] }
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch tutors');
        }
    }
);

// Add tutor
export const addTutor = createAsyncThunk(
    'tutors/addTutor',
    async (tutorData, { rejectWithValue }) => {
        try {
            const response = await api.post('/admin/tutors', tutorData);
            toast.success('Tutor added successfully');
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add tutor');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// Update tutor
export const updateTutor = createAsyncThunk(
    'tutors/updateTutor',
    async ({ id, data }, { rejectWithValue }) => {
        try {
            const response = await api.patch(`/admin/tutors/${id}`, data);
            toast.success('Tutor updated successfully');
            return response.data.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update tutor');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

// Delete tutor
export const deleteTutor = createAsyncThunk(
    'tutors/deleteTutor',
    async (id, { rejectWithValue }) => {
        try {
            await api.delete(`/admin/tutors/${id}`);
            toast.success('Tutor deleted successfully');
            return id;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete tutor');
            return rejectWithValue(error.response?.data?.message);
        }
    }
);

const initialState = {
    list: [],
    loading: false,
    error: null,
};

const tutorSlice = createSlice({
    name: 'tutors',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Tutors
            .addCase(fetchTutors.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTutors.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchTutors.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add Tutor
            .addCase(addTutor.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            // Update Tutor
            .addCase(updateTutor.fulfilled, (state, action) => {
                const index = state.list.findIndex(t => t.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            // Delete Tutor
            .addCase(deleteTutor.fulfilled, (state, action) => {
                state.list = state.list.filter(t => t.id !== action.payload);
            });
    },
});

export default tutorSlice.reducer;
