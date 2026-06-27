import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import client from '../api/client';
import Badge from '../components/Badge';

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Comment form state
  const [replyBody, setReplyBody] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [ticketRes, usersRes] = await Promise.all([
          client.get(`/tickets/${id}`),
          client.get('/users').catch(() => ({ data: [] }))
        ]);
        setTicket(ticketRes.data.data || ticketRes.data);
        setUsers(usersRes.data.data || usersRes.data);
      } catch (err) {
        setError('Failed to load ticket details.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    try {
      await client.patch(`/tickets/${id}`, { status: newStatus });
      setTicket({ ...ticket, status: newStatus });
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleAssigneeChange = async (e) => {
    const newAssignee = e.target.value;
    try {
      await client.patch(`/tickets/${id}/assign`, { assignee_id: newAssignee });
      setTicket({ ...ticket, assignee_id: newAssignee });
    } catch (err) {
      alert('Failed to assign ticket');
    }
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyBody.trim()) return;
    
    setSubmittingReply(true);
    try {
      const { data } = await client.post(`/tickets/${id}/comments`, {
        body: replyBody,
        is_internal: isInternal
      });
      // Append comment
      setTicket({ 
        ...ticket, 
        comments: [...(ticket.comments || []), data.comment || data] 
      });
      setReplyBody('');
    } catch (err) {
      alert('Failed to post reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 flex flex-col"><Navbar /><div className="p-8 text-gray-500 max-w-7xl mx-auto">Loading ticket...</div></div>;
  if (error || !ticket) return <div className="min-h-screen bg-gray-50 flex flex-col"><Navbar /><div className="p-8 text-red-500 max-w-7xl mx-auto">{error || 'Ticket not found'}</div></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <button onClick={() => navigate('/tickets')} className="text-sm font-medium text-blue-600 hover:text-blue-800 mb-6 inline-flex items-center transition-colors">
          &larr; <span className="ml-1">Back to Tickets</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column 2/3 */}
          <div className="lg:w-2/3">
            <div className="bg-white border border-gray-200 rounded shadow-sm p-6 mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">{ticket.subject}</h1>
              <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{ticket.description}</div>
            </div>

            {/* Comment Thread */}
            <h2 className="text-lg font-medium text-gray-900 mb-4">Thread</h2>
            <div className="space-y-4 mb-8">
              {(ticket.comments || []).map((comment, index) => (
                <div 
                  key={comment.id || index} 
                  className={`border rounded shadow-sm p-4 flex gap-4 ${comment.is_internal ? 'bg-[#fffdf2] border-yellow-200' : 'bg-white border-gray-200'}`}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-semibold text-sm border border-gray-200 shadow-sm">
                      {(comment.author?.name || comment.author_name || 'U').charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">{comment.author?.name || comment.author_name || 'Unknown'}</span>
                        {comment.is_internal && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-yellow-100 text-yellow-800 border border-yellow-200 uppercase tracking-wide">
                            Internal Note
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(comment.created_at).toLocaleString()}</span>
                    </div>
                    <div className="text-gray-700 text-sm whitespace-pre-wrap leading-relaxed">{comment.body}</div>
                  </div>
                </div>
              ))}
              {(!ticket.comments || ticket.comments.length === 0) && (
                <div className="text-sm text-gray-500 italic py-4">No comments yet.</div>
              )}
            </div>

            {/* Reply Box */}
            <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden mt-4">
              <div className="flex border-b border-gray-200 bg-gray-50">
                <button 
                  type="button"
                  onClick={() => setIsInternal(false)}
                  className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${!isInternal ? 'bg-white border-b-2 border-blue-600 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Public Reply
                </button>
                <button 
                  type="button"
                  onClick={() => setIsInternal(true)}
                  className={`flex-1 py-3 text-sm font-medium text-center transition-colors ${isInternal ? 'bg-yellow-50 border-b-2 border-yellow-500 text-yellow-700' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Internal Note
                </button>
              </div>
              <div className={`p-4 ${isInternal ? 'bg-yellow-50/50' : 'bg-white'}`}>
                <textarea 
                  rows={4}
                  placeholder={isInternal ? "Write an internal note..." : "Write a public reply..."}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm mb-3 focus:ring-1 focus:ring-blue-500"
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                />
                <div className="flex justify-end">
                  <button 
                    onClick={handleReplySubmit}
                    disabled={submittingReply || !replyBody.trim()}
                    className={`px-4 py-2 text-sm font-medium text-white rounded transition-colors disabled:opacity-50 ${isInternal ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    {submittingReply ? 'Submitting...' : isInternal ? 'Add Note' : 'Submit Reply'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column 1/3 */}
          <div className="lg:w-1/3">
            <div className="bg-white border border-gray-200 rounded shadow-sm p-6 space-y-6">
              
              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Requester</label>
                <div className="text-sm font-medium text-gray-900">{ticket.requester?.name || ticket.requester_name || 'N/A'}</div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Created</label>
                <div className="text-sm text-gray-900">{new Date(ticket.created_at).toLocaleString()}</div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</label>
                <select 
                  value={ticket.status}
                  onChange={handleStatusChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="open">Open</option>
                  <option value="pending">Pending</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Priority</label>
                <div className="mt-1">
                  <Badge type="priority" value={ticket.priority} />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Assignee</label>
                <select 
                  value={ticket.assignee_id || ''}
                  onChange={handleAssigneeChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  <option value="">Unassigned</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-5 border-t border-gray-100">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">SLA</label>
                <div className="flex flex-col gap-2 border border-gray-100 bg-gray-50/50 p-3 rounded">
                  <span className="text-sm text-gray-700">
                    <span className="font-medium mr-1">Due:</span> 
                    {ticket.sla_due_date ? new Date(ticket.sla_due_date).toLocaleDateString() : 'None'}
                  </span>
                  {ticket.sla_breached && (
                    <span className="inline-flex max-w-max items-center px-2 py-0.5 rounded text-[11px] font-medium bg-red-100 text-red-800 border border-red-200 uppercase tracking-wider mt-1">
                      BREACHED
                    </span>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
