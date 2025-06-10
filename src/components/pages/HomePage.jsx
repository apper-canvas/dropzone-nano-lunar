import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import DropZone from '@/components/organisms/DropZone';
import ErrorMessage from '@/components/molecules/ErrorMessage';
import ApperIcon from '@/components/ApperIcon';
import UploadOverview from '@/components/organisms/UploadOverview';
import ActiveUploadsList from '@/components/organisms/ActiveUploadsList';
import RecentUploadsList from '@/components/organisms/RecentUploadsList';
import { fileService, uploadConfigService } from '@/services';

const HomePage = () => {
  const [files, setFiles] = useState([]);
  const [uploadHistory, setUploadHistory] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadStats, setUploadStats] = useState({
    totalUploads: 0,
    successfulUploads: 0,
    totalSize: 0
  });

  useEffect(() => {
    loadConfig();
    loadUploadHistory();
  }, []);

  const loadConfig = async () => {
    try {
      const uploadConfig = await uploadConfigService.getConfig();
      setConfig(uploadConfig);
    } catch (err) {
      console.error('Failed to load config:', err);
      toast.error('Failed to load upload configuration');
    }
  };

  const loadUploadHistory = async () => {
    try {
      const history = await fileService.getUploadHistory();
      setUploadHistory(history);
      
      const stats = history.reduce((acc, file) => ({
        totalUploads: acc.totalUploads + 1,
        successfulUploads: acc.successfulUploads + (file.status === 'completed' ? 1 : 0),
        totalSize: acc.totalSize + file.size
      }), { totalUploads: 0, successfulUploads: 0, totalSize: 0 });
      
      setUploadStats(stats);
    } catch (err) {
      console.error('Failed to load upload history:', err);
    }
  };

  const validateFiles = (newFiles) => {
    if (!config) return { validFiles: [], errors: [] };

    const errors = [];
    const validFiles = [];

    // Check total file count
    if (files.length + newFiles.length > config.maxFiles) {
      errors.push(`Maximum ${config.maxFiles} files allowed. Currently have ${files.length} files.`);
      return { validFiles: [], errors };
    }

    newFiles.forEach(file => {
      const fileErrors = fileService.validateFile(file, config);
      if (fileErrors.length > 0) {
        errors.push(`${file.name}: ${fileErrors.join(', ')}`);
      } else {
        validFiles.push(file);
      }
    });

    return { validFiles, errors };
  };

  const handleFilesAdded = async (newFiles) => {
    setError(null);
    
    const { validFiles, errors } = validateFiles(newFiles);
    
    if (errors.length > 0) {
      setError(errors.join('\n'));
      toast.error(`${errors.length} file(s) failed validation`);
      return;
    }

    if (validFiles.length === 0) {
      return;
    }

    // Start uploads for valid files
    validFiles.forEach(file => startUpload(file));
    toast.success(`Started uploading ${validFiles.length} file(s)`);
  };

  const startUpload = async (file) => {
    const fileItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
      uploadSpeed: 0,
      preview: null,
      error: null
    };

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      fileItem.preview = URL.createObjectURL(file);
    }

    // Add to files list
    setFiles(prev => [...prev, fileItem]);

    try {
      await fileService.simulateUpload(file, (updatedFile) => {
        setFiles(prev => prev.map(f => f.id === updatedFile.id ? updatedFile : f));
      });

      // Upload completed successfully
      toast.success(`${file.name} uploaded successfully`);
      
      // Remove from active uploads after a delay
      setTimeout(() => {
        setFiles(prev => prev.filter(f => f.id !== fileItem.id));
        loadUploadHistory(); // Refresh history
      }, 2000);

    } catch (err) {
      // Handle upload failure
      setFiles(prev => prev.map(f => 
        f.id === fileItem.id 
          ? { ...f, status: 'error', error: err.message }
          : f
      ));
      toast.error(`Failed to upload ${file.name}`);
    }
  };

  const handlePauseUpload = async (fileId) => {
    try {
      await fileService.pauseUpload(fileId);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'paused' } : f
      ));
      toast.info('Upload paused');
    } catch (err) {
      toast.error('Failed to pause upload');
    }
  };

  const handleResumeUpload = async (fileId) => {
    try {
      await fileService.resumeUpload(fileId);
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'uploading' } : f
      ));
      toast.info('Upload resumed');
    } catch (err) {
      toast.error('Failed to resume upload');
    }
  };

  const handleCancelUpload = async (fileId) => {
    try {
      await fileService.cancelUpload(fileId);
      setFiles(prev => prev.filter(f => f.id !== fileId));
      toast.info('Upload cancelled');
    } catch (err) {
      toast.error('Failed to cancel upload');
    }
  };

  const handleRetryUpload = async (file) => {
    // Remove the failed file and start a new upload
    setFiles(prev => prev.filter(f => f.id !== file.id));
    
    // Create a new File object to restart the upload
    const blob = new Blob([''], { type: file.type });
    const newFile = new File([blob], file.name, { type: file.type });
    Object.defineProperty(newFile, 'size', { value: file.size });
    
    startUpload(newFile);
  };

  const clearCompleted = () => {
    setFiles(prev => prev.filter(f => f.status !== 'completed'));
    toast.success('Cleared completed uploads');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const hasActiveUploads = files.some(f => f.status === 'uploading' || f.status === 'paused');

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h1 
          className="text-3xl font-bold text-surface-900 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          DropZone Pro
        </motion.h1>
        <motion.p 
          className="text-surface-600 text-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Upload and manage your files with real-time progress tracking
        </motion.p>
      </div>

      {/* Upload Stats */}
      <UploadOverview uploadStats={uploadStats} formatFileSize={formatFileSize} />

      {/* Error Messages */}
      <AnimatePresence>
        {error && (
          <ErrorMessage 
            message={error} 
            onDismiss={() => setError(null)}
          />
        )}
      </AnimatePresence>

      {/* Drop Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <DropZone 
          onFilesAdded={handleFilesAdded}
          disabled={hasActiveUploads && files.length >= (config?.maxFiles || 10)}
          config={config}
        />
      </motion.div>

      {/* Active Uploads */}
      {files.length > 0 && (
        <ActiveUploadsList 
          files={files}
          onPause={handlePauseUpload}
          onResume={handleResumeUpload}
          onCancel={handleCancelUpload}
          onRetry={handleRetryUpload}
          clearCompleted={clearCompleted}
        />
      )}

      {/* Upload History */}
      <RecentUploadsList uploadHistory={uploadHistory} formatFileSize={formatFileSize} />

      {/* Empty State */}
      {files.length === 0 && uploadHistory.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center py-12"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="Upload" className="w-16 h-16 text-surface-300 mx-auto mb-4" />
          </motion.div>
          <h3 className="text-lg font-medium text-surface-900 mb-2">No uploads yet</h3>
          <p className="text-surface-500">Start by dragging files to the drop zone above</p>
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;