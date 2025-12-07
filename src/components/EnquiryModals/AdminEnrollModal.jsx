import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios'; // Using axios instance
import { Modal } from '../ui/Modal'; // Using UI Modal if suitable, but this is a custom complex modal

// Recreating as full component since UI Modal might be too simple
const AdminEnrollModal = ({ isOpen, onClose, studentData, type, onSuccess }) => {
    const [courses, setCourses] = useState([]);
    const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        contact: '',
        courseName: '',
        totalFees: '',
        paymentMode: 'Cash',
        paymentOption: 'Pay in Full',
        installment1Amount: '',
        installment1Date: new Date().toISOString().split('T')[0],
        installment2Amount: '',
        installment2Date: '',
        installment3Amount: '',
        installment3Date: '',
    });

    useEffect(() => {
        if (isOpen) {
            fetchCourses();
        }
    }, [isOpen]);

    useEffect(() => {
        if (studentData) {
            setFormData(prev => ({
                ...prev,
                fullName: studentData.fullName || '',
                email: studentData.email || '',
                contact: studentData.contact || '',
                courseName: studentData.courseName || studentData.preferredCourses || '',
                totalFees: studentData.totalFees || '',
                paymentMode: studentData.paymentMode || 'Cash',
                paymentOption: studentData.paymentOption || 'Pay in Full',
                installment1Amount: studentData.installment1Amount || '',
                installment1Date: studentData.installment1Date || new Date().toISOString().split('T')[0],
                installment2Amount: studentData.installment2Amount || '',
                installment2Date: studentData.installment2Date || '',
                installment3Amount: studentData.installment3Amount || '',
                installment3Date: studentData.installment3Date || '',
            }));
        }
    }, [studentData]);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses'); // Assuming public or admin route
            setCourses(res.data.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const toggleCourse = (courseTitle, coursePrice) => {
        const currentCourses = formData.courseName ? formData.courseName.split(',').map(c => c.trim()).filter(Boolean) : [];
        let newCourses;
        let newTotalFees = parseFloat(formData.totalFees) || 0;
        const price = parseFloat(coursePrice) || 0;

        if (currentCourses.includes(courseTitle)) {
            newCourses = currentCourses.filter(c => c !== courseTitle);
            newTotalFees = Math.max(0, newTotalFees - price);
        } else {
            newCourses = [...currentCourses, courseTitle];
            newTotalFees += price;
        }

        setFormData(prev => ({
            ...prev,
            courseName: newCourses.join(', '),
            totalFees: newTotalFees
        }));
    };

    const handleInstallmentChange = (e) => {
        const { name, value } = e.target;

        if (name === 'installment1Amount') {
            const amount = parseFloat(value) || 0;
            const total = parseFloat(formData.totalFees) || 0;
            if (amount > total) return;
            const remaining = total - amount;
            const nextInstallments = remaining > 0 ? remaining / 2 : 0;

            setFormData(prev => ({
                ...prev,
                installment1Amount: value,
                installment2Amount: nextInstallments.toFixed(2),
                installment3Amount: nextInstallments.toFixed(2)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.totalFees) {
            toast.error('Please enter Total Fees');
            return;
        }
        if (formData.paymentOption === 'Pay in Installments') {
            if (!formData.installment1Amount || !formData.installment2Date || !formData.installment3Date) {
                toast.error('Please fill all installment details');
                return;
            }
        }

        try {
            const endpoint = type === 'enquiry'
                ? `/admissions/enquiry/${studentData.id}/enroll`
                : `/admissions/${studentData.id}/enroll`; // Updated routes mapping

            const res = await api.post(endpoint, formData);

            if (res.data.success) {
                onSuccess(res.data.data);
                onClose();
                toast.success('Student Enrolled Successfully');
            } else {
                toast.error(res.data.error || 'Enrollment failed');
            }
        } catch (error) {
            console.error('Enrollment error:', error);
            toast.error(error.response?.data?.error || 'Failed to enroll student');
        }
    };

    if (!isOpen) return null;

    const selectedCoursesList = formData.courseName ? formData.courseName.split(',').map(c => c.trim()) : [];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Enroll Student</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
                    {/* Simplified for brevity - Fields same as source */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50" readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50" readOnly />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                            <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg bg-gray-50" readOnly />
                        </div>
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course(s)</label>
                            <div className="w-full p-2 border border-gray-200 rounded-lg cursor-pointer bg-white flex justify-between items-center" onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}>
                                <span className="truncate">{formData.courseName || 'Select Courses'}</span>
                                <span className="text-gray-400">▼</span>
                            </div>
                            {isCourseDropdownOpen && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                    {courses.map(course => (
                                        <div key={course.id} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer" onClick={() => toggleCourse(course.title, course.price)}>
                                            <input type="checkbox" checked={selectedCoursesList.includes(course.title)} readOnly className="mr-2" />
                                            <span className="text-sm text-gray-700">{course.title} (₹{course.price})</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">Payment Details</h3>
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Fees (₹)</label>
                            <input type="number" name="totalFees" value={formData.totalFees} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                            <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="w-full p-2 border border-gray-200 rounded-lg">
                                <option value="Cash">Cash</option>
                                <option value="Online">Online</option>
                                <option value="UPI">UPI</option>
                                <option value="Bank Transfer">Bank Transfer</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Option</label>
                        <div className="flex gap-4">
                            <label className="flex items-center cursor-pointer"><input type="radio" name="paymentOption" value="Pay in Full" checked={formData.paymentOption === 'Pay in Full'} onChange={handleChange} className="mr-2" /> Pay in Full</label>
                            <label className="flex items-center cursor-pointer"><input type="radio" name="paymentOption" value="Pay in Installments" checked={formData.paymentOption === 'Pay in Installments'} onChange={handleChange} className="mr-2" /> Pay in Installments</label>
                        </div>
                    </div>

                    {formData.paymentOption === 'Pay in Installments' && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-medium text-gray-500 mb-1">1st Installment</label><input type="number" name="installment1Amount" value={formData.installment1Amount} onChange={handleInstallmentChange} className="w-full p-2 border rounded text-sm" /></div>
                                <div><label className="block text-xs font-medium text-gray-500 mb-1">Date</label><input type="date" name="installment1Date" value={formData.installment1Date} onChange={handleChange} className="w-full p-2 border rounded text-sm" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-medium text-gray-500 mb-1">2nd Installment</label><input type="number" value={formData.installment2Amount} readOnly className="w-full p-2 border rounded text-sm bg-gray-100" /></div>
                                <div><label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label><input type="date" name="installment2Date" value={formData.installment2Date} onChange={handleChange} className="w-full p-2 border rounded text-sm" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-medium text-gray-500 mb-1">3rd Installment</label><input type="number" value={formData.installment3Amount} readOnly className="w-full p-2 border rounded text-sm bg-gray-100" /></div>
                                <div><label className="block text-xs font-medium text-gray-500 mb-1">Due Date</label><input type="date" name="installment3Date" value={formData.installment3Date} onChange={handleChange} className="w-full p-2 border rounded text-sm" /></div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700">Enroll Student</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminEnrollModal;
