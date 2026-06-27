import React from 'react';

const colors = {
  open: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-800',
};

export default function Badge({ value }) {
  return <span className={`px-2 py-1 rounded text-xs font-semibold ${colors[value] || 'bg-gray-100'}`}>{value}</span>;
}
