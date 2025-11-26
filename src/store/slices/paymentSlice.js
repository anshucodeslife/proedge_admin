import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  transactions: [
    { id: 'TXN-001', student: 'Alice Smith', amount: 5000, date: '2024-11-20', status: 'Success', type: 'Tuition Fee' },
    { id: 'TXN-002', student: 'Bob Jones', amount: 4500, date: '2024-11-21', status: 'Pending', type: 'Exam Fee' },
  ],
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.unshift({ ...action.payload, id: `TXN-00${state.transactions.length + 1}` });
    },
  },
});

export const { addTransaction } = paymentSlice.actions;
export default paymentSlice.reducer;
