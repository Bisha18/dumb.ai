import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NoteEditor from './pages/NoteEditor';
import GraphView from './pages/GraphView';
import AIInsights from './pages/AIInsights';
import Login from './pages/Login';
import Register from './pages/Register';
import useStore from './store/useStore';
import { useSocketInit } from './hooks/useSocket';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const token = useStore(state => state.token);
  if (!token) return <Navigate to="/login" replace />;
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
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="notes" element={<NoteEditor />} />
            <Route path="graph" element={<GraphView />} />
            <Route path="ai" element={<AIInsights />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GlobalProvider>
  );
}

export default App;
