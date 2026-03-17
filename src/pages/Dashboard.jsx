import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStyles } from '../theme';
import { getPatients, getAppointments, getInventory, getRetentionAlerts, getServices, getProviders, subscribe } from '../data/store';

const fmt = (cents) => `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

export default function Dashboard() {
  const s = useStyles();
  const nav = useNavigate();
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);

  const patients = getPatients();
  const appointments = getAppointments();
  const inventory = getInventory();
  const alerts = getRetentionAlerts();
  const services = getServices();
  const providers = getProviders();

  const today = new Date().toISOString().slice(0, 10);
  const todayAppts = appointments.filter(a => a.date === today);
  const confirmedToday = todayAppts.filter(a => a.status === 'confirmed').length;
  const pendingToday = todayAppts.filter(a => a.status === 'pending').length;

  // Revenue (completed appointments this month)
  const thisMonth = today.slice(0, 7);
  const monthAppts = appointments.filter(a => a.date?.startsWith(thisMonth) && a.status === 'completed');
  const monthRevenue = monthAppts.reduce((sum, a) => {
    const svc = services.find(sv => sv.id === a.serviceId);
    return sum + (svc?.price || 0);
  }, 0);

  // New patients this month
  const newPatientsMonth = patients.filter(p => p.createdAt?.startsWith(thisMonth)).length;

  // Low stock
  const lowStock = inventory.filter(i => i.quantity <= i.reorderAt);

  // Pending retention
  const pendingAlerts = alerts.filter(a => a.status === 'pending');

  // Upcoming appointments (next 5)
  const upcoming = appointments
    .filter(a => a.date >= today && a.status !== 'completed')
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`))
    .slice(0, 8);

  const KPI = ({ label, value, sub, onClick, idx = 0 }) => (
    <div onClick={onClick} style={{
      ...s.cardStyle, padding: '28px 24px', cursor: onClick ? 'pointer' : 'default',
      animation: `fadeInUp 0.5s cubic-bezier(0.16,1,0.3,1) ${idx * 80}ms backwards`,
      position: 'relative', overflow: 'hidden',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = s.shadowMd; e.currentTarget.style.transform = 'translateY(-2px)'; }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = s.shadow; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: `${s.accent}08` }} />
      <div style={{ font: `500 10px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1.5, color: s.text3, marginBottom: 10 }}>{label}</div>
      <div style={{ font: `600 34px ${s.FONT}`, color: s.text, marginBottom: 6, letterSpacing: '-0.5px' }}>{value}</div>
      {sub && <div style={{ font: `400 13px ${s.FONT}`, color: s.text2 }}>{sub}</div>}
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: 32, animation: 'fadeIn 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
        <h1 style={{ font: `600 28px ${s.FONT}`, color: s.text, marginBottom: 6, letterSpacing: '-0.3px' }}>Dashboard</h1>
        <p style={{ font: `400 14px ${s.FONT}`, color: s.text3 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} overview
        </p>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
        <KPI label="Today's Appointments" value={todayAppts.length} sub={`${confirmedToday} confirmed, ${pendingToday} pending`} onClick={() => nav('/schedule')} idx={0} />
        <KPI label="Monthly Revenue" value={fmt(monthRevenue)} sub={`${monthAppts.length} completed treatments`} onClick={() => nav('/reports')} idx={1} />
        <KPI label="Active Patients" value={patients.length} sub={`${newPatientsMonth} new this month`} onClick={() => nav('/patients')} idx={2} />
        <KPI label="Retention Alerts" value={pendingAlerts.length} sub={pendingAlerts.length > 0 ? `${pendingAlerts.filter(a => a.priority === 'high').length} high priority` : 'All caught up'} onClick={() => nav('/retention')} idx={3} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Upcoming Appointments */}
        <div style={{ ...s.cardStyle, overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ font: `600 14px ${s.FONT}`, color: s.text }}>Upcoming Appointments</span>
            <button onClick={() => nav('/schedule')} style={{ ...s.pillGhost, padding: '5px 12px', fontSize: 11 }}>View All</button>
          </div>
          <div>
            {upcoming.map(a => {
              const svc = services.find(sv => sv.id === a.serviceId);
              const prov = providers.find(p => p.id === a.providerId);
              const isToday = a.date === today;
              return (
                <div key={a.id} style={{ padding: '14px 20px', borderBottom: '1px solid #F8F8F8', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, background: isToday ? s.accentLight : '#F5F5F5',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <div style={{ font: `600 12px ${s.FONT}`, color: isToday ? s.accent : s.text, lineHeight: 1 }}>
                      {new Date(a.date + 'T12:00:00').toLocaleDateString('en-US', { day: 'numeric' })}
                    </div>
                    <div style={{ font: `400 9px ${s.MONO}`, color: isToday ? s.accent : s.text3, textTransform: 'uppercase' }}>
                      {new Date(a.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' })}
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: `500 13px ${s.FONT}`, color: s.text }}>{a.patientName}</div>
                    <div style={{ font: `400 12px ${s.FONT}`, color: s.text2 }}>{svc?.name || 'Service'} — {prov?.name || 'Provider'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ font: `500 12px ${s.MONO}`, color: s.text }}>{a.time}</div>
                    <span style={{
                      font: `500 10px ${s.FONT}`, textTransform: 'uppercase', letterSpacing: 0.5,
                      color: a.status === 'confirmed' ? s.success : a.status === 'pending' ? s.warning : s.text3,
                    }}>{a.status}</span>
                  </div>
                </div>
              );
            })}
            {upcoming.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', font: `400 13px ${s.FONT}`, color: s.text3 }}>No upcoming appointments</div>
            )}
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Low Stock Alerts */}
          <div style={{ ...s.cardStyle, overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ font: `600 14px ${s.FONT}`, color: s.text }}>Low Stock Alerts</span>
              <button onClick={() => nav('/inventory')} style={{ ...s.pillGhost, padding: '5px 12px', fontSize: 11 }}>Inventory</button>
            </div>
            {lowStock.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', font: `400 13px ${s.FONT}`, color: s.text3 }}>All stock levels healthy</div>
            ) : lowStock.map(item => (
              <div key={item.id} style={{ padding: '12px 20px', borderBottom: '1px solid #F8F8F8', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ font: `500 13px ${s.FONT}`, color: s.text }}>{item.name}</div>
                  <div style={{ font: `400 11px ${s.FONT}`, color: s.text3 }}>{item.category}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    font: `600 12px ${s.MONO}`,
                    color: item.quantity <= item.reorderAt / 2 ? s.danger : s.warning,
                  }}>{item.quantity} left</span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div style={{ ...s.cardStyle, padding: 20 }}>
            <div style={{ font: `600 14px ${s.FONT}`, color: s.text, marginBottom: 14 }}>Quick Actions</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { label: 'New Patient', path: '/patients', icon: '+' },
                { label: 'Book Appointment', path: '/schedule', icon: '+' },
                { label: 'Send Email', path: '/email', icon: '→' },
                { label: 'Send Text Blast', path: '/texts', icon: '→' },
              ].map(a => (
                <button key={a.label} onClick={() => nav(a.path)} style={{
                  padding: '14px 16px', background: '#F8F8F8', border: '1px solid #F0F0F0',
                  borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                  font: `500 13px ${s.FONT}`, color: s.text, transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = s.accent; e.currentTarget.style.color = s.accent; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#F0F0F0'; e.currentTarget.style.color = s.text; }}
                >
                  {a.label}
                  <span style={{ fontSize: 16, opacity: 0.5 }}>{a.icon}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 860px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
