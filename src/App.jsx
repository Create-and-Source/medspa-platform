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
const Inbox = lazy(() => import('./pages/Inbox'));
const BeforeAfter = lazy(() => import('./pages/BeforeAfter'));
const Charts = lazy(() => import('./pages/Charts'));
const Waivers = lazy(() => import('./pages/Waivers'));
const CheckIn = lazy(() => import('./pages/CheckIn'));
const Referrals = lazy(() => import('./pages/Referrals'));
const Memberships = lazy(() => import('./pages/Memberships'));
const Reviews = lazy(() => import('./pages/Reviews'));
const Waitlist = lazy(() => import('./pages/Waitlist'));
const Aftercare = lazy(() => import('./pages/Aftercare'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Reports = lazy(() => import('./pages/Reports'));
const Settings = lazy(() => import('./pages/Settings'));
const Portal = lazy(() => import('./pages/Portal'));

function Loader() {
  return <div style={{ padding: 60, textAlign: 'center', color: '#999', font: "400 14px 'Inter', sans-serif" }}>Loading...</div>;
}

export default function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/portal" element={<Portal />} />
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/checkin" element={<CheckIn />} />
                <Route path="/patients" element={<Patients />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/treatments" element={<Treatments />} />
                <Route path="/charts" element={<Charts />} />
                <Route path="/photos" element={<BeforeAfter />} />
                <Route path="/waivers" element={<Waivers />} />
                <Route path="/memberships" element={<Memberships />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/referrals" element={<Referrals />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/retention" element={<Retention />} />
                <Route path="/aftercare" element={<Aftercare />} />
                <Route path="/waitlist" element={<Waitlist />} />
                <Route path="/reviews" element={<Reviews />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/email" element={<Email />} />
                <Route path="/texts" element={<TextMessages />} />
                <Route path="/social" element={<SocialMedia />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          } />
        </Routes>
      </Suspense>
    </ThemeProvider>
  );
}
