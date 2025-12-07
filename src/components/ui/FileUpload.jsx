import React, { useState } from 'react';
import api from '../../api/axios';
import { Button } from './Button';
import { Upload, X, Check, Loader2 } from 'lucide-react';

export const FileUpload = ({ label, folder, accept, onUploadComplete, initialValue }) => {
    const [uploading, setUploading] = useState(false);
    const [uploadedKey, setUploadedKey] = useState(initialValue || '');
    const [error, setError] = useState(null);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            // 1. Get Signed URL
            console.log('Requesting signed URL for:', file.name, file.type);
            const response = await api.post('/upload/signed-url', {
                fileName: file.name,
                fileType: file.type,
                folder: folder || 'general'
            });

            console.log('Backup API Response:', response);
            const { data } = response;
            console.log('Inner Data:', data);

            if (!data || !data.data || !data.data.uploadUrl) {
                console.error('Invalid response structure:', data);
                throw new Error('Failed to retrieve upload configuration');
            }

            const { uploadUrl, key } = data.data;
            console.log('Got Upload URL:', uploadUrl);

            // 2. Upload to S3 using standard fetch (bypass axios interceptors to avoid auth headers on S3)
            const uploadRes = await fetch(uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type
                }
            });

            if (!uploadRes.ok) {
                console.error('S3 Upload Failed:', uploadRes.status, uploadRes.statusText);
                throw new Error('Failed to upload file to storage');
            }

            // 3. Success
            console.log('Upload Successful, Key:', key);
            setUploadedKey(key);
            onUploadComplete(key); // Return key to parent form

        } catch (err) {
            console.error('Upload Process Error:', err);
            setError(err.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const clearFile = () => {
        setUploadedKey('');
        onUploadComplete('');
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">{label}</label>

            {!uploadedKey ? (
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors">
                    {uploading ? (
                        <div className="text-center">
                            <Loader2 className="animate-spin text-indigo-600 mb-2 mx-auto" size={24} />
                            <p className="text-sm text-slate-500">Uploading...</p>
                        </div>
                    ) : (
                        <>
                            <Upload className="text-slate-400 mb-2" size={24} />
                            <p className="text-sm text-slate-500 mb-2">Click to upload {accept && `(${accept})`}</p>
                            <input
                                type="file"
                                accept={accept}
                                onChange={handleFileChange}
                                className="hidden"
                                id={`file-upload-${folder}`}
                            />
                            <label
                                htmlFor={`file-upload-${folder}`}
                                className="cursor-pointer bg-white px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50"
                            >
                                Select File
                            </label>
                        </>
                    )}
                    {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                </div>
            ) : (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-lg">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <Check className="text-green-600 flex-shrink-0" size={18} />
                        <span className="text-sm text-green-700 truncate font-medium">Upload Complete</span>
                        <span className="text-xs text-slate-500 truncate max-w-[150px]">{uploadedKey}</span>
                    </div>
                    <button
                        type="button"
                        onClick={clearFile}
                        className="p-1 hover:bg-green-100 rounded-full text-green-700 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};
