import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import client from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState({ open: 0, pending: 0, resolved: 0, sla_breached: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const { data } = await client.get('/dashboard');
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const cards = [
    { label: 'Open Tickets', value: stats.open, borderClass: 'border-l-blue-500' },
    { label: 'Pending Tickets', value: stats.pending, borderClass: 'border-l-yellow-500' },
    { label: 'Resolved Today', value: stats.resolved, borderClass: 'border-l-green-500' },
    { label: 'SLA Breached', value: stats.sla_breached, borderClass: 'border-l-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>

        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {cards.map((card, idx) => (
              <div 
                key={idx} 
                className={`bg-white border-y border-r border-gray-200 border-l-4 rounded shadow-sm p-6 ${card.borderClass}`}
              >
                <div className="text-4xl font-bold text-gray-900 mb-2">{card.value}</div>
                <div className="text-sm font-medium text-gray-500 uppercase tracking-wide">{card.label}</div>
              </div>
            ))}
          </div>
        )}

        <div>
          <Link 
            to="/tickets"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            &rarr; View All Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}
