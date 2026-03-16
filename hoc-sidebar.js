// Shared sidebar renderer — Haus of Confidence
const HOC_LOCATIONS = [
  { id: 'scottsdale-main', name: 'Old Town — Winfield Scott', address: '4205 N Winfield Scott Plaza, Suite 6', city: 'Scottsdale, AZ 85251', type: 'Medspa' },
  { id: 'scottsdale-flagship', name: 'Old Town — Brown Ave', address: '4236 N. Brown Ave', city: 'Scottsdale, AZ', type: 'Surgical & Regenerative' },
];

function getActiveLocation() {
  return localStorage.getItem('hoc_location') || HOC_LOCATIONS[0].id;
}
function setActiveLocation(id) {
  localStorage.setItem('hoc_location', id);
  location.reload();
}
function getLocationName(id) {
  const loc = HOC_LOCATIONS.find(l => l.id === id);
  return loc ? loc.name : HOC_LOCATIONS[0].name;
}

function renderSidebar(activePage) {
  const pages = [
    { section: 'Operations', items: [
      { href: 'app.html', icon: 'nd', label: 'Dashboard' },
      { href: 'app.html#appointments', icon: 'nsq', label: 'Appointments' },
      { href: 'app.html#patients', icon: 'nsq round', label: 'Patients' },
    ]},
    { section: 'Clinical', items: [
      { href: 'charting.html', icon: 'nsq', label: 'Charting & SOAP' },
      { href: 'app.html#photos', icon: 'nsq', label: 'Before & After' },
    ]},
    { section: 'Revenue', items: [
      { href: 'memberships.html', icon: 'nsq', label: 'Memberships' },
      { href: 'app.html#payments', icon: 'nsq rect', label: 'Payments' },
    ]},
    { section: 'Business', items: [
      { href: 'analytics.html', icon: 'nsq', label: 'Analytics' },
      { href: 'inventory.html', icon: 'nsq', label: 'Inventory' },
      { href: 'app.html#messages', icon: 'nsq round', label: 'Messages', badge: '5' },
    ]},
    { section: 'Settings', items: [
      { href: 'settings.html', icon: 'nsq', label: 'Settings' },
    ]},
    { section: 'Patient Tools', items: [
      { href: 'booking.html', icon: 'nsq', label: 'Online Booking ↗', target: '_blank' },
      { href: 'patient-portal.html', icon: 'nsq', label: 'Patient Portal ↗', target: '_blank' },
      { href: 'app.html#kiosk', icon: 'nsq', label: 'Patient Check-In' },
    ]},
  ];

  const activeLoc = getActiveLocation();
  const locOptions = HOC_LOCATIONS.map(l =>
    `<option value="${l.id}"${l.id === activeLoc ? ' selected' : ''}>${l.name}</option>`
  ).join('');

  let html = `<div class="sidebar">
    <div class="sb-brand">
      <div class="sb-logo">Haus of Confidence</div>
      <div class="sb-tag">A Premier Medspa</div>
    </div>
    <div class="sb-loc">
      <div class="sb-loc-label">Location</div>
      <select onchange="setActiveLocation(this.value)">${locOptions}</select>
    </div>
    <div style="flex:1;overflow-y:auto;padding-top:.3rem;">`;

  for (const section of pages) {
    html += `<div class="ns">${section.section}</div>`;
    for (const item of section.items) {
      const isActive = activePage === item.href;
      const iconClass = item.icon === 'nd' ? 'nd' : 'nsq';
      const iconStyle = item.icon.includes('round') ? 'border-radius:50%;' : item.icon.includes('rect') ? 'border-radius:2px;' : '';
      html += `<a class="ni${isActive?' active':''}" href="${item.href}"${item.target?` target="${item.target}"`:''}>
        <div class="${iconClass}" style="${iconStyle}"></div>${item.label}
        ${item.badge ? `<span class="nbadge">${item.badge}</span>` : ''}
      </a>`;
    }
  }

  html += `</div>
    <div class="sb-rep">✦ Replaces Clover + Boulevard + EHR + SMS</div>
    <div class="sb-user"><div class="sb-uname">Sara Ameli</div><div class="sb-ucred">DNP, FNP-C · Founder</div></div>
  </div>`;
  return html;
}
