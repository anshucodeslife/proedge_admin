import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmissions, deleteAdmission, updateAdmission } from '../../store/slices/admissionSlice';
import { Search, Trash2, Eye, UserPlus, Edit2, X, Download } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import AdminEnrollModal from '../../components/EnquiryModals/AdminEnrollModal';
import InvoiceModal from '../../components/EnquiryModals/InvoiceModal';

const Batch1Admissions = () => {
    const dispatch = useDispatch();
    const { list: admissions, loading } = useSelector((state) => state.admissions);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAdmission, setSelectedAdmission] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    // Modal states
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [enrollingStudent, setEnrollingStudent] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [newStudentData, setNewStudentData] = useState(null);

    useEffect(() => {
        dispatch(fetchAdmissions());
    }, [dispatch]);

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This admission record will be permanently deleted.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            dispatch(deleteAdmission(id));
            if (selectedAdmission?.id === id) setSelectedAdmission(null);
            Swal.fire('Deleted!', 'Record has been deleted.', 'success');
        }
    };

    const handleEnroll = (admission) => {
        setEnrollingStudent(admission);
        setShowEnrollModal(true);
    };

    const handleEnrollSuccess = (studentData) => {
        dispatch(fetchAdmissions());
        setNewStudentData(studentData);
        setShowInvoiceModal(true);
    };

    const openEditModal = (admission) => {
        setEditForm(admission);
        setIsEditing(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(updateAdmission(editForm)).unwrap();
            setIsEditing(false);
            Swal.fire('Success', 'Admission updated successfully', 'success');
        } catch (error) {
            Swal.fire('Error', 'Failed to update admission', 'error');
        }
    };

    const filteredAdmissions = admissions.filter(ad =>
        ad.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ad.contact?.includes(searchTerm)
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Batch 1 Admissions</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search admissions..."
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
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Student</th>
                                <th className="p-4">Course</th>
                                <th className="p-4">Fees</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">Loading...</td></tr>
                            ) : filteredAdmissions.length === 0 ? (
                                <tr><td colSpan="6" className="p-8 text-center text-gray-500">No admissions found.</td></tr>
                            ) : (
                                filteredAdmissions.map(ad => (
                                    <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-gray-600 text-sm">{new Date(ad.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4 font-mono text-xs text-gray-500">{ad.orderId}</td>
                                        <td className="p-4 font-medium text-gray-800">
                                            <div>{ad.fullName}</div>
                                            <div className="text-xs text-gray-500">{ad.email}</div>
                                        </td>
                                        <td className="p-4 text-gray-600">{ad.courseName}</td>
                                        <td className="p-4 font-bold text-green-600">₹{ad.totalFees}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => handleEnroll(ad)} title="Enroll to LMS" className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><UserPlus size={18} /></button>
                                                <button onClick={() => openEditModal(ad)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                                                <button onClick={() => setSelectedAdmission(ad)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"><Eye size={18} /></button>
                                                <button onClick={() => handleDelete(ad.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
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
            {selectedAdmission && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl p-6 relative">
                        <button onClick={() => setSelectedAdmission(null)} className="absolute top-4 right-4"><X size={24} /></button>
                        <h2 className="text-xl font-bold mb-4">Admission Details</h2>
                        <div className="grid grid-cols-2 gap-6">
                            <div><p className="text-sm text-gray-500">Full Name</p><p className="font-medium">{selectedAdmission.fullName}</p></div>
                            <div><p className="text-sm text-gray-500">Email</p><p>{selectedAdmission.email}</p></div>
                            <div><p className="text-sm text-gray-500">Contact</p><p>{selectedAdmission.contact}</p></div>
                            <div><p className="text-sm text-gray-500">Course</p><p>{selectedAdmission.courseName}</p></div>
                            <div><p className="text-sm text-gray-500">Total Fees</p><p>₹{selectedAdmission.totalFees}</p></div>
                            <div><p className="text-sm text-gray-500">Order ID</p><p className="font-mono">{selectedAdmission.orderId}</p></div>
                            <div><p className="text-sm text-gray-500">Address</p><p>{selectedAdmission.address}</p></div>
                            <div><p className="text-sm text-gray-500">DOB</p><p>{new Date(selectedAdmission.dob).toLocaleDateString()}</p></div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {isEditing && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Edit Admission</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <input value={editForm.fullName || ''} onChange={e => setEditForm({ ...editForm, fullName: e.target.value })} className="w-full p-2 border rounded" placeholder="Name" />
                            <input value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} className="w-full p-2 border rounded" placeholder="Email" />
                            <input value={editForm.contact || ''} onChange={e => setEditForm({ ...editForm, contact: e.target.value })} className="w-full p-2 border rounded" placeholder="Contact" />
                            <input value={editForm.totalFees || ''} onChange={e => setEditForm({ ...editForm, totalFees: e.target.value })} className="w-full p-2 border rounded" placeholder="Fees" type="number" />
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
                type="admission"
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

export default Batch1Admissions;
