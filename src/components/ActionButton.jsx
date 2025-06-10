import { motion } from 'framer-motion';
import ApperIcon from './ApperIcon';

const ActionButton = ({ 
  icon, 
  label, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  disabled = false,
  loading = false,
  className = ''
}) => {
  const getVariantClasses = () => {
    const variants = {
      primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90',
      secondary: 'bg-white border border-surface-300 text-surface-700 hover:bg-surface-50',
      success: 'bg-success text-white hover:bg-success/90',
      warning: 'bg-warning text-white hover:bg-warning/90',
      error: 'bg-error text-white hover:bg-error/90',
      ghost: 'text-surface-600 hover:bg-surface-100'
    };
    return variants[variant] || variants.primary;
  };

  const getSizeClasses = () => {
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg'
    };
    return sizes[size] || sizes.md;
  };

  const getIconSize = () => {
    const sizes = {
      sm: 'w-4 h-4',
      md: 'w-5 h-5',
      lg: 'w-6 h-6'
    };
    return sizes[size] || sizes.md;
  };

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center gap-2 rounded-lg font-medium transition-all
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
    >
      {loading ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <ApperIcon name="Loader2" className={getIconSize()} />
        </motion.div>
      ) : icon ? (
        <ApperIcon name={icon} className={getIconSize()} />
      ) : null}
      
      {label && <span>{label}</span>}
    </motion.button>
  );
};

export default ActionButton;