import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { fetchUsers, addUser, updateUser, deleteUser, bulkDeleteUsers } from '../../store/slices/userSlice';
import Swal from 'sweetalert2';

export const UsersList = () => {
    const { list: users, loading } = useSelector(state => state.users);
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({});

    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    // Reset selection when search/filter changes
    useEffect(() => {
        setSelectedUsers([]);
    }, [searchTerm, roleFilter]);

    const filteredUsers = users.filter(user => {
        const matchesSearch = (user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesRole = roleFilter ? user.role === roleFilter : true;
        const isActive = user.status === 'ACTIVE'; // Only show active users by default or manage deleted separately?
        // Let's show all active for now, user controller returns everything but we can filter INACTIVE if needed.
        // Actually deletion sets INACTIVE.
        return matchesSearch && matchesRole && isActive;
    });

    const handleSearch = (e) => setSearchTerm(e.target.value);

    // Selection Handlers
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedUsers(filteredUsers.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectUser = (id) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleBulkDelete = async () => {
        const result = await Swal.fire({
            title: `Delete ${selectedUsers.length} users?`,
            text: "This will permanently delete these users and all their data! This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete all!'
        });
        if (result.isConfirmed) {
            await dispatch(bulkDeleteUsers(selectedUsers));
            setSelectedUsers([]);
        }
    };

    const handleCreate = () => {
        setEditingUser(null);
        setFormData({ role: 'STUDENT', status: 'ACTIVE' });
        setIsModalOpen(true);
    };

    const handleEdit = (user) => {
        setEditingUser(user);
        setFormData({ ...user, password: '' }); // Don't show password
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete the user and all their data! This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, permanently delete!'
        });
        if (result.isConfirmed) {
            dispatch(deleteUser(id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!formData.fullName || !formData.email || !formData.role) {
            // Let slice handle error or validated here
        }

        try {
            if (editingUser) {
                const dataToUpdate = { ...formData };
                if (!dataToUpdate.password) delete dataToUpdate.password;

                await dispatch(updateUser({ id: editingUser.id, data: dataToUpdate })).unwrap();
            } else {
                if (!formData.password) return alert('Password is required for new user');
                await dispatch(addUser(formData)).unwrap();
            }
            setIsModalOpen(false);
        } catch (error) {
            // Toast handled in slice
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">User Management</h2>
                    <p className="text-slate-500 text-sm">Manage Admins, Tutors, and Students</p>
                </div>
                <Button onClick={handleCreate} icon={Plus}>Add User</Button>
            </div>

            <Card>
                <div className="p-4 border-b border-slate-100 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <select
                        className="px-4 py-2 border border-slate-200 rounded-lg outline-none bg-white"
                        value={roleFilter}
                        onChange={e => setRoleFilter(e.target.value)}
                    >
                        <option value="">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="TUTOR">Tutor</option>
                        <option value="STUDENT">Student</option>
                    </select>
                </div>

                <div className="overflow-x-auto">
                    <div className="flex justify-between items-center bg-slate-50 px-6 py-2 border-b border-slate-100 h-12">
                        {/* Bulk Actions Header */}
                        {selectedUsers.length > 0 ? (
                            <div className="flex items-center gap-4 w-full">
                                <span className="text-sm font-semibold text-slate-700">{selectedUsers.length} selected</span>
                                <button
                                    onClick={handleBulkDelete}
                                    className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-medium flex items-center gap-1 ml-auto"
                                >
                                    <Trash2 size={14} /> Delete Selected
                                </button>
                            </div>
                        ) : (
                            <span className="text-xs font-semibold text-slate-500 uppercase">
                                {/* Placeholder to keep height consistent or leave empty */}
                            </span>
                        )}
                    </div>

                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-semibold text-slate-500">
                            <tr>
                                <th className="px-6 py-4 w-10">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                        checked={filteredUsers.length > 0 && selectedUsers.length === filteredUsers.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Email</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center">Loading...</td></tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr><td colSpan="6" className="px-6 py-8 text-center">No users found.</td></tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                checked={selectedUsers.includes(user.id)}
                                                onChange={() => handleSelectUser(user.id)}
                                            />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-800">{user.fullName}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'TUTOR' ? 'bg-blue-100 text-blue-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(user)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 size={18} /></button>
                                                <button onClick={() => handleDelete(user.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingUser ? "Edit User" : "Create User"}>
                <form onSubmit={handleSubmit} className="space-y-4 px-1">
                    <InputField label="Full Name" value={formData.fullName || ''} onChange={e => setFormData({ ...formData, fullName: e.target.value })} required />
                    <InputField label="Email" type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} required />

                    {!editingUser && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">Password</label>
                            <input
                                type="password"
                                className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.password || ''}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>
                    )}
                    {editingUser && (
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-slate-700">New Password (Optional)</label>
                            <input
                                type="password"
                                className="px-4 py-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
                                value={formData.password || ''}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                placeholder="Leave blank to keep current"
                            />
                        </div>
                    )}

                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-slate-700">Role</label>
                        <select
                            className="px-4 py-2 border border-slate-200 rounded-lg outline-none bg-white focus:ring-2 focus:ring-indigo-500"
                            value={formData.role || 'STUDENT'}
                            onChange={e => setFormData({ ...formData, role: e.target.value })}
                        >
                            <option value="ADMIN">Admin</option>
                            <option value="SUPERADMIN">Super Admin</option>
                            <option value="TUTOR">Tutor</option>
                            <option value="STUDENT">Student</option>
                        </select>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingUser ? "Update" : "Create"}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UsersList;
