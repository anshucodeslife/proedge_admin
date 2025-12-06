import React, { useState } from 'react';
import { Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadFile } from '../../api/uploadService';
import toast from 'react-hot-toast';

export const VideoUploader = ({ onUploadComplete, accept = 'video/*' }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('video/')) {
        toast.error('Please select a valid video file');
        return;
      }

      // Validate file size (max 500MB)
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 500MB');
        return;
      }

      setSelectedFile(file);
      setUploadedUrl('');
      setProgress(0);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select a file first');
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const fileUrl = await uploadFile(
        selectedFile,
        'videos',
        (progressPercent) => {
          setProgress(progressPercent);
        }
      );

      setUploadedUrl(fileUrl);
      toast.success('Video uploaded successfully!');
      
      if (onUploadComplete) {
        onUploadComplete(fileUrl);
      }
    } catch (error) {
      toast.error(error.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setUploadedUrl('');
    setProgress(0);
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        {!selectedFile ? (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  Select video file
                </span>
                <input
                  type="file"
                  className="sr-only"
                  accept={accept}
                  onChange={handleFileSelect}
                />
                <span className="mt-1 block text-xs text-gray-500">
                  MP4, AVI, MOV up to 500MB
                </span>
              </label>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {uploadedUrl ? (
                  <CheckCircle className="h-8 w-8 text-green-500" />
                ) : (
                  <Upload className="h-8 w-8 text-blue-500" />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600"
                disabled={uploading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {uploading && (
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Uploading...</span>
                  <span className="text-gray-900 font-medium">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {uploadedUrl && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-green-800">
                      Upload complete!
                    </p>
                    <p className="text-xs text-green-700 mt-1 break-all">
                      {uploadedUrl}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!uploadedUrl && !uploading && (
              <button
                onClick={handleUpload}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Upload Video
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
