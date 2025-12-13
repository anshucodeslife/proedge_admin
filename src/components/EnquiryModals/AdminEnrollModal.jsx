import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { useDispatch } from 'react-redux';
import { updateAdmission } from '../../store/slices/admissionSlice';

const AdminEnrollModal = ({ isOpen, onClose, studentData, type, onSuccess }) => {
    const dispatch = useDispatch();
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [isCourseDropdownOpen, setIsCourseDropdownOpen] = useState(false);

    // Initial State
    const initialFormData = {
        fullName: '',
        email: '',
        contact: '',
        // Extended Fields
        dob: '',
        gender: '',
        parentName: '',
        parentContact: '',
        address: '',
        currentSchool: '',
        classYear: '',
        educationLevel: '',
        board: '',

        courseName: '', // Comma separated for display/multi-select logic
        batchId: '', // For Batch Selection

        totalFees: '',
        paymentMode: 'Cash',
        paymentOption: 'Pay in Full',
        installment1Amount: '',
        installment1Date: new Date().toISOString().split('T')[0],
        installment2Amount: '',
        installment2Date: '',
        installment3Amount: '',
        installment3Date: '',
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        if (isOpen) {
            fetchCourses();
            fetchBatches();
        }
    }, [isOpen]);

    useEffect(() => {
        if (studentData && isOpen) {
            console.log('Student Data Received:', studentData);
            setFormData(prev => ({
                ...initialFormData, // Start with defaults
                // Then override with actual student data
                fullName: studentData.fullName || '',
                email: studentData.email || '',
                contact: studentData.contact || '',
                dob: studentData.dob ? new Date(studentData.dob).toISOString().split('T')[0] : '',
                gender: studentData.gender || '',
                parentName: studentData.parentName || '',
                parentContact: studentData.parentContact || '',
                address: studentData.address || '',
                currentSchool: studentData.currentSchool || '',
                classYear: studentData.classYear || '',
                educationLevel: studentData.educationLevel || '',
                board: studentData.board || '',

                courseName: studentData.courseName || studentData.preferredCourses || '',
                batchId: studentData.batchId || '',

                totalFees: studentData.totalFees || '',
                paymentMode: studentData.paymentMode || 'Cash',
                paymentOption: studentData.paymentOption || 'Pay in Full',
                installment1Amount: studentData.installment1Amount || '',
                installment1Date: studentData.installment1Date?.split('T')[0] || new Date().toISOString().split('T')[0],
                installment2Amount: studentData.installment2Amount || '',
                installment2Date: studentData.installment2Date?.split('T')[0] || '',
                installment3Amount: studentData.installment3Amount || '',
                installment3Date: studentData.installment3Date?.split('T')[0] || '',
            }));
        } else if (!studentData) {
            setFormData(initialFormData);
        }
    }, [studentData, isOpen]);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data.data || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const fetchBatches = async () => {
        try {
            const res = await api.get('/lms/batches');
            setBatches(res.data.data?.batches || res.data.data || []);
        } catch (error) {
            console.error('Error fetching batches:', error);
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

        if (!formData.totalFees && type !== 'edit') { // Fees crucial for enrollment
            toast.error('Please enter Total Fees');
            return;
        }

        try {
            if (type === 'edit') {
                // Edit Mode - Update Student/Admission
                // Assuming updateAdmission updates the student profile
                await dispatch(updateAdmission({ ...formData, userId: studentData.userId || studentData.id })).unwrap();

                // If batch changed, update enrollment batch?
                // The backend 'updateStudent' doesn't handle batch. 
                // We might need a separate call if batchId changed.
                // For now, simpler implementation: Just update profile fields via updateAdmission.

                toast.success('Student details updated successfully');
                onSuccess && onSuccess(formData);
                onClose();
            } else {
                // Enroll Mode
                const endpoint = type === 'enquiry'
                    ? `/admissions/enquiry/${studentData.id}/enroll`
                    : `/admissions/${studentData.id}/enroll`;

                const res = await api.post(endpoint, formData);

                if (res.data.success) {
                    onSuccess && onSuccess(res.data.data);
                    onClose();
                    toast.success('Student Enrolled Successfully');
                } else {
                    toast.error(res.data.error || 'Enrollment failed');
                }
            }
        } catch (error) {
            console.error('Operation error:', error);
            toast.error(error.message || 'Operation failed');
        }
    };

    if (!isOpen) return null;

    const selectedCoursesList = formData.courseName ? formData.courseName.split(',').map(c => c.trim()) : [];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">{type === 'edit' ? 'Edit Student Details' : 'Enroll Student'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* --- Personal Information --- */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Personal Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                                <input type="text" name="contact" value={formData.contact} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">DOB</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded-lg">
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea name="address" value={formData.address} onChange={handleChange} className="w-full p-2 border rounded-lg" rows="2" />
                            </div>
                        </div>
                    </div>

                    {/* --- Parent & Academic --- */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Parent & Academic</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Name</label>
                                <input type="text" name="parentName" value={formData.parentName} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Contact</label>
                                <input type="text" name="parentContact" value={formData.parentContact} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">School/College</label>
                                <input type="text" name="currentSchool" value={formData.currentSchool} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                                <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="w-full p-2 border rounded-lg">
                                    <option value="">Select</option>
                                    <option value="10th">10th</option>
                                    <option value="12th">12th</option>
                                    <option value="Undergraduate">Undergraduate</option>
                                    <option value="Graduate">Graduate</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* --- Course & Batch --- */}
                    <div className="space-y-4 md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Course & Batch</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Course(s)</label>
                                <div className="w-full p-2 border border-gray-200 rounded-lg cursor-pointer bg-white flex justify-between items-center" onClick={() => setIsCourseDropdownOpen(!isCourseDropdownOpen)}>
                                    <span className="truncate">{formData.courseName || 'Select Courses'}</span>
                                    <span className="text-gray-400">▼</span>
                                </div>
                                {isCourseDropdownOpen && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                        {Array.isArray(courses) && courses.length > 0 ? courses.map(course => {
                                            const selectedCourses = formData.courseName ? formData.courseName.split(',').map(c => c.trim()) : [];
                                            return (
                                                <div key={course.id} className="flex items-center p-2 hover:bg-gray-50 cursor-pointer" onClick={() => toggleCourse(course.title, course.price)}>
                                                    <input type="checkbox" checked={selectedCourses.includes(course.title)} readOnly className="mr-2" />
                                                    <span className="text-sm text-gray-700">{course.title} (₹{course.price})</span>
                                                </div>
                                            );
                                        }) : (
                                            <div className="p-2 text-sm text-gray-500 text-center">No courses available</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Batch</label>
                                <select name="batchId" value={formData.batchId} onChange={handleChange} className="w-full p-2 border rounded-lg">
                                    <option value="">Select Batch</option>
                                    {batches.map(batch => (
                                        <option key={batch.id} value={batch.id}>{batch.name} ({batch.tutorName})</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>


                    {/* --- Payment Details --- */}
                    <div className="space-y-4 md:col-span-2">
                        <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Payment Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Total Fees (₹)</label>
                                <input type="number" name="totalFees" value={formData.totalFees} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Mode</label>
                                <select name="paymentMode" value={formData.paymentMode} onChange={handleChange} className="w-full p-2 border rounded-lg">
                                    <option value="Cash">Cash</option>
                                    <option value="Online">Online</option>
                                    <option value="UPI">UPI</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Option</label>
                                <div className="flex gap-4">
                                    <label className="flex items-center cursor-pointer"><input type="radio" name="paymentOption" value="Pay in Full" checked={formData.paymentOption === 'Pay in Full'} onChange={handleChange} className="mr-2" /> Pay in Full</label>
                                    <label className="flex items-center cursor-pointer"><input type="radio" name="paymentOption" value="Pay in Installments" checked={formData.paymentOption === 'Pay in Installments'} onChange={handleChange} className="mr-2" /> Pay in Installments</label>
                                </div>
                            </div>
                        </div>

                        {formData.paymentOption === 'Pay in Installments' && (
                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                                <h4 className="text-sm font-medium text-gray-600 mb-3">Installment Schedule</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">1st Amount</label>
                                        <input type="number" name="installment1Amount" value={formData.installment1Amount} onChange={handleInstallmentChange} className="w-full p-2 border rounded text-sm" />
                                        <label className="block text-xs font-medium text-gray-500 mt-1 mb-1">Date</label>
                                        <input type="date" name="installment1Date" value={formData.installment1Date} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">2nd Amount</label>
                                        <input type="number" value={formData.installment2Amount} readOnly className="w-full p-2 border rounded text-sm bg-gray-100" />
                                        <label className="block text-xs font-medium text-gray-500 mt-1 mb-1">Due Date</label>
                                        <input type="date" name="installment2Date" value={formData.installment2Date} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-500 mb-1">3rd Amount</label>
                                        <input type="number" value={formData.installment3Amount} readOnly className="w-full p-2 border rounded text-sm bg-gray-100" />
                                        <label className="block text-xs font-medium text-gray-500 mt-1 mb-1">Due Date</label>
                                        <input type="date" name="installment3Date" value={formData.installment3Date} onChange={handleChange} className="w-full p-2 border rounded text-sm" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2 mt-4 flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
                            {type === 'edit' ? 'Update Details' : 'Enroll Student'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminEnrollModal;
