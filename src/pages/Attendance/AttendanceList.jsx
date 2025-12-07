import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Calendar, Upload } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { fetchAttendance } from '../../store/slices/attendanceSlice';

export const AttendanceList = () => {
  const records = useSelector(state => state.attendance.list);
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Attendance</h2>
          <p className="text-slate-500 text-sm">Track student and staff attendance</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={Upload}>Upload CSV</Button>
          <Button icon={Calendar}>Mark Today</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-4">Class 10-A Today</h3>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[85%]"></div>
            </div>
            <span className="font-bold text-slate-700">85%</span>
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">S{i}</div>
                  <span className="text-slate-700">Student Name {i}</span>
                </div>
                <Badge variant="primary">Present</Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-slate-800 mb-4">Attendance History</h3>
          <div className="space-y-4">
            {records.length > 0 ? records.map((record) => (
              <div key={record.id} className="flex items-center justify-between border-b border-slate-50 pb-3 last:border-0">
                <div>
                  <p className="font-medium text-slate-700">{record.user?.fullName || 'Unknown Student'}</p>
                  <p className="text-xs text-slate-500">{record.batch?.name || 'No Batch'} • {new Date(record.date).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <Badge variant={record.status === 'PRESENT' ? 'success' : 'error'}>{record.status}</Badge>
                </div>
              </div>
            )) : (
              <p className="text-center text-slate-400 py-4">No recent attendance records found.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
