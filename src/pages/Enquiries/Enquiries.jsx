import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEnquiries, updateEnquiryStatus, deleteEnquiry } from '../../store/slices/enquirySlice';
import { Search, Trash2, Eye, UserPlus, Edit2, X } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import AdminEnrollModal from '../../components/EnquiryModals/AdminEnrollModal';
import InvoiceModal from '../../components/EnquiryModals/InvoiceModal';

const Enquiries = () => {
    const dispatch = useDispatch();
    const { list: enquiries, loading } = useSelector((state) => state.enquiries);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    // Modal states
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [enrollingStudent, setEnrollingStudent] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [newStudentData, setNewStudentData] = useState(null);

    useEffect(() => {
        dispatch(fetchEnquiries());
    }, [dispatch]);

    const handleStatusChange = (id, newStatus) => {
        dispatch(updateEnquiryStatus({ id, status: newStatus }))
            .unwrap()
            .then(() => {
                if (selectedEnquiry?.id === id) {
                    setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
                }
                Swal.fire('Success', 'Status updated successfully', 'success');
            })
            .catch(() => Swal.fire('Error', 'Failed to update status', 'error'));
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            dispatch(deleteEnquiry(id));
            if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
        }
    };

    const handleEnroll = (enquiry) => {
        setEnrollingStudent(enquiry);
        setShowEnrollModal(true);
    };

    const handleEnrollSuccess = (studentData) => {
        dispatch(fetchEnquiries());
        setNewStudentData(studentData);
        setShowInvoiceModal(true);
    };

    const openEditModal = (enquiry) => {
        setEditForm(enquiry);
        setIsEditing(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/enquiries/${editForm.id}`, editForm);
            dispatch(fetchEnquiries());
            setIsEditing(false);
            Swal.fire('Success', 'Enquiry updated successfully', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to update enquiry', 'error');
        }
    };

    const filteredEnquiries = enquiries.filter(enquiry =>
        enquiry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.contact.includes(searchTerm)
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-700';
            case 'Contacted': return 'bg-yellow-100 text-yellow-700';
            case 'Converted': return 'bg-green-100 text-green-700';
            case 'Closed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Interested / Enquiries</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search enquiries..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C08B]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                            <tr>
                                <th className="p-4">Date</th>
                                <th className="p-4">Name</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Course Interest</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
                            ) : filteredEnquiries.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No enquiries found.</td></tr>
                            ) : (
                                filteredEnquiries.map(enquiry => (
                                    <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-600 text-sm">{new Date(enquiry.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium text-gray-800">{enquiry.fullName}</td>
                                        <td className="p-4 text-sm">
                                            <div className="text-gray-800">{enquiry.email}</div>
                                            <div className="text-gray-500">{enquiry.contact}</div>
                                        </td>
                                        <td className="p-4 text-gray-600">{enquiry.preferredCourses || '-'}</td>
                                        <td className="p-4">
                                            <select
                                                value={enquiry.status}
                                                onChange={(e) => handleStatusChange(enquiry.id, e.target.value)}
                                                className={`px-2 py-1 rounded-full text-xs font-medium border-none focus:ring-0 cursor-pointer ${getStatusColor(enquiry.status)}`}
                                            >
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="Converted">Converted</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEnroll(enquiry)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><UserPlus size={18} /></button>
                                                <button onClick={() => openEditModal(enquiry)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                                                <button onClick={() => setSelectedEnquiry(enquiry)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"><Eye size={18} /></button>
                                                <button onClick={() => handleDelete(enquiry.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedEnquiry && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    {/* ... (Copy details UI from source or keep simple) ... */}
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
                        <button onClick={() => setSelectedEnquiry(null)} className="absolute top-4 right-4"><X size={24} /></button>
                        <h2 className="text-xl font-bold mb-4">Enquiry Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-sm text-gray-500">Name</p><p>{selectedEnquiry.fullName}</p></div>
                            <div><p className="text-sm text-gray-500">Email</p><p>{selectedEnquiry.email}</p></div>
                            <div><p className="text-sm text-gray-500">Contact</p><p>{selectedEnquiry.contact}</p></div>
                            <div><p className="text-sm text-gray-500">Course</p><p>{selectedEnquiry.preferredCourses}</p></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal (Simpler version) */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Edit Enquiry</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <input value={editForm.fullName} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} className="w-full p-2 border rounded" placeholder="Name" />
                            <input value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full p-2 border rounded" placeholder="Email" />
                            <input value={editForm.contact} onChange={e => setEditForm({ ...editForm, contact: e.target.value })} className="w-full p-2 border rounded" placeholder="Contact" />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <AdminEnrollModal
                isOpen={showEnrollModal}
                onClose={() => setShowEnrollModal(false)}
                studentData={enrollingStudent}
                type="enquiry"
                onSuccess={handleEnrollSuccess}
            />

            <InvoiceModal
                isOpen={showInvoiceModal}
                onClose={() => setShowInvoiceModal(false)}
                studentData={newStudentData}
            />
        </div>
    );
};

export default Enquiries;
