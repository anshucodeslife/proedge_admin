import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchModules = createAsyncThunk(
  'modules/fetchModules',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get('/lms/modules', { params: { courseId } });
      return response.data.data?.modules || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch modules');
    }
  }
);

export const addModule = createAsyncThunk(
  'modules/addModule',
  async (moduleData, { rejectWithValue }) => {
    try {
      const response = await api.post('/lms/modules', moduleData);
      toast.success('Module added successfully');
      return response.data.data || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add module');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const addLesson = createAsyncThunk(
  'modules/addLesson',
  async (lessonData, { rejectWithValue }) => {
    try {
      const response = await api.post('/lms/lessons', lessonData);
      toast.success('Lesson added successfully');
      return response.data.data || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add lesson');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updateModule = createAsyncThunk(
  'modules/updateModule',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/lms/modules/${id}`, data);
      toast.success('Module updated successfully');
      return response.data.data || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update module');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

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

export const updateLesson = createAsyncThunk(
  'modules/updateLesson',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/lms/lessons/${id}`, data);
      toast.success('Lesson updated successfully');
      return response.data.data || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update lesson');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const deleteLesson = createAsyncThunk(
  'modules/deleteLesson',
  async ({ lessonId, moduleId }, { rejectWithValue }) => {
    try {
      await api.delete(`/lms/lessons/${lessonId}`);
      toast.success('Lesson deleted successfully');
      return { lessonId, moduleId };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete lesson');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  list: [],
  loading: false,
  error: null,
};

const moduleSlice = createSlice({
  name: 'modules',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Modules
      .addCase(fetchModules.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchModules.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchModules.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Module
      .addCase(addModule.fulfilled, (state, action) => {
        state.list.push({ ...action.payload, lessons: [] });
      })
      // Add Lesson
      .addCase(addLesson.fulfilled, (state, action) => {
        const module = state.list.find(m => m.id === action.payload.moduleId);
        if (module) {
          if (!module.lessons) module.lessons = [];
          module.lessons.push(action.payload);
        }
      })
      // Update Module
      .addCase(updateModule.fulfilled, (state, action) => {
        const index = state.list.findIndex(m => m.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = { ...state.list[index], ...action.payload };
        }
      })
      // Delete Module
      .addCase(deleteModule.fulfilled, (state, action) => {
        state.list = state.list.filter(m => m.id !== action.payload);
      })
      // Update Lesson
      .addCase(updateLesson.fulfilled, (state, action) => {
        const module = state.list.find(m => m.id === action.payload.moduleId);
        if (module && module.lessons) {
          const index = module.lessons.findIndex(l => l.id === action.payload.id);
          if (index !== -1) {
            module.lessons[index] = action.payload;
          }
        }
      })
      // Delete Lesson
      .addCase(deleteLesson.fulfilled, (state, action) => {
        const module = state.list.find(m => m.id === action.payload.moduleId);
        if (module && module.lessons) {
          module.lessons = module.lessons.filter(l => l.id !== action.payload.lessonId);
        }
      });
  },
});

export default moduleSlice.reducer;
