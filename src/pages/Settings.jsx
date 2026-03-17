import { useState, useEffect } from 'react';
import { useTheme, useStyles, PRESETS } from '../theme';
import { getSettings, updateSettings, getProviders, addProvider, updateProvider, getServices, addService, updateService, deleteService, getLocations, addLocation, subscribe } from '../data/store';

export default function Settings() {
  const s = useStyles();
  const { theme, setTheme, setCustomColor } = useTheme();
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);

  const [tab, setTab] = useState('general');
  const [settings, setSettingsLocal] = useState(getSettings());
  const [saved, setSaved] = useState(false);

  // Service form
  const [showSvcForm, setShowSvcForm] = useState(false);
  const [editSvc, setEditSvc] = useState(null);
  const [svcForm, setSvcForm] = useState({ name: '', category: 'Injectables', duration: 30, price: 0, unit: 'per session', description: '' });

  // Provider form
  const [showProvForm, setShowProvForm] = useState(false);
  const [editProv, setEditProv] = useState(null);
  const [provForm, setProvForm] = useState({ name: '', title: '', specialties: '', color: '#111' });

  const providers = getProviders();
  const services = getServices();
  const locations = getLocations();

  const handleSaveSettings = () => {
    updateSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleSaveService = () => {
    if (!svcForm.name.trim()) return;
    if (editSvc) {
      updateService(editSvc.id, { ...svcForm, specialties: typeof svcForm.specialties === 'string' ? svcForm.specialties.split(',').map(s => s.trim()) : svcForm.specialties });
    } else {
      addService(svcForm);
    }
    setShowSvcForm(false);
  };

  const handleSaveProvider = () => {
    if (!provForm.name.trim()) return;
    const data = { ...provForm, specialties: typeof provForm.specialties === 'string' ? provForm.specialties.split(',').map(s => s.trim()) : provForm.specialties };
    if (editProv) {
      updateProvider(editProv.id, data);
    } else {
      addProvider(data);
    }
    setShowProvForm(false);
  };

  const handleResetDemo = () => {
    if (confirm('This will clear ALL data and reset to demo defaults. Are you sure?')) {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('ms_'));
      keys.forEach(k => localStorage.removeItem(k));
      localStorage.removeItem('ms_initialized');
      window.location.reload();
    }
  };

  const tabs = [
    { id: 'general', label: 'General' },
    { id: 'branding', label: 'Branding' },
    { id: 'services', label: 'Services' },
    { id: 'providers', label: 'Providers' },
    { id: 'locations', label: 'Locations' },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ font: `600 26px ${s.FONT}`, color: s.text, marginBottom: 4 }}>Settings</h1>
        <p style={{ font: `400 14px ${s.FONT}`, color: s.text2 }}>Configure your medspa platform — brand it for any client demo</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 28, background: '#F0F0F0', borderRadius: 8, overflow: 'hidden', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: '9px 20px', background: tab === t.id ? '#fff' : 'transparent', border: 'none',
            font: `500 13px ${s.FONT}`, color: tab === t.id ? s.text : s.text3, cursor: 'pointer',
            borderRadius: tab === t.id ? 8 : 0, boxShadow: tab === t.id ? s.shadow : 'none',
          }}>{t.label}</button>
        ))}
      </div>

      {/* General */}
      {tab === 'general' && (
        <div style={{ maxWidth: 520 }}>
          <div style={{ ...s.cardStyle, padding: 24 }}>
            {[
              { key: 'businessName', label: 'Business Name', placeholder: 'Your MedSpa' },
              { key: 'tagline', label: 'Tagline', placeholder: 'Where Science Meets Beauty' },
              { key: 'email', label: 'Email', placeholder: 'info@yourmedspa.com' },
              { key: 'phone', label: 'Phone', placeholder: '(480) 555-0100' },
              { key: 'website', label: 'Website', placeholder: 'yourmedspa.com' },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={s.label}>{f.label}</label>
                <input value={settings[f.key] || ''} onChange={e => setSettingsLocal({ ...settings, [f.key]: e.target.value })} placeholder={f.placeholder} style={s.input} />
              </div>
            ))}
            <button onClick={handleSaveSettings} style={s.pillAccent}>
              {saved ? 'Saved!' : 'Save Settings'}
            </button>
          </div>

          <div style={{ marginTop: 24 }}>
            <button onClick={handleResetDemo} style={{ ...s.pillGhost, color: s.danger, borderColor: s.danger }}>
              Reset All Demo Data
            </button>
            <p style={{ font: `400 11px ${s.FONT}`, color: s.text3, marginTop: 8 }}>
              Clears all localStorage data and reloads with fresh demo data. Use this between client demos.
            </p>
          </div>
        </div>
      )}

      {/* Branding */}
      {tab === 'branding' && (
        <div style={{ maxWidth: 520 }}>
          <div style={{ ...s.cardStyle, padding: 24 }}>
            <div style={{ font: `600 15px ${s.FONT}`, color: s.text, marginBottom: 16 }}>Brand Color</div>
            <p style={{ font: `400 13px ${s.FONT}`, color: s.text2, marginBottom: 20 }}>
              Pick the medspa's brand color. This changes the entire platform accent instantly.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 20 }}>
              {PRESETS.map(p => (
                <button key={p.id} onClick={() => setTheme(p)} style={{
                  padding: '14px 10px', borderRadius: 12, cursor: 'pointer',
                  background: '#fff', border: theme.id === p.id ? `2.5px solid ${p.accent}` : '1.5px solid #E5E5E5',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: p.accent }} />
                  <span style={{ font: `500 11px ${s.FONT}`, color: theme.id === p.id ? p.accent : s.text2 }}>{p.name}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', background: '#FAFAFA', borderRadius: 10 }}>
              <label style={{ font: `500 13px ${s.FONT}`, color: s.text }}>Custom Color</label>
              <input type="color" value={theme.accent} onChange={e => setCustomColor(e.target.value)} style={{ width: 40, height: 40, border: '1px solid #E5E5E5', borderRadius: 10, cursor: 'pointer', padding: 2 }} />
              <span style={{ font: `400 12px ${s.MONO}`, color: s.text3 }}>{theme.accent}</span>
            </div>

            {/* Preview */}
            <div style={{ marginTop: 24, padding: 20, background: '#FAFAFA', borderRadius: 12, border: '1px solid #F0F0F0' }}>
              <div style={{ font: `600 13px ${s.FONT}`, color: s.text, marginBottom: 12 }}>Preview</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button style={s.pillAccent}>Primary Button</button>
                <button style={s.pillOutline}>Outline Button</button>
                <button style={s.pillGhost}>Ghost Button</button>
              </div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ padding: '3px 10px', borderRadius: 100, background: s.accentLight, color: s.accent, font: `500 11px ${s.FONT}` }}>Active Tag</span>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.accent }} />
                <span style={{ font: `400 12px ${s.FONT}`, color: s.accent }}>Accent text</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services */}
      {tab === 'services' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ font: `500 14px ${s.FONT}`, color: s.text }}>{services.length} services</span>
            <button onClick={() => { setEditSvc(null); setSvcForm({ name: '', category: 'Injectables', duration: 30, price: 0, unit: 'per session', description: '' }); setShowSvcForm(true); }} style={s.pillAccent}>+ Add Service</button>
          </div>
          <div style={s.tableWrap}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E5E5' }}>
                  {['Service', 'Category', 'Duration', 'Price', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '12px 14px', font: `500 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {services.map(svc => (
                  <tr key={svc.id} style={{ borderBottom: '1px solid #F5F5F5' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ font: `500 13px ${s.FONT}`, color: s.text }}>{svc.name}</div>
                      {svc.description && <div style={{ font: `400 11px ${s.FONT}`, color: s.text3 }}>{svc.description}</div>}
                    </td>
                    <td style={{ padding: '12px 14px' }}><span style={{ padding: '3px 10px', borderRadius: 100, background: '#F5F5F5', font: `500 11px ${s.FONT}`, color: s.text2 }}>{svc.category}</span></td>
                    <td style={{ padding: '12px 14px', font: `400 13px ${s.MONO}`, color: s.text2 }}>{svc.duration}min</td>
                    <td style={{ padding: '12px 14px', font: `500 13px ${s.MONO}`, color: s.text }}>${(svc.price / 100).toFixed(0)} {svc.unit}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => { setEditSvc(svc); setSvcForm({ name: svc.name, category: svc.category, duration: svc.duration, price: svc.price, unit: svc.unit || 'per session', description: svc.description || '' }); setShowSvcForm(true); }} style={{ ...s.pillGhost, padding: '4px 8px', fontSize: 10 }}>Edit</button>
                        <button onClick={() => { if (confirm('Delete?')) deleteService(svc.id); }} style={{ ...s.pillGhost, padding: '4px 8px', fontSize: 10, color: s.danger }}>×</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Providers */}
      {tab === 'providers' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ font: `500 14px ${s.FONT}`, color: s.text }}>{providers.length} providers</span>
            <button onClick={() => { setEditProv(null); setProvForm({ name: '', title: '', specialties: '', color: '#111' }); setShowProvForm(true); }} style={s.pillAccent}>+ Add Provider</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
            {providers.map(p => (
              <div key={p.id} style={{ ...s.cardStyle, padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: s.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `600 14px ${s.FONT}`, color: s.accent }}>
                    {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div>
                    <div style={{ font: `600 14px ${s.FONT}`, color: s.text }}>{p.name}</div>
                    <div style={{ font: `400 12px ${s.FONT}`, color: s.text2 }}>{p.title}</div>
                  </div>
                </div>
                {p.specialties && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                    {(Array.isArray(p.specialties) ? p.specialties : [p.specialties]).map(sp => (
                      <span key={sp} style={{ padding: '2px 8px', borderRadius: 100, background: '#F5F5F5', font: `400 10px ${s.FONT}`, color: s.text2 }}>{sp}</span>
                    ))}
                  </div>
                )}
                <button onClick={() => { setEditProv(p); setProvForm({ name: p.name, title: p.title, specialties: Array.isArray(p.specialties) ? p.specialties.join(', ') : p.specialties || '', color: p.color || '#111' }); setShowProvForm(true); }} style={{ ...s.pillOutline, padding: '5px 12px', fontSize: 11 }}>Edit</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locations */}
      {tab === 'locations' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 12 }}>
            {locations.map(l => (
              <div key={l.id} style={{ ...s.cardStyle, padding: 20 }}>
                <div style={{ font: `600 15px ${s.FONT}`, color: s.text, marginBottom: 8 }}>{l.name}</div>
                <div style={{ font: `400 13px ${s.FONT}`, color: s.text2, marginBottom: 4 }}>{l.address}</div>
                <div style={{ font: `400 13px ${s.FONT}`, color: s.text3, marginBottom: 8 }}>{l.phone}</div>
                {l.rooms && (
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {l.rooms.map(r => (
                      <span key={r} style={{ padding: '3px 8px', borderRadius: 6, background: '#F5F5F5', font: `400 11px ${s.FONT}`, color: s.text2 }}>{r}</span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Service Form Modal */}
      {showSvcForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }} onClick={() => setShowSvcForm(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 480, width: '90%', boxShadow: s.shadowLg }} onClick={e => e.stopPropagation()}>
            <h2 style={{ font: `600 18px ${s.FONT}`, color: s.text, marginBottom: 20 }}>{editSvc ? 'Edit Service' : 'Add Service'}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={s.label}>Name</label>
                <input value={svcForm.name} onChange={e => setSvcForm({ ...svcForm, name: e.target.value })} style={s.input} />
              </div>
              <div>
                <label style={s.label}>Category</label>
                <select value={svcForm.category} onChange={e => setSvcForm({ ...svcForm, category: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  <option>Injectables</option><option>Skin</option><option>Laser</option><option>Lifting</option><option>Wellness</option><option>Body</option>
                </select>
              </div>
              <div>
                <label style={s.label}>Duration (min)</label>
                <input type="number" value={svcForm.duration} onChange={e => setSvcForm({ ...svcForm, duration: parseInt(e.target.value) || 30 })} style={s.input} />
              </div>
              <div>
                <label style={s.label}>Price (cents)</label>
                <input type="number" value={svcForm.price} onChange={e => setSvcForm({ ...svcForm, price: parseInt(e.target.value) || 0 })} style={s.input} />
              </div>
              <div>
                <label style={s.label}>Unit</label>
                <input value={svcForm.unit} onChange={e => setSvcForm({ ...svcForm, unit: e.target.value })} style={s.input} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={s.label}>Description</label>
                <input value={svcForm.description} onChange={e => setSvcForm({ ...svcForm, description: e.target.value })} style={s.input} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSvcForm(false)} style={s.pillGhost}>Cancel</button>
              <button onClick={handleSaveService} style={s.pillAccent}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Provider Form Modal */}
      {showProvForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }} onClick={() => setShowProvForm(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 480, width: '90%', boxShadow: s.shadowLg }} onClick={e => e.stopPropagation()}>
            <h2 style={{ font: `600 18px ${s.FONT}`, color: s.text, marginBottom: 20 }}>{editProv ? 'Edit Provider' : 'Add Provider'}</h2>
            <div style={{ display: 'grid', gap: 14 }}>
              <div>
                <label style={s.label}>Full Name</label>
                <input value={provForm.name} onChange={e => setProvForm({ ...provForm, name: e.target.value })} style={s.input} placeholder="Dr. Jane Smith" />
              </div>
              <div>
                <label style={s.label}>Title</label>
                <input value={provForm.title} onChange={e => setProvForm({ ...provForm, title: e.target.value })} style={s.input} placeholder="Medical Director" />
              </div>
              <div>
                <label style={s.label}>Specialties (comma separated)</label>
                <input value={provForm.specialties} onChange={e => setProvForm({ ...provForm, specialties: e.target.value })} style={s.input} placeholder="Botox, Fillers, PDO Threads" />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowProvForm(false)} style={s.pillGhost}>Cancel</button>
              <button onClick={handleSaveProvider} style={s.pillAccent}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
