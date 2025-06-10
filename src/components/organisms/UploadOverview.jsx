import React from 'react';
import { motion } from 'framer-motion';
import UploadStatCard from '@/components/molecules/UploadStatCard';

const UploadOverview = ({ uploadStats, formatFileSize }) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <UploadStatCard 
        value={uploadStats.totalUploads} 
        label="Total Uploads" 
        colorClass="from-primary/10 to-secondary/10 text-primary" 
        borderColorClass="border-primary/20" 
      />
      <UploadStatCard 
        value={uploadStats.successfulUploads} 
        label="Successful" 
        colorClass="from-success/10 to-accent/10 text-success" 
        borderColorClass="border-success/20" 
      />
      <UploadStatCard 
        value={formatFileSize(uploadStats.totalSize)} 
        label="Total Size" 
        colorClass="from-info/10 to-primary/10 text-info" 
        borderColorClass="border-info/20" 
      />
    </motion.div>
  );
};

export default UploadOverview;