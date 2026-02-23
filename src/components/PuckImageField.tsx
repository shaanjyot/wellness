'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, ImageIcon } from 'lucide-react';

interface PuckImageFieldProps {
  field: any;
  name: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
}

export default function PuckImageField({ value, onChange, readOnly }: PuckImageFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'cms-images');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      onChange(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      // Reset file input so the same file can be re-uploaded
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {/* Image Preview */}
      {value && (
        <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e5e7eb', background: '#f9fafb' }}>
          <img
            src={value}
            alt="Preview"
            style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {!readOnly && (
            <button
              onClick={handleClear}
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                background: 'rgba(0,0,0,0.6)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0
              }}
              title="Remove image"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* Upload Button / URL Input */}
      {!readOnly && (
        <>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 12px',
                background: uploading ? '#e5e7eb' : '#0d9488',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: uploading ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                fontWeight: 500,
                flex: 1,
                justifyContent: 'center'
              }}
            >
              {uploading ? (
                <>
                  <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={14} />
                  {value ? 'Replace Image' : 'Upload Image'}
                </>
              )}
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />

          {/* URL input for manual entry */}
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste image URL..."
            style={{
              width: '100%',
              padding: '6px 10px',
              border: '1px solid #e5e7eb',
              borderRadius: '6px',
              fontSize: '12px',
              color: '#6b7280',
              background: '#f9fafb',
              boxSizing: 'border-box'
            }}
          />
        </>
      )}

      {/* Error */}
      {error && (
        <div style={{ color: '#ef4444', fontSize: '12px' }}>{error}</div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
