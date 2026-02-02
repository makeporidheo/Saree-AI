
import React, { useRef } from 'react';
import { Upload, X, CheckCircle2, Circle } from 'lucide-react';

interface ImageUploadFieldProps {
  label: string;
  subLabel?: string;
  files: File[];
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (index: number) => void;
  multiple?: boolean;
  maxFiles?: number;
  accept?: string;
  selectedIndex?: number | null;
  onSelect?: (index: number) => void;
}

export const ImageUploadField: React.FC<ImageUploadFieldProps> = ({
  label,
  subLabel,
  files,
  onFilesSelected,
  onRemoveFile,
  multiple = false,
  maxFiles = 1,
  accept = "image/*",
  selectedIndex = null,
  onSelect
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const totalFiles = files.length + newFiles.length;
      
      if (maxFiles && totalFiles > maxFiles) {
        alert(`You can only upload a maximum of ${maxFiles} files.`);
        return;
      }
      
      onFilesSelected(newFiles);
      // Reset input
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      {subLabel && <p className="text-xs text-slate-500 mb-2">{subLabel}</p>}
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {files.map((file, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <div 
              key={idx} 
              className={`relative group aspect-[3/4] bg-slate-100 rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${isSelected ? 'border-primary-500 ring-2 ring-primary-100 shadow-md' : 'border-slate-200 hover:border-slate-300'}`}
              onClick={() => onSelect?.(idx)}
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`upload-${idx}`}
                className="w-full h-full object-cover"
              />
              
              {onSelect && (
                <div className="absolute top-2 left-2 z-10 transition-transform active:scale-90">
                  {isSelected ? (
                    <CheckCircle2 size={24} className="text-primary-600 bg-white/90 rounded-full p-0.5 shadow-sm" />
                  ) : (
                    <Circle size={24} className="text-white/80 bg-black/10 rounded-full p-0.5" />
                  )}
                </div>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFile(idx);
                }}
                className="absolute top-2 right-2 p-1 bg-white/80 hover:bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X size={16} />
              </button>
              
              {isSelected && (
                <div className="absolute inset-0 bg-primary-500/5 pointer-events-none" />
              )}
            </div>
          );
        })}
        
        {(files.length < maxFiles) && (
          <div
            onClick={() => inputRef.current?.click()}
            className="aspect-[3/4] border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-colors text-slate-400 hover:text-primary-600"
          >
            <Upload size={24} className="mb-2" />
            <span className="text-xs font-medium">Add Image</span>
            <span className="text-[10px] opacity-60">({files.length}/{maxFiles})</span>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
      />
    </div>
  );
};
