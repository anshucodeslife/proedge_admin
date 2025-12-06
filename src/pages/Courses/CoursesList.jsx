import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit, Trash2, Users, BookOpen } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { fetchCourses, addCourse, updateCourse, deleteCourse } from '../../store/slices/courseSlice';

export const CoursesList = () => {
  const { list: courses, pagination, loading } = useSelector(state => state.courses);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    title: '', slug: '', description: '', price: '', thumbnail: '', duration: ''
  });

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handlePageChange = (newPage) => {
    dispatch(fetchCourses({ page: newPage }));
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCourse) {
      await dispatch(updateCourse({ id: editingCourse.id, data: formData }));
    } else {
      await dispatch(addCourse(formData));
    }
    dispatch(fetchCourses({ page: pagination.page }));
    closeModal();
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      slug: course.slug || '',
      description: course.description || '',
      price: course.price || '',
      thumbnail: course.thumbnail || '',
      duration: course.duration || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await dispatch(deleteCourse(id));
      dispatch(fetchCourses({ page: pagination.page }));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
    setFormData({ title: '', slug: '', description: '', price: '', thumbnail: '', duration: '' });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Courses Management</h1>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus size={20} /> Add Course
        </Button>
      </div>

      <Card>
        {loading ? (
          <div className="p-8 text-center">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No courses found</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="primary">₹{course.price}</Badge>
                    <span className="text-xs text-gray-500">{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <BookOpen size={16} />
                      <span>{course._count?.modules || 0} modules</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{course._count?.enrollments || 0} students</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="flex-1 p-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                    >
                      <Edit size={16} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="flex-1 p-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                    >
                      <Trash2 size={16} className="mx-auto" />
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-600">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => handlePageChange(pagination.page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCourse ? 'Edit Course' : 'Add Course'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField label="Course Title" name="title" value={formData.title} onChange={handleChange} required />
          <InputField label="Slug" name="slug" value={formData.slug} onChange={handleChange} required />
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              rows="3"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Price (₹)" type="number" name="price" value={formData.price} onChange={handleChange} required />
            <InputField label="Duration" name="duration" value={formData.duration} onChange={handleChange} placeholder="e.g., 8 weeks" />
          </div>
          <InputField label="Thumbnail URL" name="thumbnail" value={formData.thumbnail} onChange={handleChange} />
          <div className="flex justify-end gap-2 mt-6">
            <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit">{editingCourse ? 'Update' : 'Create'} Course</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
