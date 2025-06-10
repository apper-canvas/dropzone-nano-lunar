import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const StatusIndicator = ({ status, size = 'sm' }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'uploading':
        return {
          color: 'text-primary',
          bg: 'bg-primary/10',
          icon: 'Upload',
          label: 'Uploading',
          animate: true
        };
      case 'paused':
        return {
          color: 'text-warning',
          bg: 'bg-warning/10',
          icon: 'Pause',
          label: 'Paused',
          animate: false
        };
      case 'completed':
        return {
          color: 'text-success',
          bg: 'bg-success/10',
          icon: 'CheckCircle',
          label: 'Completed',
          animate: false
        };
      case 'error':
        return {
          color: 'text-error',
          bg: 'bg-error/10',
          icon: 'AlertCircle',
          label: 'Error',
          animate: false
        };
      default:
        return {
          color: 'text-surface-500',
          bg: 'bg-surface-100',
          icon: 'FileText',
          label: 'Unknown',
          animate: false
        };
    }
  };

  const config = getStatusConfig();
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full ${config.bg}`}>
      <motion.div
        animate={config.animate ? { rotate: 360 } : {}}
        transition={config.animate ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
      >
        <ApperIcon name={config.icon} className={`${iconSize} ${config.color}`} />
      </motion.div>
      <span className={`${textSize} font-medium ${config.color}`}>
        {config.label}
      </span>
    </div>
  );
};

export default StatusIndicator;