import React from 'react';

const UploadStatCard = ({ value, label, colorClass, borderColorClass }) => {
  return (
    <div className={`bg-gradient-to-br ${colorClass} rounded-xl p-4 text-center border ${borderColorClass}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-surface-600">{label}</div>
    </div>
  );
};

export default UploadStatCard;