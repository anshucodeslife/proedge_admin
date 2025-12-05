import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchParents = createAsyncThunk(
  'parents/fetchParents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/parents');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch parents');
    }
  }
);

export const addParent = createAsyncThunk(
  'parents/addParent',
  async (parentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/parents', parentData);
      toast.success('Parent added successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add parent');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const parentSlice = createSlice({
  name: 'parents',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchParents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchParents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchParents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addParent.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateParent.fulfilled, (state, action) => {
        const index = state.list.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      .addCase(deleteParent.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p.id !== action.payload);
      });
  },
});

export const updateParent = createAsyncThunk(
  'parents/updateParent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/parents/${id}`, data);
      toast.success('Parent updated successfully');
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update parent');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteParent = createAsyncThunk(
  'parents/deleteParent',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/parents/${id}`);
      toast.success('Parent deleted successfully');
      return id;
    } catch (error) {
       toast.error(error.response?.data?.message || 'Failed to delete parent');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export default parentSlice.reducer;
