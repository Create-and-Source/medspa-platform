import { useState, useEffect } from 'react';
import { useStyles } from '../theme';
import { getPatients, addPatient, updatePatient, deletePatient, getAppointments, getServices, subscribe } from '../data/store';

const fmt = (cents) => `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;

export default function Patients() {
  const s = useStyles();
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sort, setSort] = useState('lastVisit');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', dob: '', gender: 'Female', allergies: '', notes: '', membershipTier: 'None' });

  const patients = getPatients();
  const appointments = getAppointments();
  const services = getServices();

  const filtered = patients.filter(p => {
    const q = search.toLowerCase();
    const nameMatch = `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) || p.email?.toLowerCase().includes(q) || p.phone?.includes(q);
    if (!nameMatch) return false;
    if (filter === 'All') return true;
    return p.membershipTier === filter;
  }).sort((a, b) => {
    if (sort === 'lastVisit') return (b.lastVisit || '').localeCompare(a.lastVisit || '');
    if (sort === 'name') return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    if (sort === 'spent') return b.totalSpent - a.totalSpent;
    if (sort === 'visits') return b.visitCount - a.visitCount;
    return 0;
  });

  const handleSave = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return;
    if (selected) {
      updatePatient(selected.id, form);
    } else {
      addPatient({ ...form, totalSpent: 0, visitCount: 0, lastVisit: null });
    }
    setShowForm(false);
    setSelected(null);
    setForm({ firstName: '', lastName: '', email: '', phone: '', dob: '', gender: 'Female', allergies: '', notes: '', membershipTier: 'None' });
  };

  const handleEdit = (p) => {
    setForm({ firstName: p.firstName, lastName: p.lastName, email: p.email, phone: p.phone, dob: p.dob || '', gender: p.gender || 'Female', allergies: p.allergies || '', notes: p.notes || '', membershipTier: p.membershipTier || 'None' });
    setSelected(p);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (confirm('Delete this patient?')) {
      deletePatient(id);
      if (selected?.id === id) { setSelected(null); setShowForm(false); }
    }
  };

  const patientAppts = (patientId) => appointments.filter(a => a.patientId === patientId).sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  const [detail, setDetail] = useState(null);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ font: `600 26px ${s.FONT}`, color: s.text, marginBottom: 4 }}>Patients</h1>
          <p style={{ font: `400 14px ${s.FONT}`, color: s.text2 }}>{patients.length} total patients</p>
        </div>
        <button onClick={() => { setSelected(null); setForm({ firstName: '', lastName: '', email: '', phone: '', dob: '', gender: 'Female', allergies: '', notes: '', membershipTier: 'None' }); setShowForm(true); }} style={s.pillAccent}>
          + New Patient
        </button>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patients..." style={{ ...s.input, maxWidth: 320 }} />
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{ ...s.input, width: 'auto', minWidth: 140, cursor: 'pointer' }}>
          <option value="All">All Members</option>
          <option value="None">Non-Members</option>
          <option value="Silver">Silver</option>
          <option value="Gold">Gold</option>
          <option value="Platinum">Platinum</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...s.input, width: 'auto', minWidth: 140, cursor: 'pointer' }}>
          <option value="lastVisit">Last Visit</option>
          <option value="name">Name</option>
          <option value="spent">Total Spent</option>
          <option value="visits">Visit Count</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: detail ? '1fr 400px' : '1fr', gap: 20 }}>
        {/* Patient Table */}
        <div style={s.tableWrap}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                  {['Patient', 'Contact', 'Membership', 'Visits', 'Total Spent', 'Last Visit', ''].map(h => (
                    <th key={h} style={{ padding: '12px 16px', font: `500 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id} onClick={() => setDetail(p)} style={{ borderBottom: '1px solid #F5F5F5', cursor: 'pointer', transition: 'background 0.1s', background: detail?.id === p.id ? s.accentLight : 'transparent' }}
                    onMouseEnter={e => { if (detail?.id !== p.id) e.currentTarget.style.background = '#FAFAFA'; }}
                    onMouseLeave={e => { if (detail?.id !== p.id) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#F0F0F0', display: 'flex', alignItems: 'center', justifyContent: 'center', font: `500 13px ${s.FONT}`, color: s.text2, flexShrink: 0 }}>
                          {p.firstName[0]}{p.lastName[0]}
                        </div>
                        <div>
                          <div style={{ font: `500 14px ${s.FONT}`, color: s.text }}>{p.firstName} {p.lastName}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ font: `400 13px ${s.FONT}`, color: s.text2 }}>{p.email}</div>
                      <div style={{ font: `400 12px ${s.FONT}`, color: s.text3 }}>{p.phone}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      {p.membershipTier !== 'None' && (
                        <span style={{ padding: '3px 10px', borderRadius: 100, font: `500 11px ${s.FONT}`, background: p.membershipTier === 'Platinum' ? '#111' : p.membershipTier === 'Gold' ? '#B8960C' : '#999', color: '#fff' }}>
                          {p.membershipTier}
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', font: `500 13px ${s.MONO}`, color: s.text }}>{p.visitCount}</td>
                    <td style={{ padding: '14px 16px', font: `500 13px ${s.MONO}`, color: s.text }}>{fmt(p.totalSpent)}</td>
                    <td style={{ padding: '14px 16px', font: `400 13px ${s.FONT}`, color: s.text2 }}>
                      {p.lastVisit ? new Date(p.lastVisit + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <button onClick={e => { e.stopPropagation(); handleEdit(p); }} style={{ ...s.pillGhost, padding: '4px 10px', fontSize: 11 }}>Edit</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan="7" style={{ padding: 40, textAlign: 'center', font: `400 13px ${s.FONT}`, color: s.text3 }}>No patients found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        {detail && (
          <div style={{ ...s.cardStyle, padding: 24, alignSelf: 'start', position: 'sticky', top: 80 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: s.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `600 16px ${s.FONT}`, color: s.accent }}>
                  {detail.firstName[0]}{detail.lastName[0]}
                </div>
                <div>
                  <div style={{ font: `600 16px ${s.FONT}`, color: s.text }}>{detail.firstName} {detail.lastName}</div>
                  {detail.membershipTier !== 'None' && <span style={{ font: `500 11px ${s.FONT}`, color: s.accent }}>{detail.membershipTier} Member</span>}
                </div>
              </div>
              <button onClick={() => setDetail(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999', fontSize: 18 }}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Email', value: detail.email },
                { label: 'Phone', value: detail.phone },
                { label: 'DOB', value: detail.dob || '—' },
                { label: 'Gender', value: detail.gender },
                { label: 'Visits', value: detail.visitCount },
                { label: 'Total Spent', value: fmt(detail.totalSpent) },
              ].map(f => (
                <div key={f.label}>
                  <div style={s.label}>{f.label}</div>
                  <div style={{ font: `400 13px ${s.FONT}`, color: s.text }}>{f.value}</div>
                </div>
              ))}
            </div>

            {detail.allergies && (
              <div style={{ padding: '10px 14px', background: '#FEF2F2', borderRadius: 8, marginBottom: 16, font: `400 12px ${s.FONT}`, color: s.danger }}>
                Allergies: {detail.allergies}
              </div>
            )}

            <div style={{ font: `600 13px ${s.FONT}`, color: s.text, marginBottom: 10 }}>Recent Appointments</div>
            {patientAppts(detail.id).length === 0 ? (
              <div style={{ font: `400 12px ${s.FONT}`, color: s.text3, padding: '8px 0' }}>No appointments found</div>
            ) : patientAppts(detail.id).map(a => {
              const svc = services.find(sv => sv.id === a.serviceId);
              return (
                <div key={a.id} style={{ padding: '8px 0', borderBottom: '1px solid #F5F5F5', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ font: `500 12px ${s.FONT}`, color: s.text }}>{svc?.name || 'Service'}</div>
                    <div style={{ font: `400 11px ${s.FONT}`, color: s.text3 }}>{a.date}</div>
                  </div>
                  <span style={{ font: `500 10px ${s.FONT}`, textTransform: 'uppercase', color: a.status === 'completed' ? s.success : a.status === 'confirmed' ? s.accent : s.warning }}>{a.status}</span>
                </div>
              );
            })}

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => handleEdit(detail)} style={{ ...s.pillOutline, padding: '6px 14px', fontSize: 12, flex: 1 }}>Edit</button>
              <button onClick={() => handleDelete(detail.id)} style={{ ...s.pillGhost, padding: '6px 14px', fontSize: 12, color: s.danger, borderColor: s.danger }}>Delete</button>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }} onClick={() => setShowForm(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 520, width: '90%', boxShadow: s.shadowLg, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ font: `600 20px ${s.FONT}`, color: s.text, marginBottom: 24 }}>{selected ? 'Edit Patient' : 'New Patient'}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { key: 'firstName', label: 'First Name', type: 'text' },
                { key: 'lastName', label: 'Last Name', type: 'text' },
                { key: 'email', label: 'Email', type: 'email' },
                { key: 'phone', label: 'Phone', type: 'tel' },
                { key: 'dob', label: 'Date of Birth', type: 'date' },
              ].map(f => (
                <div key={f.key}>
                  <label style={s.label}>{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} style={s.input} />
                </div>
              ))}
              <div>
                <label style={s.label}>Gender</label>
                <select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  <option>Female</option><option>Male</option><option>Non-binary</option><option>Prefer not to say</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Membership</label>
                <select value={form.membershipTier} onChange={e => setForm({ ...form, membershipTier: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  <option>None</option><option>Silver</option><option>Gold</option><option>Platinum</option>
                </select>
              </div>
            </div>

            <div style={{ marginTop: 16 }}>
              <label style={s.label}>Allergies</label>
              <input value={form.allergies} onChange={e => setForm({ ...form, allergies: e.target.value })} style={s.input} placeholder="e.g., Latex, Lidocaine" />
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={s.label}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} style={{ ...s.input, resize: 'vertical' }} placeholder="Internal notes..." />
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={s.pillGhost}>Cancel</button>
              <button onClick={handleSave} style={s.pillAccent}>{selected ? 'Save Changes' : 'Add Patient'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
