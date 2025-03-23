import React, { useState } from 'react';
import api from '../services/api';

const UploadCSV: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = ['text/csv'];
    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage('Only CSV files are allowed!');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/tasks/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage('File uploaded and lists distributed successfully!');
      setFile(null);
      window.location.reload(); 
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error uploading file');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && <p className="mb-4 text-sm text-green-600">{message}</p>}

      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
      >
        Upload & Distribute
      </button>
    </form>
  );
};

export default UploadCSV;
