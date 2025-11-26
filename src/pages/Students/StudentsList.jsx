import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, MoreVertical } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { addStudent } from '../../store/slices/studentSlice';
import toast from 'react-hot-toast';

export const StudentsList = () => {
  const students = useSelector(state => state.students.list);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', phone: '', studentId: '', admissionNo: '', dob: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addStudent({
      fullName: formData.fullName,
      email: formData.email,
      admissionNo: formData.admissionNo,
      class: 'Class 10-A', // Default for now
      parentEmail: 'parent@example.com' // Default
    }));
    toast.success('Student added successfully');
    setIsModalOpen(false);
    setFormData({ fullName: '', email: '', password: '', phone: '', studentId: '', admissionNo: '', dob: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Students</h2>
          <p className="text-slate-500 text-sm">Manage student admissions and profiles</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>Add Student</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Admission No</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Class</th>
                <th className="px-6 py-4">Parent Email</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{student.admissionNo}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{student.fullName}</td>
                  <td className="px-6 py-4"><Badge variant="primary">{student.class}</Badge></td>
                  <td className="px-6 py-4">{student.parentEmail}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-indigo-600"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Student">
        <form className="space-y-4" onSubmit={handleSubmit}>
           <div className="grid grid-cols-1 gap-4">
            <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Alice Smith" />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <InputField label="Admission No" name="admissionNo" value={formData.admissionNo} onChange={handleChange} placeholder="ADM001" />
             <InputField label="Student ID" type="number" name="studentId" value={formData.studentId} onChange={handleChange} placeholder="1001" />
          </div>
          <InputField label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} />
          <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="student@proedge.com" />
          <InputField label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Contact Number" />
          <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" />
          
          <div className="pt-4">
            <Button className="w-full">Register Student</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
