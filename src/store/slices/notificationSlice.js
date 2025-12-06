import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications');
      return response.data.data?.notifications || response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

export const sendNotification = createAsyncThunk(
  'notifications/sendNotification',
  async (notificationData, { rejectWithValue }) => {
    try {
      const response = await api.post('/notifications/send', notificationData);
      toast.success('Notification sent successfully');
      return response.data.data || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send notification');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${id}`);
      toast.success('Notification deleted');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete notification');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.list = state.list.filter(n => n.id !== action.payload);
      });
  },
});

export default notificationSlice.reducer;
