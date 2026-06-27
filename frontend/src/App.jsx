import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TicketList from './pages/TicketList';
import TicketDetail from './pages/TicketDetail';
import TicketCreate from './pages/TicketCreate';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to='/login' />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path='/tickets' element={<PrivateRoute><TicketList /></PrivateRoute>} />
        <Route path='/tickets/new' element={<PrivateRoute><TicketCreate /></PrivateRoute>} />
        <Route path='/tickets/:id' element={<PrivateRoute><TicketDetail /></PrivateRoute>} />
        <Route path='/' element={<Navigate to='/dashboard' />} />
      </Routes>
    </BrowserRouter>
  );
}
