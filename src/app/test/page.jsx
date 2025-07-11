'use client';

import React, { useState, useRef } from 'react';

const VideoUploadPage = () => {
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [error, setError] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];

            // Validate file type
            if (!selectedFile.type.startsWith('video/')) {
                setError('Please upload a video file');
                return;
            }

            // Validate file size (100MB)
            if (selectedFile.size > 100 * 1024 * 1024) {
                setError('File size must be less than 100MB');
                return;
            }

            // Set the file directly without duration validation
            setFile(selectedFile);
            setError('');
        }
    };

    const uploadFile = async () => {
        if (!file) {
            setError('Please select a file first');
            return;
        }

        setUploadStatus('Uploading...');
        setUploadProgress(0);
        setError('');
        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/routes/v1/videoUploadController?action=upload', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle permission errors specifically
                if (response.status === 403) {
                    throw new Error('Permission denied. Please check storage access.');
                }
                throw new Error(result.message || 'Upload failed');
            }

            setAnalysisResult(result.data);
            setUploadStatus(result.message || 'Analysis complete!');
            setUploadProgress(100);
        } catch (err) {
            console.error('Upload failed:', err);
            setError(err.message.includes('Permission denied')
                ? 'Server configuration error: ' + err.message
                : `Error: ${err.message || 'Upload failed'}`);
            setUploadStatus('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setFile(null);
        setUploadProgress(0);
        setUploadStatus('');
        setAnalysisResult(null);
        setError('');
        setIsUploading(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Video Upload & Analysis</h1>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload Video (max 100MB)
                    </label>
                    <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
                        disabled={isUploading}
                    />
                </div>

                {file && (
                    <div className="mb-4">
                        <p className="text-sm text-gray-600">
                            Selected: {file.name} ({Math.round(file.size / (1024 * 1024))}MB)
                        </p>
                        <video
                            src={URL.createObjectURL(file)}
                            controls
                            className="mt-2 w-full rounded"
                        />
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
                        {error}
                    </div>
                )}

                {uploadStatus && (
                    <div className="mb-4">
                        <p className="text-sm font-medium">{uploadStatus}</p>
                        {uploadProgress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                <div
                                    className="bg-blue-600 h-2.5 rounded-full"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                )}

                {analysisResult && (
                    <div className="mb-4 p-4 bg-gray-50 rounded">
                        <h3 className="font-medium mb-2">Analysis Results:</h3>
                        <pre className="text-xs overflow-auto max-h-60 p-2 bg-white rounded">
                            {JSON.stringify(analysisResult, null, 2)}
                        </pre>
                    </div>
                )}

                <div className="flex space-x-3">
                    <button
                        onClick={uploadFile}
                        disabled={!file || isUploading}
                        className={`px-4 py-2 rounded text-white ${!file || isUploading
                                ? 'bg-blue-300 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                    >
                        {isUploading ? 'Processing...' : 'Upload & Analyze'}
                    </button>
                    <button
                        onClick={resetForm}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        disabled={isUploading}
                    >
                        Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoUploadPage;