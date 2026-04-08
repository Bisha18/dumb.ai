import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NoteEditor from './pages/NoteEditor';
import GraphView from './pages/GraphView';
import AIInsights from './pages/AIInsights';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
import useStore from './store/useStore';
import { useSocketInit } from './hooks/useSocket';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const token = useStore(state => state.token);
  if (!token) return <Navigate to="/landing" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const token = useStore(state => state.token);
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
};

const GlobalProvider = ({ children }) => {
  useSocketInit();
  return children;
};

function App() {
  return (
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/landing" element={<PublicRoute><Landing /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          {/* Protected app routes */}
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="notes" element={<NoteEditor />} />
            <Route path="graph" element={<GraphView />} />
            <Route path="ai" element={<AIInsights />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/landing" replace />} />
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
