import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit, Trash2, Calendar, Users } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { SelectField } from '../../components/ui/SelectField';
import { fetchBatches, addBatch, updateBatch, deleteBatch } from '../../store/slices/batchSlice';
import { fetchCourses } from '../../store/slices/courseSlice';
import Swal from 'sweetalert2';

export const BatchesList = () => {
  const batches = useSelector(state => state.batches.list);
  const courses = useSelector(state => state.courses.list);
  const loading = useSelector(state => state.batches.loading);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState(null);
  const [formData, setFormData] = useState({
    name: '', courseId: '', tutorName: '', startDate: '', endDate: '', schedule: ''
  });

  useEffect(() => {
    dispatch(fetchBatches());
    dispatch(fetchCourses({ page: 1, limit: 100 }));
  }, [dispatch]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingBatch) {
      await dispatch(updateBatch({ id: editingBatch.id, data: formData }));
    } else {
      await dispatch(addBatch(formData));
    }
    dispatch(fetchBatches());
    closeModal();
  };

  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setFormData({
      name: batch.name || '',
      courseId: batch.courseId || '',
      tutorName: batch.tutorName || '',
      startDate: batch.startDate?.split('T')[0] || '',
      endDate: batch.endDate?.split('T')[0] || '',
      schedule: batch.schedule || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this batch?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      await dispatch(deleteBatch(id));
      dispatch(fetchBatches());
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBatch(null);
    setFormData({ name: '', courseId: '', tutorName: '', startDate: '', endDate: '', schedule: '' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Batches Management</h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={20} /> Add Batch
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center">Loading batches...</div>
        ) : batches.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No batches found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="p-4 text-left">Batch Name</th>
                  <th className="p-4 text-left">Course</th>
                  <th className="p-4 text-left">Tutor</th>
                  {/* <th className="p-4 text-left">Schedule</th> */}
                  <th className="p-4 text-left">Duration</th>
                  <th className="p-4 text-left">Students</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {batches.map((batch) => (
                  <tr key={batch.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium">{batch.name}</td>
                    <td className="p-4">{batch.course?.title || 'N/A'}</td>
                    <td className="p-4">{batch.tutorName}</td>
                    {/* <td className="p-4">
                      <Badge variant="neutral">{batch.schedule}</Badge>
                    </td> */}
                    <td className="p-4 text-sm text-gray-600">
                      {batch.startDate && new Date(batch.startDate).toLocaleDateString()} - {batch.endDate && new Date(batch.endDate).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Users size={16} className="text-gray-400" />
                        <span>{batch._count?.enrollments || 0}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(batch)}
                          className="p-2 hover:bg-gray-100 rounded"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(batch.id)}
                          className="p-2 hover:bg-gray-100 rounded text-red-600"
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
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingBatch ? 'Edit Batch' : 'Add Batch'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Batch Name" name="name" value={formData.name} onChange={handleChange} required />
          <SelectField
            label="Course"
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            options={courses.map(c => ({ value: c.id, label: c.title }))}
            required
          />
          <InputField label="Tutor Name" name="tutorName" value={formData.tutorName} onChange={handleChange} required />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Start Date" type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            <InputField label="End Date" type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
          </div>
          <InputField label="Schedule" name="schedule" value={formData.schedule} onChange={handleChange} placeholder="e.g., Mon-Fri 10AM-12PM" />
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit">{editingBatch ? 'Update' : 'Create'} Batch</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
