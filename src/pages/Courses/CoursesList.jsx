import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, ChevronRight } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { SelectField } from '../../components/ui/SelectField';
import { addCourse } from '../../store/slices/courseSlice';
import toast from 'react-hot-toast';

export const CoursesList = () => {
  const courses = useSelector(state => state.courses.list);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '', type: 'SUBJECT', slug: '', price: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addCourse({
      title: formData.name,
      code: formData.code,
      slug: formData.slug,
      price: Number(formData.price),
      units: 0,
      status: 'Active'
    }));
    toast.success('Course added successfully');
    setIsModalOpen(false);
    setFormData({ name: '', code: '', type: 'SUBJECT', slug: '', price: '' });
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Courses</h2>
          <p className="text-slate-500 text-sm">Manage curriculum subjects and topics</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>Add Course</Button>
      </div>

      <Card>
        <div className="divide-y divide-slate-100">
          {courses.map((sub, i) => (
            <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 font-bold">
                  {sub.title.substring(0,2).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800">{sub.title}</h4>
                  <p className="text-xs text-slate-500">{sub.code} • {sub.units} Units</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <Badge variant="neutral">{sub.status}</Badge>
                 <button className="p-2 text-slate-400 hover:text-indigo-600"><ChevronRight size={18} /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Course">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField label="Course Name" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g., Mathematics" />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Slug" name="slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} placeholder="e.g., math-101" />
            <InputField label="Price (₹)" type="number" name="price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} placeholder="1999" />
          </div>
          <InputField label="Course Code" name="code" value={formData.code} onChange={(e) => setFormData({...formData, code: e.target.value})} placeholder="e.g., MTH101" />
          <SelectField 
            label="Type" 
            name="type" 
            value={formData.type} 
            onChange={(e) => setFormData({...formData, type: e.target.value})} 
            options={[
              { value: 'SUBJECT', label: 'Subject' },
              { value: 'TOPIC', label: 'Topic' },
              { value: 'CHAPTER', label: 'Chapter' }
            ]} 
          />
          <div className="pt-4">
            <Button className="w-full">Create Course</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
