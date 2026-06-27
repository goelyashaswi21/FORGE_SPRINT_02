import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function TicketCreate() {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tickets', { subject, description, priority });
      navigate(`/tickets/${res.data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="bg-white p-8 rounded-lg shadow-sm w-full max-w-2xl border-t-4 border-blue-600">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Create New Ticket</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
            <input 
              required
              className="w-full border p-3 rounded bg-gray-50 outline-blue-500" 
              value={subject} 
              onChange={e => setSubject(e.target.value)}
              placeholder="Briefly describe your issue..." 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea 
              required
              className="w-full border p-3 rounded bg-gray-50 min-h-[150px] outline-blue-500" 
              value={description} 
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide more details..." 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
            <select 
              className="w-full border p-3 rounded bg-gray-50 outline-blue-500" 
              value={priority} 
              onChange={e => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => navigate('/tickets')} className="px-6 py-2 border rounded font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
            <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 shadow-sm transition">Create Ticket</button>
          </div>
        </form>
      </div>
    </div>
  );
}
