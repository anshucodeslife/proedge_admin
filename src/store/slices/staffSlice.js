import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchStaff = createAsyncThunk(
  'staff/fetchStaff',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/staff'); // Assuming /admin/staff based on student endpoint being /admin/students
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch staff');
    }
  }
);

export const addStaff = createAsyncThunk(
  'staff/addStaff',
  async (staffData, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/staff', staffData);
      toast.success('Staff member added successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add staff');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addStaff.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        const index = state.list.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.list = state.list.filter(s => s.id !== action.payload);
      });
  },
});

export const updateStaff = createAsyncThunk(
  'staff/updateStaff',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/staff/${id}`, data);
      toast.success('Staff member updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update staff');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteStaff = createAsyncThunk(
  'staff/deleteStaff',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/staff/${id}`);
      toast.success('Staff member deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete staff');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export default staffSlice.reducer;
