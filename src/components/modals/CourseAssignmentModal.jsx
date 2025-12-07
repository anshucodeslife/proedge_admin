import { useState, useEffect } from 'react';
import { X, UserPlus } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const CourseAssignmentModal = ({ isOpen, onClose, onSuccess, courses = [] }) => {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [allStudents, setAllStudents] = useState([]);
    const [filteredStudents, setFilteredStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchAllStudents();
        }
    }, [isOpen]);

    const fetchAllStudents = async () => {
        try {
            const res = await axios.get('/admin/students');
            const students = res.data.data || res.data || [];
            setAllStudents(students);
            setFilteredStudents(students);
        } catch (error) {
            console.error('Error fetching students:', error);
            setAllStudents([]);
            setFilteredStudents([]);
        }
    };

    const handleSearchChange = (query) => {
        setSearchQuery(query);
        if (!query) {
            setFilteredStudents(allStudents);
        } else {
            const filtered = allStudents.filter(student =>
                student.fullName?.toLowerCase().includes(query.toLowerCase()) ||
                student.studentId?.toLowerCase().includes(query.toLowerCase()) ||
                student.email?.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredStudents(filtered);
        }
    };

    const toggleStudent = (student) => {
        setSelectedStudents(prev => {
            const exists = prev.find(s => s.id === student.id);
            if (exists) {
                return prev.filter(s => s.id !== student.id);
            } else {
                return [...prev, student];
            }
        });
    };

    const handleAssign = async () => {
        if (!selectedCourse || selectedStudents.length === 0) {
            Swal.fire('Error', 'Please select a course and at least one student', 'error');
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`/admin/courses/${selectedCourse}/assign`, {
                userIds: selectedStudents.map(s => s.id),
            });

            Swal.fire('Success', `Successfully assigned course to ${res.data.data.success?.length || 0} students`, 'success');
            onSuccess();
            handleClose();
        } catch (error) {
            console.error('Error assigning course:', error);
            Swal.fire('Error', 'Failed to assign course', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedCourse('');
        setSearchQuery('');
        setFilteredStudents(allStudents);
        setSelectedStudents([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Assign Course to Students</h2>
                    <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Course Selection */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    >
                        <option value="">Choose a course</option>
                        {Array.isArray(courses) && courses.map(course => (
                            <option key={course.id} value={course.id}>{course.title}</option>
                        ))}
                    </select>
                </div>

                {/* Student Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Students</label>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search students..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-2"
                    />
                </div>

                {/* Student List */}
                {filteredStudents.length > 0 && (
                    <div className="mb-4 border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                        {filteredStudents.map(student => {
                            const isSelected = selectedStudents.find(s => s.id === student.id);
                            return (
                                <div
                                    key={student.id}
                                    onClick={() => toggleStudent(student)}
                                    className={`p-3 cursor-pointer border-b last:border-b-0 ${isSelected ? 'bg-orange-50' : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{student.fullName || student.name}</div>
                                            <div className="text-sm text-gray-600">{student.studentId} • {student.email}</div>
                                        </div>
                                        {isSelected && (
                                            <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                                                <X className="w-3 h-3 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Selected Students */}
                {selectedStudents.length > 0 && (
                    <div className="mb-6">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                            Selected Students ({selectedStudents.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {selectedStudents.map(student => (
                                <div
                                    key={student.id}
                                    className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full flex items-center gap-2"
                                >
                                    <span className="text-sm">{student.fullName}</span>
                                    <button
                                        onClick={() => toggleStudent(student)}
                                        className="hover:bg-orange-200 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4">
                    <button
                        onClick={handleClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleAssign}
                        disabled={!selectedCourse || selectedStudents.length === 0 || loading}
                        className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        {loading ? 'Assigning...' : `Assign to ${selectedStudents.length} Student(s)`}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseAssignmentModal;
