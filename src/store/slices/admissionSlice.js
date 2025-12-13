import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchAdmissions = createAsyncThunk('admissions/fetchAdmissions', async (_, { rejectWithValue }) => {
    try {
        // Fetch enrollments which now serve as the single source of truth for admissions
        const response = await api.get('/enrollments?limit=100'); // Fetch enough for now, pagination added later
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch admissions');
    }
});

export const updateAdmission = createAsyncThunk('admissions/updateAdmission', async (data, { rejectWithValue }) => {
    try {
        // Update enrollment status or details
        // Note: For full edit, we might need a specific endpoint. 
        // For now, let's assuming basic status update or similar.
        // Actually, let's keep it simple. If we edit student info, we update User.
        const response = await api.put(`/admin/students/${data.userId}`, data); // Example: Update user profile
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update admission');
    }
});

export const deleteAdmission = createAsyncThunk('admissions/deleteAdmission', async (id, { rejectWithValue }) => {
    try {
        // Soft delete enrollment or update status to CANCELLED
        await api.delete(`/admissions/${id}`); // Using the delete route which handles soft delete
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete admission');
    }
});

export const restoreAdmission = createAsyncThunk('admissions/restoreAdmission', async (id, { rejectWithValue }) => {
    try {
        await api.put(`/admissions/${id}/restore`);
        return id;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to restore admission');
    }
});

const admissionSlice = createSlice({
    name: 'admissions',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAdmissions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdmissions.fulfilled, (state, action) => {
                state.loading = false;
                // standardize structure: map enrollment to flat admission object for the table
                const enrollments = action.payload.data?.enrollments || [];
                state.list = enrollments
                    // .filter(e => e.status !== 'CANCELLED') // Allow all statuses so we can show Deleted tab
                    .map(e => ({
                        id: e.id,
                        userId: e.userId,
                        batchId: e.batchId,
                        createdAt: e.enrolledAt,
                        orderId: e.payments?.[0]?.orderId || 'N/A', // Assuming first payment

                        // Personal Details
                        fullName: e.user?.fullName,
                        email: e.user?.email,
                        contact: e.user?.contact,
                        dob: e.user?.dob,
                        gender: e.user?.gender,
                        address: e.user?.address,

                        // Parent Details
                        parentName: e.user?.parentName,
                        parentContact: e.user?.parentContact,

                        // Academic Details
                        currentSchool: e.user?.currentSchool,
                        classYear: e.user?.classYear,
                        educationLevel: e.user?.educationLevel,
                        board: e.user?.board,

                        // Course & Batch
                        courseName: e.course?.title,
                        batchTiming: e.user?.batchTiming,

                        // Payment Details
                        totalFees: e.payments?.[0]?.amount || e.user?.totalFees || 0,
                        originalFees: e.user?.originalFees,
                        paymentMode: e.payments?.[0]?.mode || 'Cash',
                        paymentOption: e.user?.paymentOption || 'Pay in Full',
                        advanceAmount: e.user?.advanceAmount,
                        referralCode: e.user?.referralCode,
                        referralAmount: e.user?.referralAmount || 0,

                        // Installment Details
                        installment1Amount: e.user?.installment1Amount,
                        installment1Date: e.user?.installment1Date,
                        installment2Amount: e.user?.installment2Amount,
                        installment2Date: e.user?.installment2Date,
                        installment3Amount: e.user?.installment3Amount,
                        installment3Date: e.user?.installment3Date,

                        // Status & Invoice
                        status: e.status,
                        invoiceId: e.payments?.[0]?.invoice?.id,
                        invoiceNo: e.payments?.[0]?.invoice?.invoiceNo,
                        invoiceDate: e.payments?.[0]?.invoice?.createdAt,
                        paymentId: e.payments?.[0]?.id
                    }));
            })
            .addCase(fetchAdmissions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateAdmission.fulfilled, (state, action) => {
                // Refresh list or optimistic update
            })
            .addCase(deleteAdmission.fulfilled, (state, action) => {
                // Should we remove it or just update, since we now show Trash?
                // Ideally, we move it to Trash tab. Just update status in list.
                const index = state.list.findIndex(item => item.id === action.payload);
                if (index !== -1) {
                    state.list[index].status = 'CANCELLED';
                }
            })
            .addCase(restoreAdmission.fulfilled, (state, action) => {
                const index = state.list.findIndex(item => item.id === action.payload);
                if (index !== -1) {
                    state.list[index].status = 'PENDING';
                }
            });
    },
});

export default admissionSlice.reducer;
