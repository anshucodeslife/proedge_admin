import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { SelectField } from '../../components/ui/SelectField';
import { addQuestion, fetchQuestions, updateQuestion, deleteQuestion } from '../../store/slices/questionSlice';
import toast from 'react-hot-toast';

export const QuestionBank = () => {
  const questions = useSelector(state => state.questions.list);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({ question: '', type: 'MCQ', subject: '', difficulty: 'Medium' });

  const openModal = (q = null) => {
    setEditingQuestion(q);
    if (q) {
      setFormData({
        question: q.question,
        type: q.type || 'MCQ',
        subject: q.subject || '',
        difficulty: q.difficulty || 'Medium'
      });
    } else {
      setFormData({ question: '', type: 'MCQ', subject: '', difficulty: 'Medium' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingQuestion) {
      dispatch(updateQuestion({ id: editingQuestion.id, data: formData }));
    } else {
      dispatch(addQuestion(formData));
    }
    setIsModalOpen(false);
    setFormData({ question: '', type: 'MCQ', subject: '', difficulty: 'Medium' });
    setEditingQuestion(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      dispatch(deleteQuestion(id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Question Bank</h2>
          <p className="text-slate-500 text-sm">Manage repository of questions</p>
        </div>
        <Button onClick={() => openModal()} icon={Plus}>Add Question</Button>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <Card key={q.id} className="p-4 relative group">
            <div className="flex justify-between items-start mb-2">
              <Badge variant="neutral">{q.subject}</Badge>
              <div className="flex gap-2">
                <Badge variant="primary">{q.type}</Badge>
                <Badge variant={q.difficulty === 'Easy' ? 'success' : q.difficulty === 'Medium' ? 'warning' : 'danger'}>{q.difficulty}</Badge>
              </div>
            </div>
            <p className="font-medium text-slate-800 pr-16">{q.question}</p>
             <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => openModal(q)}
                  className="p-1.5 bg-white rounded-full text-slate-400 hover:text-indigo-600 shadow-sm border border-slate-100"
                  title="Edit"
                >
                  <Edit size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(q.id)}
                  className="p-1.5 bg-white rounded-full text-slate-400 hover:text-red-600 shadow-sm border border-slate-100"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
             </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingQuestion ? "Edit Question" : "Add Question"}>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField label="Question Text" value={formData.question} onChange={(e) => setFormData({...formData, question: e.target.value})} />
          <InputField label="Subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <SelectField 
              label="Type" 
              value={formData.type} 
              onChange={(e) => setFormData({...formData, type: e.target.value})} 
              options={[{ value: 'MCQ', label: 'MCQ' }, { value: 'Descriptive', label: 'Descriptive' }]} 
            />
            <SelectField 
              label="Difficulty" 
              value={formData.difficulty} 
              onChange={(e) => setFormData({...formData, difficulty: e.target.value})} 
              options={[{ value: 'Easy', label: 'Easy' }, { value: 'Medium', label: 'Medium' }, { value: 'Hard', label: 'Hard' }]} 
            />
          </div>
          <div className="pt-4">
            <Button className="w-full">{editingQuestion ? "Update Question" : "Add Question"}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
