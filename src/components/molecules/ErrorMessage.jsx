import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorMessage = ({ message, onRetry, onDismiss }) => {
  return (
    <motion.div
      className="bg-error/10 border border-error/20 rounded-lg p-4 mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <ApperIcon name="AlertCircle" className="w-5 h-5 text-error" />
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm text-error font-medium">{message}</p>
        </div>
        
        <div className="flex items-center gap-2">
          {onRetry && (
            <Button
              onClick={onRetry}
              className="text-xs text-error hover:text-error/80 font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </Button>
          )}
          
          {onDismiss && (
            <Button
              onClick={onDismiss}
              className="text-error hover:text-error/80 p-0"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <ApperIcon name="X" className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ErrorMessage;