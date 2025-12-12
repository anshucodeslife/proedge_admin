import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';
import toast from 'react-hot-toast';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async ({ role, search } = {}, { rejectWithValue }) => {
    try {
        const params = {};
        if (role) params.role = role;
        if (search) params.search = search;
        const response = await axios.get('/users', { params });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
});

export const addUser = createAsyncThunk('users/addUser', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/users', userData);
        toast.success('User added successfully');
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to add user');
        return rejectWithValue(error.response?.data?.message);
    }
});

export const updateUser = createAsyncThunk('users/updateUser', async ({ id, data }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`/users/${id}`, data);
        toast.success('User updated successfully');
        return response.data.data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to update user');
        return rejectWithValue(error.response?.data?.message);
    }
});

export const deleteUser = createAsyncThunk('users/deleteUser', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/users/${id}`);
        toast.success('User deleted successfully');
        return id;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete user');
        return rejectWithValue(error.response?.data?.message);
    }
});

export const bulkDeleteUsers = createAsyncThunk('users/bulkDeleteUsers', async (ids, { rejectWithValue }) => {
    try {
        await axios.post('/users/bulk-delete', { ids });
        toast.success(`Deleted ${ids.length} users successfully`);
        return ids;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to delete users');
        return rejectWithValue(error.response?.data?.message);
    }
});

const userSlice = createSlice({
    name: 'users',
    initialState: {
        list: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add
            .addCase(addUser.fulfilled, (state, action) => {
                state.list.unshift(action.payload);
            })
            // Update
            .addCase(updateUser.fulfilled, (state, action) => {
                const index = state.list.findIndex(u => u.id === action.payload.id);
                if (index !== -1) {
                    state.list[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.list = state.list.filter(u => u.id !== action.payload);
            })
            // Bulk Delete
            .addCase(bulkDeleteUsers.fulfilled, (state, action) => {
                state.list = state.list.filter(u => !action.payload.includes(u.id));
            });
    },
});

export default userSlice.reducer;
