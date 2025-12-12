import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { addTutor, fetchTutors, updateTutor, deleteTutor } from '../../store/slices/tutorSlice';
import Swal from 'sweetalert2';

export const TutorsList = () => {
    const { list: tutors, loading } = useSelector(state => state.tutors);
    const dispatch = useDispatch();

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTutor, setEditingTutor] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        dispatch(fetchTutors());
    }, [dispatch]);

    const handleSearch = (e) => setSearchTerm(e.target.value);

    const filteredTutors = tutors.filter(tutor =>
        (tutor.fullName && tutor.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tutor.email && tutor.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (tutor.subjects && tutor.subjects.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleEdit = (tutor) => {
        setEditingTutor(tutor);
        setFormData({ ...tutor });
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setEditingTutor(null);
        setFormData({});
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?', text: "You won't be able to revert this!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete it!'
        });
        if (result.isConfirmed) {
            dispatch(deleteTutor(id));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingTutor) {
                await dispatch(updateTutor({ id: editingTutor.id, data: formData })).unwrap();
            } else {
                await dispatch(addTutor({ ...formData })).unwrap();
            }
            setIsModalOpen(false);
        } catch (error) {
            // Handled in slice
        }
    };

    const handleStatusChange = async (tutorId, newStatus) => {
        try {
            await dispatch(updateTutor({ id: tutorId, data: { status: newStatus } })).unwrap();
        } catch (error) {
            // Handled in slice
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Tutors</h2>
                    <p className="text-slate-500 text-sm">Manage tutor profiles</p>
                </div>
                <Button onClick={handleCreate} icon={Plus}>Add Tutor</Button>
            </div>

            {/* List */}
            <Card>
                <div className="p-4 border-b border-slate-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tutors..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-semibold text-slate-500">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Contact</th>
                                <th className="px-6 py-4">Subjects</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center">Loading...</td></tr>
                            ) : filteredTutors.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-8 text-center">No tutors found.</td></tr>
                            ) : (
                                filteredTutors.map((tutor) => (
                                    <tr key={tutor.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-800">
                                            <div>{tutor.fullName}</div>
                                            <div className="text-xs text-slate-400">{tutor.email}</div>
                                        </td>
                                        <td className="px-6 py-4">{tutor.contact || '-'}</td>
                                        <td className="px-6 py-4">{tutor.subjects || '-'}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={tutor.status || 'ACTIVE'}
                                                onChange={(e) => handleStatusChange(tutor.id, e.target.value)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border-0 outline-none cursor-pointer transition-all ${tutor.status === 'ACTIVE'
                                                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                    }`}
                                            >
                                                <option value="ACTIVE">Active</option>
                                                <option value="INACTIVE">Inactive</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEdit(tutor)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit"><Edit2 size={18} /></button>
                                                <button onClick={() => handleDelete(tutor.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Edit/Add Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTutor ? "Edit Tutor" : "Add Tutor"}>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <InputField label="Full Name" name="fullName" value={formData.fullName || ''} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required />
                        <InputField label="Email" name="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
                        <InputField label="Contact" name="contact" value={formData.contact || ''} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} />
                        <InputField label="Subjects" name="subjects" value={formData.subjects || ''} onChange={(e) => setFormData({ ...formData, subjects: e.target.value })} placeholder="e.g. Maths, Science" />
                        {!editingTutor && (
                            <InputField label="Password" name="password" type="password" value={formData.password || ''} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Default: contact number" />
                        )}
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="submit">{editingTutor ? "Update Tutor" : "Add Tutor"}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default TutorsList;
