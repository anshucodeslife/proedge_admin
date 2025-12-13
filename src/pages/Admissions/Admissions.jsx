import React, { useEffect, useState } from 'react';

import { Search, Filter, Download, Plus, Eye, Edit2, Trash2, UserPlus, RefreshCw } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdmissions, deleteAdmission, restoreAdmission } from '../../store/slices/admissionSlice';
import { fetchCourses } from '../../store/slices/courseSlice';
import { fetchBatches } from '../../store/slices/batchSlice';
import AdminEnrollModal from '../../components/EnquiryModals/AdminEnrollModal';
import InvoiceModal from '../../components/EnquiryModals/InvoiceModal';
import toast from 'react-hot-toast';

const Admissions = () => {
    const dispatch = useDispatch();
    const { list: admissions, loading } = useSelector((state) => state.admissions);
    const { list: courses } = useSelector((state) => state.courses);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [showEnrollModal, setShowEnrollModal] = useState(false);
    const [modalType, setModalType] = useState('admission'); // 'admission' or 'edit'
    const [selectedAdmission, setSelectedAdmission] = useState(null); // For future Detail View
    const [newStudentData, setNewStudentData] = useState(null);
    const [enrollingStudent, setEnrollingStudent] = useState(null);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);

    // Tab State: 'active' or 'deleted'
    const [activeTab, setActiveTab] = useState('active');

    useEffect(() => {
        dispatch(fetchAdmissions());
        dispatch(fetchCourses());
        dispatch(fetchBatches());
    }, [dispatch]);

    // Handle Delete
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this admission? It will be moved to the trash.')) {
            const result = await dispatch(deleteAdmission(id));
            if (deleteAdmission.fulfilled.match(result)) {
                toast.success('Admission moved to trash');
            } else {
                toast.error(result.payload || 'Failed to delete');
            }
        }
    };

    // Handle Restore
    const handleRestore = async (id) => {
        if (window.confirm('Are you sure you want to restore this admission? It will be moved to Pending status.')) {
            const result = await dispatch(restoreAdmission(id));
            if (restoreAdmission.fulfilled.match(result)) {
                toast.success('Admission restored successfully');
            } else {
                toast.error(result.payload || 'Failed to restore');
            }
        }
    };

    const handleEnroll = (admission) => {
        console.log('Enrolling student:', admission);
        setEnrollingStudent(admission);
        setModalType('admission');
        setShowEnrollModal(true);
    };

    const openEditModal = (admission) => {
        console.log('Opening edit modal for:', admission);
        setNewStudentData(admission);
        setModalType('edit');
        setShowEnrollModal(true);
    }

    const filteredAdmissions = admissions.filter(ad => {
        const matchesSearch = ad.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ad.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ad.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = selectedCourse ? ad.courseName === selectedCourse : true;

        // Tab Filtering
        const isDeleted = ad.status === 'CANCELLED';
        const matchesTab = activeTab === 'deleted' ? isDeleted : !isDeleted;

        return matchesSearch && matchesCourse && matchesTab;
    });

    return (
        <>
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Admissions</h1>
                        <p className="text-gray-600">Manage student admissions and enrollments</p>
                    </div>
                    <button
                        onClick={() => {
                            setModalType('admission');
                            setNewStudentData(null);
                            setShowEnrollModal(true);
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        New Admission
                    </button>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    {/* Filters & Tabs */}
                    <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50">
                        {/* Tabs */}
                        <div className="flex bg-gray-200 rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'active' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                Active / Pending
                            </button>
                            <button
                                onClick={() => setActiveTab('deleted')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'deleted' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                            >
                                Trash ({admissions.filter(a => a.status === 'CANCELLED').length})
                            </button>
                        </div>

                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search student, email or invoice..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="relative w-48">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                                    value={selectedCourse}
                                    onChange={(e) => setSelectedCourse(e.target.value)}
                                >
                                    <option value="">All Courses</option>
                                    {courses.map(course => (
                                        <option key={course.id} value={course.title}>{course.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Date</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">ID</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Student</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Course</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Fees</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                                    <th className="p-4 font-semibold text-gray-600 text-sm text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="7" className="p-8 text-center text-gray-500">Loading...</td></tr>
                                ) : filteredAdmissions.length === 0 ? (
                                    <tr><td colSpan="7" className="p-8 text-center text-gray-500">No admissions found.</td></tr>
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
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${ad.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                    ad.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                                        ad.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                                            'bg-gray-100 text-gray-600'
                                                    }`}>
                                                    {ad.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {/* Actions based on Tab */}
                                                    {activeTab === 'deleted' ? (
                                                        <button
                                                            onClick={() => handleRestore(ad.id)}
                                                            title="Restore Admission"
                                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg flex items-center gap-1"
                                                        >
                                                            <RefreshCw size={18} />
                                                        </button>
                                                    ) : (
                                                        <>
                                                            {/* Invoice Button - Show for all ACTIVE enrollments */}
                                                            {ad.status === 'ACTIVE' && (
                                                                <button onClick={() => {
                                                                    setNewStudentData(ad);
                                                                    setShowInvoiceModal(true);
                                                                }} title="View Invoice" className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg">
                                                                    <Download size={18} />
                                                                </button>
                                                            )}

                                                            {/* Enroll/Assign Button - Show if PENDING */}
                                                            {ad.status !== 'ACTIVE' && (
                                                                <button onClick={() => handleEnroll(ad)} title="Verify & Assign Batch" className="p-2 text-green-600 hover:bg-green-50 rounded-lg ring-1 ring-green-200">
                                                                    <UserPlus size={18} />
                                                                </button>
                                                            )}

                                                            <button onClick={() => openEditModal(ad)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 size={18} /></button>
                                                            {/* <button onClick={() => setSelectedAdmission(ad)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"><Eye size={18} /></button> */}
                                                            <button onClick={() => handleDelete(ad.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modals */}
                {showEnrollModal && (
                    <AdminEnrollModal
                        isOpen={showEnrollModal}
                        onClose={() => setShowEnrollModal(false)}
                        type={modalType}
                        studentData={modalType === 'edit' ? newStudentData : enrollingStudent}
                        onSuccess={() => dispatch(fetchAdmissions())}
                    />
                )}

                {showInvoiceModal && newStudentData && (
                    <InvoiceModal
                        isOpen={showInvoiceModal}
                        onClose={() => setShowInvoiceModal(false)}
                        studentData={newStudentData}
                    />
                )}
            </div>
        </>
    );
};

export default Admissions;
