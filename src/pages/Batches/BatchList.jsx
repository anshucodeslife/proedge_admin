import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Users, Calendar, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { SelectField } from '../../components/ui/SelectField';
import { addBatch, fetchBatches, updateBatch, deleteBatch } from '../../store/slices/batchSlice';
import { fetchCourses } from '../../store/slices/courseSlice';
import toast from 'react-hot-toast';

export const BatchList = () => {
  const batches = useSelector(state => state.batches.list);
  const courses = useSelector(state => state.courses.list);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchBatches());
    dispatch(fetchCourses());
  }, [dispatch]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [formData, setFormData] = useState({ name: '', course: '', tutor: '', startDate: '' });

  const openModal = (batch = null) => {
    setEditingBatch(batch);
    if (batch) {
      setFormData({
        name: batch.name,
        course: batch.course || '',
        tutor: batch.tutor || '',
        startDate: batch.startDate || ''
      });
    } else {
      setFormData({ name: '', course: '', tutor: '', startDate: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBatch) {
      dispatch(updateBatch({ 
        id: editingBatch.id, 
        data: { ...formData, students: editingBatch.students } 
      }));
    } else {
      dispatch(addBatch({ ...formData, students: 0 }));
    }
    setIsModalOpen(false);
    setFormData({ name: '', course: '', tutor: '', startDate: '' });
    setEditingBatch(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      dispatch(deleteBatch(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Batches</h2>
          <p className="text-slate-500 text-sm">Manage class schedules and groups</p>
        </div>
        <Button onClick={() => openModal()} icon={Plus}>Create Batch</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <Card key={batch.id} className="p-6 hover:shadow-md transition-shadow relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <Users size={24} />
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">ID: {batch.id}</span>
              </div>
            </div>
             <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openModal(batch)}
                  className="p-1.5 bg-white rounded-full text-slate-400 hover:text-indigo-600 shadow-sm border border-slate-100"
                  title="Edit"
                >
                  <Edit size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(batch.id)}
                  className="p-1.5 bg-white rounded-full text-slate-400 hover:text-red-600 shadow-sm border border-slate-100"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
             </div>

            <h3 className="font-bold text-slate-800 text-lg mb-1">{batch.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{batch.course}</p>
            
            <div className="space-y-2 text-sm text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-400" />
                <span>{batch.students} Students</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-slate-400" />
                <span>Starts: {batch.startDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] text-emerald-600 font-bold">T</span>
                <span>Tutor: {batch.tutor}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingBatch ? "Edit Batch" : "Create New Batch"}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField label="Batch Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g., Class 10-A" />
          <SelectField 
            label="Course" 
            value={formData.course} 
            onChange={(e) => setFormData({...formData, course: e.target.value})} 
            options={courses.data ? courses.data.map(c => ({ value: c.title, label: c.title })) : courses.map(c => ({ value: c.title, label: c.title }))} 
          />
          <InputField label="Tutor Name" value={formData.tutor} onChange={(e) => setFormData({...formData, tutor: e.target.value})} placeholder="e.g., John Doe" />
          <InputField label="Start Date" type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
          <div className="pt-4">
            <Button className="w-full">{editingBatch ? "Update Batch" : "Create Batch"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
