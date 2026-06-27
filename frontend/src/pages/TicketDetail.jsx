import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import api from '../api/client';
import Badge from '../components/Badge';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [body, setBody] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = () => {
    api.get(`/tickets/${id}`).then(res => setTicket(res.data)).catch(console.error);
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!body) return;
    try {
      await api.post(`/tickets/${id}/comments`, { body, is_internal: isInternal });
      setBody('');
      fetchTicket();
    } catch (err) {
      console.error(err);
    }
  };

  if (!ticket) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <button onClick={() => navigate('/tickets')} className="mb-4 text-blue-600 hover:underline font-semibold">&larr; Back to tickets</button>
      
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border-l-4 border-blue-500">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">{ticket.subject}</h1>
            <p className="text-gray-500 text-sm">Requested by <span className="font-semibold text-gray-700">{ticket.requester?.name}</span></p>
          </div>
          <div className="text-right flex items-center space-x-3">
             <Badge value={ticket.status} />
             <Badge value={ticket.priority} />
             <div className={`flex items-center text-sm font-semibold p-1 px-2 rounded ${ticket.sla_breached ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                <Clock className="w-4 h-4 mr-1" />
                {ticket.sla_breached ? 'BREACHED' : 'Time remaining'}
             </div>
          </div>
        </div>
        <div className="prose text-gray-700 bg-gray-50 p-4 rounded mt-4 border">
          {ticket.description}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {ticket.comments?.map(c => (
          <div key={c.id} className={`p-4 rounded-lg shadow-sm ${c.is_internal ? 'bg-yellow-50 border-l-4 border-yellow-400' : 'bg-white border-l-4 border-gray-200'}`}>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-gray-800">{c.user?.name} {c.is_internal && <span className="text-yellow-600 font-bold ml-2">(Internal Note)</span>}</span>
              <span className="text-gray-400">{new Date(c.created_at).toLocaleString()}</span>
            </div>
            <p className="text-gray-700 mt-2">{c.body}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleReply} className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-gray-400">
        <h3 className="font-bold mb-4 text-gray-800">Add a Reply</h3>
        <textarea 
          className="w-full border p-3 rounded mb-4 bg-gray-50 min-h-[100px] outline-blue-500" 
          value={body} 
          onChange={e => setBody(e.target.value)} 
          placeholder="Type your message here..."
        />
        <div className="flex justify-between items-center">
          <label className="flex items-center space-x-2 text-sm text-gray-700 font-semibold cursor-pointer">
            <input type="checkbox" checked={isInternal} onChange={e => setIsInternal(e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
            <span>Internal note (Agents only)</span>
          </label>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition">Send Reply</button>
        </div>
      </form>
    </div>
  );
}
