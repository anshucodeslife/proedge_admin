import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReferrals, createReferral, deleteReferral } from '../../store/slices/referralSlice';
import { Search, Plus, Trash2, Copy, Percent, Users, Award } from 'lucide-react';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';

const Referrals = () => {
    const dispatch = useDispatch();
    const { list: referrals, stats, loading } = useSelector((state) => state.referrals);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ code: '', discount: '', maxUses: '', expiryDate: '' });

    useEffect(() => {
        dispatch(fetchReferrals());
    }, [dispatch]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await dispatch(createReferral(formData)).unwrap();
            setShowModal(false);
            setFormData({ code: '', discount: '', maxUses: '', expiryDate: '' });
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
                <button onClick={() => setShowModal(true)} className="bg-[#00C08B] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#00a074]">
                    <Plus size={20} /> Create New Code
                </button>
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
                            <th className="p-4">Discount</th>
                            <th className="p-4">Usage</th>
                            <th className="p-4">Expiry</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? <tr><td colSpan="6" className="p-8 text-center">Loading...</td></tr> :
                            filteredReferrals.map(ref => (
                                <tr key={ref.id} className="hover:bg-gray-50">
                                    <td className="p-4 font-mono font-medium text-purple-600">{ref.code}</td>
                                    <td className="p-4 font-bold text-green-600">₹{ref.discountAmount}</td>
                                    <td className="p-4">{ref.usedCount} / {ref.usageLimit || '∞'}</td>
                                    <td className="p-4 text-sm text-gray-600">{new Date(ref.expiryDate).toLocaleDateString()}</td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded bg-green-100 text-green-700 text-xs`}>Active</span></td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
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
                                <label className="block text-sm font-medium mb-1">Discount Amount (₹)</label>
                                <input required type="number" value={formData.discount} onChange={e => setFormData({ ...formData, discount: e.target.value })} className="w-full p-2 border rounded" placeholder="e.g. 500" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Max Uses</label>
                                    <input type="number" value={formData.maxUses} onChange={e => setFormData({ ...formData, maxUses: e.target.value })} className="w-full p-2 border rounded" placeholder="Optional" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                                    <input required type="date" value={formData.expiryDate} onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} className="w-full p-2 border rounded" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border rounded hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-[#00C08B] text-white rounded hover:bg-[#00a074]">Create</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Referrals;
