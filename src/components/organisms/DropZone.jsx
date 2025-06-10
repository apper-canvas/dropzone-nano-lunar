import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const DropZone = ({ onFilesAdded, disabled, config }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the drop zone completely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesAdded(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFilesAdded(files);
    }
    // Reset input value so same file can be selected again
    e.target.value = '';
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer ${
        isDragging
          ? 'border-secondary bg-gradient-to-br from-secondary/10 to-primary/10 scale-101'
          : disabled
          ? 'border-surface-300 bg-surface-50 cursor-not-allowed'
          : 'border-surface-300 bg-white hover:border-primary hover:bg-primary/5'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {isDragging && (
        <motion.div
          className="absolute inset-0 rounded-xl drag-gradient opacity-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          exit={{ opacity: 0 }}
        />
      )}
      
      <motion.div
        className={`relative z-10 ${disabled ? 'opacity-50' : ''}`}
        animate={isDragging ? { scale: 1.05 } : { scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            isDragging
              ? 'bg-gradient-to-br from-secondary to-primary text-white'
              : 'bg-surface-100 text-surface-500'
          }`}
          animate={isDragging ? { rotate: [0, 10, -10, 0] } : {}}
          transition={{ duration: 0.5, repeat: isDragging ? Infinity : 0 }}
        >
          <ApperIcon name="Upload" className="w-8 h-8" />
        </motion.div>

        <h3 className="text-xl font-semibold text-surface-900 mb-2">
          {isDragging ? 'Drop files here' : 'Drop files to upload'}
        </h3>
        
        <p className="text-surface-600 mb-4">
          or <span className="text-primary font-medium">browse files</span> from your computer
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-surface-500">
          <div className="flex items-center gap-1">
            <ApperIcon name="File" className="w-4 h-4" />
            <span>Max {formatFileSize(config?.maxFileSize || 10485760)}</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Grid3X3" className="w-4 h-4" />
            <span>Up to {config?.maxFiles || 10} files</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-surface-400">
          <span className="px-2 py-1 bg-surface-100 rounded">Images</span>
          <span className="px-2 py-1 bg-surface-100 rounded">PDFs</span>
          <span className="px-2 py-1 bg-surface-100 rounded">Documents</span>
        </div>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
        accept={config?.allowedTypes?.join(',') || '*'}
      />
    </motion.div>
  );
};

export default DropZone;