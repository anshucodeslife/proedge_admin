import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Mail, Phone } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { addStaff } from '../../store/slices/staffSlice';
import toast from 'react-hot-toast';

export const StaffList = () => {
  const staff = useSelector(state => state.staff.list);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', subject: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addStaff(formData));
    toast.success('Staff member added');
    setIsModalOpen(false);
    setFormData({ name: '', email: '', role: '', subject: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Staff & Teachers</h2>
          <p className="text-slate-500 text-sm">Manage faculty and admin staff</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>Add Staff</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <Card key={member.id} className="p-6 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">{member.name}</h3>
                  <p className="text-xs text-slate-500">{member.role}</p>
                </div>
              </div>
              <Badge variant="neutral">{member.subject}</Badge>
            </div>
            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Mail size={16} className="text-slate-400" />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-slate-400" />
                <span>{member.phone}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Staff Member">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <InputField label="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <InputField label="Role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
          <InputField label="Subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
          <div className="pt-4">
            <Button className="w-full">Add Staff</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
