/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Invoices } from './components/Invoices';
import { Clients } from './components/Clients';
import { Reminders } from './components/Reminders';
import { Payments } from './components/Payments';
import { Toaster } from 'sonner';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

// ── Root router ───────────────────────────────────────────────────────────────

export default function App() {
  console.log("🛠️ [PayTrack] App component rendering...");
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'clients' | 'payments' | 'reminders'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    console.log("📡 [PayTrack] useEffect checking authentication...");
    const token = localStorage.getItem('paytrack_token');
    
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);

    const handleAuthError = () => {
      setIsAuthenticated(false);
    };

    window.addEventListener('auth-unauthorized', handleAuthError);
    return () => window.removeEventListener('auth-unauthorized', handleAuthError);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('paytrack_token');
    localStorage.removeItem('paytrack_user');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">Chargement de PayTrack...</div>;
  }

  // Dashboard Layout Wrapper
  const DashboardLayout = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const renderContent = () => {
      switch (activeTab) {
        case 'dashboard': return <Dashboard />;
        case 'invoices': return <Invoices />;
        case 'clients': return <Clients />;
        case 'payments': return <Payments />;
        case 'reminders': return <Reminders />;
        default: return <Dashboard />;
      }
    };

    return (
      <div className="flex h-screen bg-slate-50 font-sans antialiased overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={(tab) => { setActiveTab(tab as any); setSidebarOpen(false); }} 
          onLogout={handleLogout}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto bg-slate-50/50">
            {renderContent()}
          </main>
        </div>
      </div>
    );
  };

  return (
    <>
      <Routes>
        {/* Public Marketing Website */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Pages */}
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} 
        />

        {/* Protected Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />} />
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </>
  );
}
