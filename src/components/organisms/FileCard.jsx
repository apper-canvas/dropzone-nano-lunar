import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import ProgressBar from '@/components/atoms/ProgressBar';
import StatusIndicator from '@/components/molecules/StatusIndicator';
import FileTypeIcon from '@/components/molecules/FileTypeIcon';
import { fileService } from '@/services';

const FileCard = ({ file, onPause, onResume, onCancel, onRetry }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <motion.div
      className="bg-white rounded-xl p-4 shadow-sm border border-surface-200 hover:shadow-md transition-all"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      whileHover={{ scale: 1.02 }}
      layout
    >
      <div className="flex items-start gap-3">
        {/* File Preview/Icon */}
        <div className="flex-shrink-0">
          {file.preview ? (
            <img
              src={file.preview}
              alt={file.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-surface-100 flex items-center justify-center">
              <FileTypeIcon type={file.type} className="w-6 h-6 text-surface-600" />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-surface-900 truncate">{file.name}</h4>
              <div className="flex items-center gap-2 text-sm text-surface-500">
                <span>{formatFileSize(file.size)}</span>
                <span>•</span>
                <StatusIndicator status={file.status} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1 ml-2">
              <AnimatePresence mode="wait">
                {file.status === 'uploading' && (
                  <motion.button
                    key="pause"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => onPause(file.id)}
                    className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-600 hover:text-warning transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ApperIcon name="Pause" className="w-4 h-4" />
                  </motion.button>
                )}

                {file.status === 'paused' && (
                  <motion.button
                    key="resume"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => onResume(file.id)}
                    className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-600 hover:text-primary transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ApperIcon name="Play" className="w-4 h-4" />
                  </motion.button>
                )}

                {file.status === 'error' && (
                  <motion.button
                    key="retry"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => onRetry(file)}
                    className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-600 hover:text-primary transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ApperIcon name="RotateCcw" className="w-4 h-4" />
                  </motion.button>
                )}

                {(file.status === 'uploading' || file.status === 'paused' || file.status === 'error') && (
                  <motion.button
                    key="cancel"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => onCancel(file.id)}
                    className="p-1.5 rounded-lg hover:bg-surface-100 text-surface-600 hover:text-error transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ApperIcon name="X" className="w-4 h-4" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Progress Bar */}
          {(file.status === 'uploading' || file.status === 'paused') && (
            <div className="mb-2">
              <ProgressBar progress={file.progress} status={file.status} />
            </div>
          )}

          {/* Additional Info */}
          <div className="flex items-center justify-between text-xs text-surface-500">
            {file.status === 'uploading' && (
              <>
                <span>{file.progress}% complete</span>
                <span>{fileService.formatUploadSpeed(file.uploadSpeed || 0)}</span>
              </>
            )}
            {file.status === 'completed' && (
              <div className="flex items-center gap-1 text-success">
                <ApperIcon name="CheckCircle" className="w-3 h-3" />
                <span>Upload complete</span>
              </div>
            )}
            {file.status === 'error' && file.error && (
              <span className="text-error">{file.error}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FileCard;