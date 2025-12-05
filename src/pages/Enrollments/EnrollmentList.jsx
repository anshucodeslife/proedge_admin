import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { SelectField } from '../../components/ui/SelectField';
import { enrollStudent, fetchEnrollments, deleteEnrollment } from '../../store/slices/enrollmentSlice';
import { fetchStudents } from '../../store/slices/studentSlice';
import { fetchCourses } from '../../store/slices/courseSlice';
import { fetchBatches } from '../../store/slices/batchSlice';
import toast from 'react-hot-toast';

export const EnrollmentList = () => {
  const enrollments = useSelector(state => state.enrollments.list);
  const students = useSelector(state => state.students.list);
  const courses = useSelector(state => state.courses.list);
  const batches = useSelector(state => state.batches.list);
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    dispatch(fetchEnrollments());
    dispatch(fetchStudents());
    dispatch(fetchBatches());
    dispatch(fetchCourses());
  }, [dispatch]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ studentId: '', courseId: '', batchId: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const student = students.find(s => s.id === Number(formData.studentId));
    const course = courses.find(c => c.id === Number(formData.courseId));
    const batch = batches.find(b => b.id === Number(formData.batchId));

    if (student && course && batch) {
      dispatch(enrollStudent({
        studentName: student.name,
        courseName: course.title,
        batchName: batch.name
      }));
      toast.success('Student enrolled successfully');
      setIsModalOpen(false);
      setFormData({ studentId: '', courseId: '', batchId: '' });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to unenroll this student?')) {
      dispatch(deleteEnrollment(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Enrollments</h2>
          <p className="text-slate-500 text-sm">Manage student course enrollments</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>New Enrollment</Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Batch</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-800">{enrollment.studentName}</td>
                  <td className="px-6 py-4">{enrollment.courseName}</td>
                  <td className="px-6 py-4">{enrollment.batchName}</td>
                  <td className="px-6 py-4 text-slate-500">{enrollment.date}</td>
                  <td className="px-6 py-4"><Badge variant="primary">{enrollment.status}</Badge></td>
                  <td className="px-6 py-4 text-right">
                     <button 
                        onClick={() => handleDelete(enrollment.id)}
                        className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                        title="Unenroll"
                      >
                        <Trash2 size={16} />
                      </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Enroll Student">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <SelectField 
            label="Student" 
            value={formData.studentId} 
            onChange={(e) => setFormData({...formData, studentId: e.target.value})} 
            options={students.map(s => ({ value: s.id, label: s.name }))} 
          />
          <SelectField 
            label="Course" 
            value={formData.courseId} 
            onChange={(e) => setFormData({...formData, courseId: e.target.value})} 
            options={courses.map(c => ({ value: c.id, label: c.title }))} 
          />
          <SelectField 
            label="Batch" 
            value={formData.batchId} 
            onChange={(e) => setFormData({...formData, batchId: e.target.value})} 
            options={batches.map(b => ({ value: b.id, label: b.name }))} 
          />
          <div className="pt-4">
            <Button className="w-full">Enroll Student</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
