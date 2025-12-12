import React, { useState, useEffect } from 'react';
import { Save, Lock, Mail, Globe, Bell, Trash2 } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import Swal from 'sweetalert2';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';

export const ProfileSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    site_name: '',
    support_email: '',
    maintenance_mode: 'false',
    smtp_host: '',
    smtp_port: '',
    smtp_user: '',
    smtp_pass: '',
    notification_email: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/system/settings');
      if (res.data.success) {
        setSettings(prev => ({ ...prev, ...res.data.data }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? String(checked) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api.post('/system/settings', settings);
      if (res.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Saved',
          text: 'System settings updated successfully',
          timer: 1500,
          showConfirmButton: false
        });
      }
    } catch (error) {
      Swal.fire('Error', 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const result = await Swal.fire({
      title: 'Danger Zone: Reset System?',
      text: "This will DELETE ALL students, payments, and activity. Only Admin accounts will be preserved.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Yes, Nuke It!'
    });

    if (result.isConfirmed) {
      try {
        await api.post('/system/reset-data');
        Swal.fire('Reset Complete', 'System data has been cleared.', 'success');
      } catch (error) {
        Swal.fire('Error', 'Reset failed', 'error');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading Configuration...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">System Settings</h2>
          <p className="text-slate-500 text-sm">Configure global application parameters</p>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={saving}
          icon={Save}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* General Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold border-b border-slate-100 pb-2">
            <Globe size={20} className="text-[#00C08B]" />
            <h3>General Configuration</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Site Name</label>
              <input
                name="site_name"
                value={settings.site_name}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00C08B] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
              <input
                name="support_email"
                value={settings.support_email}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00C08B] outline-none"
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="maintenance_mode"
                name="maintenance_mode"
                checked={settings.maintenance_mode === 'true'}
                onChange={handleChange}
                className="w-4 h-4 text-[#00C08B] rounded"
              />
              <label htmlFor="maintenance_mode" className="text-sm font-medium text-slate-700">Enable Maintenance Mode</label>
            </div>
          </div>
        </Card>

        {/* SMTP Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold border-b border-slate-100 pb-2">
            <Mail size={20} className="text-blue-500" />
            <h3>SMTP Configuration (Email)</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Host</label>
              <input
                name="smtp_host"
                value={settings.smtp_host}
                onChange={handleChange}
                placeholder="smtp.gmail.com"
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00C08B] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Port</label>
              <input
                name="smtp_port"
                value={settings.smtp_port}
                onChange={handleChange}
                placeholder="587"
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00C08B] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SMTP User</label>
              <input
                name="smtp_user"
                value={settings.smtp_user}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00C08B] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SMTP Password</label>
              <input
                type="password"
                name="smtp_pass"
                value={settings.smtp_pass}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00C08B] outline-none"
              />
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4 text-slate-800 font-semibold border-b border-slate-100 pb-2">
            <Bell size={20} className="text-orange-500" />
            <h3>Notifications</h3>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Admin Notification Email</label>
            <input
              type="email"
              name="notification_email"
              value={settings.notification_email}
              onChange={handleChange}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#00C08B] outline-none"
            />
            <p className="text-xs text-slate-500 mt-1">Receive alerts for new enquiries and admissions.</p>
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-100 bg-red-50/10">
          <div className="flex items-center gap-2 mb-4 text-red-600 font-semibold border-b border-red-100 pb-2">
            <Trash2 size={20} />
            <h3>Danger Zone</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-slate-800 font-medium">Reset System Data</h4>
              <p className="text-sm text-slate-500">Permanently delete all students, admissions, and logs.</p>
            </div>
            <button
              onClick={handleReset}
              className="bg-white hover:bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-sm"
            >
              <Trash2 size={18} />
              Reset All Data
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

