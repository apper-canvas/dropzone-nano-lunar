import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const RecentUploadsList = ({ uploadHistory, formatFileSize }) => {
  if (uploadHistory.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold text-surface-900">
        Recent Uploads
      </h2>
      
      <div className="space-y-3">
        {uploadHistory.slice(0, 5).map((file, index) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-surface-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {file.preview ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                    <ApperIcon name="CheckCircle" className="w-5 h-5 text-success" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-surface-900 truncate">{file.name}</h4>
                <div className="flex items-center gap-2 text-sm text-surface-500">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span className="text-success">Completed</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentUploadsList;