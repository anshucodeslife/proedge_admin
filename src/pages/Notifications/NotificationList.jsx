import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Send, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { InputField } from '../../components/ui/InputField';
import { SelectField } from '../../components/ui/SelectField';
import { sendNotification, deleteNotification } from '../../store/slices/notificationSlice';
import toast from 'react-hot-toast';

export const NotificationList = () => {
  const notifications = useSelector(state => state.notifications.list);
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '', userId: '', type: 'IN_APP' });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(sendNotification(formData));
    toast.success('Notification sent successfully');
    setIsModalOpen(false);
    setFormData({ title: '', message: '', userId: '', type: 'IN_APP' });
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
    toast.success('Notification deleted');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Notifications</h2>
          <p className="text-slate-500 text-sm">Send updates to students and staff</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Send}>Send Notification</Button>
      </div>

      <div className="grid gap-4">
        {notifications.map((notification) => (
          <Card key={notification.id} className="p-4 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-slate-800">{notification.title}</h3>
                <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{notification.type}</span>
              </div>
              <p className="text-slate-600 text-sm mb-2">{notification.message}</p>
              <div className="flex gap-4 text-xs text-slate-400">
                <span>To: {notification.userId || 'All'}</span>
                <span>{notification.date}</span>
              </div>
            </div>
            <button 
              onClick={() => handleDelete(notification.id)}
              className="text-slate-400 hover:text-red-500 transition-colors p-2"
            >
              <Trash2 size={18} />
            </button>
          </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Send Notification">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField label="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} placeholder="Announcement Title" />
          <div className="grid grid-cols-2 gap-4">
             <InputField label="User ID" value={formData.userId} onChange={(e) => setFormData({...formData, userId: e.target.value})} placeholder="STU001" />
             <SelectField 
              label="Type" 
              value={formData.type} 
              onChange={(e) => setFormData({...formData, type: e.target.value})} 
              options={[
                { value: 'IN_APP', label: 'In-App' },
                { value: 'EMAIL', label: 'Email' },
                { value: 'SMS', label: 'SMS' }
              ]} 
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Message</label>
            <textarea 
              className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all text-slate-600 text-sm"
              rows="4"
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Type your message here..."
            ></textarea>
          </div>
          <div className="pt-4">
            <Button className="w-full">Send Notification</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
