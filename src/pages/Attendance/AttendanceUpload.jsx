import { useState } from 'react';
import { Upload, Calendar, CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import Swal from 'sweetalert2';

const AttendanceUpload = () => {
    const [selectedDate, setSelectedDate] = useState('');
    const [file, setFile] = useState(null);
    const [parsedData, setParsedData] = useState([]);
    const [uploadResults, setUploadResults] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        // Parse Excel file
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);

            setParsedData(json);
        };
        reader.readAsArrayBuffer(selectedFile);
    };

    const handleUpload = async () => {
        if (!selectedDate || parsedData.length === 0) {
            Swal.fire('Error', 'Please select a date and upload a file', 'error');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/admin/attendance/upload', {
                date: selectedDate,
                attendanceData: parsedData,
            });

            setUploadResults(response.data.data);
        } catch (error) {
            console.error('Upload error:', error);
            Swal.fire('Error', 'Failed to upload attendance', 'error');
        } finally {
            setLoading(false);
        }
    };

    const downloadSample = () => {
        const sampleData = [
            { student_id: 'STU001', attendance: 'present' },
            { student_id: 'STU002', attendance: 'absent' },
            { student_id: 'STU003', attendance: 'leave' },
        ];

        const ws = XLSX.utils.json_to_sheet(sampleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
        XLSX.writeFile(wb, 'attendance_sample.xlsx');
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Upload Attendance</h1>
                <p className="text-gray-600 mt-1">Upload student attendance via Excel file</p>
            </div>

            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Picker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Calendar className="inline w-4 h-4 mr-1" />
                            Attendance Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>

                    {/* File Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Upload className="inline w-4 h-4 mr-1" />
                            Excel File
                        </label>
                        <input
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex gap-4">
                    <button
                        onClick={handleUpload}
                        disabled={!selectedDate || parsedData.length === 0 || loading}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {loading ? 'Uploading...' : 'Upload Attendance'}
                    </button>
                    <button
                        onClick={downloadSample}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download Sample
                    </button>
                </div>
            </div>

            {/* Preview Section */}
            {parsedData.length > 0 && !uploadResults && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Preview ({parsedData.length} records)</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Attendance</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {parsedData.slice(0, 10).map((row, idx) => (
                                    <tr key={idx}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{row.student_id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-2 py-1 rounded-full text-xs ${row.attendance?.toLowerCase() === 'present' ? 'bg-green-100 text-green-800' :
                                                row.attendance?.toLowerCase() === 'absent' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {row.attendance}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {parsedData.length > 10 && (
                            <p className="text-sm text-gray-500 mt-2">Showing 10 of {parsedData.length} records</p>
                        )}
                    </div>
                </div>
            )}

            {/* Results Section */}
            {uploadResults && (
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-semibold mb-4">Upload Results</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-green-700">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-semibold">Success</span>
                            </div>
                            <p className="text-2xl font-bold text-green-900 mt-2">{uploadResults.success?.length || 0}</p>
                        </div>

                        <div className="bg-red-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700">
                                <XCircle className="w-5 h-5" />
                                <span className="font-semibold">Failed</span>
                            </div>
                            <p className="text-2xl font-bold text-red-900 mt-2">{uploadResults.failed?.length || 0}</p>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-yellow-700">
                                <AlertCircle className="w-5 h-5" />
                                <span className="font-semibold">Already Exists</span>
                            </div>
                            <p className="text-2xl font-bold text-yellow-900 mt-2">{uploadResults.alreadyEnrolled?.length || 0}</p>
                        </div>
                    </div>

                    {/* Failed Records */}
                    {uploadResults.failed && uploadResults.failed.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-semibold text-red-700 mb-2">Failed Records</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student ID</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {uploadResults.failed.map((record, idx) => (
                                            <tr key={idx}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.student_id}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{record.reason}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AttendanceUpload;
