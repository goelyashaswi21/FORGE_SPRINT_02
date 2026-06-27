import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../api/client';
import Badge from '../components/Badge';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const fetchTickets = () => {
    let url = '/tickets?';
    if (status) url += `status=${status}&`;
    if (priority) url += `priority=${priority}&`;
    if (search) url += `search=${search}&`;
    api.get(url).then(res => setTickets(res.data.data)).catch(console.error);
  };

  useEffect(() => {
    fetchTickets();
  }, [status, priority]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">Tickets</h1>
        <button onClick={() => navigate('/tickets/new')} className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700 transition">Create Ticket</button>
      </div>

      <div className="flex gap-4 mb-6 bg-white p-4 rounded-lg shadow-sm items-center">
        <select className="border p-2 rounded w-40 bg-gray-50" value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
        
        <select className="border p-2 rounded w-40 bg-gray-50" value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <div className="flex items-center border rounded bg-gray-50 flex-grow">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <input 
            className="p-2 bg-transparent outline-none w-full" 
            placeholder="Search tickets..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && fetchTickets()}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-4">#ID</th>
              <th className="p-4">Subject</th>
              <th className="p-4">Status</th>
              <th className="p-4">Priority</th>
              <th className="p-4">Assignee</th>
              <th className="p-4">Created</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(t => (
              <tr key={t.id} onClick={() => navigate(`/tickets/${t.id}`)} className="border-b hover:bg-gray-50 cursor-pointer transition">
                <td className="p-4 text-gray-500">#{t.id}</td>
                <td className="p-4 font-semibold text-gray-800">{t.subject}</td>
                <td className="p-4"><Badge value={t.status} /></td>
                <td className="p-4"><Badge value={t.priority} /></td>
                <td className="p-4">{t.assignee?.name || 'Unassigned'}</td>
                <td className="p-4 text-sm text-gray-500">{new Date(t.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {tickets.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-gray-500">No tickets found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
