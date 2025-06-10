import ApperIcon from './ApperIcon';

const FileTypeIcon = ({ type, className = 'w-6 h-6' }) => {
  const getIconByType = (mimeType) => {
    if (mimeType.startsWith('image/')) {
      return 'Image';
    }
    
    if (mimeType.startsWith('video/')) {
      return 'Video';
    }
    
    if (mimeType.startsWith('audio/')) {
      return 'Music';
    }
    
    // Document types
    const documentTypes = {
      'application/pdf': 'FileText',
      'application/msword': 'FileText',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'FileText',
      'application/vnd.ms-excel': 'FileSpreadsheet',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'FileSpreadsheet',
      'application/vnd.ms-powerpoint': 'Presentation',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'Presentation',
      'text/plain': 'FileText',
      'text/csv': 'FileSpreadsheet',
      'application/zip': 'Archive',
      'application/x-zip-compressed': 'Archive',
      'application/json': 'FileJson',
      'text/javascript': 'FileCode',
      'text/html': 'FileCode',
      'text/css': 'FileCode'
    };
    
    return documentTypes[mimeType] || 'File';
  };

  const iconName = getIconByType(type);
  
  return <ApperIcon name={iconName} className={className} />;
};

export default FileTypeIcon;