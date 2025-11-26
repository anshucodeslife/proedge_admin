import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { addParent } from '../../store/slices/parentSlice';
import toast from 'react-hot-toast';

export const ParentsList = () => {
  const parents = useSelector(state => state.parents.list);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', children: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addParent({ ...formData, children: [formData.children] }));
    toast.success('Parent added');
    setIsModalOpen(false);
    setFormData({ name: '', email: '', phone: '', children: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Parents</h2>
          <p className="text-slate-500 text-sm">Manage parent accounts and associations</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>Add Parent</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Children</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parents.map((parent) => (
                <tr key={parent.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{parent.name}</td>
                  <td className="px-6 py-4">{parent.email}</td>
                  <td className="px-6 py-4">{parent.phone}</td>
                  <td className="px-6 py-4">{parent.children.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Parent">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <InputField label="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <InputField label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <InputField label="Child Name" value={formData.children} onChange={(e) => setFormData({...formData, children: e.target.value})} />
          <div className="pt-4">
            <Button className="w-full">Add Parent</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
