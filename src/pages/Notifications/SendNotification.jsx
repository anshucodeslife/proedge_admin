import { useState, useEffect } from 'react';
import { Send, Users, User, BookOpen, Mail, Bell } from 'lucide-react';
import api from '../../api/axios';
import Swal from 'sweetalert2';

const SendNotification = ({ onSuccess }) => { // Added onSuccess prop
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [recipientType, setRecipientType] = useState('all'); // all, course, individual
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [sendEmail, setSendEmail] = useState(false);
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await api.get('/courses');
            setCourses(res.data.data?.courses || []);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const searchStudents = async (query) => {
        if (!query) {
            setStudents([]);
            return;
        }
        try {
            const res = await api.get(`/admin/students/search?q=${query}`);
            setStudents(res.data.data || []);
        } catch (error) {
            console.error('Error searching students:', error);
        }
    };

    const handleSend = async () => {
        if (!title || !message) {
            Swal.fire('Error', 'Please fill in title and message', 'error');
            return;
        }

        setLoading(true);
        try {
            let userIds = [];

            if (recipientType === 'individual') {
                userIds = selectedUsers;
            } else if (recipientType === 'course') {
                // Fetch students enrolled in selected course
                const res = await api.get(`/enrollments?courseId=${selectedCourse}`);
                userIds = res.data.data.map(e => e.userId);
            }

            await api.post('/notifications/send', {
                title,
                message,
                type: sendEmail ? 'EMAIL' : 'IN_APP',
                userIds: recipientType === 'all' ? [] : userIds,
                sendEmail,
            });

            Swal.fire('Success', 'Notification sent successfully!', 'success');
            setTitle('');
            setMessage('');
            setSelectedUsers([]);
            setShowPreview(false);
            if (onSuccess) onSuccess(); // Callback
        } catch (error) {
            console.error('Error sending notification:', error);
            Swal.fire('Error', 'Failed to send notification', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className=""> {/* Removed padding to fit in modal better */}
            {/* Title section removed to not duplicate modal header if used there, or can keep it specific */}

            <div className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Notification title"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>

                {/* Message */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Notification message"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                </div>

                {/* Recipient Type */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Recipients</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => setRecipientType('all')}
                            className={`p-4 border-2 rounded-lg flex items-center gap-2 ${recipientType === 'all' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                                }`}
                        >
                            <Users className="w-5 h-5" />
                            <span>All Students</span>
                        </button>
                        <button
                            onClick={() => setRecipientType('course')}
                            className={`p-4 border-2 rounded-lg flex items-center gap-2 ${recipientType === 'course' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                                }`}
                        >
                            <BookOpen className="w-5 h-5" />
                            <span>Specific Course</span>
                        </button>
                        <button
                            onClick={() => setRecipientType('individual')}
                            className={`p-4 border-2 rounded-lg flex items-center gap-2 ${recipientType === 'individual' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
                                }`}
                        >
                            <User className="w-5 h-5" />
                            <span>Individual</span>
                        </button>
                    </div>
                </div>

                {/* Course Selection */}
                {recipientType === 'course' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Select Course</label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="">Choose a course</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Individual Selection */}
                {recipientType === 'individual' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Search Students</label>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                searchStudents(e.target.value);
                            }}
                            placeholder="Search by student ID, name, or email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent mb-2"
                        />
                        {students.length > 0 && (
                            <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                                {students.map(student => (
                                    <div
                                        key={student.id}
                                        onClick={() => {
                                            if (!selectedUsers.includes(student.id)) {
                                                setSelectedUsers([...selectedUsers, student.id]);
                                            }
                                        }}
                                        className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                                    >
                                        <div className="font-medium">{student.fullName}</div>
                                        <div className="text-sm text-gray-600">{student.studentId} • {student.email}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedUsers.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600 mb-2">Selected: {selectedUsers.length} students</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Send Email Option */}
                <div>
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={sendEmail}
                            onChange={(e) => setSendEmail(e.target.checked)}
                            className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <Mail className="w-4 h-4" />
                        <span className="text-sm font-medium text-gray-700">Also send via email</span>
                    </label>
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 border-t">
                    <button
                        onClick={() => setShowPreview(true)}
                        className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                        Preview
                    </button>
                    <button
                        onClick={handleSend}
                        disabled={loading || !title || !message}
                        className="flex-1 px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        <Send className="w-4 h-4" />
                        {loading ? 'Sending...' : 'Send Notification'}
                    </button>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Preview</h3>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Bell className="w-5 h-5 text-orange-500" />
                                <h4 className="font-semibold">{title}</h4>
                            </div>
                            <p className="text-gray-700">{message}</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowPreview(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <button
                                onClick={() => {
                                    setShowPreview(false);
                                    handleSend();
                                }}
                                className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                            >
                                Send Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SendNotification;
