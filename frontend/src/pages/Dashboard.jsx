import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard').then(res => setMetrics(res.data)).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="space-x-4">
          <button onClick={() => navigate('/tickets')} className="bg-white border px-4 py-2 rounded shadow-sm hover:bg-gray-50 text-gray-700 font-semibold transition">Manage Tickets</button>
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="bg-red-500 text-white px-4 py-2 rounded font-semibold hover:bg-red-600 shadow-sm transition">Logout</button>
        </div>
      </div>
      
      {metrics && (
        <div className="grid grid-cols-4 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-sm w-full border-t-4 border-blue-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Open</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{metrics.open_tickets}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-yellow-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Pending</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{metrics.pending_tickets}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-red-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">SLA Breaches</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{metrics.sla_breaches}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-green-500">
            <h3 className="text-gray-500 text-sm font-semibold uppercase">Avg Response</h3>
            <p className="text-3xl font-bold mt-2 text-gray-900">{metrics.avg_response_time}</p>
          </div>
        </div>
      )}
    </div>
  );
}
