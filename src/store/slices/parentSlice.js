import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  list: [
    { id: 1, name: 'Robert Smith', email: 'parent1@example.com', phone: '9876543210', children: ['Alice Smith'] },
    { id: 2, name: 'Mary Jones', email: 'parent2@example.com', phone: '8765432109', children: ['Bob Jones'] },
  ],
};

const parentSlice = createSlice({
  name: 'parents',
  initialState,
  reducers: {
    addParent: (state, action) => {
      state.list.push({ ...action.payload, id: state.list.length + 1 });
    },
  },
});

export const { addParent } = parentSlice.actions;
export default parentSlice.reducer;
