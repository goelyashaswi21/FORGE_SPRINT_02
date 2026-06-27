import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import client from '../api/client';
import Badge from '../components/Badge';

export default function TicketList() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

  const fetchTickets = async (page = 1) => {
    setLoading(true);
    try {
      const params = { page };
      if (filters.status) params.status = filters.status;
      if (filters.priority) params.priority = filters.priority;
      if (filters.search) params.search = filters.search;

      const { data } = await client.get('/tickets', { params });
      setTickets(data.data || []);
      setPagination({
        current_page: data.current_page || 1,
        last_page: data.last_page || 1
      });
    } catch (err) {
      console.error('Failed to fetch tickets', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Tickets</h1>
          <Link 
            to="/tickets/new" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors shadow-sm"
          >
            Create Ticket
          </Link>
        </div>

        <div className="bg-white p-4 border border-gray-200 rounded shadow-sm mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
          <select 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select 
            name="priority" 
            value={filters.priority} 
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 w-full sm:w-auto"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
          <input 
            type="text" 
            name="search" 
            placeholder="Search subject..." 
            value={filters.search}
            onChange={handleFilterChange}
            className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 flex-1"
          />
        </div>

        <div className="bg-white border text-sm border-gray-200 rounded shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-max">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3 border-r border-gray-100 last:border-r-0">#ID</th>
                  <th className="px-6 py-3 border-r border-gray-100 last:border-r-0">Subject</th>
                  <th className="px-6 py-3 border-r border-gray-100 last:border-r-0">Status</th>
                  <th className="px-6 py-3 border-r border-gray-100 last:border-r-0">Priority</th>
                  <th className="px-6 py-3 border-r border-gray-100 last:border-r-0">Assignee</th>
                  <th className="px-6 py-3">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500 bg-gray-50/50">Loading matches...</td>
                  </tr>
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 bg-gray-50/50">No tickets found matching criteria.</td>
                  </tr>
                ) : (
                  tickets.map(ticket => (
                    <tr 
                      key={ticket.id} 
                      onClick={() => navigate(`/tickets/${ticket.id}`)}
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 text-gray-500 font-medium">#{ticket.id}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{ticket.subject}</td>
                      <td className="px-6 py-4"><Badge type="status" value={ticket.status} /></td>
                      <td className="px-6 py-4"><Badge type="priority" value={ticket.priority} /></td>
                      <td className="px-6 py-4 text-gray-600">{ticket.assignee?.name || 'Unassigned'}</td>
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{new Date(ticket.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {pagination.last_page > 1 && (
            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <span className="text-sm text-gray-600 font-medium">Page {pagination.current_page} of {pagination.last_page}</span>
              <div className="space-x-2">
                <button 
                  disabled={pagination.current_page === 1}
                  onClick={() => fetchTickets(pagination.current_page - 1)}
                  className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <button 
                  disabled={pagination.current_page === pagination.last_page}
                  onClick={() => fetchTickets(pagination.current_page + 1)}
                  className="px-3 py-1.5 border border-gray-300 rounded bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
