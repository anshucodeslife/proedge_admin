import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Mail, Phone, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { addStaff, fetchStaff, updateStaff, deleteStaff } from '../../store/slices/staffSlice';
import toast from 'react-hot-toast';

export const StaffList = () => {
  const staff = useSelector(state => state.staff.list);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchStaff());
  }, [dispatch]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '', subject: '' });

  const openModal = (member = null) => {
    setEditingStaff(member);
    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role || '',
        subject: member.subject || ''
      });
    } else {
      setFormData({ name: '', email: '', role: '', subject: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStaff) {
      dispatch(updateStaff({ id: editingStaff.id, data: formData }));
    } else {
      dispatch(addStaff(formData));
    }
    setIsModalOpen(false);
    setFormData({ name: '', email: '', role: '', subject: '' });
    setEditingStaff(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      dispatch(deleteStaff(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Staff & Teachers</h2>
          <p className="text-slate-500 text-sm">Manage faculty and admin staff</p>
        </div>
        <Button onClick={() => openModal()} icon={Plus}>Add Staff</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staff.map((member) => (
          <Card key={member.id} className="p-6 flex flex-col gap-4 relative group">
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
             <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openModal(member)}
                  className="p-1.5 bg-white rounded-full text-slate-400 hover:text-indigo-600 shadow-sm border border-slate-100"
                  title="Edit"
                >
                  <Edit size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(member.id)}
                  className="p-1.5 bg-white rounded-full text-slate-400 hover:text-red-600 shadow-sm border border-slate-100"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingStaff ? "Edit Staff Member" : "Add Staff Member"}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <InputField label="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <InputField label="Role" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
          <InputField label="Subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
          <div className="pt-4">
            <Button className="w-full">{editingStaff ? "Update Staff" : "Add Staff"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
