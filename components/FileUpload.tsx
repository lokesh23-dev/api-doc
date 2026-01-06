'use client';

import { useCallback, useState } from 'react';
import { Upload, FileText, AlertCircle } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  error?: string | null;
}

export function FileUpload({ onFileSelect, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const file = files[0];

      if (file && (file.name.endsWith('.yaml') || file.name.endsWith('.yml') || file.name.endsWith('.json'))) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">API Documentation</h1>
          <p className="text-lg text-slate-600">
            Upload your OpenAPI specification to explore your API
          </p>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative bg-white rounded-xl border-2 border-dashed p-12 text-center
            transition-all duration-200 cursor-pointer
            ${
              isDragging
                ? 'border-blue-500 bg-blue-50 scale-105'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50'
            }
          `}
        >
          <input
            type="file"
            accept=".yaml,.yml,.json"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <Upload className="w-12 h-12 text-slate-400 mx-auto mb-4" />

          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Drop your OpenAPI file here
          </h3>
          <p className="text-slate-600 mb-4">
            or click to browse
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <span>Supports:</span>
            <span className="inline-flex items-center px-2 py-1 bg-slate-100 rounded text-slate-700 font-mono">
              .yaml
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-slate-100 rounded text-slate-700 font-mono">
              .yml
            </span>
            <span className="inline-flex items-center px-2 py-1 bg-slate-100 rounded text-slate-700 font-mono">
              .json
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Error loading specification</h4>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg p-6 border border-slate-200">
          <h3 className="font-semibold text-slate-900 mb-3">Quick Start</h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>Upload your OpenAPI 3.x specification file</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>Browse endpoints and schemas in the sidebar</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>View detailed documentation for each endpoint</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
