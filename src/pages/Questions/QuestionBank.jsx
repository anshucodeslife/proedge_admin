import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { SelectField } from '../../components/ui/SelectField';
import { addQuestion } from '../../store/slices/questionSlice';
import toast from 'react-hot-toast';

export const QuestionBank = () => {
  const questions = useSelector(state => state.questions.list);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ question: '', type: 'MCQ', subject: '', difficulty: 'Medium' });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addQuestion(formData));
    toast.success('Question added');
    setIsModalOpen(false);
    setFormData({ question: '', type: 'MCQ', subject: '', difficulty: 'Medium' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Question Bank</h2>
          <p className="text-slate-500 text-sm">Manage repository of questions</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>Add Question</Button>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <Card key={q.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <Badge variant="neutral">{q.subject}</Badge>
              <div className="flex gap-2">
                <Badge variant="primary">{q.type}</Badge>
                <Badge variant={q.difficulty === 'Easy' ? 'success' : q.difficulty === 'Medium' ? 'warning' : 'danger'}>{q.difficulty}</Badge>
              </div>
            </div>
            <p className="font-medium text-slate-800">{q.question}</p>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Question">
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
            <Button className="w-full">Add Question</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
