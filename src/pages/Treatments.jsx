import { useState, useEffect } from 'react';
import { useStyles } from '../theme';
import { getTreatmentPlans, addTreatmentPlan, updateTreatmentPlan, deleteTreatmentPlan, getPatients, getServices, getProviders, subscribe } from '../data/store';

export default function Treatments() {
  const s = useStyles();
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);

  const [showForm, setShowForm] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [form, setForm] = useState({ patientId: '', name: '', providerId: '', sessions: [] });
  const [sessionForm, setSessionForm] = useState({ serviceId: '', name: '', date: '', notes: '' });

  const plans = getTreatmentPlans();
  const patients = getPatients();
  const services = getServices();
  const providers = getProviders();

  const today = new Date().toISOString().slice(0, 10);

  const openNew = () => {
    setEditPlan(null);
    setForm({ patientId: '', name: '', providerId: '', sessions: [] });
    setShowForm(true);
  };

  const openEdit = (plan) => {
    setEditPlan(plan);
    setForm({ patientId: plan.patientId, name: plan.name, providerId: plan.providerId, sessions: [...plan.sessions] });
    setShowForm(true);
  };

  const addSession = () => {
    if (!sessionForm.serviceId) return;
    const svc = services.find(sv => sv.id === sessionForm.serviceId);
    setForm({
      ...form,
      sessions: [...form.sessions, { ...sessionForm, name: sessionForm.name || svc?.name || 'Session', status: 'upcoming' }],
    });
    setSessionForm({ serviceId: '', name: '', date: '', notes: '' });
  };

  const removeSession = (idx) => {
    setForm({ ...form, sessions: form.sessions.filter((_, i) => i !== idx) });
  };

  const handleSave = () => {
    if (!form.patientId || !form.name) return;
    const pat = patients.find(p => p.id === form.patientId);
    const data = { ...form, patientName: pat ? `${pat.firstName} ${pat.lastName}` : 'Unknown' };
    if (editPlan) {
      updateTreatmentPlan(editPlan.id, data);
    } else {
      addTreatmentPlan(data);
    }
    setShowForm(false);
  };

  const toggleSessionStatus = (planId, idx) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) return;
    const sessions = [...plan.sessions];
    const current = sessions[idx].status;
    sessions[idx].status = current === 'completed' ? 'upcoming' : current === 'upcoming' ? 'in-progress' : 'completed';
    updateTreatmentPlan(planId, { sessions });
  };

  const getProgress = (plan) => {
    const done = plan.sessions.filter(se => se.status === 'completed').length;
    return { done, total: plan.sessions.length, pct: plan.sessions.length > 0 ? Math.round((done / plan.sessions.length) * 100) : 0 };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ font: `600 26px ${s.FONT}`, color: s.text, marginBottom: 4 }}>Treatment Plans</h1>
          <p style={{ font: `400 14px ${s.FONT}`, color: s.text2 }}>{plans.length} active plans — multi-session patient pathways</p>
        </div>
        <button onClick={openNew} style={s.pillAccent}>+ New Plan</button>
      </div>

      {/* Plans Grid */}
      <div style={{ display: 'grid', gap: 16 }}>
        {plans.map(plan => {
          const prog = getProgress(plan);
          const prov = providers.find(p => p.id === plan.providerId);
          const expanded = expandedId === plan.id;

          return (
            <div key={plan.id} style={{ ...s.cardStyle, overflow: 'hidden' }}>
              {/* Header */}
              <div onClick={() => setExpandedId(expanded ? null : plan.id)} style={{
                padding: '20px 24px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', background: s.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `600 14px ${s.FONT}`, color: s.accent }}>
                    {plan.patientName?.split(' ').map(n => n[0]).join('') || '?'}
                  </div>
                  <div>
                    <div style={{ font: `600 15px ${s.FONT}`, color: s.text }}>{plan.name}</div>
                    <div style={{ font: `400 13px ${s.FONT}`, color: s.text2 }}>{plan.patientName} — {prov?.name?.split(',')[0] || 'Provider'}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  {/* Progress bar */}
                  <div style={{ width: 120 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ font: `500 11px ${s.MONO}`, color: s.text2 }}>{prog.done}/{prog.total}</span>
                      <span style={{ font: `500 11px ${s.MONO}`, color: s.accent }}>{prog.pct}%</span>
                    </div>
                    <div style={{ height: 4, background: '#F0F0F0', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ width: `${prog.pct}%`, height: '100%', background: s.accent, borderRadius: 2, transition: 'width 0.3s' }} />
                    </div>
                  </div>
                  <span style={{ font: `400 18px ${s.FONT}`, color: s.text3, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▾</span>
                </div>
              </div>

              {/* Expanded sessions */}
              {expanded && (
                <div style={{ borderTop: '1px solid #F0F0F0' }}>
                  {plan.sessions.map((ses, idx) => (
                    <div key={idx} style={{ padding: '14px 24px', borderBottom: '1px solid #F8F8F8', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <button onClick={() => toggleSessionStatus(plan.id, idx)} style={{
                        width: 28, height: 28, borderRadius: '50%', border: `2px solid ${ses.status === 'completed' ? s.success : ses.status === 'in-progress' ? s.accent : '#DDD'}`,
                        background: ses.status === 'completed' ? s.success : 'transparent', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, flexShrink: 0,
                      }}>
                        {ses.status === 'completed' && '✓'}
                        {ses.status === 'in-progress' && <div style={{ width: 10, height: 10, borderRadius: '50%', background: s.accent }} />}
                      </button>
                      <div style={{ flex: 1 }}>
                        <div style={{ font: `500 13px ${s.FONT}`, color: ses.status === 'completed' ? s.text2 : s.text, textDecoration: ses.status === 'completed' ? 'line-through' : 'none' }}>{ses.name}</div>
                        {ses.notes && <div style={{ font: `400 12px ${s.FONT}`, color: s.text3 }}>{ses.notes}</div>}
                      </div>
                      <div style={{ font: `400 12px ${s.MONO}`, color: s.text3 }}>
                        {ses.date ? new Date(ses.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'TBD'}
                      </div>
                      <span style={{
                        padding: '2px 8px', borderRadius: 100, font: `500 10px ${s.FONT}`, textTransform: 'uppercase',
                        background: ses.status === 'completed' ? '#F0FDF4' : ses.status === 'in-progress' ? s.accentLight : '#F5F5F5',
                        color: ses.status === 'completed' ? s.success : ses.status === 'in-progress' ? s.accent : s.text3,
                      }}>{ses.status}</span>
                    </div>
                  ))}
                  <div style={{ padding: '12px 24px', display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(plan)} style={{ ...s.pillOutline, padding: '6px 14px', fontSize: 11 }}>Edit Plan</button>
                    <button onClick={() => { if (confirm('Delete this treatment plan?')) deleteTreatmentPlan(plan.id); }} style={{ ...s.pillGhost, padding: '6px 14px', fontSize: 11, color: s.danger }}>Delete</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {plans.length === 0 && (
          <div style={{ ...s.cardStyle, padding: 48, textAlign: 'center' }}>
            <div style={{ font: `400 14px ${s.FONT}`, color: s.text3, marginBottom: 12 }}>No treatment plans yet</div>
            <button onClick={openNew} style={s.pillAccent}>Create First Plan</button>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }} onClick={() => setShowForm(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 600, width: '90%', boxShadow: s.shadowLg, maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ font: `600 20px ${s.FONT}`, color: s.text, marginBottom: 24 }}>{editPlan ? 'Edit Treatment Plan' : 'New Treatment Plan'}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={s.label}>Patient</label>
                <select value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  <option value="">Select patient...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Plan Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={s.input} placeholder="e.g., Anti-Aging Protocol" />
              </div>
              <div>
                <label style={s.label}>Provider</label>
                <select value={form.providerId} onChange={e => setForm({ ...form, providerId: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  <option value="">Select...</option>
                  {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            {/* Sessions */}
            <div style={{ font: `600 14px ${s.FONT}`, color: s.text, marginBottom: 12 }}>Sessions ({form.sessions.length})</div>
            {form.sessions.map((ses, idx) => (
              <div key={idx} style={{ padding: '10px 14px', background: '#F8F8F8', borderRadius: 8, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ font: `500 13px ${s.FONT}`, color: s.text }}>{ses.name}</div>
                  <div style={{ font: `400 11px ${s.FONT}`, color: s.text3 }}>{ses.date || 'TBD'}{ses.notes ? ` — ${ses.notes}` : ''}</div>
                </div>
                <button onClick={() => removeSession(idx)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.danger, fontSize: 16 }}>×</button>
              </div>
            ))}

            {/* Add session */}
            <div style={{ padding: 14, background: '#FAFAFA', borderRadius: 10, border: '1px dashed #E5E5E5', marginTop: 8 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label style={{ ...s.label, fontSize: 10 }}>Service</label>
                  <select value={sessionForm.serviceId} onChange={e => { const svc = services.find(sv => sv.id === e.target.value); setSessionForm({ ...sessionForm, serviceId: e.target.value, name: svc?.name || '' }); }} style={{ ...s.input, fontSize: 12, padding: '8px 10px', cursor: 'pointer' }}>
                    <option value="">Select...</option>
                    {services.map(sv => <option key={sv.id} value={sv.id}>{sv.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ ...s.label, fontSize: 10 }}>Date</label>
                  <input type="date" value={sessionForm.date} onChange={e => setSessionForm({ ...sessionForm, date: e.target.value })} style={{ ...s.input, fontSize: 12, padding: '8px 10px' }} />
                </div>
                <div>
                  <label style={{ ...s.label, fontSize: 10 }}>Session Name</label>
                  <input value={sessionForm.name} onChange={e => setSessionForm({ ...sessionForm, name: e.target.value })} style={{ ...s.input, fontSize: 12, padding: '8px 10px' }} placeholder="Override name" />
                </div>
                <div>
                  <label style={{ ...s.label, fontSize: 10 }}>Notes</label>
                  <input value={sessionForm.notes} onChange={e => setSessionForm({ ...sessionForm, notes: e.target.value })} style={{ ...s.input, fontSize: 12, padding: '8px 10px' }} placeholder="Optional" />
                </div>
              </div>
              <button onClick={addSession} style={{ ...s.pillOutline, padding: '6px 14px', fontSize: 11, marginTop: 10 }}>+ Add Session</button>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowForm(false)} style={s.pillGhost}>Cancel</button>
              <button onClick={handleSave} style={s.pillAccent}>{editPlan ? 'Save Changes' : 'Create Plan'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
