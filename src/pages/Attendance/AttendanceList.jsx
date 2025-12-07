import React, { useState, useEffect } from 'react';
import { Upload, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../../api/axios';

export const AttendanceList = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState({ present: 0, absent: 0, leave: 0, total: 0 });

  useEffect(() => {
    fetchAttendance();
  }, [selectedDate]);

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      // backend implementation of getAttendance supports filters
      const res = await api.get(`/admin/attendance`, {
        params: {
          startDate: selectedDate,
          endDate: selectedDate
        }
      });

      const data = res.data;

      if (data.success) {
        const records = data.data || [];
        setAttendanceData(records);

        // Calculate stats
        const present = records.filter(r => r.status === 'PRESENT').length;
        const absent = records.filter(r => r.status === 'ABSENT').length;
        const leave = records.filter(r => r.status === 'ON_LEAVE').length;
        setStats({ present, absent, leave, total: records.length });
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      Swal.fire('Error', 'Failed to fetch attendance records', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      Swal.fire('Error', 'Please upload a CSV file', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n').map(row => row.trim()).filter(row => row);

      // Parse CSV
      // Assuming Row 1 is Header: student_id, status
      // Row 2+: Data
      const parsedData = [];

      // Skip header (index 0)
      for (let i = 1; i < rows.length; i++) {
        const [studentId, status] = rows[i].split(',').map(item => item?.trim());

        if (studentId && status) {
          parsedData.push({
            student_id: studentId,
            attendance: status
          });
        }
      }

      if (parsedData.length === 0) {
        Swal.fire('Error', 'No valid data found in CSV', 'error');
        return;
      }

      // Confirm upload
      const result = await Swal.fire({
        title: 'Confirm Upload',
        text: `Found ${parsedData.length} records. Upload now?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Upload'
      });

      if (result.isConfirmed) {
        await uploadToBackend(parsedData);
      }
    };
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };

  const uploadToBackend = async (data) => {
    setLoading(true);
    try {
      const res = await api.post(`/admin/attendance/upload`, {
        date: selectedDate,
        attendanceData: data
      });

      const response = res.data;

      if (response.success) {
        const { success, failed } = response.data;
        let message = `Successfully processed ${success.length} records.`;
        if (failed.length > 0) {
          message += ` Failed: ${failed.length} (Check console for details)`;
          console.warn('Failed records:', failed);
        }

        Swal.fire('Success', message, 'success');
        fetchAttendance(); // Refresh list
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload Error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload attendance';
      Swal.fire('Error', errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PRESENT': return <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-medium">Present</span>;
      case 'ABSENT': return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-medium">Absent</span>;
      case 'ON_LEAVE': return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-medium">On Leave</span>;
      default: return <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs font-medium">{status}</span>;
    }
  };

  const downloadDemoCSV = () => {
    const csvContent = "student_id,status\nS001,PRESENT\nS002,ABSENT\nS003,ON_LEAVE\n";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = "attendance_demo.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500 mt-1">Track student and staff attendance</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={downloadDemoCSV}
            className="text-indigo-600 text-sm font-medium hover:underline mr-2"
          >
            Download Sample CSV
          </button>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm">
            <Calendar className="text-gray-400 w-4 h-4" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="outline-none text-sm text-gray-600 bg-transparent"
            />
          </div>

          <label className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors shadow-sm text-gray-700">
            <Upload className="w-4 h-4" />
            <span className="text-sm font-medium">Upload CSV</span>
            <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
          </label>

          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Mark Today
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Status (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-gray-800">Class Attendance Today</h2>
              <span className="text-2xl font-bold text-gray-900">{stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-3 mb-8">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${stats.total > 0 ? (stats.present / stats.total) * 100 : 0}%` }}
              ></div>
            </div>

            {/* List of Students Today */}
            <div className="space-y-4">
              {attendanceData.length === 0 ? (
                <div className="text-center py-8 text-gray-400 italic">No attendance marked for today yet.</div>
              ) : (
                attendanceData.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
                        {record.user?.studentId || 'ID'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{record.user?.fullName || 'Unknown Student'}</div>
                        <div className="text-xs text-gray-500">Student ID: {record.user?.studentId}</div>
                      </div>
                    </div>
                    <div>
                      {getStatusBadge(record.status)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: History/Recent (1/3 width) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Attendance Overview</h3>

            {/* Stats Summary Vertical */}
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full text-green-600"><CheckCircle size={18} /></div>
                  <span className="text-green-900 font-medium">Present</span>
                </div>
                <span className="text-xl font-bold text-green-700">{stats.present}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-full text-red-600"><XCircle size={18} /></div>
                  <span className="text-red-900 font-medium">Absent</span>
                </div>
                <span className="text-xl font-bold text-red-700">{stats.absent}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-full text-yellow-600"><AlertCircle size={18} /></div>
                  <span className="text-yellow-900 font-medium">On Leave</span>
                </div>
                <span className="text-xl font-bold text-yellow-700">{stats.leave}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent Activity</h4>
              <div className="space-y-4">
                {attendanceData.slice(0, 5).map((record) => (
                  <div key={`hist-${record.id}`} className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 truncate max-w-[120px]">{record.user?.fullName}</span>
                    <span className="text-gray-400 text-xs">{new Date(record.date).toLocaleDateString()}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${record.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                      record.status === 'ABSENT' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>{record.status}</span>
                  </div>
                ))}
                {attendanceData.length === 0 && <span className="text-gray-400 text-sm">No recent activity.</span>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
