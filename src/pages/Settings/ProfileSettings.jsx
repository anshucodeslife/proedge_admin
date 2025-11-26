import React from 'react';
import { Card } from '../../components/ui/Card';
import { InputField } from '../../components/ui/InputField';
import { Button } from '../../components/ui/Button';

export const ProfileSettings = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Settings</h2>
        <p className="text-slate-500 text-sm">System configuration and permissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">General Configuration</h3>
            <div className="space-y-4">
               <InputField label="School Name" value="Proedge Learning" onChange={()=>{}} />
               <InputField label="Academic Year" value="2024-2025" onChange={()=>{}} />
               <div className="flex items-center gap-2 mt-2">
                 <input type="checkbox" checked readOnly className="rounded text-indigo-600" />
                 <span className="text-sm text-slate-600">Enable Maintenance Mode</span>
               </div>
            </div>
          </Card>
          <Card className="p-6">
            <h3 className="font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Permissions & Roles</h3>
             <div className="space-y-3">
               <div className="flex justify-between items-center py-2">
                 <span className="text-sm font-medium text-slate-700">Allow Teachers to Edit Syllabus</span>
                 <div className="w-10 h-5 bg-indigo-600 rounded-full relative cursor-pointer"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
               </div>
               <div className="flex justify-between items-center py-2">
                 <span className="text-sm font-medium text-slate-700">Parent Access to Gradebook</span>
                 <div className="w-10 h-5 bg-slate-200 rounded-full relative cursor-pointer"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
               </div>
             </div>
          </Card>
        </div>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-bold text-slate-800 mb-4">System Logs</h3>
            <div className="text-xs space-y-3 text-slate-500">
              <p>• Backup created at 00:00 UTC</p>
              <p>• System update v2.4 installed</p>
              <p>• 5 failed login attempts (IP: 192.168.x.x)</p>
            </div>
            <Button variant="ghost" className="w-full mt-4 text-xs">View All Logs</Button>
          </Card>
        </div>
      </div>
    </div>
  );
};
