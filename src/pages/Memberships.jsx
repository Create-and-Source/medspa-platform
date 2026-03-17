import { useState, useEffect } from 'react';
import { useStyles } from '../theme';
import { subscribe } from '../data/store';

const MEM_KEY = 'ms_memberships';
const PKG_KEY = 'ms_packages';

function getMemberships() {
  try { return JSON.parse(localStorage.getItem(MEM_KEY)) || []; } catch { return []; }
}
function setMemberships(data) { localStorage.setItem(MEM_KEY, JSON.stringify(data)); }

function getPackages() {
  try { return JSON.parse(localStorage.getItem(PKG_KEY)) || []; } catch { return []; }
}
function setPackages(data) { localStorage.setItem(PKG_KEY, JSON.stringify(data)); }

function getPatients() {
  try { return JSON.parse(localStorage.getItem('ms_patients')) || []; } catch { return []; }
}

const TIERS = {
  Silver: { price: 99, color: '#94A3B8', bg: '#F8FAFC', allocations: [{ service: 'HydraFacial', units: 1, unit: 'session' }, { service: 'Chemical Peel', units: 1, unit: 'session' }] },
  Gold: { price: 199, color: '#D97706', bg: '#FFFBEB', allocations: [{ service: 'Botox', units: 20, unit: 'units' }, { service: 'HydraFacial', units: 1, unit: 'session' }, { service: 'Chemical Peel', units: 1, unit: 'session' }] },
  Platinum: { price: 349, color: '#7C3AED', bg: '#F5F3FF', allocations: [{ service: 'Botox', units: 40, unit: 'units' }, { service: 'Juvederm Filler', units: 1, unit: 'syringe' }, { service: 'HydraFacial', units: 2, unit: 'sessions' }, { service: 'RF Microneedling', units: 1, unit: 'session' }, { service: 'IV Therapy', units: 1, unit: 'session' }] },
};

function seedMemberships() {
  if (localStorage.getItem('ms_memberships_seeded')) return;
  const patients = getPatients();
  if (patients.length < 16) return;

  const now = new Date();
  const d = (offset) => { const dt = new Date(now); dt.setDate(dt.getDate() + offset); return dt.toISOString().slice(0, 10); };

  const memberships = [
    { id: 'MEM-1', patientId: patients[0].id, patientName: `${patients[0].firstName} ${patients[0].lastName}`, tier: 'Gold', startDate: d(-60), nextBilling: d(0), credits: 25, status: 'active', wallet: [{ service: 'Botox', remaining: 5, total: 20 }, { service: 'HydraFacial', remaining: 0, total: 1 }, { service: 'Chemical Peel', remaining: 1, total: 1 }] },
    { id: 'MEM-2', patientId: patients[1].id, patientName: `${patients[1].firstName} ${patients[1].lastName}`, tier: 'Platinum', startDate: d(-90), nextBilling: d(5), credits: 0, status: 'active', wallet: [{ service: 'Botox', remaining: 28, total: 40 }, { service: 'Juvederm Filler', remaining: 1, total: 1 }, { service: 'HydraFacial', remaining: 2, total: 2 }, { service: 'RF Microneedling', remaining: 1, total: 1 }, { service: 'IV Therapy', remaining: 0, total: 1 }] },
    { id: 'MEM-3', patientId: patients[2].id, patientName: `${patients[2].firstName} ${patients[2].lastName}`, tier: 'Silver', startDate: d(-30), nextBilling: d(1), credits: 50, status: 'active', wallet: [{ service: 'HydraFacial', remaining: 1, total: 1 }, { service: 'Chemical Peel', remaining: 0, total: 1 }] },
    { id: 'MEM-4', patientId: patients[3].id, patientName: `${patients[3].firstName} ${patients[3].lastName}`, tier: 'Gold', startDate: d(-120), nextBilling: d(10), credits: 0, status: 'active', wallet: [{ service: 'Botox', remaining: 20, total: 20 }, { service: 'HydraFacial', remaining: 1, total: 1 }, { service: 'Chemical Peel', remaining: 1, total: 1 }] },
    { id: 'MEM-5', patientId: patients[4].id, patientName: `${patients[4].firstName} ${patients[4].lastName}`, tier: 'Platinum', startDate: d(-45), nextBilling: d(15), credits: 100, status: 'active', wallet: [{ service: 'Botox', remaining: 12, total: 40 }, { service: 'Juvederm Filler', remaining: 0, total: 1 }, { service: 'HydraFacial', remaining: 1, total: 2 }, { service: 'RF Microneedling', remaining: 0, total: 1 }, { service: 'IV Therapy', remaining: 1, total: 1 }] },
    { id: 'MEM-6', patientId: patients[5].id, patientName: `${patients[5].firstName} ${patients[5].lastName}`, tier: 'Silver', startDate: d(-15), nextBilling: d(15), credits: 0, status: 'active', wallet: [{ service: 'HydraFacial', remaining: 1, total: 1 }, { service: 'Chemical Peel', remaining: 1, total: 1 }] },
    { id: 'MEM-7', patientId: patients[6].id, patientName: `${patients[6].firstName} ${patients[6].lastName}`, tier: 'Gold', startDate: d(-75), nextBilling: d(14), credits: 75, status: 'active', wallet: [{ service: 'Botox', remaining: 8, total: 20 }, { service: 'HydraFacial', remaining: 0, total: 1 }, { service: 'Chemical Peel', remaining: 0, total: 1 }] },
    { id: 'MEM-8', patientId: patients[7].id, patientName: `${patients[7].firstName} ${patients[7].lastName}`, tier: 'Platinum', startDate: d(-180), nextBilling: d(3), credits: 0, status: 'active', wallet: [{ service: 'Botox', remaining: 35, total: 40 }, { service: 'Juvederm Filler', remaining: 1, total: 1 }, { service: 'HydraFacial', remaining: 2, total: 2 }, { service: 'RF Microneedling', remaining: 1, total: 1 }, { service: 'IV Therapy', remaining: 1, total: 1 }] },
    { id: 'MEM-9', patientId: patients[8].id, patientName: `${patients[8].firstName} ${patients[8].lastName}`, tier: 'Gold', startDate: d(-200), nextBilling: d(-5), credits: 0, status: 'paused', wallet: [{ service: 'Botox', remaining: 14, total: 20 }, { service: 'HydraFacial', remaining: 1, total: 1 }, { service: 'Chemical Peel', remaining: 1, total: 1 }] },
    { id: 'MEM-10', patientId: patients[9].id, patientName: `${patients[9].firstName} ${patients[9].lastName}`, tier: 'Silver', startDate: d(-10), nextBilling: d(20), credits: 0, status: 'active', wallet: [{ service: 'HydraFacial', remaining: 1, total: 1 }, { service: 'Chemical Peel', remaining: 1, total: 1 }] },
  ];

  const packages = [
    { id: 'PKG-1', patientId: patients[0].id, patientName: `${patients[0].firstName} ${patients[0].lastName}`, name: '3 IPL Sessions', service: 'IPL Photofacial', totalSessions: 3, usedSessions: 2, purchaseDate: d(-45), expiresDate: d(45), status: 'active' },
    { id: 'PKG-2', patientId: patients[2].id, patientName: `${patients[2].firstName} ${patients[2].lastName}`, name: '6 Laser Hair Removal', service: 'Laser Hair Removal', totalSessions: 6, usedSessions: 3, purchaseDate: d(-90), expiresDate: d(90), status: 'active' },
    { id: 'PKG-3', patientId: patients[4].id, patientName: `${patients[4].firstName} ${patients[4].lastName}`, name: '3 RF Microneedling', service: 'RF Microneedling', totalSessions: 3, usedSessions: 1, purchaseDate: d(-30), expiresDate: d(60), status: 'active' },
    { id: 'PKG-4', patientId: patients[7].id, patientName: `${patients[7].firstName} ${patients[7].lastName}`, name: '4 Chemical Peels', service: 'Chemical Peel', totalSessions: 4, usedSessions: 4, purchaseDate: d(-120), expiresDate: d(-10), status: 'completed' },
    { id: 'PKG-5', patientId: patients[10].id, patientName: `${patients[10].firstName} ${patients[10].lastName}`, name: '3 IPL Sessions', service: 'IPL Photofacial', totalSessions: 3, usedSessions: 0, purchaseDate: d(-5), expiresDate: d(85), status: 'active' },
    { id: 'PKG-6', patientId: patients[3].id, patientName: `${patients[3].firstName} ${patients[3].lastName}`, name: '6 HydraFacial', service: 'HydraFacial', totalSessions: 6, usedSessions: 5, purchaseDate: d(-150), expiresDate: d(14), status: 'active' },
  ];

  setMemberships(memberships);
  setPackages(packages);
  localStorage.setItem('ms_memberships_seeded', 'true');
}

export default function Memberships() {
  const s = useStyles();
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);
  useEffect(() => { seedMemberships(); }, []);

  const [tab, setTab] = useState('memberships');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState('cards');
  const [selectedMember, setSelectedMember] = useState(null);

  const memberships = getMemberships();
  const packages = getPackages();

  // Filter
  const filteredMemberships = memberships.filter(m => {
    if (filter === 'Silver' || filter === 'Gold' || filter === 'Platinum') {
      if (m.tier !== filter) return false;
    }
    if (filter === 'paused' && m.status !== 'paused') return false;
    if (search) {
      const q = search.toLowerCase();
      return m.patientName?.toLowerCase().includes(q) || m.tier?.toLowerCase().includes(q);
    }
    return true;
  });

  const filteredPackages = packages.filter(p => {
    if (filter === 'active' && p.status !== 'active') return false;
    if (filter === 'completed' && p.status !== 'completed') return false;
    if (search) return p.patientName?.toLowerCase().includes(search.toLowerCase()) || p.name?.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  // KPIs
  const activeMemberships = memberships.filter(m => m.status === 'active').length;
  const mrr = memberships.filter(m => m.status === 'active').reduce((sum, m) => sum + (TIERS[m.tier]?.price || 0), 0);
  const tierBreakdown = { Silver: memberships.filter(m => m.tier === 'Silver').length, Gold: memberships.filter(m => m.tier === 'Gold').length, Platinum: memberships.filter(m => m.tier === 'Platinum').length };
  const activePackages = packages.filter(p => p.status === 'active').length;

  // Alerts
  const alerts = [];
  memberships.forEach(m => {
    m.wallet?.forEach(w => {
      if (w.remaining > 0 && w.remaining <= 5 && w.total >= 10) {
        alerts.push({ type: 'low', text: `${m.patientName} has ${w.remaining} ${w.service} units remaining`, id: m.id });
      }
    });
  });
  packages.forEach(p => {
    if (p.status === 'active') {
      const daysLeft = Math.ceil((new Date(p.expiresDate) - new Date()) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 14 && daysLeft > 0) {
        alerts.push({ type: 'expiring', text: `${p.patientName}'s "${p.name}" package expires in ${daysLeft} days`, id: p.id });
      }
    }
  });

  // Actions
  const deductUnit = (memId, serviceName) => {
    const all = getMemberships().map(m => {
      if (m.id === memId) {
        return { ...m, wallet: m.wallet.map(w => w.service === serviceName ? { ...w, remaining: Math.max(0, w.remaining - 1) } : w) };
      }
      return m;
    });
    setMemberships(all);
    setTick(t => t + 1);
  };

  const usePackageSession = (pkgId) => {
    const all = getPackages().map(p => {
      if (p.id === pkgId) {
        const used = p.usedSessions + 1;
        return { ...p, usedSessions: used, status: used >= p.totalSessions ? 'completed' : 'active' };
      }
      return p;
    });
    setPackages(all);
    setTick(t => t + 1);
  };

  const tierColor = (tier) => TIERS[tier]?.color || s.text3;
  const tierBg = (tier) => TIERS[tier]?.bg || '#F8F8F8';

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ font: `600 26px ${s.FONT}`, color: s.text, marginBottom: 4 }}>Memberships & Packages</h1>
          <p style={{ font: `400 14px ${s.FONT}`, color: s.text2 }}>Manage membership wallets, service allocations, and treatment packages</p>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setView('cards')} style={{ ...s.pill, padding: '7px 14px', fontSize: 12, background: view === 'cards' ? s.accent : 'transparent', color: view === 'cards' ? s.accentText : s.text2, border: view === 'cards' ? `1px solid ${s.accent}` : '1px solid #E5E5E5' }}>Cards</button>
          <button onClick={() => setView('table')} style={{ ...s.pill, padding: '7px 14px', fontSize: 12, background: view === 'table' ? s.accent : 'transparent', color: view === 'table' ? s.accentText : s.text2, border: view === 'table' ? `1px solid ${s.accent}` : '1px solid #E5E5E5' }}>Table</button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Active Memberships', value: activeMemberships, color: s.text },
          { label: 'Monthly Revenue', value: `$${mrr.toLocaleString()}`, color: s.success },
          { label: 'Active Packages', value: activePackages, color: s.accent },
          { label: 'Alerts', value: alerts.length, color: alerts.length > 0 ? s.warning : s.success },
        ].map(k => (
          <div key={k.label} style={{ ...s.cardStyle, padding: '16px 20px' }}>
            <div style={{ font: `400 10px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 6 }}>{k.label}</div>
            <div style={{ font: `600 24px ${s.FONT}`, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Tier Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        {Object.entries(TIERS).map(([name, tier]) => (
          <div key={name} style={{ ...s.cardStyle, padding: '16px 20px', borderLeft: `3px solid ${tier.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ font: `600 15px ${s.FONT}`, color: tier.color }}>{name}</span>
              <span style={{ font: `500 14px ${s.MONO}`, color: s.text }}>${tier.price}/mo</span>
            </div>
            <div style={{ font: `400 12px ${s.FONT}`, color: s.text2, marginBottom: 6 }}>{tierBreakdown[name]} member{tierBreakdown[name] !== 1 ? 's' : ''}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {tier.allocations.map(a => (
                <span key={a.service} style={{ padding: '2px 8px', borderRadius: 100, font: `400 10px ${s.FONT}`, background: tier.bg, color: tier.color }}>
                  {a.units} {a.service}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ ...s.cardStyle, padding: 16, marginBottom: 24, borderLeft: `3px solid ${s.warning}` }}>
          <div style={{ font: `600 13px ${s.FONT}`, color: s.warning, marginBottom: 8 }}>Alerts</div>
          {alerts.map((a, i) => (
            <div key={i} style={{ font: `400 13px ${s.FONT}`, color: s.text2, padding: '4px 0', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: a.type === 'low' ? s.warning : s.danger, flexShrink: 0 }} />
              {a.text}
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        <button onClick={() => { setTab('memberships'); setFilter('all'); }} style={{ ...s.pill, padding: '7px 14px', fontSize: 12, background: tab === 'memberships' ? s.accent : 'transparent', color: tab === 'memberships' ? s.accentText : s.text2, border: tab === 'memberships' ? `1px solid ${s.accent}` : '1px solid #E5E5E5' }}>Memberships</button>
        <button onClick={() => { setTab('packages'); setFilter('all'); }} style={{ ...s.pill, padding: '7px 14px', fontSize: 12, background: tab === 'packages' ? s.accent : 'transparent', color: tab === 'packages' ? s.accentText : s.text2, border: tab === 'packages' ? `1px solid ${s.accent}` : '1px solid #E5E5E5' }}>Packages</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder={tab === 'memberships' ? 'Search members...' : 'Search packages...'} style={{ ...s.input, maxWidth: 260 }} />
        {tab === 'memberships' && (
          <div style={{ display: 'flex', gap: 6 }}>
            {[['all', 'All'], ['Silver', 'Silver'], ['Gold', 'Gold'], ['Platinum', 'Platinum'], ['paused', 'Paused']].map(([id, label]) => (
              <button key={id} onClick={() => setFilter(id)} style={{
                ...s.pill, padding: '7px 14px', fontSize: 12,
                background: filter === id ? s.accent : 'transparent',
                color: filter === id ? s.accentText : s.text2,
                border: filter === id ? `1px solid ${s.accent}` : '1px solid #E5E5E5',
              }}>{label}</button>
            ))}
          </div>
        )}
        {tab === 'packages' && (
          <div style={{ display: 'flex', gap: 6 }}>
            {[['all', 'All'], ['active', 'Active'], ['completed', 'Completed']].map(([id, label]) => (
              <button key={id} onClick={() => setFilter(id)} style={{
                ...s.pill, padding: '7px 14px', fontSize: 12,
                background: filter === id ? s.accent : 'transparent',
                color: filter === id ? s.accentText : s.text2,
                border: filter === id ? `1px solid ${s.accent}` : '1px solid #E5E5E5',
              }}>{label}</button>
            ))}
          </div>
        )}
      </div>

      {/* Memberships Tab */}
      {tab === 'memberships' && view === 'cards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 12 }}>
          {filteredMemberships.map(m => (
            <div key={m.id} style={{ ...s.cardStyle, padding: 20, borderTop: `3px solid ${tierColor(m.tier)}`, cursor: 'pointer' }} onClick={() => setSelectedMember(selectedMember === m.id ? null : m.id)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <div>
                  <div style={{ font: `500 15px ${s.FONT}`, color: s.text }}>{m.patientName}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <span style={{ padding: '2px 10px', borderRadius: 100, font: `600 11px ${s.FONT}`, background: tierBg(m.tier), color: tierColor(m.tier) }}>{m.tier}</span>
                    {m.status === 'paused' && <span style={{ padding: '2px 8px', borderRadius: 100, font: `500 10px ${s.FONT}`, background: '#FEF2F2', color: s.danger }}>Paused</span>}
                    {m.credits > 0 && <span style={{ padding: '2px 8px', borderRadius: 100, font: `500 10px ${s.FONT}`, background: '#F0FDF4', color: s.success }}>${m.credits} credit</span>}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ font: `600 16px ${s.MONO}`, color: s.accent }}>${TIERS[m.tier]?.price}/mo</div>
                  <div style={{ font: `400 10px ${s.FONT}`, color: s.text3, marginTop: 2 }}>
                    Next: {new Date(m.nextBilling + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Wallet */}
              <div style={{ font: `500 10px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 8 }}>Wallet</div>
              <div style={{ display: 'grid', gap: 6 }}>
                {m.wallet?.map(w => {
                  const pct = w.total > 0 ? (w.remaining / w.total) * 100 : 0;
                  const barColor = pct <= 25 ? s.danger : pct <= 50 ? s.warning : s.success;
                  return (
                    <div key={w.service}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ font: `400 12px ${s.FONT}`, color: s.text2 }}>{w.service}</span>
                        <span style={{ font: `500 12px ${s.MONO}`, color: w.remaining === 0 ? s.text3 : s.text }}>{w.remaining}/{w.total}</span>
                      </div>
                      <div style={{ height: 4, borderRadius: 2, background: '#F0F0F0', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 2, background: barColor, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Expanded: deduct buttons */}
              {selectedMember === m.id && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #F0F0F0' }}>
                  <div style={{ font: `500 10px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 8 }}>Record Usage</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {m.wallet?.filter(w => w.remaining > 0).map(w => (
                      <button key={w.service} onClick={(e) => { e.stopPropagation(); deductUnit(m.id, w.service); }} style={{ ...s.pillOutline, padding: '5px 12px', fontSize: 11 }}>
                        Use 1 {w.service}
                      </button>
                    ))}
                    {m.wallet?.every(w => w.remaining === 0) && (
                      <span style={{ font: `400 12px ${s.FONT}`, color: s.text3 }}>All units used this cycle</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
          {filteredMemberships.length === 0 && (
            <div style={{ ...s.cardStyle, padding: 48, textAlign: 'center', font: `400 14px ${s.FONT}`, color: s.text3, gridColumn: '1 / -1' }}>
              No memberships match this filter
            </div>
          )}
        </div>
      )}

      {tab === 'memberships' && view === 'table' && (
        <div style={s.tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse', font: `400 13px ${s.FONT}` }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                {['Patient', 'Tier', 'Status', 'Next Billing', 'Credits', 'Wallet Summary', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', font: `500 10px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredMemberships.map(m => (
                <tr key={m.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                  <td style={{ padding: '12px 16px', font: `500 13px ${s.FONT}`, color: s.text }}>{m.patientName}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 100, font: `600 11px ${s.FONT}`, background: tierBg(m.tier), color: tierColor(m.tier) }}>{m.tier}</span>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ padding: '3px 10px', borderRadius: 100, font: `500 11px ${s.FONT}`, textTransform: 'capitalize', background: m.status === 'active' ? '#F0FDF4' : '#FEF2F2', color: m.status === 'active' ? s.success : s.danger }}>{m.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: s.text2, font: `400 12px ${s.FONT}` }}>
                    {new Date(m.nextBilling + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </td>
                  <td style={{ padding: '12px 16px', font: `500 13px ${s.FONT}`, color: m.credits > 0 ? s.success : s.text3 }}>
                    {m.credits > 0 ? `$${m.credits}` : '—'}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {m.wallet?.map(w => (
                        <span key={w.service} style={{ padding: '2px 8px', borderRadius: 100, font: `400 10px ${s.MONO}`, background: w.remaining === 0 ? '#F5F5F5' : tierBg(m.tier), color: w.remaining === 0 ? s.text3 : tierColor(m.tier) }}>
                          {w.service}: {w.remaining}/{w.total}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    {m.wallet?.some(w => w.remaining > 0) && (
                      <button onClick={() => setSelectedMember(selectedMember === m.id ? null : m.id)} style={{ ...s.pillOutline, padding: '4px 10px', fontSize: 11 }}>Deduct</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMemberships.length === 0 && (
            <div style={{ padding: 48, textAlign: 'center', font: `400 14px ${s.FONT}`, color: s.text3 }}>No memberships match this filter</div>
          )}
        </div>
      )}

      {/* Packages Tab */}
      {tab === 'packages' && view === 'cards' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
          {filteredPackages.map(p => {
            const remaining = p.totalSessions - p.usedSessions;
            const pct = (p.usedSessions / p.totalSessions) * 100;
            const daysLeft = Math.ceil((new Date(p.expiresDate) - new Date()) / (1000 * 60 * 60 * 24));
            return (
              <div key={p.id} style={{ ...s.cardStyle, padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <div style={{ font: `500 15px ${s.FONT}`, color: s.text }}>{p.patientName}</div>
                    <div style={{ font: `400 13px ${s.FONT}`, color: s.text2, marginTop: 2 }}>{p.name}</div>
                  </div>
                  <span style={{ padding: '3px 10px', borderRadius: 100, font: `500 11px ${s.FONT}`, textTransform: 'capitalize', background: p.status === 'active' ? '#F0FDF4' : '#F5F5F5', color: p.status === 'active' ? s.success : s.text3 }}>{p.status}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ font: `400 12px ${s.FONT}`, color: s.text2 }}>Sessions used</span>
                  <span style={{ font: `500 13px ${s.MONO}`, color: s.text }}>{p.usedSessions}/{p.totalSessions}</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: '#F0F0F0', overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: p.status === 'completed' ? s.text3 : s.accent, transition: 'width 0.3s' }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ font: `400 11px ${s.FONT}`, color: daysLeft <= 14 && daysLeft > 0 ? s.danger : s.text3 }}>
                    {p.status === 'completed' ? 'Completed' : daysLeft > 0 ? `${daysLeft} days remaining` : 'Expired'}
                  </div>
                  {p.status === 'active' && remaining > 0 && (
                    <button onClick={() => usePackageSession(p.id)} style={{ ...s.pillAccent, padding: '5px 12px', fontSize: 11 }}>Use Session</button>
                  )}
                </div>
              </div>
            );
          })}
          {filteredPackages.length === 0 && (
            <div style={{ ...s.cardStyle, padding: 48, textAlign: 'center', font: `400 14px ${s.FONT}`, color: s.text3, gridColumn: '1 / -1' }}>
              No packages match this filter
            </div>
          )}
        </div>
      )}

      {tab === 'packages' && view === 'table' && (
        <div style={s.tableWrap}>
          <table style={{ width: '100%', borderCollapse: 'collapse', font: `400 13px ${s.FONT}` }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                {['Patient', 'Package', 'Service', 'Progress', 'Expires', 'Status', ''].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', font: `500 10px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPackages.map(p => {
                const remaining = p.totalSessions - p.usedSessions;
                const daysLeft = Math.ceil((new Date(p.expiresDate) - new Date()) / (1000 * 60 * 60 * 24));
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ padding: '12px 16px', font: `500 13px ${s.FONT}`, color: s.text }}>{p.patientName}</td>
                    <td style={{ padding: '12px 16px', color: s.text2 }}>{p.name}</td>
                    <td style={{ padding: '12px 16px', color: s.text2 }}>{p.service}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 4, borderRadius: 2, background: '#F0F0F0', overflow: 'hidden', maxWidth: 80 }}>
                          <div style={{ width: `${(p.usedSessions / p.totalSessions) * 100}%`, height: '100%', borderRadius: 2, background: s.accent }} />
                        </div>
                        <span style={{ font: `500 12px ${s.MONO}`, color: s.text }}>{p.usedSessions}/{p.totalSessions}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', font: `400 12px ${s.FONT}`, color: daysLeft <= 14 && daysLeft > 0 ? s.danger : s.text2 }}>
                      {new Date(p.expiresDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 100, font: `500 11px ${s.FONT}`, textTransform: 'capitalize', background: p.status === 'active' ? '#F0FDF4' : '#F5F5F5', color: p.status === 'active' ? s.success : s.text3 }}>{p.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      {p.status === 'active' && remaining > 0 && (
                        <button onClick={() => usePackageSession(p.id)} style={{ ...s.pillAccent, padding: '4px 10px', fontSize: 11 }}>Use Session</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredPackages.length === 0 && (
            <div style={{ padding: 48, textAlign: 'center', font: `400 14px ${s.FONT}`, color: s.text3 }}>No packages match this filter</div>
          )}
        </div>
      )}

      {/* Deduct Modal (for table view) */}
      {selectedMember && view === 'table' && (() => {
        const m = memberships.find(x => x.id === selectedMember);
        if (!m) return null;
        return (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }} onClick={() => setSelectedMember(null)}>
            <div onClick={e => e.stopPropagation()} style={{ ...s.cardStyle, padding: 28, width: 380 }}>
              <div style={{ font: `600 18px ${s.FONT}`, color: s.text, marginBottom: 4 }}>Deduct Units</div>
              <div style={{ font: `400 13px ${s.FONT}`, color: s.text2, marginBottom: 16 }}>{m.patientName} — {m.tier}</div>
              <div style={{ display: 'grid', gap: 8 }}>
                {m.wallet?.map(w => (
                  <div key={w.service} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E5E5' }}>
                    <div>
                      <div style={{ font: `400 13px ${s.FONT}`, color: s.text }}>{w.service}</div>
                      <div style={{ font: `400 11px ${s.MONO}`, color: s.text3 }}>{w.remaining}/{w.total} remaining</div>
                    </div>
                    {w.remaining > 0 && (
                      <button onClick={() => deductUnit(m.id, w.service)} style={{ ...s.pillAccent, padding: '5px 12px', fontSize: 11 }}>-1</button>
                    )}
                  </div>
                ))}
              </div>
              <button onClick={() => setSelectedMember(null)} style={{ ...s.pillGhost, marginTop: 16, width: '100%' }}>Close</button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
