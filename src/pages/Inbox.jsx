// Unified DM Inbox — Instagram, Facebook, TikTok — multi-staff shared inbox
// Solves: multiple providers sharing one login, losing track of who messaged whom
import { useState, useEffect, useRef } from 'react';
import { useStyles } from '../theme';
import { getPatients, getProviders, getSettings, subscribe } from '../data/store';

const INBOX_KEY = 'ms_inbox';
const ASSIGN_KEY = 'ms_inbox_assignments';

function loadConversations() { try { return JSON.parse(localStorage.getItem(INBOX_KEY)) || []; } catch { return []; } }
function saveConversations(c) { localStorage.setItem(INBOX_KEY, JSON.stringify(c)); }
function loadAssignments() { try { return JSON.parse(localStorage.getItem(ASSIGN_KEY)) || {}; } catch { return {}; } }
function saveAssignments(a) { localStorage.setItem(ASSIGN_KEY, JSON.stringify(a)); }

function initInbox() {
  const existing = loadConversations();
  if (existing.length >= 11) return;
  // Reseed with full conversation set including TikTok
  localStorage.removeItem(INBOX_KEY);
  const now = new Date();
  const ago = (min) => new Date(now - min * 60000).toISOString();

  saveConversations([
    { id: 'DM-1', handle: '@emma.glow', name: 'Emma Johnson', avatar: 'EJ', patientId: 'PAT-1000', platform: 'instagram', unread: 2, lastActivity: ago(5), messages: [
      { id: 'm1', from: 'them', text: 'Hi! I saw your Botox post. How much is it per unit?', time: ago(120), read: true },
      { id: 'm2', from: 'us', text: 'Hi Emma! Botox is $14/unit. Most patients need 20-40 units depending on the area. Would you like to book a free consultation?', time: ago(90), read: true, sentBy: 'PRV-2' },
      { id: 'm3', from: 'them', text: 'Yes! Do you have anything this week?', time: ago(30), read: false },
      { id: 'm4', from: 'them', text: 'Also do you do lip filler?', time: ago(5), read: false },
    ]},
    { id: 'DM-2', handle: '@sophias_skincare', name: 'Sophia Brown', avatar: 'SB', patientId: 'PAT-1002', platform: 'instagram', unread: 1, lastActivity: ago(15), messages: [
      { id: 'm5', from: 'them', text: 'I had microneedling yesterday and my face is really red. Is that normal?', time: ago(180), read: true },
      { id: 'm6', from: 'us', text: 'Hi Sophia! Yes, redness for 24-48 hours is completely normal after RF microneedling. Keep your skin hydrated and avoid direct sun. If it persists past 48 hours, give us a call!', time: ago(150), read: true, sentBy: 'PRV-3' },
      { id: 'm7', from: 'them', text: 'Thank you! Its already calming down. When should I book my next session?', time: ago(15), read: false },
    ]},
    { id: 'DM-3', handle: '@ava.jones.az', name: 'Ava Jones', avatar: 'AJ', patientId: 'PAT-1003', platform: 'instagram', unread: 0, lastActivity: ago(60), messages: [
      { id: 'm8', from: 'them', text: 'Do you offer payment plans for PDO threads?', time: ago(300), read: true },
      { id: 'm9', from: 'us', text: 'Hi Ava! Yes we do — we offer CareCredit and Cherry financing with 0% APR options. PDO thread lifts start at $2,500. Want me to send you more details?', time: ago(240), read: true, sentBy: 'PRV-1' },
      { id: 'm10', from: 'them', text: 'That would be great, thanks!', time: ago(200), read: true },
      { id: 'm11', from: 'us', text: 'Sent! Let me know if you have questions. We can also do a virtual consultation if youd like to see if threads are right for your goals.', time: ago(60), read: true, sentBy: 'PRV-1' },
    ]},
    { id: 'DM-4', handle: '@beauty.by.charlotte', name: 'Charlotte Davis', avatar: 'CD', patientId: null, platform: 'instagram', unread: 1, lastActivity: ago(8), messages: [
      { id: 'm12', from: 'them', text: 'Omg I love your before and afters! How do I book a consultation?', time: ago(8), read: false },
    ]},
    { id: 'DM-5', handle: '@isabella_m', name: 'Isabella Martinez', avatar: 'IM', patientId: 'PAT-1004', platform: 'instagram', unread: 0, lastActivity: ago(1440), messages: [
      { id: 'm13', from: 'them', text: 'When is my next appointment?', time: ago(2880), read: true },
      { id: 'm14', from: 'us', text: 'Hi Isabella! Your next HydraFacial is scheduled for next Thursday at 2pm. See you then!', time: ago(1440), read: true, sentBy: 'PRV-2' },
    ]},
    { id: 'DM-6', handle: '@mia.skinlove', name: 'Mia Garcia', avatar: 'MG', patientId: 'PAT-1005', platform: 'instagram', unread: 3, lastActivity: ago(2), messages: [
      { id: 'm15', from: 'them', text: 'I need to reschedule my appointment for tomorrow', time: ago(45), read: false },
      { id: 'm16', from: 'them', text: 'Can I move it to Friday instead?', time: ago(30), read: false },
      { id: 'm17', from: 'them', text: 'Hello?? Anyone there?', time: ago(2), read: false },
    ]},
    { id: 'DM-7', handle: '@scottsdale.harper', name: 'Harper Anderson', avatar: 'HA', patientId: null, platform: 'facebook', unread: 1, lastActivity: ago(20), messages: [
      { id: 'm18', from: 'them', text: 'Hi, I saw your ad on Facebook. Do you accept insurance for any treatments?', time: ago(20), read: false },
    ]},
    { id: 'DM-8', handle: '@grace.skinjourney', name: 'Grace Taylor', avatar: 'GT', patientId: null, platform: 'tiktok', unread: 2, lastActivity: ago(3), messages: [
      { id: 'm19', from: 'them', text: 'OMG I just saw your Botox reel!! How old do you have to be to get it? Im 24', time: ago(10), read: false },
      { id: 'm20', from: 'them', text: 'also is baby botox a thing?? My friend said you guys do it', time: ago(3), read: false },
    ]},
    { id: 'DM-9', handle: '@chloe.wellness', name: 'Chloe Martinez', avatar: 'CM', patientId: 'PAT-1014', platform: 'tiktok', unread: 1, lastActivity: ago(12), messages: [
      { id: 'm21', from: 'them', text: 'I saw your weight loss transformation video. Is that semaglutide? How much is it per month?', time: ago(45), read: true },
      { id: 'm22', from: 'us', text: 'Hi Chloe! Yes, we offer both semaglutide and tirzepatide programs starting at $500/month. Includes weekly injections, provider check-ins, and nutrition guidance. Want to book a free consult?', time: ago(30), read: true, sentBy: 'PRV-1' },
      { id: 'm23', from: 'them', text: 'yes please! do you have anything next week?', time: ago(12), read: false },
    ]},
    { id: 'DM-10', handle: '@riley.az', name: 'Riley Thompson', avatar: 'RT', patientId: null, platform: 'facebook', unread: 1, lastActivity: ago(35), messages: [
      { id: 'm24', from: 'them', text: 'Hi! I want to get my mom a gift card for her birthday. Do you sell them online?', time: ago(35), read: false },
    ]},
    { id: 'DM-11', handle: '@scottsdale.aria', name: 'Aria Hernandez', avatar: 'AH', patientId: 'PAT-1017', platform: 'instagram', unread: 0, lastActivity: ago(180), messages: [
      { id: 'm25', from: 'them', text: 'Just wanted to say THANK YOU! My skin has never looked better after the IPL series. Everyone keeps asking what I did 😍', time: ago(240), read: true },
      { id: 'm26', from: 'us', text: 'Aria that makes our day!! Your skin really does look amazing. Would you be open to us sharing your before/after on our page? We would tag you of course!', time: ago(180), read: true, sentBy: 'PRV-3' },
    ]},
  ]);

  saveAssignments({
    'DM-1': 'PRV-2',
    'DM-2': 'PRV-3',
    'DM-3': 'PRV-1',
    'DM-6': null,
  });
}

export default function Inbox() {
  const s = useStyles();
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);
  useEffect(() => { initInbox(); }, []);

  const [conversations, setConversations] = useState(loadConversations);
  const [assignments, setAssignments] = useState(loadAssignments);
  const [activeId, setActiveId] = useState(null);
  const [reply, setReply] = useState('');
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'unassigned' | provider id
  const [search, setSearch] = useState('');
  const [currentStaff, setCurrentStaff] = useState('PRV-2'); // who is "logged in"
  const messagesEndRef = useRef(null);

  const providers = getProviders();
  const settings = getSettings();

  const active = conversations.find(c => c.id === activeId);

  const filtered = conversations.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.name?.toLowerCase().includes(q) && !c.handle?.toLowerCase().includes(q)) return false;
    }
    if (filter === 'unread') return c.unread > 0;
    if (filter === 'unassigned') return !assignments[c.id];
    if (filter.startsWith('PRV-')) return assignments[c.id] === filter;
    return true;
  }).sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unread || 0), 0);
  const unassignedCount = conversations.filter(c => !assignments[c.id]).length;

  const selectConversation = (id) => {
    setActiveId(id);
    // Mark messages as read
    const updated = conversations.map(c => {
      if (c.id === id) {
        return { ...c, unread: 0, messages: c.messages.map(m => ({ ...m, read: true })) };
      }
      return c;
    });
    setConversations(updated);
    saveConversations(updated);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const sendReply = () => {
    if (!reply.trim() || !activeId) return;
    const updated = conversations.map(c => {
      if (c.id === activeId) {
        return {
          ...c,
          lastActivity: new Date().toISOString(),
          messages: [...c.messages, {
            id: `m-${Date.now()}`,
            from: 'us',
            text: reply.trim(),
            time: new Date().toISOString(),
            read: true,
            sentBy: currentStaff,
          }],
        };
      }
      return c;
    });
    setConversations(updated);
    saveConversations(updated);
    setReply('');
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const assignConversation = (convId, providerId) => {
    const next = { ...assignments, [convId]: providerId || null };
    setAssignments(next);
    saveAssignments(next);
  };

  const timeAgo = (isoStr) => {
    if (!isoStr) return '';
    const diff = (Date.now() - new Date(isoStr)) / 60000;
    if (diff < 1) return 'now';
    if (diff < 60) return `${Math.floor(diff)}m`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h`;
    return `${Math.floor(diff / 1440)}d`;
  };

  const getProviderName = (id) => {
    const p = providers.find(pr => pr.id === id);
    return p ? p.name.split(',')[0].split(' ').slice(-1)[0] : '?';
  };

  const currentProvName = providers.find(p => p.id === currentStaff)?.name?.split(',')[0] || 'Staff';

  // Quick replies
  const QUICK_REPLIES = [
    'Thanks for reaching out! Let me look into that for you.',
    'Would you like to book a free consultation?',
    'I will check our schedule and get back to you shortly!',
    'Great question! Let me get you the details.',
    'You can book online at our website or I can schedule you right here!',
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h1 style={{ font: `600 26px ${s.FONT}`, color: s.text, marginBottom: 4 }}>DM Inbox</h1>
          <p style={{ font: `400 14px ${s.FONT}`, color: s.text2 }}>
            Instagram + Facebook + TikTok — {totalUnread} unread, {unassignedCount} unassigned
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ font: `400 12px ${s.FONT}`, color: s.text3 }}>Viewing as:</label>
          <select value={currentStaff} onChange={e => setCurrentStaff(e.target.value)} style={{ ...s.input, width: 'auto', padding: '6px 10px', fontSize: 12, cursor: 'pointer' }}>
            {providers.map(p => <option key={p.id} value={p.id}>{p.name.split(',')[0]}</option>)}
          </select>
        </div>
      </div>

      <div className="inbox-grid" style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 0, height: 'calc(100vh - 180px)', ...s.cardStyle, overflow: 'hidden' }}>
        {/* Left: Conversation List */}
        <div className={`inbox-list-panel${active ? ' inbox-has-active' : ''}`} style={{ borderRight: '1px solid #E5E5E5', display: 'flex', flexDirection: 'column' }}>
          {/* Search + Filter */}
          <div style={{ padding: '12px', borderBottom: '1px solid #F0F0F0' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..." style={{ ...s.input, padding: '8px 12px', fontSize: 12, marginBottom: 8 }} />
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {[
                ['all', 'All'],
                ['unread', `Unread (${totalUnread})`],
                ['unassigned', `New (${unassignedCount})`],
              ].map(([id, label]) => (
                <button key={id} onClick={() => setFilter(id)} style={{
                  ...s.pill, padding: '4px 10px', fontSize: 10,
                  background: filter === id ? s.accent : 'transparent',
                  color: filter === id ? s.accentText : s.text3,
                  border: filter === id ? `1px solid ${s.accent}` : '1px solid #E5E5E5',
                }}>{label}</button>
              ))}
              {/* Per-provider filter */}
              {providers.map(p => (
                <button key={p.id} onClick={() => setFilter(p.id)} style={{
                  ...s.pill, padding: '4px 10px', fontSize: 10,
                  background: filter === p.id ? s.accent : 'transparent',
                  color: filter === p.id ? s.accentText : s.text3,
                  border: filter === p.id ? `1px solid ${s.accent}` : '1px solid #E5E5E5',
                }}>{p.name.split(' ')[0]}</button>
              ))}
            </div>
          </div>

          {/* Conversations */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {filtered.map(c => {
              const assigned = assignments[c.id];
              const assignedProv = providers.find(p => p.id === assigned);
              const lastMsg = c.messages[c.messages.length - 1];
              return (
                <div key={c.id} onClick={() => selectConversation(c.id)} style={{
                  padding: '14px 16px', cursor: 'pointer', borderBottom: '1px solid #F8F8F8',
                  background: activeId === c.id ? s.accentLight : c.unread > 0 ? '#FAFAFA' : 'transparent',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (activeId !== c.id) e.currentTarget.style.background = '#FAFAFA'; }}
                onMouseLeave={e => { if (activeId !== c.id) e.currentTarget.style.background = c.unread > 0 ? '#FAFAFA' : 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                      background: c.unread > 0 ? s.accentLight : '#F0F0F0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      font: `500 12px ${s.FONT}`, color: c.unread > 0 ? s.accent : s.text2,
                      position: 'relative',
                    }}>
                      {c.avatar}
                      {c.unread > 0 && (
                        <span style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, borderRadius: '50%', background: s.danger, color: '#fff', font: `600 9px ${s.FONT}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.unread}</span>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                        <span style={{ font: `${c.unread > 0 ? '600' : '400'} 13px ${s.FONT}`, color: s.text }}>{c.name}</span>
                        <span style={{ font: `400 10px ${s.FONT}`, color: s.text3, flexShrink: 0 }}>{timeAgo(c.lastActivity)}</span>
                      </div>
                      <div style={{ font: `400 11px ${s.FONT}`, color: s.text3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {lastMsg?.from === 'us' ? `You: ${lastMsg.text}` : lastMsg?.text}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                        <span style={{ font: `400 10px ${s.FONT}`, color: s.text3 }}>{c.handle}</span>
                        {c.platform === 'facebook' && <span style={{ padding: '1px 5px', borderRadius: 4, background: '#E7F3FF', color: '#1877F2', font: `500 8px ${s.FONT}` }}>FB</span>}
                        {c.platform === 'tiktok' && <span style={{ padding: '1px 5px', borderRadius: 4, background: '#FFF0F5', color: '#FE2C55', font: `500 8px ${s.FONT}` }}>TT</span>}
                        {c.platform === 'instagram' && <span style={{ padding: '1px 5px', borderRadius: 4, background: '#FEF3F8', color: '#E1306C', font: `500 8px ${s.FONT}` }}>IG</span>}
                        {assigned && (
                          <span style={{ padding: '1px 6px', borderRadius: 4, background: '#F0F0F0', font: `500 9px ${s.FONT}`, color: s.text2 }}>
                            {assignedProv?.name?.split(' ')[0] || 'Assigned'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', font: `400 13px ${s.FONT}`, color: s.text3 }}>No conversations</div>
            )}
          </div>
        </div>

        {/* Right: Message Thread */}
        {active ? (
          <div className="inbox-thread-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Thread Header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0F0F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="inbox-back-btn" onClick={() => setActiveId(null)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', color: s.text2, font: `500 13px ${s.FONT}`, padding: '4px 0', marginRight: 4 }}>← Back</button>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: s.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', font: `500 12px ${s.FONT}`, color: s.accent }}>{active.avatar}</div>
                <div>
                  <div style={{ font: `600 14px ${s.FONT}`, color: s.text }}>{active.name}</div>
                  <div style={{ font: `400 11px ${s.FONT}`, color: s.text3 }}>{active.handle} · {active.platform}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <label style={{ font: `400 10px ${s.MONO}`, color: s.text3, textTransform: 'uppercase', letterSpacing: 1 }}>Assign</label>
                <select value={assignments[active.id] || ''} onChange={e => assignConversation(active.id, e.target.value)} style={{ ...s.input, width: 'auto', padding: '5px 8px', fontSize: 11, cursor: 'pointer' }}>
                  <option value="">Unassigned</option>
                  {providers.map(p => <option key={p.id} value={p.id}>{p.name.split(',')[0]}</option>)}
                </select>
                {active.patientId && <span style={{ padding: '3px 8px', borderRadius: 100, background: s.accentLight, color: s.accent, font: `500 10px ${s.FONT}` }}>Patient</span>}
                {!active.patientId && <span style={{ padding: '3px 8px', borderRadius: 100, background: '#FFF7ED', color: s.warning, font: `500 10px ${s.FONT}` }}>New Lead</span>}
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
              {active.messages.map(msg => {
                const isUs = msg.from === 'us';
                const sender = isUs ? providers.find(p => p.id === msg.sentBy) : null;
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isUs ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                    <div style={{ maxWidth: '70%' }}>
                      <div style={{
                        padding: '10px 14px', borderRadius: isUs ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                        background: isUs ? s.accent : '#F0F0F0',
                        color: isUs ? s.accentText : s.text,
                        font: `400 13px ${s.FONT}`, lineHeight: 1.5,
                      }}>
                        {msg.text}
                      </div>
                      <div style={{ font: `400 10px ${s.FONT}`, color: s.text3, marginTop: 4, textAlign: isUs ? 'right' : 'left' }}>
                        {timeAgo(msg.time)} ago
                        {isUs && sender && <span> · {sender.name.split(',')[0].split(' ').pop()}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div style={{ padding: '8px 20px 0', display: 'flex', gap: 4, flexWrap: 'wrap' }}>
              {QUICK_REPLIES.map((qr, i) => (
                <button key={i} onClick={() => setReply(qr)} style={{
                  ...s.pill, padding: '4px 10px', fontSize: 10, background: '#F8F8F8',
                  color: s.text2, border: '1px solid #F0F0F0',
                }}>{qr.slice(0, 40)}{qr.length > 40 ? '...' : ''}</button>
              ))}
            </div>

            {/* Reply Input */}
            <div style={{ padding: '12px 20px', borderTop: '1px solid #F0F0F0', display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <textarea value={reply} onChange={e => setReply(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendReply(); } }} rows={2} style={{ ...s.input, flex: 1, resize: 'none', fontSize: 13 }} placeholder={`Reply as ${currentProvName}...`} />
              <button onClick={sendReply} disabled={!reply.trim()} style={{ ...s.pillAccent, padding: '10px 20px', opacity: reply.trim() ? 1 : 0.4 }}>Send</button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 8 }}>
            <div style={{ font: `400 32px`, color: s.text3 }}>💬</div>
            <div style={{ font: `400 14px ${s.FONT}`, color: s.text3 }}>Select a conversation</div>
            <div style={{ font: `400 12px ${s.FONT}`, color: s.text3 }}>Each staff member sees their assigned DMs</div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .inbox-grid {
            grid-template-columns: 1fr !important;
            height: calc(100vh - 160px) !important;
          }
          .inbox-list-panel {
            border-right: none !important;
          }
          .inbox-list-panel.inbox-has-active {
            display: none !important;
          }
          .inbox-thread-panel {
            grid-column: 1 !important;
          }
          .inbox-back-btn {
            display: inline-flex !important;
          }
        }
      `}</style>
    </div>
  );
}
