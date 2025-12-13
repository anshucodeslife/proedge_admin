import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReferrals, createReferral, deleteReferral } from '../../store/slices/referralSlice';
import { Search, Plus, Trash2, Copy, Percent, Users, Award, Eye, X, Edit2, Tag } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';

const Referrals = () => {
    const dispatch = useDispatch();
    const { list: referrals, stats, loading } = useSelector((state) => state.referrals);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ code: '', discount: '' });

    // New state for details modal
    const [selectedReferral, setSelectedReferral] = useState(null);
    const [referralStudents, setReferralStudents] = useState([]);
    const [loadingStudents, setLoadingStudents] = useState(false);

    useEffect(() => {
        dispatch(fetchReferrals());
    }, [dispatch]);

    const fetchReferralStudents = async (code) => {
        setLoadingStudents(true);
        try {
            const res = await api.get(`/api/students/by-referral`, {
                params: { code }
            });
            if (res.data.success) {
                setReferralStudents(res.data.data);
            } else {
                setReferralStudents([]);
            }
        } catch (error) {
            console.error('Error fetching referral students:', error);
            setReferralStudents([]);
        } finally {
            setLoadingStudents(false);
        }
    };

    const handleViewDetails = (referral) => {
        setSelectedReferral(referral);
        fetchReferralStudents(referral.code);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createReferral(formData)).unwrap();
            setShowModal(false);
            setFormData({ code: '', discount: '' });
            toast.success('Referral code created successfully');
        } catch (error) {
            toast.error(error || 'Failed to create referral');
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This will deactivate the referral code.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        });

        if (result.isConfirmed) {
            try {
                await dispatch(deleteReferral(id)).unwrap();
                Swal.fire('Deleted!', 'Referral code has been deleted.', 'success');
                if (selectedReferral?.id === id) setSelectedReferral(null);
            } catch (error) {
                Swal.fire('Error', 'Failed to delete referral.', 'error');
            }
        }
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(`Code ${code} copied!`);
    };

    const filteredReferrals = referrals.filter(ref =>
        ref.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Referral Management</h1>
                    <p className="text-gray-500 text-sm">Create and track referral codes</p>
                </div>
                <Button onClick={() => setShowModal(true)} icon={Plus}>Create New Code</Button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-purple-500">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Referrals</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stats.totalCodes}</h3>
                            </div>
                            <Award className="text-purple-500 opacity-20" size={32} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Total Redeemed</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stats.totalRedeemed}</h3>
                            </div>
                            <Users className="text-blue-500 opacity-20" size={32} />
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-green-500">
                        <div className="flex justify-between">
                            <div>
                                <p className="text-gray-500 text-sm">Active Codes</p>
                                <h3 className="text-2xl font-bold text-gray-800">{stats.activeCodes}</h3>
                            </div>
                            <Percent className="text-green-500 opacity-20" size={32} />
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search codes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00C08B]"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
                        <tr>
                            <th className="p-4">Code</th>
                            <th className="p-4">Discount (%)</th>
                            <th className="p-4">Usage Count</th>
                            <th className="p-4">Total Discount</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? <tr><td colSpan="6" className="p-8 text-center">Loading...</td></tr> :
                            filteredReferrals.map(ref => (
                                <tr key={ref.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-mono font-medium text-purple-600">{ref.code}</td>
                                    <td className="p-4 font-bold text-gray-700">{ref.discount}%</td>
                                    <td className="p-4 text-gray-700">{ref._count?.usages || 0}</td>
                                    <td className="p-4 text-gray-700 font-medium">₹{ref.totalDiscount || 0}</td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded bg-green-100 text-green-700 text-xs`}>Active</span></td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleViewDetails(ref)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Eye size={16} /></button>
                                            <button onClick={() => copyToClipboard(ref.code)} className="p-2 text-gray-500 hover:bg-gray-100 rounded"><Copy size={16} /></button>
                                            <button onClick={() => handleDelete(ref.id)} className="p-2 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Create New Referral</h2>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Referral Code</label>
                                <input required type="text" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} className="w-full p-2 border rounded" placeholder="e.g. SUMMER50" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Discount Percentage (%)</label>
                                <input required type="number" min="0" max="100" step="0.01" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} className="w-full p-2 border rounded" placeholder="e.g. 10" />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#00C08B] text-white rounded hover:bg-[#00a074]">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Referral Details Modal */}
            {selectedReferral && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Referral Details</h2>
                            <button onClick={() => setSelectedReferral(null)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">Code</h3>
                                        <p className="text-gray-800 font-bold">{selectedReferral.code}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">Discount</h3>
                                        <p className="text-gray-800 font-bold">{selectedReferral.discount}%</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">Usage</h3>
                                        <p className="text-gray-800 font-bold">{selectedReferral._count?.usages || 0}</p>
                                    </div>
                                    <div>
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">Total Discount</h3>
                                        <p className="text-[#00C08B] font-bold">₹{selectedReferral.totalDiscount?.toLocaleString('en-IN') || 0}</p>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Student Usage History</h3>
                                    {loadingStudents ? (
                                        <p className="text-gray-500 text-sm">Loading students...</p>
                                    ) : referralStudents.length === 0 ? (
                                        <p className="text-gray-500 text-sm italic">No students have used this code yet.</p>
                                    ) : (
                                        <div className="overflow-x-auto border border-gray-100 rounded-lg">
                                            <table className="w-full text-left text-sm">
                                                <thead className="bg-gray-50 text-gray-600">
                                                    <tr>
                                                        <th className="p-3 font-medium">Student Name</th>
                                                        <th className="p-3 font-medium">Course</th>
                                                        <th className="p-3 font-medium">Original Fees</th>
                                                        <th className="p-3 font-medium">Discount Given</th>
                                                        <th className="p-3 font-medium">Date</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {referralStudents.map(student => (
                                                        <tr key={student.id} className="hover:bg-gray-50">
                                                            <td className="p-3 text-gray-800">{student.fullName || student.full_name}</td>
                                                            <td className="p-3 text-gray-600">{student.courseName || student.course_name || '-'}</td>
                                                            <td className="p-3 text-gray-600">₹{student.originalFees?.toLocaleString('en-IN') || 0}</td>
                                                            <td className="p-3 text-green-600 font-medium">₹{((Number(student.originalFees) || 0) - (Number(student.totalFees) || 0)).toLocaleString('en-IN')}</td>
                                                            <td className="p-3 text-gray-500">{new Date(student.createdAt || student.created_at).toLocaleDateString()}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                            <button
                                onClick={() => setSelectedReferral(null)}
                                className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Referrals;
