import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-slate-50 p-8"><div className="skeleton h-12 w-64 mb-6"/><div className="grid md:grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="skeleton h-28"/>)}</div></div>;
  return user ? children : <Navigate to="/login" replace />;
}
