import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  records: [
    { id: 1, date: '2024-11-26', batch: 'Class 10-A', present: 28, absent: 4, status: 'Marked' },
    { id: 2, date: '2024-11-25', batch: 'Class 10-A', present: 30, absent: 2, status: 'Marked' },
  ],
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    markAttendance: (state, action) => {
      state.records.unshift({ ...action.payload, id: state.records.length + 1, status: 'Marked' });
    },
  },
});

export const { markAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;
