import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, ChevronDown, ChevronRight, Video, FileText, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { SelectField } from '../../components/ui/SelectField';
import { FileUpload } from '../../components/ui/FileUpload';
import { addModule, addLesson, fetchModules, updateModule, deleteModule, updateLesson, deleteLesson } from '../../store/slices/moduleSlice';
import { fetchCourses } from '../../store/slices/courseSlice';
import toast from 'react-hot-toast';

export const ModulesList = () => {
  const modules = useSelector(state => state.modules.list);
  const courses = useSelector(state => state.courses.list);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchCourses());
    dispatch(fetchModules());
  }, [dispatch]);

  const [expandedModule, setExpandedModule] = useState(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);

  const [editingModule, setEditingModule] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  const [moduleForm, setModuleForm] = useState({ title: '', courseId: '', order: '' });
  const [lessonForm, setLessonForm] = useState({ title: '', type: 'Video', durationSec: '', order: '', videoUrl: '' });

  const toggleExpand = (id) => {
    setExpandedModule(expandedModule === id ? null : id);
  };

  // Module Actions
  const openModuleModal = (module = null) => {
    setEditingModule(module);
    if (module) {
      setModuleForm({
        title: module.title,
        courseId: module.courseId || '',
        order: module.order || ''
      });
    } else {
      setModuleForm({ title: '', courseId: '', order: '' });
    }
    setIsModuleModalOpen(true);
  };

  const handleModuleSubmit = (e) => {
    e.preventDefault();
    if (editingModule) {
      dispatch(updateModule({
        id: editingModule.id,
        data: { ...moduleForm, courseId: moduleForm.courseId, order: Number(moduleForm.order) }
      }));
    } else {
      dispatch(addModule({ ...moduleForm, courseId: moduleForm.courseId, order: Number(moduleForm.order) }));
    }
    setIsModuleModalOpen(false);
    setModuleForm({ title: '', courseId: '', order: '' });
    setEditingModule(null);
  };

  const handleDeleteModule = (id) => {
    if (window.confirm('Are you sure you want to delete this module and all its lessons?')) {
      dispatch(deleteModule(id));
    }
  };

  // Lesson Actions
  const openLessonModal = (moduleId, lesson = null) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(lesson);
    if (lesson) {
      setLessonForm({
        title: lesson.title,
        type: lesson.type,
        durationSec: lesson.durationSec || '',
        order: lesson.order || '',
        videoUrl: lesson.videoUrl || ''
      });
    } else {
      setLessonForm({ title: '', type: 'Video', durationSec: '', order: '', videoUrl: '' });
    }
    setIsLessonModalOpen(true);
  };

  const handleLessonSubmit = (e) => {
    e.preventDefault();
    if (editingLesson) {
      dispatch(updateLesson({
        id: editingLesson.id,
        data: { ...lessonForm, durationSec: Number(lessonForm.durationSec), order: Number(lessonForm.order), moduleId: selectedModuleId }
      }));
    } else {
      dispatch(addLesson({
        ...lessonForm,
        moduleId: selectedModuleId,
        durationSec: Number(lessonForm.durationSec),
        order: Number(lessonForm.order)
      }));
    }
    setIsLessonModalOpen(false);
    setLessonForm({ title: '', type: 'Video', durationSec: '', order: '', videoUrl: '' });
    setEditingLesson(null);
  };

  const handleDeleteLesson = (moduleId, lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      dispatch(deleteLesson({ moduleId, lessonId }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Modules & Lessons</h2>
          <p className="text-slate-500 text-sm">Manage course content and curriculum</p>
        </div>
        <Button onClick={() => openModuleModal()} icon={Plus}>Add Module</Button>
      </div>

      <div className="space-y-4">
        {modules.map((module) => (
          <Card key={module.id} className="overflow-hidden">
            <div
              className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => toggleExpand(module.id)}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  {expandedModule === module.id ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">{module.title}</h3>
                  <p className="text-xs text-slate-500">{module.lessons?.length || 0} Lessons</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); openModuleModal(module); }}
                  className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Edit Module"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteModule(module.id); }}
                  className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                  title="Delete Module"
                >
                  <Trash2 size={16} />
                </button>
                <Button
                  variant="ghost"
                  className="text-xs ml-2"
                  onClick={(e) => { e.stopPropagation(); openLessonModal(module.id); }}
                >
                  + Add Lesson
                </Button>
              </div>
            </div>

            {expandedModule === module.id && (
              <div className="bg-slate-50 border-t border-slate-100 p-4 space-y-2">
                {(!module.lessons || module.lessons.length === 0) ? (
                  <p className="text-sm text-slate-400 text-center py-2">No lessons added yet.</p>
                ) : (
                  module.lessons.map((lesson) => (
                    <div key={lesson.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${lesson.type === 'Video' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                          {lesson.type === 'Video' ? <Video size={16} /> : <FileText size={16} />}
                        </div>
                        <span className="text-sm font-medium text-slate-700">{lesson.title}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="neutral">{Math.floor(lesson.durationSec / 60)} mins</Badge>
                        <button
                          onClick={() => openLessonModal(module.id, lesson)}
                          className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                          title="Edit Lesson"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(module.id, lesson.id)}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete Lesson"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Module Modal */}
      <Modal isOpen={isModuleModalOpen} onClose={() => setIsModuleModalOpen(false)} title={editingModule ? "Edit Module" : "Create Module"}>
        <form className="space-y-4" onSubmit={handleModuleSubmit}>
          <InputField label="Module Title" value={moduleForm.title} onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })} placeholder="e.g., Algebra Basics" />
          <InputField label="Order" type="number" value={moduleForm.order} onChange={(e) => setModuleForm({ ...moduleForm, order: e.target.value })} placeholder="1" />
          <SelectField
            label="Assign to Course"
            value={moduleForm.courseId}
            onChange={(e) => setModuleForm({ ...moduleForm, courseId: e.target.value })}
            options={courses.map(c => ({ value: c.id, label: c.title }))}
          />
          <div className="pt-4">
            <Button className="w-full">{editingModule ? "Update Module" : "Create Module"}</Button>
          </div>
        </form>
      </Modal>

      {/* Lesson Modal */}
      <Modal isOpen={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)} title={editingLesson ? "Edit Lesson" : "Add Lesson"}>
        <form className="space-y-4" onSubmit={handleLessonSubmit}>
          <InputField label="Lesson Title" value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="e.g., Introduction Video" />
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Order" type="number" value={lessonForm.order} onChange={(e) => setLessonForm({ ...lessonForm, order: e.target.value })} placeholder="1" />
            <SelectField
              label="Type"
              value={lessonForm.type}
              onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })}
              options={[{ value: 'Video', label: 'Video' }, { value: 'Document', label: 'Document' }]}
            />
          </div>
          <InputField label="Duration (Seconds)" type="number" value={lessonForm.durationSec} onChange={(e) => setLessonForm({ ...lessonForm, durationSec: e.target.value })} placeholder="600" />

          {lessonForm.type === 'Video' && (
            <FileUpload
              label="Lesson Video"
              folder="lessons/videos"
              accept="video/*"
              initialValue={lessonForm.videoUrl}
              onUploadComplete={(key) => setLessonForm({ ...lessonForm, videoUrl: key })}
            />
          )}

          {lessonForm.type !== 'Video' && (
            <InputField label="Document URL" value={lessonForm.videoUrl} onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} placeholder="https://..." />
          )}

          <div className="pt-4">
            <Button className="w-full">{editingLesson ? "Update Lesson" : "Add Lesson"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
