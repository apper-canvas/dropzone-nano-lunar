import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FileCard from '@/components/organisms/FileCard';
import ActionButton from '@/components/molecules/ActionButton';

const ActiveUploadsList = ({ files, onPause, onResume, onCancel, onRetry, clearCompleted }) => {
  const hasCompletedFiles = files.some(f => f.status === 'completed');

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-surface-900">
          Active Uploads ({files.length})
        </h2>
        
        {hasCompletedFiles && (
          <ActionButton
            icon="Trash2"
            label="Clear Completed"
            variant="ghost"
            size="sm"
            onClick={clearCompleted}
          />
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {files.map(file => (
            <FileCard
              key={file.id}
              file={file}
              onPause={onPause}
              onResume={onResume}
              onCancel={onCancel}
              onRetry={onRetry}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ActiveUploadsList;