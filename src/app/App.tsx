import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LeadsProvider } from './contexts/LeadsContext';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Leads } from './pages/Leads';
import { LeadDetails } from './pages/LeadDetails';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout><Dashboard /></DashboardLayout></ProtectedRoute>} />
      <Route path="/leads" element={<ProtectedRoute><DashboardLayout><Leads /></DashboardLayout></ProtectedRoute>} />
      <Route path="/leads/:id" element={<ProtectedRoute><DashboardLayout><LeadDetails /></DashboardLayout></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><DashboardLayout><Settings /></DashboardLayout></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><DashboardLayout><Help /></DashboardLayout></ProtectedRoute>} />

      <Route path="/" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <LeadsProvider>
            <div className="size-full">
              <AppRoutes />
              <Toaster position="top-right" richColors />
            </div>
          </LeadsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}