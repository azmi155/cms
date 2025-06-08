import * as React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import DevicesPage from './pages/devices/DevicesPage';
import UsersPage from './pages/users/UsersPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/devices" element={<DevicesPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
