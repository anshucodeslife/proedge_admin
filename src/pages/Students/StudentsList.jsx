import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit2, Trash2, Eye, Search, X, Download, FileText, AlertCircle } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { addStudent, fetchStudents, updateStudent, deleteStudent } from '../../store/slices/studentSlice';
import toast from 'react-hot-toast';
import InvoiceModal from '../../components/EnquiryModals/InvoiceModal';
import Swal from 'sweetalert2';

export const StudentsList = () => {
  const { list: students, loading } = useSelector(state => state.students);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // For Edit/Add
  const [viewModalOpen, setViewModalOpen] = useState(false); // For View Details
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [invoiceStudent, setInvoiceStudent] = useState(null);

  const [formData, setFormData] = useState({});

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // --- Helpers ---
  const getDueDateStatus = (dateString) => {
    if (!dateString) return 'normal';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(dateString);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'overdue';
    if (diffDays <= 5) return 'upcoming';
    return 'normal';
  };

  const hasPaymentAlert = (student) => {
    if (student.paymentOption !== 'Pay in Installments') return false;
    const installments = [
      { date: student.installment1Date, paid: student.installment1Paid },
      { date: student.installment2Date, paid: student.installment2Paid },
      { date: student.installment3Date, paid: student.installment3Paid }
    ];
    return installments.some(inst => {
      if (inst.paid) return false;
      const status = getDueDateStatus(inst.date);
      return status === 'overdue' || status === 'upcoming';
    });
  };

  // --- Handlers ---
  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredStudents = students.filter(student =>
    (student.fullName && student.fullName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (student.contact && student.contact.includes(searchTerm)) ||
    (student.studentId && student.studentId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({ ...student }); // Clone data
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingStudent(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleView = (student) => {
    setSelectedStudent(student);
    setViewModalOpen(true);
  };

  const handleViewInvoice = (student) => {
    setInvoiceStudent(student);
    setShowInvoiceModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?', text: "You won't be able to revert this!", icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, delete it!'
    });
    if (result.isConfirmed) {
      dispatch(deleteStudent(id));
      // success toast is handled in slice or we can add here
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await dispatch(updateStudent({ id: editingStudent.id, data: formData })).unwrap();
        toast.success('Student updated successfully');
      } else {
        await dispatch(addStudent({ ...formData, isPreApproved: true })).unwrap();
        toast.success('Student registered successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Operation failed: ' + (error.message || 'Unknown error'));
    }
  };

  // Helper for consistent Select Input
  const SelectField = ({ label, value, onChange, options }) => (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-600 text-sm appearance-none bg-white"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </div>
  );

  const handleExportCSV = () => {
    if (!students.length) return toast.error('No data to export');
    const headers = ['ID', 'Name', 'Email', 'Contact', 'Course', 'Pay Mode', 'Total Fees', 'Installment 1', 'Installment 2', 'Installment 3'];
    const csvContent = [
      headers.join(','),
      ...students.map(s => [
        s.studentId, `"${s.fullName}"`, s.email, s.phone || s.contact,
        `"${s.courseName}"`, s.paymentMode, s.totalFees,
        s.installment1Amount, s.installment2Amount, s.installment3Amount
      ].join(','))
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Enrolled Students</h2>
          <p className="text-slate-500 text-sm">Manage student admissions and profiles</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} icon={Download}>Export CSV</Button>
          <Button onClick={handleCreate} icon={Plus}>Add Student</Button>
        </div>
      </div>

      {/* List */}
      <Card>
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center">Loading...</td></tr>
              ) : filteredStudents.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center">No students found.</td></tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{student.studentId || '-'}</td>
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <div className="flex items-center gap-2">
                        {student.fullName}
                        {hasPaymentAlert(student) && (
                          <div className="group relative">
                            <AlertCircle size={16} className="text-orange-500" />
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">{student.email}</div>
                    </td>
                    <td className="px-6 py-4">{student.courseName || '-'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleViewInvoice(student)} className="p-2 text-purple-600 hover:bg-purple-50 rounded" title="Invoice"><FileText size={18} /></button>
                        <button onClick={() => handleEdit(student)} className="p-2 text-blue-600 hover:bg-blue-50 rounded" title="Edit"><Edit2 size={18} /></button>
                        <button onClick={() => handleView(student)} className="p-2 text-slate-600 hover:bg-slate-50 rounded" title="Details"><Eye size={18} /></button>
                        <button onClick={() => handleDelete(student.id)} className="p-2 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit/Add Modal - Comprehensive */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStudent ? "Edit Student" : "Register Student"}>
        <form onSubmit={handleSubmit} className="space-y-6 px-1">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Full Name" name="fullName" value={formData.fullName || ''} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="e.g. John Doe" />
            <InputField label="Email" name="email" value={formData.email || ''} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="e.g. john@example.com" />
            <InputField label="Contact" name="contact" value={formData.contact || ''} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} placeholder="+91 9876543210" />
            <InputField label="Student ID" name="studentId" value={formData.studentId || ''} onChange={(e) => setFormData({ ...formData, studentId: e.target.value })} placeholder="Auto-generated if empty" />
            <InputField label="Date of Birth" name="dob" type="date" value={formData.dob ? new Date(formData.dob).toISOString().split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} />

            <SelectField
              label="Gender"
              value={formData.gender || ''}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              options={[{ value: '', label: 'Select' }, { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]}
            />
          </div>

          {/* Section 2: Parent/Guardian */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-slate-800 mb-3">Parent/Guardian Info</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Parent Name" name="parentName" value={formData.parentName || ''} onChange={(e) => setFormData({ ...formData, parentName: e.target.value })} />
              <InputField label="Parent Contact" name="parentContact" value={formData.parentContact || ''} onChange={(e) => setFormData({ ...formData, parentContact: e.target.value })} />
            </div>
          </div>

          {/* Section 3: Academic */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-slate-800 mb-3">Academic Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="School/College" name="currentSchool" value={formData.currentSchool || ''} onChange={(e) => setFormData({ ...formData, currentSchool: e.target.value })} />
              <InputField label="Class/Year" name="classYear" value={formData.classYear || ''} onChange={(e) => setFormData({ ...formData, classYear: e.target.value })} />
              <div className="col-span-2">
                <InputField label="Subjects" name="subjects" value={formData.subjects || ''} onChange={(e) => setFormData({ ...formData, subjects: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Section 4: Course & Fees */}
          <div className="border-t pt-4">
            <h3 className="font-semibold text-slate-800 mb-3">Course & Payment</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Course Name" name="courseName" value={formData.courseName || ''} onChange={(e) => setFormData({ ...formData, courseName: e.target.value })} />
              <InputField label="Total Fees" name="totalFees" type="number" value={formData.totalFees || ''} onChange={(e) => setFormData({ ...formData, totalFees: parseFloat(e.target.value) })} />

              <SelectField
                label="Payment Mode"
                value={formData.paymentMode || ''}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                options={[
                  { value: '', label: 'Select' },
                  { value: 'Cash', label: 'Cash' },
                  { value: 'Online', label: 'Online' },
                  { value: 'UPI', label: 'UPI' },
                  { value: 'Bank Transfer', label: 'Bank Transfer' }
                ]}
              />
              <SelectField
                label="Payment Option"
                value={formData.paymentOption || ''}
                onChange={(e) => setFormData({ ...formData, paymentOption: e.target.value })}
                options={[
                  { value: 'Pay in Full', label: 'Pay in Full' },
                  { value: 'Payment in Advance', label: 'Payment in Advance' },
                  { value: 'Pay in Installments', label: 'Pay in Installments' }
                ]}
              />

              <InputField label="Reference No" name="referenceNo" value={formData.referenceNo || ''} onChange={(e) => setFormData({ ...formData, referenceNo: e.target.value })} />
            </div>

            {/* Installments Logic */}
            {formData.paymentOption === 'Pay in Installments' && (
              <div className="mt-4 bg-slate-50 p-4 rounded border border-slate-200">
                <h4 className="text-sm font-semibold mb-3">Installment Schedule</h4>
                <div className="grid grid-cols-3 gap-4 text-xs">
                  {/* Installment 1 */}
                  <div className="space-y-2">
                    <p className="font-medium text-slate-500">1st Installment</p>
                    <input type="number" placeholder="Amount" className="w-full p-2 border border-slate-200 rounded focus:border-indigo-500 outline-none" value={formData.installment1Amount || ''} onChange={(e) => setFormData({ ...formData, installment1Amount: e.target.value })} />
                    <input type="date" className="w-full p-2 border border-slate-200 rounded focus:border-indigo-500 outline-none" value={formData.installment1Date ? new Date(formData.installment1Date).toISOString().split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, installment1Date: e.target.value })} />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.installment1Paid || false} onChange={(e) => setFormData({ ...formData, installment1Paid: e.target.checked })} className="text-emerald-500 rounded focus:ring-emerald-500" />
                      Received
                    </label>
                  </div>
                  {/* Installment 2 */}
                  <div className="space-y-2">
                    <p className="font-medium text-slate-500">2nd Installment</p>
                    <input type="number" placeholder="Amount" className="w-full p-2 border border-slate-200 rounded focus:border-indigo-500 outline-none" value={formData.installment2Amount || ''} onChange={(e) => setFormData({ ...formData, installment2Amount: e.target.value })} />
                    <input type="date" className="w-full p-2 border border-slate-200 rounded focus:border-indigo-500 outline-none" value={formData.installment2Date ? new Date(formData.installment2Date).toISOString().split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, installment2Date: e.target.value })} />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.installment2Paid || false} onChange={(e) => setFormData({ ...formData, installment2Paid: e.target.checked })} className="text-emerald-500 rounded focus:ring-emerald-500" />
                      Received
                    </label>
                  </div>
                  {/* Installment 3 */}
                  <div className="space-y-2">
                    <p className="font-medium text-slate-500">3rd Installment</p>
                    <input type="number" placeholder="Amount" className="w-full p-2 border border-slate-200 rounded focus:border-indigo-500 outline-none" value={formData.installment3Amount || ''} onChange={(e) => setFormData({ ...formData, installment3Amount: e.target.value })} />
                    <input type="date" className="w-full p-2 border border-slate-200 rounded focus:border-indigo-500 outline-none" value={formData.installment3Date ? new Date(formData.installment3Date).toISOString().split('T')[0] : ''} onChange={(e) => setFormData({ ...formData, installment3Date: e.target.value })} />
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.installment3Paid || false} onChange={(e) => setFormData({ ...formData, installment3Paid: e.target.checked })} className="text-emerald-500 rounded focus:ring-emerald-500" />
                      Received
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit">{editingStudent ? "Update Student" : "Register Student"}</Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Student Details</h2>
              <button onClick={() => setSelectedStudent(null)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Personal */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Personal Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-500">Name</p><p className="font-medium">{selectedStudent.fullName}</p></div>
                  <div><p className="text-sm text-gray-500">Email</p><p>{selectedStudent.email}</p></div>
                  <div><p className="text-sm text-gray-500">Contact</p><p>{selectedStudent.contact}</p></div>
                  <div><p className="text-sm text-gray-500">DOB</p><p>{selectedStudent.dob ? new Date(selectedStudent.dob).toLocaleDateString() : '-'}</p></div>
                  <div><p className="text-sm text-gray-500">Address</p><p>{selectedStudent.address || '-'}</p></div>
                  <div><p className="text-sm text-gray-500">Student ID</p><p>{selectedStudent.studentId}</p></div>
                  <div><p className="text-sm text-gray-500">Gender</p><p>{selectedStudent.gender || '-'}</p></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Parent Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-500">Parent Name</p><p>{selectedStudent.parentName || '-'}</p></div>
                  <div><p className="text-sm text-gray-500">Parent Contact</p><p>{selectedStudent.parentContact || '-'}</p></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Academic Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-500">School/College</p><p>{selectedStudent.currentSchool || '-'}</p></div>
                  <div><p className="text-sm text-gray-500">Class/Year</p><p>{selectedStudent.classYear || '-'}</p></div>
                  <div className="col-span-2"><p className="text-sm text-gray-500">Subjects</p><p>{selectedStudent.subjects || '-'}</p></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-4">Course Info</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-500">Course</p><p>{selectedStudent.courseName || '-'}</p></div>
                  <div><p className="text-sm text-gray-500">Fees</p><p>₹{selectedStudent.totalFees}</p></div>
                  <div><p className="text-sm text-gray-500">Paid Fees</p><p>₹{selectedStudent.paidFees || 0}</p></div>
                  <div><p className="text-sm text-gray-500">Mode</p><p>{selectedStudent.paymentMode}</p></div>
                  <div><p className="text-sm text-gray-500">Option</p><p>{selectedStudent.paymentOption}</p></div>
                  <div><p className="text-sm text-gray-500">Reference</p><p>{selectedStudent.referenceNo || '-'}</p></div>
                </div>
              </div>

              {/* Installment History View */}
              {selectedStudent.paymentOption === 'Pay in Installments' && (
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-4">Installment Status</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-xs text-slate-500">1st Installment</p>
                      <p className="font-semibold">₹{selectedStudent.installment1Amount}</p>
                      <p className="text-xs">{selectedStudent.installment1Date ? new Date(selectedStudent.installment1Date).toLocaleDateString() : '-'}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${selectedStudent.installment1Paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedStudent.installment1Paid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-xs text-slate-500">2nd Installment</p>
                      <p className="font-semibold">₹{selectedStudent.installment2Amount}</p>
                      <p className="text-xs">{selectedStudent.installment2Date ? new Date(selectedStudent.installment2Date).toLocaleDateString() : '-'}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${selectedStudent.installment2Paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedStudent.installment2Paid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-3 rounded">
                      <p className="text-xs text-slate-500">3rd Installment</p>
                      <p className="font-semibold">₹{selectedStudent.installment3Amount}</p>
                      <p className="text-xs">{selectedStudent.installment3Date ? new Date(selectedStudent.installment3Date).toLocaleDateString() : '-'}</p>
                      <span className={`text-xs px-2 py-0.5 rounded ${selectedStudent.installment3Paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedStudent.installment3Paid ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t flex justify-end">
              <Button onClick={() => setSelectedStudent(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}

      <InvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        studentData={invoiceStudent}
      />
    </div>
  );
};
