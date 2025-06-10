import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import DropZone from './DropZone';
import FileCard from './FileCard';
import ErrorMessage from './ErrorMessage';
import ActionButton from './ActionButton';
import ApperIcon from './ApperIcon';
import { fileService, uploadConfigService } from '../services';

const MainFeature = () => {
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
      
      // Calculate stats
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
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 text-center border border-primary/20">
          <div className="text-2xl font-bold text-primary">{uploadStats.totalUploads}</div>
          <div className="text-sm text-surface-600">Total Uploads</div>
        </div>
        <div className="bg-gradient-to-br from-success/10 to-accent/10 rounded-xl p-4 text-center border border-success/20">
          <div className="text-2xl font-bold text-success">{uploadStats.successfulUploads}</div>
          <div className="text-sm text-surface-600">Successful</div>
        </div>
        <div className="bg-gradient-to-br from-info/10 to-primary/10 rounded-xl p-4 text-center border border-info/20">
          <div className="text-2xl font-bold text-info">{formatFileSize(uploadStats.totalSize)}</div>
          <div className="text-sm text-surface-600">Total Size</div>
        </div>
      </motion.div>

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
      <AnimatePresence>
        {files.length > 0 && (
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
              
              {files.some(f => f.status === 'completed') && (
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
                    onPause={handlePauseUpload}
                    onResume={handleResumeUpload}
                    onCancel={handleCancelUpload}
                    onRetry={handleRetryUpload}
                  />
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload History */}
      {uploadHistory.length > 0 && (
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
      )}

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

export default MainFeature;