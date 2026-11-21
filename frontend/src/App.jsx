import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import CreateLink from './pages/CreateLink';
import Links from './pages/Links';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing/>}/>
          <Route path="/login" element={<Auth mode="login"/>}/>
          <Route path="/signup" element={<Auth mode="signup"/>}/>
          <Route element={<ProtectedRoute><DashboardLayout/></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/links" element={<Links/>}/>
            <Route path="/create" element={<CreateLink/>}/>
            <Route path="/analytics" element={<Analytics/>}/>
            <Route path="/analytics/:id" element={<Analytics/>}/>
            <Route path="/settings" element={<Settings/>}/>
          </Route>
          <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" toastOptions={{duration:3500,style:{border:'1px solid #e8eaf0',fontSize:'14px'}}}/>
    </AuthProvider>
  );
}
