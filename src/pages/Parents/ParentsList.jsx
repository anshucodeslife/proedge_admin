import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { addParent, fetchParents, updateParent, deleteParent } from '../../store/slices/parentSlice';
import toast from 'react-hot-toast';

export const ParentsList = () => {
  const parents = useSelector(state => state.parents.list);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchParents());
  }, [dispatch]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingParent, setEditingParent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', children: '' });

  const openModal = (parent = null) => {
    setEditingParent(parent);
    if (parent) {
      setFormData({
        name: parent.name,
        email: parent.email,
        phone: parent.phone || '',
        children: parent.children ? parent.children.join(', ') : ''
      });
    } else {
      setFormData({ name: '', email: '', phone: '', children: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingParent) {
      dispatch(updateParent({ 
        id: editingParent.id, 
        data: { ...formData, children: [formData.children] } 
      }));
    } else {
      dispatch(addParent({ ...formData, children: [formData.children] }));
    }
    setIsModalOpen(false);
    setFormData({ name: '', email: '', phone: '', children: '' });
    setEditingParent(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this parent?')) {
      dispatch(deleteParent(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Parents</h2>
          <p className="text-slate-500 text-sm">Manage parent accounts and associations</p>
        </div>
        <Button onClick={() => openModal()} icon={Plus}>Add Parent</Button>
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
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {parents.map((parent) => (
                <tr key={parent.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{parent.name}</td>
                  <td className="px-6 py-4">{parent.email}</td>
                  <td className="px-6 py-4">{parent.phone}</td>
                  <td className="px-6 py-4">{parent.children.join(', ')}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                       <button 
                        onClick={() => openModal(parent)}
                        className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(parent.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingParent ? "Edit Parent" : "Add Parent"}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          <InputField label="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <InputField label="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
          <InputField label="Child Name" value={formData.children} onChange={(e) => setFormData({...formData, children: e.target.value})} />
          <div className="pt-4">
            <Button className="w-full">{editingParent ? "Update Parent" : "Add Parent"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
