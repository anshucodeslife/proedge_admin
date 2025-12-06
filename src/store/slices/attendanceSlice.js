import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/enrollments/attendance');
      return response.data.data?.attendance || response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch attendance');
    }
  }
);

export const markAttendance = createAsyncThunk(
  'attendance/markAttendance',
  async (attendanceData, { rejectWithValue }) => {
    try {
      const response = await api.post('/enrollments/attendance', attendanceData);
      toast.success('Attendance marked successfully');
      return response.data.data || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = { list: [], loading: false, error: null };

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => { state.loading = true; })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.list.push(action.payload);
      });
  },
});

export default attendanceSlice.reducer;
