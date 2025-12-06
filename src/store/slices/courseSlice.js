import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

// Fetch courses with pagination (admin endpoint)
export const fetchCourses = createAsyncThunk(
  'courses/fetchCourses',
  async ({ page = 1, limit = 20, search = '', sortBy = 'createdAt', sortOrder = 'desc' } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({ page, limit, sortBy, sortOrder, ...(search && { search }) });
      const response = await api.get(`/admin/courses?${params}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch courses');
    }
  }
);

// Fetch single course by ID
export const fetchCourseById = createAsyncThunk(
  'courses/fetchCourseById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/courses/${id}`);
      return response.data.data.course;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch course');
    }
  }
);

// Fetch course students
export const fetchCourseStudents = createAsyncThunk(
  'courses/fetchCourseStudents',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/courses/${id}/students`);
      return response.data.data.students;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

// Add course
export const addCourse = createAsyncThunk(
  'courses/addCourse',
  async (courseData, { rejectWithValue }) => {
    try {
      const response = await api.post('/courses', courseData);
      toast.success('Course added successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add course');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Update course
export const updateCourse = createAsyncThunk(
  'courses/updateCourse',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/courses/${id}`, data);
      toast.success('Course updated successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update course');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete course
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
  currentCourse: null,
  courseStudents: [],
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  loading: false,
  error: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.pending, (state) => { state.loading = true; })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.courses || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseStudents.fulfilled, (state, action) => {
        state.courseStudents = action.payload;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.list.findIndex(c => c.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c.id !== action.payload);
      });
  },
});

export default courseSlice.reducer;
