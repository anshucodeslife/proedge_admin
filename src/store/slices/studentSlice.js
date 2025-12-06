import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/students');
      return response.data.data?.students || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

export const addStudent = createAsyncThunk(
  'students/addStudent',
  async (studentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/students', studentData);
      toast.success('Student added successfully');
      const data = response.data.data || response.data;
      return data.student || data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add student');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/admin/students/${id}`, data);
      toast.success('Student updated successfully');
      const responseData = response.data.data || response.data;
      return responseData.student || responseData;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update student');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/deleteStudent',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/admin/students/${id}`);
      toast.success('Student deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete student');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Student
      .addCase(addStudent.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update Student
      .addCase(updateStudent.fulfilled, (state, action) => {
        const index = state.list.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      // Delete Student
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.list = state.list.filter(s => s.id !== action.payload);
      });
  },
});

export default studentSlice.reducer;
