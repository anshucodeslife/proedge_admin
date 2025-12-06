import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/courses');
      return response.data.data?.courses || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

export const addCourse = createAsyncThunk(
  'courses/addCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await api.post('/courses', courseData);
      toast.success('Course created successfully');
      return response.data.data || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create course');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/courses/${id}`, data);
      toast.success('Course updated successfully');
      return response.data.data || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update course');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  'courses/deleteCourse',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/courses/${id}`);
      toast.success('Course deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete course');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Course
      .addCase(addCourse.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // Update Course
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      // Delete Course
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c.id !== action.payload);
      });
  },
});

export default courseSlice.reducer;
