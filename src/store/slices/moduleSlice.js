import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

// Create module
export const createModule = createAsyncThunk(
  'modules/createModule',
  async (moduleData, { rejectWithValue }) => {
    try {
      const response = await api.post('/lms/modules', moduleData);
      toast.success('Module created successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create module');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Fetch modules by course
export const fetchModulesByCourse = createAsyncThunk(
  'modules/fetchByCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/lms/courses/${courseId}/modules`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch modules');
    }
  }
);

// Update module
export const updateModule = createAsyncThunk(
  'modules/updateModule',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/lms/modules/${id}`, data);
      toast.success('Module updated successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update module');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete module
export const deleteModule = createAsyncThunk(
  'modules/deleteModule',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/lms/modules/${id}`);
      toast.success('Module deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete module');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Create lesson
export const createLesson = createAsyncThunk(
  'modules/createLesson',
  async (lessonData, { rejectWithValue }) => {
    try {
      const response = await api.post('/lms/lessons', lessonData);
      toast.success('Lesson created successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create lesson');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Fetch lessons by module
export const fetchLessonsByModule = createAsyncThunk(
  'modules/fetchLessonsByModule',
  async (moduleId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/lms/modules/${moduleId}/lessons`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lessons');
    }
  }
);

// Update lesson
export const updateLesson = createAsyncThunk(
  'modules/updateLesson',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/lms/lessons/${id}`, data);
      toast.success('Lesson updated successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update lesson');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Delete lesson
export const deleteLesson = createAsyncThunk(
  'modules/deleteLesson',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/lms/lessons/${id}`);
      toast.success('Lesson deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete lesson');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  list: [],
  lessons: {},
  loading: false,
  error: null,
};

const moduleSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchModulesByCourse.pending, (state) => { state.loading = true; })
      .addCase(fetchModulesByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchModulesByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createModule.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateModule.fulfilled, (state, action) => {
        const index = state.list.findIndex(m => m.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteModule.fulfilled, (state, action) => {
        state.list = state.list.filter(m => m.id !== action.payload);
      })
      .addCase(fetchLessonsByModule.fulfilled, (state, action) => {
        const moduleId = action.meta.arg;
        state.lessons[moduleId] = action.payload;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        const moduleId = action.payload.moduleId;
        if (!state.lessons[moduleId]) state.lessons[moduleId] = [];
        state.lessons[moduleId].push(action.payload);
      })
      .addCase(updateLesson.fulfilled, (state, action) => {
        const moduleId = action.payload.moduleId;
        if (state.lessons[moduleId]) {
          const index = state.lessons[moduleId].findIndex(l => l.id === action.payload.id);
          if (index !== -1) state.lessons[moduleId][index] = action.payload;
        }
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        Object.keys(state.lessons).forEach(moduleId => {
          state.lessons[moduleId] = state.lessons[moduleId].filter(l => l.id !== action.payload);
        });
      });
  },
});

export default moduleSlice.reducer;
