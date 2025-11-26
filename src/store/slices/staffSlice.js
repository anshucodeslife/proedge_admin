import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 1, name: 'John Doe', role: 'Teacher', email: 'john@proedge.com', phone: '1234567890', subject: 'Mathematics' },
    { id: 2, name: 'Jane Smith', role: 'Teacher', email: 'jane@proedge.com', phone: '0987654321', subject: 'Physics' },
    { id: 3, name: 'Admin User', role: 'Admin', email: 'admin@proedge.com', phone: '1122334455', subject: 'N/A' },
  ],
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    addStaff: (state, action) => {
      state.list.push({ ...action.payload, id: state.list.length + 1 });
    },
  },
});

export const { addStaff } = staffSlice.actions;
export default staffSlice.reducer;
