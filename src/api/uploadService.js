import api from './axios';

/**
 * Get signed URL for uploading files to S3
 * @param {string} fileName - Original file name
 * @param {string} fileType - MIME type (e.g., 'video/mp4')
 * @param {string} folder - S3 folder path (e.g., 'videos', 'images')
 */
export const getSignedUploadUrl = async (fileName, fileType, folder = 'videos') => {
  try {
    const response = await api.post('/upload/signed-url', {
      fileName,
      fileType,
      folder
    });
    return response.data.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get upload URL');
  }
};

/**
 * Upload file directly to S3 using signed URL
 * @param {File} file - File object to upload
 * @param {string} signedUrl - Pre-signed S3 URL
 * @param {function} onProgress - Progress callback function
 */
export const uploadToS3 = async (file, signedUrl, onProgress) => {
  try {
    const response = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return true;
  } catch (error) {
    throw new Error('Failed to upload file to S3');
  }
};

/**
 * Complete upload flow: get signed URL and upload file
 * @param {File} file - File to upload
 * @param {string} folder - S3 folder
 * @param {function} onProgress - Progress callback
 */
export const uploadFile = async (file, folder = 'videos', onProgress) => {
  // Get signed URL
  const { signedUrl, fileUrl } = await getSignedUploadUrl(
    file.name,
    file.type,
    folder
  );

  // Upload to S3
  await uploadToS3(file, signedUrl, onProgress);

  // Return the final S3 URL
  return fileUrl;
};

/**
 * Get signed URL for viewing uploaded content
 * @param {string} key - S3 object key
 */
export const getSignedViewUrl = async (key) => {
  try {
    const response = await api.get(`/upload/view/${encodeURIComponent(key)}`);
    return response.data.data.url;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to get view URL');
  }
};

export default {
  getSignedUploadUrl,
  uploadToS3,
  uploadFile,
  getSignedViewUrl,
};
