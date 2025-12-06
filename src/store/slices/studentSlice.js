import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

// Fetch students with pagination and filters
export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async ({ page = 1, limit = 20, search = '', status = '', courseId = '', batchId = '', sortBy = 'createdAt', sortOrder = 'desc' } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
        ...(courseId && { courseId }),
        ...(batchId && { batchId }),
        sortBy,
        sortOrder
      });
      const response = await api.get(`/admin/students?${params}`);
      return response.data.data || { students: response.data.data?.students || [], pagination: {} };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch students');
    }
  }
);

// Fetch single student by ID
export const fetchStudentById = createAsyncThunk(
  'students/fetchStudentById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/students/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch student');
    }
  }
);

// Add new student
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

// Update student
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

// Delete student
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

// Update student status
export const updateStudentStatus = createAsyncThunk(
  'students/updateStudentStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/admin/students/${id}/status`, { status });
      toast.success('Student status updated');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Bulk update student status
export const bulkUpdateStatus = createAsyncThunk(
  'students/bulkUpdateStatus',
  async ({ studentIds, status }, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/students/bulk-status', { studentIds, status });
      toast.success(`Updated ${response.data.data.count} students`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to bulk update');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Bulk assign to course
export const bulkAssignCourse = createAsyncThunk(
  'students/bulkAssignCourse',
  async ({ studentIds, courseId, batchId }, { rejectWithValue }) => {
    try {
      const response = await api.post('/admin/students/bulk-assign', { studentIds, courseId, batchId });
      toast.success('Students assigned to course');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign students');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Reset student password
export const resetStudentPassword = createAsyncThunk(
  'students/resetPassword',
  async ({ id, newPassword }, { rejectWithValue }) => {
    try {
      await api.post(`/admin/students/${id}/reset-password`, { newPassword });
      toast.success('Password reset successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  list: [],
  currentStudent: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },
  filters: {
    search: '',
    status: '',
    courseId: '',
    batchId: ''
  },
  loading: false,
  error: null,
  selectedStudents: []
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedStudents: (state, action) => {
      state.selectedStudents = action.payload;
    },
    toggleStudentSelection: (state, action) => {
      const id = action.payload;
      if (state.selectedStudents.includes(id)) {
        state.selectedStudents = state.selectedStudents.filter(sid => sid !== id);
      } else {
        state.selectedStudents.push(id);
      }
    },
    clearSelectedStudents: (state) => {
      state.selectedStudents = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.students || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Student By ID
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.currentStudent = action.payload;
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
      })
      // Update Status
      .addCase(updateStudentStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex(s => s.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      })
      // Bulk Update Status - refetch needed
      .addCase(bulkUpdateStatus.fulfilled, (state) => {
        state.selectedStudents = [];
      })
      // Bulk Assign - refetch needed
      .addCase(bulkAssignCourse.fulfilled, (state) => {
        state.selectedStudents = [];
      });
  },
});

export const { setFilters, setSelectedStudents, toggleStudentSelection, clearSelectedStudents } = studentSlice.actions;
export default studentSlice.reducer;
