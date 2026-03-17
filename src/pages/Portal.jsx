import { useState, useEffect } from 'react';
import { useStyles } from '../theme';
import {
  getPatients, getAppointments, getServices, getProviders,
  getTreatmentPlans, getPhotos, updatePatient, subscribe,
} from '../data/store';

const fmt = (cents) => `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
const fmtDate = (d) => {
  if (!d) return '';
  const dt = new Date(d + (d.length === 10 ? 'T12:00:00' : ''));
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};
const fmtWeekday = (d) => {
  if (!d) return '';
  const dt = new Date(d + 'T12:00:00');
  return dt.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
};

// localStorage helpers for non-store keys
function lsGet(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}

const WAIVER_TEMPLATES = {
  general: 'General Treatment Consent',
  hipaa: 'HIPAA Privacy Notice',
  botox: 'Botox / Neurotoxin Consent',
  filler: 'Dermal Filler Consent',
  laser: 'Laser / IPL Consent',
  photo: 'Photo / Marketing Consent',
  financial: 'Financial Responsibility',
  micro: 'Microneedling Consent',
  cancel: 'Cancellation Policy',
};

const TIER_COLORS = {
  Silver: { color: '#94A3B8', bg: '#F8FAFC' },
  Gold: { color: '#D97706', bg: '#FFFBEB' },
  Platinum: { color: '#7C3AED', bg: '#F5F3FF' },
};

export default function Portal() {
  const s = useStyles();
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);

  const patients = getPatients();
  const [selectedPatientId, setSelectedPatientId] = useState('PAT-1000');
  const [section, setSection] = useState('home');
  const [editInfo, setEditInfo] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [copied, setCopied] = useState(false);
  const [signingWaiver, setSigningWaiver] = useState(null);
  const [signName, setSignName] = useState('');

  const patient = patients.find(p => p.id === selectedPatientId);
  const patientName = patient ? patient.firstName : 'Guest';
  const today = new Date().toISOString().slice(0, 10);

  // Data filtered by patient
  const appointments = getAppointments().filter(a => a.patientId === selectedPatientId);
  const services = getServices();
  const providers = getProviders();
  const treatmentPlans = getTreatmentPlans().filter(t => t.patientId === selectedPatientId);
  const photos = getPhotos().filter(p => p.patientId === selectedPatientId);
  const memberships = lsGet('ms_memberships', []).filter(m => m.patientId === selectedPatientId);
  const packages = lsGet('ms_packages', []).filter(p => p.patientId === selectedPatientId);
  const walletEntries = lsGet('ms_wallet', []).filter(w => w.patientId === selectedPatientId);
  const waivers = lsGet('ms_waivers', []).filter(w => w.patientId === selectedPatientId);
  const referrals = lsGet('ms_referrals', []).filter(r => r.referrerId === selectedPatientId);

  const upcomingAppts = appointments.filter(a => a.date >= today && a.status !== 'completed')
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const pastAppts = appointments.filter(a => a.date < today || a.status === 'completed')
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
  const nextAppt = upcomingAppts[0];

  const membership = memberships[0];
  const tierInfo = membership ? TIER_COLORS[membership.tier] || TIER_COLORS.Gold : null;

  const giftCards = walletEntries.filter(w => w.type === 'gift_card' && w.balance > 0);
  const credits = walletEntries.filter(w => w.type === 'credit' && w.balance > 0);
  const loyalty = walletEntries.find(w => w.type === 'loyalty');

  const referralCode = referrals[0]?.code || `REF-${patientName.toUpperCase()}-${selectedPatientId.replace('PAT-', '')}`;
  const creditedReferrals = referrals.filter(r => r.status === 'credited');
  const totalReferralCredits = creditedReferrals.reduce((sum, r) => sum + (r.referrerCredit || 0), 0);

  const svcName = (id) => services.find(sv => sv.id === id)?.name || 'Service';
  const provName = (id) => providers.find(p => p.id === id)?.name || 'Provider';

  // Photo pairs
  const photoPairs = {};
  photos.forEach(p => {
    const key = `${p.serviceId}-${p.angle}`;
    if (!photoPairs[key]) photoPairs[key] = {};
    photoPairs[key][p.phase] = p;
    photoPairs[key].serviceName = p.serviceName || svcName(p.serviceId);
    photoPairs[key].angle = p.angle;
  });

  const handleEditInfo = () => {
    setEditForm({
      firstName: patient?.firstName || '',
      lastName: patient?.lastName || '',
      email: patient?.email || '',
      phone: patient?.phone || '',
      dob: patient?.dob || '',
      allergies: patient?.allergies || '',
    });
    setEditInfo(true);
  };

  const saveInfo = () => {
    updatePatient(selectedPatientId, editForm);
    setEditInfo(false);
    setTick(t => t + 1);
  };

  const handleSignWaiver = (waiverId) => {
    const allWaivers = lsGet('ms_waivers', []);
    const updated = allWaivers.map(w =>
      w.id === waiverId ? { ...w, status: 'signed', signedAt: new Date().toISOString(), signatureData: signName } : w
    );
    localStorage.setItem('ms_waivers', JSON.stringify(updated));
    setSigningWaiver(null);
    setSignName('');
    setTick(t => t + 1);
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(`https://yourmedspa.com/refer/${referralCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // -- Style helpers --
  const portalBg = '#F9FAFB';
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'appointments', label: 'Appointments' },
    { id: 'treatment', label: 'Treatment Plan' },
    { id: 'membership', label: 'Membership' },
    { id: 'wallet', label: 'Wallet' },
    { id: 'photos', label: 'Before & After' },
    { id: 'waivers', label: 'Waivers' },
    { id: 'referrals', label: 'Refer a Friend' },
    { id: 'info', label: 'My Info' },
  ];

  const Card = ({ children, style }) => (
    <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #EAEAEA', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', ...style }}>
      {children}
    </div>
  );

  const SectionTitle = ({ children }) => (
    <h2 style={{ font: `600 20px ${s.FONT}`, color: s.text, margin: '0 0 16px 0' }}>{children}</h2>
  );

  const Badge = ({ text, color, bg }) => (
    <span style={{
      display: 'inline-block', padding: '4px 12px', borderRadius: 100,
      font: `600 11px ${s.FONT}`, textTransform: 'uppercase', letterSpacing: 0.5,
      color: color || '#fff', background: bg || s.accent,
    }}>{text}</span>
  );

  const ProgressBar = ({ value, max, color }) => (
    <div style={{ height: 8, borderRadius: 100, background: '#F0F0F0', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 100, width: `${Math.min(100, (value / max) * 100)}%`,
        background: color || s.accent, transition: 'width 0.4s ease',
      }} />
    </div>
  );

  // -- Sections --

  const renderHome = () => (
    <div>
      {/* Welcome */}
      <Card style={{ padding: '32px 28px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: s.accentLight,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            font: `600 22px ${s.FONT}`, color: s.accent, flexShrink: 0,
          }}>
            {patient?.firstName?.[0]}{patient?.lastName?.[0]}
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ font: `600 28px ${s.FONT}`, color: s.text, margin: 0 }}>
              Welcome back, {patientName}
            </h1>
            <p style={{ font: `400 14px ${s.FONT}`, color: s.text2, margin: '4px 0 0' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          {membership && tierInfo && (
            <Badge text={`${membership.tier} Member`} color={tierInfo.color} bg={tierInfo.bg} />
          )}
        </div>
      </Card>

      {/* Next Appointment Preview */}
      {nextAppt && (
        <Card style={{ padding: '24px 28px', marginBottom: 20, borderLeft: `4px solid ${s.accent}` }}>
          <div style={{ font: `500 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 10 }}>
            Next Appointment
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ font: `600 16px ${s.FONT}`, color: s.text, marginBottom: 4 }}>
                {svcName(nextAppt.serviceId)}
              </div>
              <div style={{ font: `400 14px ${s.FONT}`, color: s.text2 }}>
                {fmtWeekday(nextAppt.date)} at {nextAppt.time}
              </div>
              <div style={{ font: `400 13px ${s.FONT}`, color: s.text3, marginTop: 2 }}>
                with {provName(nextAppt.providerId)}
              </div>
            </div>
            <button onClick={() => setSection('appointments')} style={{
              ...s.pillOutline, padding: '10px 20px',
            }}>View All</button>
          </div>
        </Card>
      )}

      {/* Quick Links Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
        {[
          { id: 'appointments', label: 'My Appointments', count: upcomingAppts.length, sub: 'upcoming' },
          { id: 'treatment', label: 'Treatment Plan', count: treatmentPlans.length, sub: treatmentPlans.length === 1 ? 'active plan' : 'plans' },
          { id: 'membership', label: 'Membership', count: membership ? membership.tier : 'None', sub: membership ? 'active' : '' },
          { id: 'wallet', label: 'Wallet', count: loyalty ? `${loyalty.points.toLocaleString()} pts` : '$0', sub: 'balance' },
          { id: 'referrals', label: 'Referrals', count: creditedReferrals.length, sub: 'friends referred' },
          { id: 'waivers', label: 'Waivers', count: waivers.filter(w => w.status === 'pending').length, sub: 'pending' },
        ].map(item => (
          <Card key={item.id} style={{ padding: '20px 18px', cursor: 'pointer', transition: 'all 0.15s' }}
            onClick={() => setSection(item.id)}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
          >
            <div style={{ font: `600 22px ${s.FONT}`, color: s.accent, marginBottom: 4 }}>{item.count}</div>
            <div style={{ font: `500 13px ${s.FONT}`, color: s.text }}>{item.label}</div>
            {item.sub && <div style={{ font: `400 11px ${s.FONT}`, color: s.text3 }}>{item.sub}</div>}
          </Card>
        ))}
      </div>
    </div>
  );

  const renderAppointments = () => (
    <div>
      <SectionTitle>My Appointments</SectionTitle>

      {/* Upcoming */}
      <div style={{ font: `500 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 10 }}>
        Upcoming ({upcomingAppts.length})
      </div>
      {upcomingAppts.length === 0 ? (
        <Card style={{ padding: 32, textAlign: 'center', marginBottom: 24 }}>
          <div style={{ font: `400 14px ${s.FONT}`, color: s.text3 }}>No upcoming appointments</div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {upcomingAppts.map(a => (
            <Card key={a.id} style={{ padding: '18px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12, background: s.accentLight,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <div style={{ font: `600 14px ${s.FONT}`, color: s.accent, lineHeight: 1 }}>
                    {new Date(a.date + 'T12:00:00').getDate()}
                  </div>
                  <div style={{ font: `400 9px ${s.MONO}`, color: s.accent, textTransform: 'uppercase' }}>
                    {new Date(a.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ font: `600 15px ${s.FONT}`, color: s.text }}>{svcName(a.serviceId)}</div>
                  <div style={{ font: `400 13px ${s.FONT}`, color: s.text2 }}>
                    {fmtWeekday(a.date)} at {a.time}
                  </div>
                  <div style={{ font: `400 12px ${s.FONT}`, color: s.text3, marginTop: 2 }}>
                    with {provName(a.providerId)} {a.room ? `- ${a.room}` : ''}
                  </div>
                </div>
                <Badge
                  text={a.status}
                  color={a.status === 'confirmed' ? s.success : s.warning}
                  bg={a.status === 'confirmed' ? '#F0FDF4' : '#FFFBEB'}
                />
              </div>
            </Card>
          ))}
        </div>
      )}

      <button style={{ ...s.pillAccent, padding: '12px 28px', marginBottom: 32 }}>
        Book New Appointment
      </button>

      {/* Past */}
      <div style={{ font: `500 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 10 }}>
        Past Appointments ({pastAppts.length})
      </div>
      {pastAppts.length === 0 ? (
        <Card style={{ padding: 32, textAlign: 'center' }}>
          <div style={{ font: `400 14px ${s.FONT}`, color: s.text3 }}>No past appointments</div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pastAppts.slice(0, 10).map(a => (
            <Card key={a.id} style={{ padding: '14px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ font: `500 14px ${s.FONT}`, color: s.text }}>{svcName(a.serviceId)}</div>
                  <div style={{ font: `400 12px ${s.FONT}`, color: s.text3 }}>
                    {fmtDate(a.date)} at {a.time} - {provName(a.providerId)}
                  </div>
                </div>
                <span style={{ font: `400 11px ${s.FONT}`, color: s.text3, textTransform: 'uppercase' }}>Completed</span>
              </div>
            </Card>
          ))}
          {pastAppts.length > 10 && (
            <div style={{ font: `400 12px ${s.FONT}`, color: s.text3, textAlign: 'center', padding: 8 }}>
              + {pastAppts.length - 10} more
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderTreatmentPlan = () => (
    <div>
      <SectionTitle>My Treatment Plan</SectionTitle>
      {treatmentPlans.length === 0 ? (
        <Card style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ font: `500 16px ${s.FONT}`, color: s.text, marginBottom: 8 }}>No active treatment plan</div>
          <div style={{ font: `400 14px ${s.FONT}`, color: s.text3 }}>
            Ask your provider about a personalized treatment plan at your next visit.
          </div>
        </Card>
      ) : treatmentPlans.map(plan => {
        const completed = plan.sessions.filter(ss => ss.status === 'completed').length;
        const total = plan.sessions.length;
        const nextSession = plan.sessions.find(ss => ss.status === 'upcoming' || ss.status === 'in-progress');
        return (
          <Card key={plan.id} style={{ padding: '24px 28px', marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ font: `600 18px ${s.FONT}`, color: s.text }}>{plan.name}</div>
                <div style={{ font: `400 13px ${s.FONT}`, color: s.text2, marginTop: 4 }}>
                  with {provName(plan.providerId)}
                </div>
              </div>
              <div style={{ font: `600 14px ${s.FONT}`, color: s.accent }}>{completed}/{total} sessions</div>
            </div>
            <ProgressBar value={completed} max={total} />
            <div style={{ font: `400 12px ${s.FONT}`, color: s.text3, marginTop: 8 }}>
              {Math.round((completed / total) * 100)}% complete
            </div>
            {nextSession && (
              <div style={{
                marginTop: 16, padding: '14px 18px', borderRadius: 12,
                background: s.accentLight, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <div style={{ font: `500 13px ${s.FONT}`, color: s.text }}>Next: {nextSession.name}</div>
                  <div style={{ font: `400 12px ${s.FONT}`, color: s.text2, marginTop: 2 }}>{fmtDate(nextSession.date)}</div>
                </div>
                <Badge text={nextSession.status} color={nextSession.status === 'in-progress' ? s.warning : s.accent} bg={nextSession.status === 'in-progress' ? '#FFFBEB' : s.accentLight} />
              </div>
            )}
            {/* Sessions list */}
            <div style={{ marginTop: 20 }}>
              <div style={{ font: `500 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 10 }}>
                All Sessions
              </div>
              {plan.sessions.map((ss, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                  borderBottom: i < plan.sessions.length - 1 ? '1px solid #F5F5F5' : 'none',
                }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: ss.status === 'completed' ? s.success : ss.status === 'in-progress' ? s.warning : '#E5E5E5',
                    color: ss.status === 'completed' || ss.status === 'in-progress' ? '#fff' : s.text3,
                    font: `600 11px ${s.FONT}`,
                  }}>
                    {ss.status === 'completed' ? '\u2713' : i + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ font: `500 13px ${s.FONT}`, color: ss.status === 'completed' ? s.text2 : s.text }}>{ss.name}</div>
                    {ss.date && <div style={{ font: `400 11px ${s.FONT}`, color: s.text3 }}>{fmtDate(ss.date)}</div>}
                  </div>
                  <span style={{
                    font: `500 10px ${s.FONT}`, textTransform: 'uppercase', letterSpacing: 0.5,
                    color: ss.status === 'completed' ? s.success : ss.status === 'in-progress' ? s.warning : s.text3,
                  }}>{ss.status}</span>
                </div>
              ))}
            </div>
          </Card>
        );
      })}
    </div>
  );

  const renderMembership = () => (
    <div>
      <SectionTitle>My Membership</SectionTitle>
      {!membership ? (
        <Card style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ font: `500 18px ${s.FONT}`, color: s.text, marginBottom: 8 }}>
            You don't have a membership yet
          </div>
          <div style={{ font: `400 14px ${s.FONT}`, color: s.text3, marginBottom: 20 }}>
            Unlock exclusive savings with a membership tier.
          </div>
          <button style={{ ...s.pillAccent, padding: '12px 32px', fontSize: 14 }}>
            Explore Memberships
          </button>
        </Card>
      ) : (
        <div>
          <Card style={{ padding: '28px', marginBottom: 16, background: tierInfo?.bg || '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <Badge text={membership.tier} color={tierInfo?.color} bg='rgba(255,255,255,0.8)' />
                <div style={{ font: `600 22px ${s.FONT}`, color: s.text, marginTop: 10 }}>
                  {membership.tier} Membership
                </div>
                <div style={{ font: `400 13px ${s.FONT}`, color: s.text2, marginTop: 4 }}>
                  Member since {fmtDate(membership.startDate)}
                </div>
              </div>
              <Badge text={membership.status} color={membership.status === 'active' ? s.success : s.warning}
                bg={membership.status === 'active' ? '#F0FDF4' : '#FFFBEB'} />
            </div>

            {membership.nextBilling && (
              <div style={{ font: `400 13px ${s.FONT}`, color: s.text2, marginBottom: 20 }}>
                Next billing: <strong>{fmtDate(membership.nextBilling)}</strong>
              </div>
            )}

            {membership.credits > 0 && (
              <div style={{
                padding: '12px 16px', borderRadius: 10, background: 'rgba(255,255,255,0.7)',
                font: `500 14px ${s.FONT}`, color: s.accent, marginBottom: 16,
              }}>
                {fmt(membership.credits * 100)} membership credits available
              </div>
            )}

            {/* Service allocations */}
            <div style={{ font: `500 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 12 }}>
              Included Services
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(membership.wallet || []).map((w, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ font: `500 14px ${s.FONT}`, color: s.text }}>{w.service}</span>
                    <span style={{ font: `600 13px ${s.MONO}`, color: w.remaining > 0 ? s.accent : s.text3 }}>
                      {w.remaining} of {w.total} remaining
                    </span>
                  </div>
                  <ProgressBar value={w.remaining} max={w.total} color={w.remaining > 0 ? s.accent : '#DDD'} />
                </div>
              ))}
            </div>
          </Card>

          {/* Packages */}
          {packages.length > 0 && (
            <div>
              <div style={{ font: `500 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, margin: '20px 0 10px' }}>
                My Packages
              </div>
              {packages.map(pkg => (
                <Card key={pkg.id} style={{ padding: '18px 22px', marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ font: `600 15px ${s.FONT}`, color: s.text }}>{pkg.name}</div>
                    <Badge text={pkg.status} color={pkg.status === 'active' ? s.success : s.text3}
                      bg={pkg.status === 'active' ? '#F0FDF4' : '#F5F5F5'} />
                  </div>
                  <div style={{ font: `400 13px ${s.FONT}`, color: s.text2, marginBottom: 8 }}>
                    {pkg.usedSessions} of {pkg.totalSessions} sessions used - Expires {fmtDate(pkg.expiresDate)}
                  </div>
                  <ProgressBar value={pkg.usedSessions} max={pkg.totalSessions} color={s.accent} />
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderWallet = () => (
    <div>
      <SectionTitle>My Wallet</SectionTitle>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
        <Card style={{ padding: '20px 18px' }}>
          <div style={{ font: `400 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 6 }}>
            Gift Cards
          </div>
          <div style={{ font: `600 24px ${s.FONT}`, color: s.text }}>
            {fmt(giftCards.reduce((sum, g) => sum + g.balance, 0))}
          </div>
        </Card>
        <Card style={{ padding: '20px 18px' }}>
          <div style={{ font: `400 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 6 }}>
            Account Credits
          </div>
          <div style={{ font: `600 24px ${s.FONT}`, color: s.text }}>
            {fmt(credits.reduce((sum, c) => sum + c.balance, 0))}
          </div>
        </Card>
        <Card style={{ padding: '20px 18px' }}>
          <div style={{ font: `400 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 6 }}>
            Loyalty Points
          </div>
          <div style={{ font: `600 24px ${s.FONT}`, color: s.accent }}>
            {loyalty ? loyalty.points.toLocaleString() : '0'}
          </div>
          {loyalty && (
            <div style={{ font: `400 11px ${s.FONT}`, color: s.text3, marginTop: 2 }}>
              {loyalty.lifetimePoints?.toLocaleString()} lifetime
            </div>
          )}
        </Card>
      </div>

      {/* Gift Cards detail */}
      {giftCards.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ font: `500 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 10 }}>
            Gift Cards
          </div>
          {giftCards.map(gc => (
            <Card key={gc.id} style={{ padding: '16px 20px', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ font: `500 14px ${s.FONT}`, color: s.text }}>
                    Gift Card from {gc.purchasedBy}
                  </div>
                  {gc.recipientMessage && (
                    <div style={{ font: `400 12px ${s.FONT}`, color: s.text2, fontStyle: 'italic', marginTop: 2 }}>
                      "{gc.recipientMessage}"
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ font: `600 16px ${s.FONT}`, color: s.accent }}>{fmt(gc.balance)}</div>
                  <div style={{ font: `400 11px ${s.FONT}`, color: s.text3 }}>of {fmt(gc.amount)}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Credits detail */}
      {credits.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ font: `500 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 10 }}>
            Account Credits
          </div>
          {credits.map(cr => (
            <Card key={cr.id} style={{ padding: '16px 20px', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ font: `500 14px ${s.FONT}`, color: s.text }}>{cr.reason}</div>
                  <div style={{ font: `400 11px ${s.FONT}`, color: s.text3 }}>{fmtDate(cr.createdAt)}</div>
                </div>
                <div style={{ font: `600 16px ${s.FONT}`, color: s.success }}>{fmt(cr.balance)}</div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Loyalty history */}
      {loyalty && loyalty.transactions && (
        <div>
          <div style={{ font: `500 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 10 }}>
            Points Activity
          </div>
          {loyalty.transactions.slice().reverse().map((tx, i) => (
            <div key={i} style={{
              display: 'flex', justifyContent: 'space-between', padding: '10px 0',
              borderBottom: i < loyalty.transactions.length - 1 ? '1px solid #F5F5F5' : 'none',
            }}>
              <div>
                <div style={{ font: `400 13px ${s.FONT}`, color: s.text }}>{tx.note}</div>
                <div style={{ font: `400 11px ${s.FONT}`, color: s.text3 }}>{fmtDate(tx.date)}</div>
              </div>
              <span style={{
                font: `600 13px ${s.MONO}`,
                color: (tx.points || 0) > 0 ? s.success : s.danger,
              }}>
                {(tx.points || 0) > 0 ? '+' : ''}{tx.points}
              </span>
            </div>
          ))}
        </div>
      )}

      {giftCards.length === 0 && credits.length === 0 && !loyalty && (
        <Card style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ font: `400 14px ${s.FONT}`, color: s.text3 }}>No wallet activity yet.</div>
        </Card>
      )}
    </div>
  );

  const renderPhotos = () => {
    const pairKeys = Object.keys(photoPairs);
    return (
      <div>
        <SectionTitle>Before & After</SectionTitle>
        {pairKeys.length === 0 ? (
          <Card style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ font: `500 16px ${s.FONT}`, color: s.text, marginBottom: 8 }}>No photos yet</div>
            <div style={{ font: `400 14px ${s.FONT}`, color: s.text3 }}>
              Your before and after photos will appear here after your treatments.
            </div>
          </Card>
        ) : pairKeys.map(key => {
          const pair = photoPairs[key];
          return (
            <Card key={key} style={{ padding: '22px 24px', marginBottom: 14 }}>
              <div style={{ font: `600 15px ${s.FONT}`, color: s.text, marginBottom: 4 }}>
                {pair.serviceName}
              </div>
              <div style={{ font: `400 12px ${s.FONT}`, color: s.text3, marginBottom: 16 }}>
                Angle: {pair.angle}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {['before', 'after'].map(phase => {
                  const photo = pair[phase];
                  return (
                    <div key={phase}>
                      <div style={{ font: `600 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 8 }}>
                        {phase}
                      </div>
                      {photo ? (
                        <div style={{
                          height: 160, borderRadius: 12, background: '#F5F5F5', border: '1px solid #E5E5E5',
                          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <div style={{ font: `500 12px ${s.FONT}`, color: s.text3, marginBottom: 4 }}>
                            Clinical Photo
                          </div>
                          <div style={{ font: `400 11px ${s.FONT}`, color: s.text3 }}>{fmtDate(photo.date)}</div>
                          {photo.notes && (
                            <div style={{ font: `400 11px ${s.FONT}`, color: s.text2, marginTop: 6, padding: '0 12px', textAlign: 'center' }}>
                              {photo.notes}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{
                          height: 160, borderRadius: 12, background: '#FAFAFA', border: '1px dashed #DDD',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          font: `400 12px ${s.FONT}`, color: s.text3,
                        }}>
                          Not yet taken
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  const renderWaivers = () => (
    <div>
      <SectionTitle>My Waivers</SectionTitle>
      {waivers.length === 0 ? (
        <Card style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ font: `400 14px ${s.FONT}`, color: s.text3 }}>No waivers assigned.</div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {waivers.map(w => {
            const templateName = WAIVER_TEMPLATES[w.templateId] || w.templateId;
            const isPending = w.status === 'pending';
            return (
              <Card key={w.id} style={{ padding: '18px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    background: isPending ? '#FEF3C7' : '#F0FDF4',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    font: `500 14px ${s.FONT}`,
                    color: isPending ? s.warning : s.success,
                  }}>
                    {isPending ? '!' : '\u2713'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ font: `500 14px ${s.FONT}`, color: s.text }}>{templateName}</div>
                    <div style={{ font: `400 12px ${s.FONT}`, color: s.text3 }}>
                      {isPending ? 'Signature required' : `Signed ${fmtDate(w.signedAt)}`}
                    </div>
                  </div>
                  {isPending && (
                    signingWaiver === w.id ? (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <input
                          value={signName}
                          onChange={e => setSignName(e.target.value)}
                          placeholder="Type full name to sign"
                          style={{ ...s.input, width: 200, padding: '8px 12px', fontSize: 13 }}
                        />
                        <button
                          onClick={() => handleSignWaiver(w.id)}
                          disabled={!signName.trim()}
                          style={{
                            ...s.pillAccent, padding: '8px 16px', fontSize: 12,
                            opacity: signName.trim() ? 1 : 0.5,
                          }}
                        >Sign</button>
                        <button onClick={() => { setSigningWaiver(null); setSignName(''); }}
                          style={{ ...s.pillGhost, padding: '8px 12px', fontSize: 12 }}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setSigningWaiver(w.id)}
                        style={{ ...s.pillAccent, padding: '8px 18px', fontSize: 12 }}>
                        Sign Now
                      </button>
                    )
                  )}
                  {!isPending && (
                    <Badge text="Signed" color={s.success} bg="#F0FDF4" />
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderReferrals = () => (
    <div>
      <SectionTitle>Refer a Friend</SectionTitle>
      <Card style={{ padding: '28px', marginBottom: 20 }}>
        <div style={{ font: `500 16px ${s.FONT}`, color: s.text, marginBottom: 8 }}>
          Share your referral code
        </div>
        <div style={{ font: `400 14px ${s.FONT}`, color: s.text2, marginBottom: 16 }}>
          Give your friends $50 off their first visit and earn $50 in credits for each referral.
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px',
          borderRadius: 12, background: s.accentLight, marginBottom: 16,
        }}>
          <code style={{ font: `600 16px ${s.MONO}`, color: s.accent, flex: 1 }}>
            {referralCode}
          </code>
          <button onClick={copyReferralLink} style={{ ...s.pillAccent, padding: '8px 18px', fontSize: 12 }}>
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
        </div>
        <div style={{ font: `400 13px ${s.FONT}`, color: s.text3 }}>
          Share link: https://yourmedspa.com/refer/{referralCode}
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24 }}>
        <Card style={{ padding: '18px', textAlign: 'center' }}>
          <div style={{ font: `600 24px ${s.FONT}`, color: s.text }}>{referrals.length}</div>
          <div style={{ font: `400 12px ${s.FONT}`, color: s.text3 }}>Total Referrals</div>
        </Card>
        <Card style={{ padding: '18px', textAlign: 'center' }}>
          <div style={{ font: `600 24px ${s.FONT}`, color: s.success }}>{creditedReferrals.length}</div>
          <div style={{ font: `400 12px ${s.FONT}`, color: s.text3 }}>Completed</div>
        </Card>
        <Card style={{ padding: '18px', textAlign: 'center' }}>
          <div style={{ font: `600 24px ${s.FONT}`, color: s.accent }}>${totalReferralCredits}</div>
          <div style={{ font: `400 12px ${s.FONT}`, color: s.text3 }}>Credits Earned</div>
        </Card>
      </div>

      {/* Referral History */}
      {referrals.length > 0 && (
        <div>
          <div style={{ font: `500 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3, marginBottom: 10 }}>
            Referral History
          </div>
          {referrals.map(r => (
            <Card key={r.id} style={{ padding: '14px 20px', marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ font: `500 14px ${s.FONT}`, color: s.text }}>{r.friendName}</div>
                  <div style={{ font: `400 12px ${s.FONT}`, color: s.text3 }}>Referred {fmtDate(r.referredDate)}</div>
                </div>
                <Badge
                  text={r.status}
                  color={r.status === 'credited' ? s.success : r.status === 'booked' ? s.accent : s.warning}
                  bg={r.status === 'credited' ? '#F0FDF4' : r.status === 'booked' ? s.accentLight : '#FFFBEB'}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const renderInfo = () => (
    <div>
      <SectionTitle>My Info</SectionTitle>
      <Card style={{ padding: '28px' }}>
        {!editInfo ? (
          <div>
            {[
              { label: 'Name', value: `${patient?.firstName || ''} ${patient?.lastName || ''}` },
              { label: 'Email', value: patient?.email || '' },
              { label: 'Phone', value: patient?.phone || '' },
              { label: 'Date of Birth', value: patient?.dob ? fmtDate(patient.dob) : '' },
              { label: 'Allergies', value: patient?.allergies || 'None' },
              { label: 'Member Since', value: patient?.createdAt ? fmtDate(patient.createdAt) : '' },
            ].map((row, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', padding: '14px 0',
                borderBottom: i < 5 ? '1px solid #F5F5F5' : 'none',
              }}>
                <span style={{ font: `400 11px ${s.MONO}`, textTransform: 'uppercase', letterSpacing: 1, color: s.text3 }}>{row.label}</span>
                <span style={{ font: `500 14px ${s.FONT}`, color: s.text }}>{row.value}</span>
              </div>
            ))}
            <div style={{ marginTop: 20 }}>
              <button onClick={handleEditInfo} style={{ ...s.pillOutline, padding: '10px 24px' }}>
                Edit Info
              </button>
            </div>
          </div>
        ) : (
          <div>
            {[
              { key: 'firstName', label: 'First Name' },
              { key: 'lastName', label: 'Last Name' },
              { key: 'email', label: 'Email' },
              { key: 'phone', label: 'Phone' },
              { key: 'dob', label: 'Date of Birth', type: 'date' },
              { key: 'allergies', label: 'Allergies' },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 16 }}>
                <label style={s.label}>{field.label}</label>
                <input
                  type={field.type || 'text'}
                  value={editForm[field.key] || ''}
                  onChange={e => setEditForm({ ...editForm, [field.key]: e.target.value })}
                  style={s.input}
                />
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button onClick={saveInfo} style={{ ...s.pillAccent, padding: '10px 28px' }}>Save</button>
              <button onClick={() => setEditInfo(false)} style={{ ...s.pillGhost, padding: '10px 28px' }}>Cancel</button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );

  const sections = {
    home: renderHome,
    appointments: renderAppointments,
    treatment: renderTreatmentPlan,
    membership: renderMembership,
    wallet: renderWallet,
    photos: renderPhotos,
    waivers: renderWaivers,
    referrals: renderReferrals,
    info: renderInfo,
  };

  return (
    <div style={{ minHeight: '100vh', background: portalBg, fontFamily: s.FONT }}>
      {/* Patient selector (dev tool) */}
      <div style={{
        background: '#111', padding: '8px 24px', display: 'flex', alignItems: 'center', gap: 12,
        font: `400 12px ${s.MONO}`, color: '#888',
      }}>
        <span>Logged in as:</span>
        <select
          value={selectedPatientId}
          onChange={e => { setSelectedPatientId(e.target.value); setSection('home'); setEditInfo(false); }}
          style={{
            background: '#222', color: '#fff', border: '1px solid #444', borderRadius: 6,
            padding: '4px 8px', font: `400 12px ${s.MONO}`, outline: 'none',
          }}
        >
          {patients.map(p => (
            <option key={p.id} value={p.id}>{p.id} - {p.firstName} {p.lastName}</option>
          ))}
        </select>
      </div>

      {/* Top Nav */}
      <div style={{
        background: '#fff', borderBottom: '1px solid #EAEAEA', padding: '0 24px',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer', padding: '16px 14px',
                font: `${section === item.id ? '600' : '400'} 13px ${s.FONT}`,
                color: section === item.id ? s.accent : s.text2,
                borderBottom: section === item.id ? `2px solid ${s.accent}` : '2px solid transparent',
                whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (section !== item.id) e.currentTarget.style.color = s.text; }}
              onMouseLeave={e => { if (section !== item.id) e.currentTarget.style.color = s.text2; }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '28px 24px 60px' }}>
        {sections[section]?.()}
      </div>
    </div>
  );
}
