import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchEnrollments = createAsyncThunk(
  'enrollments/fetchEnrollments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/enrollments');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch enrollments');
    }
  }
);

export const addEnrollment = createAsyncThunk(
  'enrollments/addEnrollment',
  async (enrollmentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/enrollments', enrollmentData);
      toast.success('Student enrolled successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll student');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateEnrollment = createAsyncThunk(
  'enrollments/updateEnrollment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/enrollments/${id}`, data);
      toast.success('Enrollment updated successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update enrollment');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteEnrollment = createAsyncThunk(
  'enrollments/deleteEnrollment',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/enrollments/${id}`);
      toast.success('Enrollment removed successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete enrollment');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEnrollments.pending, (state) => { state.loading = true; })
      .addCase(fetchEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addEnrollment.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateEnrollment.fulfilled, (state, action) => {
        const index = state.list.findIndex(e => e.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteEnrollment.fulfilled, (state, action) => {
        state.list = state.list.filter(e => e.id !== action.payload);
      });
  },
});

export default enrollmentSlice.reducer;
