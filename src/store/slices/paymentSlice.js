import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/payments');
      return response.data.data?.payments || response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch payments');
    }
  }
);

export const addTransaction = createAsyncThunk(
  'payments/addTransaction',
  async (paymentData, { rejectWithValue }) => {
    try {
      const response = await api.post('/payments', paymentData);
      toast.success('Payment recorded successfully');
      return response.data.data || response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record payment');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const updatePaymentStatus = createAsyncThunk(
  'payments/updateStatus',
  async ({ paymentId, status }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/payments/${paymentId}/status`, { status });
      return { paymentId, status };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update payment status');
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  'payments/deleteTransaction',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/payments/${id}`);
      toast.success('Transaction deleted successfully');
      return id;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete transaction');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Payments
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Transaction
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.unshift(action.payload);
      })
      // Update Payment Status
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        const { paymentId, status } = action.payload;
        const paymentIndex = state.transactions.findIndex(p => p.id === paymentId);
        if (paymentIndex !== -1) {
          state.transactions[paymentIndex].status = status;
        }
      })
      // Delete Transaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(t => t.id !== action.payload);
      });
  },
});

export default paymentSlice.reducer;
