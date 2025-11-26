import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 1, name: 'Class 10-A', course: 'Mathematics 101', tutor: 'John Doe', students: 32, startDate: '2024-01-15' },
    { id: 2, name: 'Class 9-B', course: 'Physics 202', tutor: 'Jane Smith', students: 28, startDate: '2024-02-01' },
  ],
};

const batchSlice = createSlice({
  name: 'batches',
  initialState,
  reducers: {
    addBatch: (state, action) => {
      state.list.push({ ...action.payload, id: state.list.length + 1 });
    },
  },
});

export const { addBatch } = batchSlice.actions;
export default batchSlice.reducer;
