import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Users, Calendar } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { SelectField } from '../../components/ui/SelectField';
import { addBatch } from '../../store/slices/batchSlice';
import toast from 'react-hot-toast';

export const BatchList = () => {
  const batches = useSelector(state => state.batches.list);
  const courses = useSelector(state => state.courses.list);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', course: '', tutor: '', startDate: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addBatch({ ...formData, students: 0 }));
    toast.success('Batch created successfully');
    setIsModalOpen(false);
    setFormData({ name: '', course: '', tutor: '', startDate: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Batches</h2>
          <p className="text-slate-500 text-sm">Manage class schedules and groups</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>Create Batch</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch) => (
          <Card key={batch.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                <Users size={24} />
              </div>
              <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded text-slate-500">ID: {batch.id}</span>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Batch">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField label="Batch Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g., Class 10-A" />
          <SelectField 
            label="Course" 
            value={formData.course} 
            onChange={(e) => setFormData({...formData, course: e.target.value})} 
            options={courses.map(c => ({ value: c.title, label: c.title }))} 
          />
          <InputField label="Tutor Name" value={formData.tutor} onChange={(e) => setFormData({...formData, tutor: e.target.value})} placeholder="e.g., John Doe" />
          <InputField label="Start Date" type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
          <div className="pt-4">
            <Button className="w-full">Create Batch</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
