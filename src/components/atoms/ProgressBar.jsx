import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, status }) => {
  const getProgressColor = () => {
    switch (status) {
      case 'uploading':
        return 'from-secondary via-primary to-accent';
      case 'paused':
        return 'from-warning to-warning';
      case 'completed':
        return 'from-success to-success';
      case 'error':
        return 'from-error to-error';
      default:
        return 'from-surface-300 to-surface-300';
    }
  };

  const getBackgroundPosition = () => {
    if (status === 'uploading') {
      return `${progress}% 50%`;
    }
    return '0% 50%';
  };

  return (
    <div className="relative">
      {/* Background track */}
      <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden">
        {/* Progress fill */}
        <motion.div
          className={`h-full bg-gradient-to-r ${getProgressColor()} rounded-full relative overflow-hidden`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            backgroundSize: '200% 100%',
            backgroundPosition: getBackgroundPosition(),
          }}
        >
          {/* Animated shimmer effect for uploading */}
          {status === 'uploading' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </motion.div>
      </div>

      {/* Percentage text */}
      <div className="absolute right-0 top-0 transform -translate-y-5">
        <motion.span
          className="text-xs font-medium text-surface-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {progress}%
        </motion.span>
      </div>
    </div>
  );
};

export default ProgressBar;