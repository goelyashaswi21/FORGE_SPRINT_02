import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-6">
        <Link to="/dashboard" className="text-xl font-semibold text-gray-900">
          PulseDesk
        </Link>
        <Link to="/tickets" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
          Tickets
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        {/* Placeholder for logged in user */}
        <span className="text-sm text-gray-600 font-medium">User</span>
        <button 
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
