import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, UserCheck, UserX, Key } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { 
  fetchStudents, 
  addStudent, 
  updateStudent, 
  deleteStudent,
  updateStudentStatus,
  bulkUpdateStatus,
  bulkAssignCourse,
  resetStudentPassword,
  setFilters,
  toggleStudentSelection,
  clearSelectedStudents
} from '../../store/slices/studentSlice';

export const StudentsList = () => {
  const { list: students, pagination, filters, loading, selectedStudents } = useSelector(state => state.students);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [resetPasswordStudent, setResetPasswordStudent] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', phone: '', studentId: '', dob: ''
  });

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    dispatch(fetchStudents({ 
      page: pagination.page,
      limit: pagination.limit,
      ...filters 
    }));
  }, [dispatch, pagination.page, filters]);

  const handleSearch = () => {
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchStudents({ page: 1, search: searchTerm, status: statusFilter }));
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    dispatch(setFilters({ status }));
    dispatch(fetchStudents({ page: 1, status }));
  };

  const handlePageChange = (newPage) => {
    dispatch(fetchStudents({ 
      page: newPage,
      ...filters 
    }));
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingStudent) {
      await dispatch(updateStudent({ id: editingStudent.id, data: formData }));
    } else {
      await dispatch(addStudent(formData));
    }
    dispatch(fetchStudents({ page: pagination.page, ...filters }));
    closeModal();
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      fullName: student.fullName || '',
      email: student.email || '',
      password: '',
      phone: student.phone || '',
      studentId: student.studentId || '',
      dob: student.dob || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      await dispatch(deleteStudent(id));
      dispatch(fetchStudents({ page: pagination.page, ...filters }));
    }
  };

  const handleToggleStatus = async (student) => {
    const newStatus = student.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await dispatch(updateStudentStatus({ id: student.id, status: newStatus }));
    dispatch(fetchStudents({ page: pagination.page, ...filters }));
  };

  const handleResetPassword = async () => {
    if (resetPasswordStudent && newPassword) {
      await dispatch(resetStudentPassword({ id: resetPasswordStudent.id, newPassword }));
      setIsResetPasswordOpen(false);
      setResetPasswordStudent(null);
      setNewPassword('');
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedStudents.length > 0) {
      await dispatch(bulkUpdateStatus({ studentIds: selectedStudents, status }));
      dispatch(clearSelectedStudents());
      dispatch(fetchStudents({ page: pagination.page, ...filters }));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStudent(null);
    setFormData({ fullName: '', email: '', password: '', phone: '', studentId: '', dob: '' });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      dispatch({ type: 'students/setSelectedStudents', payload: students.map(s => s.id) });
    } else {
      dispatch(clearSelectedStudents());
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students Management</h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={20} /> Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 mb-6">
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or student ID..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
          </div>
          <select
            className="px-4 py-2 border rounded-lg"
            value={statusFilter}
            onChange={(e) => handleStatusFilterChange(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
          <Button onClick={handleSearch} className="flex items-center gap-2">
            <Filter size={20} /> Apply Filters
          </Button>
        </div>
      </Card>

      {/* Bulk Actions */}
      {selectedStudents.length > 0 && (
        <Card className="p-4 mb-4 bg-blue-50">
          <div className="flex items-center justify-between">
            <span className="font-medium">{selectedStudents.length} students selected</span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleBulkStatusUpdate('ACTIVE')}>
                Activate All
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleBulkStatusUpdate('INACTIVE')}>
                Deactivate All
              </Button>
              <Button size="sm" variant="outline" onClick={() => dispatch(clearSelectedStudents())}>
                Clear Selection
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Students Table */}
      <Card>
        {loading ? (
          <div className="p-8 text-center">Loading students...</div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No students found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-left">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={selectedStudents.length === students.length && students.length > 0}
                    />
                  </th>
                  <th className="p-4 text-left">Student ID</th>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Enrollments</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => dispatch(toggleStudentSelection(student.id))}
                      />
                    </td>
                    <td className="p-4 font-medium">{student.studentId}</td>
                    <td className="p-4">{student.fullName}</td>
                    <td className="p-4">{student.email}</td>
                    <td className="p-4">
                      <Badge variant={student.status === 'ACTIVE' ? 'success' : 'danger'}>
                        {student.status}
                      </Badge>
                    </td>
                    <td className="p-4">{student._count?.enrollments || 0}</td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(student)}
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(student)}
                          className="p-2 hover:bg-gray-100 rounded"
                          title={student.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                        >
                          {student.status === 'ACTIVE' ? <UserX size={18} /> : <UserCheck size={18} />}
                        </button>
                        <button
                          onClick={() => {
                            setResetPasswordStudent(student);
                            setIsResetPasswordOpen(true);
                          }}
                          className="p-2 hover:bg-gray-100 rounded"
                          title="Reset Password"
                        >
                          <Key size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(student.id)}
                          className="p-2 hover:bg-gray-100 rounded text-red-600"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-600">
              Showing {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </Button>
              <span className="px-4 py-2">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add/Edit Student Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingStudent ? 'Edit Student' : 'Add Student'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required />
          <InputField label="Email" type="email" name="email" value={formData.email} onChange={handleChange} required />
          <InputField label="Student ID" name="studentId" value={formData.studentId} onChange={handleChange} required />
          {!editingStudent && (
            <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required />
          )}
          <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
          <InputField label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} />
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit">{editingStudent ? 'Update' : 'Add'} Student</Button>
          </div>
        </form>
      </Modal>

      {/* Reset Password Modal */}
      <Modal isOpen={isResetPasswordOpen} onClose={() => setIsResetPasswordOpen(false)} title="Reset Password">
        <div className="space-y-4">
          <p>Reset password for: <strong>{resetPasswordStudent?.fullName}</strong></p>
          <InputField
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>Cancel</Button>
            <Button onClick={handleResetPassword}>Reset Password</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
