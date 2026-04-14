import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { Invoices } from './components/Invoices';
import { Clients } from './components/Clients';
import { Reminders } from './components/Reminders';
import { Payments } from './components/Payments';
import { Toaster } from 'sonner';
import { useAuth } from './context/AuthContext';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';

// ── Dashboard shell ───────────────────────────────────────────────────────────

function DashboardLayout() {
  const { isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'invoices' | 'clients' | 'payments' | 'reminders'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':  return <Dashboard />;
      case 'invoices':   return <Invoices />;
      case 'clients':    return <Clients />;
      case 'payments':   return <Payments />;
      case 'reminders':  return <Reminders />;
      default:           return <Dashboard />;
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
        setActiveTab={(tab) => { setActiveTab(tab as typeof activeTab); setSidebarOpen(false); }}
        onLogout={logout}
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
}

// ── Root router ───────────────────────────────────────────────────────────────

export default function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-white text-xl animate-pulse">P</div>
          <p className="text-slate-500 text-sm font-medium">Chargement de PayTrack…</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        {/* Landing page — always public */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth — /auth?tab=login or /auth?tab=signup — redirect if already logged in */}
        <Route
          path="/auth"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />}
        />

        {/* Dashboard — DashboardLayout handles the unauthenticated redirect internally */}
        <Route path="/dashboard" element={<DashboardLayout />} />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster position="top-right" richColors />
    </>
  );
}
