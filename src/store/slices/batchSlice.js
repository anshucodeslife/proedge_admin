import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchBatches = createAsyncThunk(
  'batches/fetchBatches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/lms/batches');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch batches');
    }
  }
);

export const addBatch = createAsyncThunk(
  'batches/addBatch',
  async (batchData, { rejectWithValue }) => {
    try {
      const response = await api.post('/lms/batches', batchData);
      toast.success('Batch created successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create batch');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const batchSlice = createSlice({
  name: 'batches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Batches
      .addCase(fetchBatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatches.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchBatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Batch
      .addCase(addBatch.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update Batch
      .addCase(updateBatch.fulfilled, (state, action) => {
        const index = state.list.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      // Delete Batch
      .addCase(deleteBatch.fulfilled, (state, action) => {
        state.list = state.list.filter(b => b.id !== action.payload);
      });
  },
});

export const updateBatch = createAsyncThunk(
  'batches/updateBatch',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/lms/batches/${id}`, data);
      toast.success('Batch updated successfully');
      return response.data;
    } catch (error) {
       toast.error(error.response?.data?.message || 'Failed to update batch');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteBatch = createAsyncThunk(
  'batches/deleteBatch',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/lms/batches/${id}`);
      toast.success('Batch deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete batch');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export default batchSlice.reducer;
