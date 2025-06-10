import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';
import ActionButton from '../components/ActionButton';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ApperIcon name="FileX" className="w-24 h-24 text-surface-300 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-4xl font-bold text-surface-900 mb-4">404</h1>
        <h2 className="text-xl font-semibold text-surface-700 mb-4">Page Not Found</h2>
        <p className="text-surface-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <ActionButton
          icon="Home"
          label="Go Home"
          onClick={() => navigate('/')}
          variant="primary"
        />
      </motion.div>
    </div>
  );
};

export default NotFound;