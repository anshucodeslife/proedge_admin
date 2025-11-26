import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 1, title: 'Mathematics 101', slug: 'math-101', price: 1999, code: 'MTH101', units: 4, status: 'Active' },
    { id: 2, title: 'Physics 202', slug: 'physics-202', price: 2499, code: 'PHY202', units: 3, status: 'Active' },
    { id: 3, title: 'Chemistry 303', slug: 'chemistry-303', price: 1999, code: 'CHM303', units: 4, status: 'Active' },
  ],
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    addCourse: (state, action) => {
      state.list.push({ ...action.payload, id: state.list.length + 1 });
    },
  },
});

export const { addCourse } = courseSlice.actions;
export default courseSlice.reducer;
