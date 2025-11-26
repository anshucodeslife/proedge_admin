import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 1, fullName: 'Alice Smith', email: 'alice@proedge.com', admissionNo: 'ADM-2024-001', class: 'Class 10-A', parentEmail: 'parent1@example.com', studentId: 'STU001' },
    { id: 2, fullName: 'Bob Jones', email: 'bob@proedge.com', admissionNo: 'ADM-2024-002', class: 'Class 9-B', parentEmail: 'parent2@example.com', studentId: 'STU002' },
    { id: 3, fullName: 'Charlie Brown', email: 'charlie@proedge.com', admissionNo: 'ADM-2024-003', class: 'Class 10-A', parentEmail: 'parent3@example.com', studentId: 'STU003' },
  ],
};

const studentSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    addStudent: (state, action) => {
      state.list.push({ ...action.payload, id: state.list.length + 1 });
    },
    updateStudent: (state, action) => {
      const index = state.list.findIndex(s => s.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
    deleteStudent: (state, action) => {
      state.list = state.list.filter(s => s.id !== action.payload);
    },
  },
});

export const { addStudent, updateStudent, deleteStudent } = studentSlice.actions;
export default studentSlice.reducer;
