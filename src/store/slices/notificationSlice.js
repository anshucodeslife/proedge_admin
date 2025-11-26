import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 1, title: 'Exam Schedule Released', message: 'The final exam schedule for Class 10 has been released.', recipient: 'All Students', date: '2024-11-25' },
    { id: 2, title: 'Holiday Announcement', message: 'School will remain closed on Friday.', recipient: 'All Staff', date: '2024-11-24' },
  ],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    sendNotification: (state, action) => {
      state.list.unshift({ 
        ...action.payload, 
        id: state.list.length + 1, 
        date: new Date().toISOString().split('T')[0] 
      });
    },
    deleteNotification: (state, action) => {
      state.list = state.list.filter(n => n.id !== action.payload);
    },
  },
});

export const { sendNotification, deleteNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
