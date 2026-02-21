'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Upload } from 'lucide-react';

const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });

interface JsonNodeProps {
  path: string;
  val: any;
  onChange: (newVal: any) => void;
  propertyKey: string;
}

export default function JsonNode({ path, val, onChange, propertyKey }: JsonNodeProps) {
  const [useWysiwyg, setUseWysiwyg] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (typeof val === 'string') {
    return (
      <div className="mb-4 p-4 border rounded bg-white shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{propertyKey}</label>
        <div className="flex flex-wrap gap-2 mb-2 items-center">
          <button
            type="button"
            onClick={() => setUseWysiwyg(!useWysiwyg)}
            className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-md font-medium transition-colors border border-gray-300"
          >
            {useWysiwyg ? 'Use Plain Text Input' : 'Use Rich Text Editor'}
          </button>

          <div className="relative">
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setIsUploading(true);
                  try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const response = await fetch('/api/upload', {
                      method: 'POST',
                      body: formData,
                    });
                    const data = await response.json();
                    if (data.success) {
                      onChange(data.url);
                    } else {
                      alert('Failed to upload image: ' + data.error);
                    }
                  } catch (err) {
                    alert('Failed to upload image.');
                  } finally {
                    setIsUploading(false);
                  }
                }
              }}
            />
            <button
              type="button"
              disabled={isUploading}
              className="text-xs bg-teal-50 hover:bg-teal-100 text-teal-700 px-3 py-1.5 rounded-md font-medium flex items-center gap-1 transition-colors border border-teal-200"
            >
              <Upload className="w-3 h-3" />
              {isUploading ? 'Uploading...' : 'Upload Image as Value'}
            </button>
          </div>
        </div>

        {useWysiwyg ? (
          <RichTextEditor content={val} onChange={(c) => onChange(c)} />
        ) : (
          <textarea
            className="w-full font-mono text-sm bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            rows={Math.max(3, val.split('\n').length)}
            value={val}
            onChange={e => onChange(e.target.value)}
          />
        )}
      </div>
    );
  }

  if (typeof val === 'number' || typeof val === 'boolean') {
    return (
      <div className="mb-4 p-4 border rounded bg-white shadow-sm">
        <label className="block text-sm font-semibold text-gray-700 mb-2">{propertyKey}</label>
        <input
          type={typeof val === 'number' ? 'number' : 'checkbox'}
          checked={typeof val === 'boolean' ? val : undefined}
          value={typeof val === 'number' ? val : undefined}
          onChange={e => onChange(typeof val === 'number' ? Number(e.target.value) : e.target.checked)}
          className="border border-gray-300 p-2 rounded focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none"
        />
      </div>
    );
  }

  if (Array.isArray(val)) {
    return (
      <div className="mb-6 p-4 border-l-4 border-blue-400 bg-blue-50/30 rounded-r-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-bold text-gray-800">{propertyKey} (Array)</label>
          <button
            type="button"
            className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1.5 rounded-md font-medium transition-colors"
            onClick={() => {
              let newItem: any = "";
              if (val.length > 0) {
                if (Array.isArray(val[0])) newItem = [] as any;
                else if (typeof val[0] === 'object' && val[0] !== null) {
                  newItem = JSON.parse(JSON.stringify(val[0]));
                  const typedNewItem = newItem as Record<string, any>;
                  // clear string values for template
                  Object.keys(typedNewItem).forEach(k => { if (typeof typedNewItem[k] === 'string') typedNewItem[k] = ''; });
                } else if (typeof val[0] === 'number') newItem = 0 as any;
                else if (typeof val[0] === 'boolean') newItem = false as any;
              }
              const newVal = [...val, newItem];
              onChange(newVal);
            }}
          >
            + Add Item
          </button>
        </div>

        {val.length === 0 && <div className="text-gray-400 text-xs italic mb-2">No items in array</div>}

        {val.map((item, idx) => (
          <div key={idx} className="mb-4 relative border border-gray-300 rounded-lg p-4 bg-white">
            <div className="absolute top-2 right-2 z-10">
              <button
                type="button"
                onClick={() => {
                  const newVal = [...val];
                  newVal.splice(idx, 1);
                  onChange(newVal);
                }}
                className="text-red-600 text-xs bg-red-50 hover:bg-red-100 px-2 py-1 rounded border border-red-200 transition-colors"
              >
                Remove
              </button>
            </div>
            <JsonNode path={`${path}[${idx}]`} propertyKey={`Item [${idx}]`} val={item} onChange={(v: any) => {
              const newVal = [...val];
              newVal[idx] = v;
              onChange(newVal);
            }} />
          </div>
        ))}
      </div>
    );
  }

  if (typeof val === 'object' && val !== null) {
    return (
      <div className="mb-6 p-4 border-l-4 border-teal-400 bg-teal-50/30 rounded-r-lg shadow-sm">
        <label className="block text-sm font-bold text-gray-800 mb-4">{propertyKey} (Object)</label>
        {Object.keys(val).map(key => (
          <JsonNode key={key} propertyKey={key} path={`${path}.${key}`} val={val[key]} onChange={(v: any) => {
            onChange({ ...val, [key]: v });
          }} />
        ))}
      </div>
    );
  }

  return null;
}
