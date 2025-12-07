import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit, Trash2, Eye, Search, X } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { SelectField } from '../../components/ui/SelectField';
import { FileUpload } from '../../components/ui/FileUpload';
import { addCourse, fetchCourses, updateCourse, deleteCourse } from '../../store/slices/courseSlice';
import toast from 'react-hot-toast';

export const CoursesList = () => {
  const { list: courses, loading } = useSelector(state => state.courses);
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); // For View Details
  const [editingCourse, setEditingCourse] = useState(null);   // For Edit

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    code: '',
    price: '',
    mrp: '',
    duration: '',
    lectures: '',
    projects: '',
    certificate: '',
    access: '',
    thumbnail: '',
    description: '',
    active: true,
    type: 'SUBJECT'
  });

  useEffect(() => {
    dispatch(fetchCourses({ page: 1, limit: 100 }));
  }, [dispatch]);

  // --- Handlers ---

  const handleSearch = (e) => setSearchTerm(e.target.value);

  const filteredCourses = courses.filter(course =>
    course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      slug: course.slug || '',
      code: course.code || '',
      price: course.price || '',
      mrp: course.mrp || '',
      duration: course.duration || '',
      lectures: course.lectures || '',
      projects: course.projects || '',
      certificate: course.certificate || '',
      access: course.access || '',
      thumbnail: course.thumbnail || course.image || '',
      description: course.description || '',
      active: course.active ?? true,
      type: 'SUBJECT' // Default or derive if needed
    });
    setIsModalOpen(true);
  };

  const startAdd = () => {
    setEditingCourse(null);
    setFormData({
      title: '', slug: '', code: '', price: '', mrp: '', duration: '',
      lectures: '', projects: '', certificate: '', access: '',
      thumbnail: '', description: '', active: true, type: 'SUBJECT'
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCourse(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      dispatch(deleteCourse(id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation / Auto-slug
    const payload = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      price: Number(formData.price),
      mrp: Number(formData.mrp)
    };

    if (editingCourse) {
      await dispatch(updateCourse({ id: editingCourse.id, data: payload }));
      // toast handled in slice
    } else {
      await dispatch(addCourse(payload));
    }
    closeModal();
    dispatch(fetchCourses()); // Refresh
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Course Management</h2>
          <p className="text-slate-500 text-sm">Manage courses, curriculum, and details</p>
        </div>
        <Button onClick={startAdd} icon={Plus}>Add Course</Button>
      </div>

      {/* Search & List */}
      <Card>
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-100 uppercase text-xs font-semibold text-slate-500">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center">Loading...</td></tr>
              ) : filteredCourses.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center">No courses found.</td></tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-800">
                      <div className="flex items-center gap-3">
                        {course.thumbnail ? (
                          <img src={`https://proedge-lms.s3.ap-south-1.amazonaws.com/${course.thumbnail}`} alt="" className="w-10 h-10 rounded object-cover" />
                        ) : (
                          <div className="w-10 h-10 bg-slate-100 rounded flex items-center justify-center font-bold text-slate-400">
                            {course.title?.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div>{course.title}</div>
                          {course.code && <div className="text-xs text-slate-400">{course.code}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-800">₹{course.price}</span>
                        {course.mrp && <span className="text-xs text-slate-400 line-through">₹{course.mrp}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4">{course.duration || '-'}</td>
                    <td className="px-6 py-4">
                      <Badge variant={course.active ? 'success' : 'danger'}>
                        {course.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => startEdit(course)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} title={editingCourse ? "Edit Course" : "Add Course"}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          <InputField label="Course Title" name="title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required placeholder="e.g. Master React JS" />

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Course Code" name="code" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="e.g. RCT101" />
            <InputField label="Slug (URL)" name="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} placeholder="Auto-generated if empty" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Price (₹)" type="number" name="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
            <InputField label="MRP (₹)" type="number" name="mrp" value={formData.mrp} onChange={(e) => setFormData({ ...formData, mrp: e.target.value })} placeholder="Original Price" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Duration" name="duration" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 3 Months" />
            <InputField label="Lectures" name="lectures" value={formData.lectures} onChange={(e) => setFormData({ ...formData, lectures: e.target.value })} placeholder="e.g. 50+ Hours" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <InputField label="Projects" name="projects" value={formData.projects} onChange={(e) => setFormData({ ...formData, projects: e.target.value })} placeholder="e.g. 5 Capstone" />
            <InputField label="Certificate" name="certificate" value={formData.certificate} onChange={(e) => setFormData({ ...formData, certificate: e.target.value })} placeholder="e.g. Yes" />
          </div>

          <InputField label="Access" name="access" value={formData.access} onChange={(e) => setFormData({ ...formData, access: e.target.value })} placeholder="e.g. Lifetime Access" />

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed course description..."
            />
          </div>

          <FileUpload
            label="Course Thumbnail"
            folder="courses/thumbnails"
            accept="image/*"
            initialValue={formData.thumbnail}
            onUploadComplete={(key) => setFormData({ ...formData, thumbnail: key })}
          />

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="active" className="text-sm font-medium text-slate-700">Active Course</label>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
            <Button type="submit">{editingCourse ? "Update Course" : "Create Course"}</Button>
          </div>
        </form>
      </Modal>

      {/* View Details Modal (Legacy Replica) */}
      {selectedCourse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Course Details</h2>
              <button onClick={() => setSelectedCourse(null)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              {selectedCourse.thumbnail && (
                <div className="w-full h-48 rounded-lg overflow-hidden bg-slate-100">
                  <img src={`https://proedge-lms.s3.ap-south-1.amazonaws.com/${selectedCourse.thumbnail}`} alt={selectedCourse.title} className="w-full h-full object-cover" />
                </div>
              )}

              <div>
                <h3 className="text-xs uppercase font-bold text-slate-400 mb-1">Title</h3>
                <p className="text-lg font-bold text-slate-800">{selectedCourse.title}</p>
                <p className="text-sm text-slate-500">{selectedCourse.slug}</p>
              </div>

              <div>
                <h3 className="text-xs uppercase font-bold text-slate-400 mb-1">Description</h3>
                <p className="text-slate-700 whitespace-pre-wrap">{selectedCourse.description || 'No description.'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs uppercase font-bold text-slate-400 mb-1">Price</h3>
                  <p className="font-semibold text-slate-800">₹{selectedCourse.price}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase font-bold text-slate-400 mb-1">MRP</h3>
                  <p className="text-slate-500 line-through">₹{selectedCourse.mrp || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs uppercase font-bold text-slate-400 mb-1">Duration</h3>
                  <p className="text-slate-800">{selectedCourse.duration || '-'}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase font-bold text-slate-400 mb-1">Lectures</h3>
                  <p className="text-slate-800">{selectedCourse.lectures || '-'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs uppercase font-bold text-slate-400 mb-1">Projects</h3>
                  <p className="text-slate-800">{selectedCourse.projects || '-'}</p>
                </div>
                <div>
                  <h3 className="text-xs uppercase font-bold text-slate-400 mb-1">Status</h3>
                  <Badge variant={selectedCourse.active ? 'success' : 'danger'}>{selectedCourse.active ? 'Active' : 'Inactive'}</Badge>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
              <Button variant="outline" onClick={() => setSelectedCourse(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

