import React from 'react';

const STATUS_COLORS = {
  open: 'bg-blue-100 text-blue-800 border-blue-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  resolved: 'bg-green-100 text-green-800 border-green-200',
  closed: 'bg-gray-100 text-gray-800 border-gray-200'
};

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-800 border-gray-200',
  medium: 'bg-blue-100 text-blue-800 border-blue-200',
  high: 'bg-orange-100 text-orange-800 border-orange-200',
  urgent: 'bg-red-100 text-red-800 border-red-200'
};

export default function Badge({ type = 'status', value }) {
  const normValue = value?.toLowerCase() || '';
  const colors = type === 'status' 
    ? STATUS_COLORS[normValue] || 'bg-gray-100 text-gray-800 border-gray-200'
    : PRIORITY_COLORS[normValue] || 'bg-gray-100 text-gray-800 border-gray-200';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors}`}>
      {value}
    </span>
  );
}
