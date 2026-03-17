import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './theme';
import Layout from './components/Layout';
import { initStore } from './data/store';

initStore();

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Patients = lazy(() => import('./pages/Patients'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Treatments = lazy(() => import('./pages/Treatments'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Retention = lazy(() => import('./pages/Retention'));
const Email = lazy(() => import('./pages/Email'));
const TextMessages = lazy(() => import('./pages/TextMessages'));
const SocialMedia = lazy(() => import('./pages/SocialMedia'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));

function Loader() {
  return <div style={{ padding: 60, textAlign: 'center', color: '#999', font: "400 14px 'Inter', sans-serif" }}>Loading...</div>;
}

export default function App() {
  return (
    <ThemeProvider>
      <Layout>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/treatments" element={<Treatments />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/retention" element={<Retention />} />
            <Route path="/email" element={<Email />} />
            <Route path="/texts" element={<TextMessages />} />
            <Route path="/social" element={<SocialMedia />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </Layout>
    </ThemeProvider>
  );
}
