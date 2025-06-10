import uploadHistory from '../mockData/uploadHistory.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class FileService {
  constructor() {
    this.uploadHistory = [...uploadHistory];
    this.activeUploads = new Map();
  }

  async getUploadHistory() {
    await delay(200);
    return [...this.uploadHistory];
  }

  async simulateUpload(file, onProgress) {
    const fileItem = {
      id: Date.now().toString(),
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploading',
      progress: 0,
      uploadSpeed: 0,
      preview: null,
      error: null,
      startTime: Date.now()
    };

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      fileItem.preview = URL.createObjectURL(file);
    }

    this.activeUploads.set(fileItem.id, { file, fileItem, cancelled: false, paused: false });

    // Simulate upload progress
    const totalChunks = 100;
    const chunkDelay = Math.random() * 100 + 50; // 50-150ms per chunk
    
    for (let i = 0; i <= totalChunks; i++) {
      const uploadData = this.activeUploads.get(fileItem.id);
      if (!uploadData || uploadData.cancelled) {
        throw new Error('Upload cancelled');
      }

      // Handle pause
      while (uploadData.paused && !uploadData.cancelled) {
        await delay(100);
      }

      const progress = Math.round((i / totalChunks) * 100);
      const elapsed = Date.now() - fileItem.startTime;
      const uploadSpeed = elapsed > 0 ? (file.size * (progress / 100)) / (elapsed / 1000) : 0;

      fileItem.progress = progress;
      fileItem.uploadSpeed = uploadSpeed;
      fileItem.status = progress === 100 ? 'completed' : 'uploading';

      onProgress({ ...fileItem });

      if (progress < 100) {
        await delay(chunkDelay);
      }
    }

    // Simulate random failures (10% chance)
    if (Math.random() < 0.1) {
      fileItem.status = 'error';
      fileItem.error = 'Upload failed due to network error';
      onProgress({ ...fileItem });
      throw new Error('Upload failed');
    }

    // Add to history
    this.uploadHistory.unshift({ ...fileItem });
    if (this.uploadHistory.length > 10) {
      this.uploadHistory.pop();
    }

    this.activeUploads.delete(fileItem.id);
    return fileItem;
  }

  async pauseUpload(fileId) {
    await delay(100);
    const uploadData = this.activeUploads.get(fileId);
    if (uploadData) {
      uploadData.paused = true;
      uploadData.fileItem.status = 'paused';
      return uploadData.fileItem;
    }
    throw new Error('Upload not found');
  }

  async resumeUpload(fileId) {
    await delay(100);
    const uploadData = this.activeUploads.get(fileId);
    if (uploadData) {
      uploadData.paused = false;
      uploadData.fileItem.status = 'uploading';
      return uploadData.fileItem;
    }
    throw new Error('Upload not found');
  }

  async cancelUpload(fileId) {
    await delay(100);
    const uploadData = this.activeUploads.get(fileId);
    if (uploadData) {
      uploadData.cancelled = true;
      this.activeUploads.delete(fileId);
      return true;
    }
    return false;
  }

  async retryUpload(file, onProgress) {
    return this.simulateUpload(file, onProgress);
  }

  validateFile(file, config) {
    const errors = [];

    if (file.size > config.maxFileSize) {
      errors.push(`File size exceeds ${this.formatFileSize(config.maxFileSize)} limit`);
    }

    if (config.allowedTypes.length > 0 && !config.allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }

    return errors;
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  formatUploadSpeed(bytesPerSecond) {
    if (bytesPerSecond === 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
    return parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}

export default new FileService();