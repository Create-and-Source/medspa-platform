// Central localStorage store — all CRUD for the medspa platform
// No backend — everything persists in localStorage for demo purposes

const listeners = new Set();
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
function notify() { listeners.forEach(fn => fn()); }

function get(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; }
}
function set(key, data) { localStorage.setItem(key, JSON.stringify(data)); notify(); }

// ── Patients ──
export function getPatients() { return get('ms_patients', []); }
export function addPatient(p) { const all = getPatients(); p.id = `PAT-${Date.now()}`; p.createdAt = new Date().toISOString(); all.unshift(p); set('ms_patients', all); return p; }
export function updatePatient(id, updates) { const all = getPatients().map(p => p.id === id ? { ...p, ...updates } : p); set('ms_patients', all); }
export function deletePatient(id) { set('ms_patients', getPatients().filter(p => p.id !== id)); }
export function getPatient(id) { return getPatients().find(p => p.id === id) || null; }

// ── Appointments ──
export function getAppointments() { return get('ms_appointments', []); }
export function addAppointment(a) { const all = getAppointments(); a.id = `APT-${Date.now()}`; a.createdAt = new Date().toISOString(); all.push(a); set('ms_appointments', all); return a; }
export function updateAppointment(id, updates) { set('ms_appointments', getAppointments().map(a => a.id === id ? { ...a, ...updates } : a)); }
export function deleteAppointment(id) { set('ms_appointments', getAppointments().filter(a => a.id !== id)); }

// ── Treatment Plans ──
export function getTreatmentPlans() { return get('ms_treatment_plans', []); }
export function addTreatmentPlan(t) { const all = getTreatmentPlans(); t.id = `TP-${Date.now()}`; t.createdAt = new Date().toISOString(); all.unshift(t); set('ms_treatment_plans', all); return t; }
export function updateTreatmentPlan(id, updates) { set('ms_treatment_plans', getTreatmentPlans().map(t => t.id === id ? { ...t, ...updates } : t)); }
export function deleteTreatmentPlan(id) { set('ms_treatment_plans', getTreatmentPlans().filter(t => t.id !== id)); }

// ── Inventory ──
export function getInventory() { return get('ms_inventory', []); }
export function addInventoryItem(item) { const all = getInventory(); item.id = `INV-${Date.now()}`; item.createdAt = new Date().toISOString(); all.unshift(item); set('ms_inventory', all); return item; }
export function updateInventoryItem(id, updates) { set('ms_inventory', getInventory().map(i => i.id === id ? { ...i, ...updates } : i)); }
export function adjustStock(id, qty, reason) {
  const all = getInventory().map(i => {
    if (i.id === id) {
      const log = i.adjustmentLog || [];
      log.push({ qty, reason, date: new Date().toISOString() });
      return { ...i, quantity: Math.max(0, i.quantity + qty), adjustmentLog: log };
    }
    return i;
  });
  set('ms_inventory', all);
}

// ── Emails ──
export function getEmails() { return get('ms_emails', []); }
export function addEmail(e) { const all = getEmails(); e.id = `EM-${Date.now()}`; e.sentDate = new Date().toISOString(); all.unshift(e); set('ms_emails', all); return e; }

// ── Text Messages (SMS) ──
export function getTextMessages() { return get('ms_texts', []); }
export function addTextMessage(t) { const all = getTextMessages(); t.id = `TXT-${Date.now()}`; t.sentDate = new Date().toISOString(); all.unshift(t); set('ms_texts', all); return t; }

// ── Social Media Posts ──
export function getSocialPosts() { return get('ms_social_posts', []); }
export function addSocialPost(p) { const all = getSocialPosts(); p.id = `SP-${Date.now()}`; p.createdAt = new Date().toISOString(); all.unshift(p); set('ms_social_posts', all); return p; }
export function updateSocialPost(id, updates) { set('ms_social_posts', getSocialPosts().map(p => p.id === id ? { ...p, ...updates } : p)); }
export function deleteSocialPost(id) { set('ms_social_posts', getSocialPosts().filter(p => p.id !== id)); }

// ── Retention Alerts ──
export function getRetentionAlerts() { return get('ms_retention_alerts', []); }
export function updateRetentionAlert(id, updates) { set('ms_retention_alerts', getRetentionAlerts().map(a => a.id === id ? { ...a, ...updates } : a)); }

// ── Services ──
export function getServices() { return get('ms_services', []); }
export function addService(s) { const all = getServices(); s.id = `SVC-${Date.now()}`; all.push(s); set('ms_services', all); return s; }
export function updateService(id, updates) { set('ms_services', getServices().map(s => s.id === id ? { ...s, ...updates } : s)); }
export function deleteService(id) { set('ms_services', getServices().filter(s => s.id !== id)); }

// ── Providers ──
export function getProviders() { return get('ms_providers', []); }
export function addProvider(p) { const all = getProviders(); p.id = `PRV-${Date.now()}`; all.push(p); set('ms_providers', all); return p; }
export function updateProvider(id, updates) { set('ms_providers', getProviders().map(p => p.id === id ? { ...p, ...updates } : p)); }

// ── Locations ──
export function getLocations() { return get('ms_locations', []); }
export function addLocation(l) { const all = getLocations(); l.id = `LOC-${Date.now()}`; all.push(l); set('ms_locations', all); return l; }

// ── Before/After Photos ──
export function getPhotos() { return get('ms_photos', []); }
export function addPhoto(p) { const all = getPhotos(); p.id = `PHT-${Date.now()}`; p.createdAt = new Date().toISOString(); all.unshift(p); set('ms_photos', all); return p; }
export function deletePhoto(id) { set('ms_photos', getPhotos().filter(p => p.id !== id)); }

// ── Settings ──
export function getSettings() { return get('ms_settings', {}); }
export function updateSettings(updates) { set('ms_settings', { ...getSettings(), ...updates }); }

// ── Init seed data ──
export function initStore() {
  if (localStorage.getItem('ms_initialized')) return;

  const today = new Date();
  const d = (offset) => { const dt = new Date(today); dt.setDate(dt.getDate() + offset); return dt.toISOString().slice(0, 10); };
  const t = (h, m) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

  // Providers
  set('ms_providers', [
    { id: 'PRV-1', name: 'Dr. Sarah Mitchell', title: 'Medical Director', specialties: ['Botox', 'Fillers', 'PDO Threads'], color: '#111' },
    { id: 'PRV-2', name: 'Jessica Park, NP', title: 'Nurse Practitioner', specialties: ['Botox', 'Fillers', 'Chemical Peels', 'Laser'], color: '#666' },
    { id: 'PRV-3', name: 'Emily Chen, RN', title: 'Aesthetic Nurse', specialties: ['Microneedling', 'IPL', 'HydraFacial', 'Laser'], color: '#999' },
    { id: 'PRV-4', name: 'Dr. Marcus Webb', title: 'Cosmetic Surgeon', specialties: ['Body Contouring', 'Fat Transfer', 'PDO Threads'], color: '#444' },
  ]);

  // Services
  set('ms_services', [
    { id: 'SVC-1', name: 'Botox', category: 'Injectables', duration: 30, price: 1400, unit: 'per unit', description: 'Botulinum toxin for wrinkle reduction' },
    { id: 'SVC-2', name: 'Juvederm Filler', category: 'Injectables', duration: 45, price: 75000, unit: 'per syringe', description: 'Hyaluronic acid dermal filler' },
    { id: 'SVC-3', name: 'Sculptra', category: 'Injectables', duration: 60, price: 95000, unit: 'per vial', description: 'Poly-L-lactic acid collagen stimulator' },
    { id: 'SVC-4', name: 'PDO Threads', category: 'Lifting', duration: 90, price: 250000, unit: 'per session', description: 'Polydioxanone thread lift' },
    { id: 'SVC-5', name: 'RF Microneedling', category: 'Skin', duration: 60, price: 80000, unit: 'per session', description: 'Radiofrequency microneedling for skin tightening' },
    { id: 'SVC-6', name: 'IPL Photofacial', category: 'Skin', duration: 45, price: 45000, unit: 'per session', description: 'Intense pulsed light for pigmentation and redness' },
    { id: 'SVC-7', name: 'Chemical Peel', category: 'Skin', duration: 30, price: 25000, unit: 'per session', description: 'Medical-grade chemical exfoliation' },
    { id: 'SVC-8', name: 'Laser Hair Removal', category: 'Laser', duration: 30, price: 30000, unit: 'per area', description: 'Permanent hair reduction' },
    { id: 'SVC-9', name: 'HydraFacial', category: 'Skin', duration: 45, price: 22000, unit: 'per session', description: 'Multi-step facial cleansing and hydration' },
    { id: 'SVC-10', name: 'IV Therapy', category: 'Wellness', duration: 45, price: 20000, unit: 'per session', description: 'Vitamin and nutrient infusion' },
    { id: 'SVC-11', name: 'Medical Weight Loss', category: 'Wellness', duration: 30, price: 50000, unit: 'per month', description: 'Semaglutide/tirzepatide program' },
    { id: 'SVC-12', name: 'Body Contouring', category: 'Body', duration: 120, price: 350000, unit: 'per session', description: 'Non-surgical fat reduction' },
  ]);

  // Locations
  set('ms_locations', [
    { id: 'LOC-1', name: 'Main Location', address: '4205 N Scottsdale Rd, Suite 6, Scottsdale, AZ 85251', phone: '(480) 555-0100', rooms: ['Treatment Room 1', 'Treatment Room 2', 'VIP Suite', 'Consultation Room'] },
    { id: 'LOC-2', name: 'Flagship', address: '4236 N. Brown Ave, Old Town Scottsdale, AZ', phone: '(480) 555-0200', rooms: ['Suite A', 'Suite B', 'Surgical Suite', 'Recovery Room', 'Consultation'] },
  ]);

  // Patients (30)
  const firstNames = ['Emma', 'Olivia', 'Sophia', 'Ava', 'Isabella', 'Mia', 'Charlotte', 'Amelia', 'Harper', 'Evelyn', 'Abigail', 'Ella', 'Scarlett', 'Grace', 'Chloe', 'Victoria', 'Riley', 'Aria', 'Lily', 'Aubrey', 'Zoe', 'Penelope', 'Layla', 'Nora', 'Camila', 'Hannah', 'Addison', 'Luna', 'Savannah', 'Brooklyn'];
  const lastNames = ['Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White', 'Lopez', 'Lee', 'Gonzalez', 'Harris', 'Clark', 'Lewis', 'Robinson', 'Walker', 'Perez', 'Hall', 'Young', 'Allen'];
  const patients = firstNames.map((fn, i) => ({
    id: `PAT-${1000 + i}`,
    firstName: fn,
    lastName: lastNames[i],
    email: `${fn.toLowerCase()}.${lastNames[i].toLowerCase()}@email.com`,
    phone: `(480) 555-${String(1000 + i).slice(1)}`,
    dob: `${1970 + Math.floor(Math.random() * 30)}-${String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, '0')}`,
    gender: ['Female', 'Female', 'Female', 'Male'][Math.floor(Math.random() * 4)],
    allergies: Math.random() > 0.7 ? 'Latex' : '',
    notes: '',
    membershipTier: ['None', 'None', 'Silver', 'Gold', 'Platinum'][Math.floor(Math.random() * 5)],
    totalSpent: Math.floor(Math.random() * 2000000),
    visitCount: Math.floor(1 + Math.random() * 20),
    lastVisit: d(-Math.floor(Math.random() * 120)),
    createdAt: d(-Math.floor(30 + Math.random() * 365)),
    location: Math.random() > 0.4 ? 'LOC-1' : 'LOC-2',
  }));
  set('ms_patients', patients);

  // Appointments (next 14 days + past 7 days)
  const svcIds = ['SVC-1', 'SVC-2', 'SVC-3', 'SVC-5', 'SVC-6', 'SVC-7', 'SVC-8', 'SVC-9', 'SVC-10', 'SVC-11'];
  const provIds = ['PRV-1', 'PRV-2', 'PRV-3', 'PRV-4'];
  const statuses = ['confirmed', 'confirmed', 'confirmed', 'pending', 'completed'];
  const appts = [];
  for (let dayOff = -7; dayOff <= 14; dayOff++) {
    const numAppts = 3 + Math.floor(Math.random() * 6);
    for (let j = 0; j < numAppts; j++) {
      const hour = 9 + Math.floor(Math.random() * 8);
      const min = [0, 15, 30, 45][Math.floor(Math.random() * 4)];
      const pat = patients[Math.floor(Math.random() * patients.length)];
      const svc = svcIds[Math.floor(Math.random() * svcIds.length)];
      const prov = provIds[Math.floor(Math.random() * provIds.length)];
      const status = dayOff < 0 ? 'completed' : statuses[Math.floor(Math.random() * statuses.length)];
      appts.push({
        id: `APT-${2000 + appts.length}`,
        patientId: pat.id,
        patientName: `${pat.firstName} ${pat.lastName}`,
        serviceId: svc,
        providerId: prov,
        date: d(dayOff),
        time: t(hour, min),
        duration: [30, 45, 60, 90][Math.floor(Math.random() * 4)],
        status,
        location: Math.random() > 0.4 ? 'LOC-1' : 'LOC-2',
        room: `Treatment Room ${1 + Math.floor(Math.random() * 3)}`,
        notes: '',
        createdAt: new Date().toISOString(),
      });
    }
  }
  set('ms_appointments', appts);

  // Treatment Plans
  const plans = [
    { id: 'TP-1', patientId: 'PAT-1000', patientName: 'Emma Johnson', name: 'Anti-Aging Protocol', sessions: [
      { serviceId: 'SVC-1', name: 'Botox - Forehead & Crows Feet', status: 'completed', date: d(-60), notes: '28 units total' },
      { serviceId: 'SVC-2', name: 'Juvederm - Nasolabial Folds', status: 'completed', date: d(-45), notes: '1 syringe each side' },
      { serviceId: 'SVC-5', name: 'RF Microneedling - Full Face', status: 'completed', date: d(-20), notes: 'Setting 3, good response' },
      { serviceId: 'SVC-1', name: 'Botox Touch-up', status: 'upcoming', date: d(5), notes: '' },
      { serviceId: 'SVC-5', name: 'RF Microneedling #2', status: 'upcoming', date: d(25), notes: '' },
      { serviceId: 'SVC-5', name: 'RF Microneedling #3', status: 'upcoming', date: d(55), notes: '' },
    ], createdAt: d(-65), providerId: 'PRV-1' },
    { id: 'TP-2', patientId: 'PAT-1003', patientName: 'Ava Jones', name: 'Skin Rejuvenation Series', sessions: [
      { serviceId: 'SVC-6', name: 'IPL Photofacial #1', status: 'completed', date: d(-30), notes: 'Sun damage treatment' },
      { serviceId: 'SVC-6', name: 'IPL Photofacial #2', status: 'completed', date: d(-10), notes: 'Good clearing' },
      { serviceId: 'SVC-6', name: 'IPL Photofacial #3', status: 'upcoming', date: d(10), notes: '' },
      { serviceId: 'SVC-7', name: 'Chemical Peel - Maintenance', status: 'upcoming', date: d(30), notes: '' },
    ], createdAt: d(-35), providerId: 'PRV-2' },
    { id: 'TP-3', patientId: 'PAT-1007', patientName: 'Amelia Thompson', name: 'Weight Loss Program', sessions: [
      { serviceId: 'SVC-11', name: 'Month 1 - Semaglutide 0.25mg', status: 'completed', date: d(-28), notes: 'Starting dose, -3lbs' },
      { serviceId: 'SVC-11', name: 'Month 2 - Semaglutide 0.5mg', status: 'in-progress', date: d(0), notes: 'Dose increase' },
      { serviceId: 'SVC-11', name: 'Month 3 - Semaglutide 1.0mg', status: 'upcoming', date: d(28), notes: '' },
      { serviceId: 'SVC-11', name: 'Month 4 - Maintenance', status: 'upcoming', date: d(56), notes: '' },
    ], createdAt: d(-30), providerId: 'PRV-1' },
  ];
  set('ms_treatment_plans', plans);

  // Inventory (injectables + products)
  set('ms_inventory', [
    { id: 'INV-1', name: 'Botox (100u vial)', category: 'Injectables', sku: 'BTX-100', quantity: 24, reorderAt: 10, unitCost: 42000, location: 'LOC-1', expirationDate: d(180), adjustmentLog: [] },
    { id: 'INV-2', name: 'Juvederm Ultra XC', category: 'Injectables', sku: 'JUV-UXC', quantity: 18, reorderAt: 8, unitCost: 28000, location: 'LOC-1', expirationDate: d(365), adjustmentLog: [] },
    { id: 'INV-3', name: 'Juvederm Voluma XC', category: 'Injectables', sku: 'JUV-VXC', quantity: 12, reorderAt: 6, unitCost: 32000, location: 'LOC-1', expirationDate: d(300), adjustmentLog: [] },
    { id: 'INV-4', name: 'Sculptra (2 vial kit)', category: 'Injectables', sku: 'SLP-2V', quantity: 8, reorderAt: 4, unitCost: 45000, location: 'LOC-1', expirationDate: d(540), adjustmentLog: [] },
    { id: 'INV-5', name: 'PDO Threads - Smooth (20pk)', category: 'Injectables', sku: 'PDO-SM20', quantity: 6, reorderAt: 3, unitCost: 18000, location: 'LOC-1', expirationDate: d(365), adjustmentLog: [] },
    { id: 'INV-6', name: 'PDO Threads - Cog (10pk)', category: 'Injectables', sku: 'PDO-CG10', quantity: 4, reorderAt: 2, unitCost: 35000, location: 'LOC-1', expirationDate: d(365), adjustmentLog: [] },
    { id: 'INV-7', name: 'Semaglutide 2.4mg/0.75ml', category: 'Wellness', sku: 'SEM-24', quantity: 30, reorderAt: 10, unitCost: 25000, location: 'LOC-1', expirationDate: d(90), adjustmentLog: [] },
    { id: 'INV-8', name: 'Tirzepatide 5mg/0.5ml', category: 'Wellness', sku: 'TRZ-5', quantity: 20, reorderAt: 8, unitCost: 30000, location: 'LOC-1', expirationDate: d(90), adjustmentLog: [] },
    { id: 'INV-9', name: 'Lidocaine 2% (50ml)', category: 'Supplies', sku: 'LID-50', quantity: 40, reorderAt: 15, unitCost: 1500, location: 'LOC-1', expirationDate: d(365), adjustmentLog: [] },
    { id: 'INV-10', name: 'SkinMedica TNS Serum', category: 'Retail', sku: 'SM-TNS', quantity: 15, reorderAt: 5, unitCost: 13000, location: 'LOC-1', expirationDate: d(730), adjustmentLog: [] },
    { id: 'INV-11', name: 'EltaMD UV Clear SPF 46', category: 'Retail', sku: 'EM-UVC', quantity: 25, reorderAt: 10, unitCost: 2400, location: 'LOC-1', expirationDate: d(730), adjustmentLog: [] },
    { id: 'INV-12', name: 'Latisse 5ml', category: 'Retail', sku: 'LAT-5', quantity: 12, reorderAt: 5, unitCost: 9000, location: 'LOC-1', expirationDate: d(365), adjustmentLog: [] },
    { id: 'INV-13', name: 'Microneedling Tips (box of 10)', category: 'Supplies', sku: 'MN-T10', quantity: 8, reorderAt: 4, unitCost: 12000, location: 'LOC-1', expirationDate: d(730), adjustmentLog: [] },
    { id: 'INV-14', name: 'Botox (100u vial)', category: 'Injectables', sku: 'BTX-100-F', quantity: 16, reorderAt: 8, unitCost: 42000, location: 'LOC-2', expirationDate: d(180), adjustmentLog: [] },
    { id: 'INV-15', name: 'Juvederm Ultra XC', category: 'Injectables', sku: 'JUV-UXC-F', quantity: 10, reorderAt: 5, unitCost: 28000, location: 'LOC-2', expirationDate: d(365), adjustmentLog: [] },
  ]);

  // Retention Alerts (auto-generated from patient data)
  const alerts = [];
  patients.forEach(p => {
    const daysSince = Math.floor((today - new Date(p.lastVisit)) / (1000 * 60 * 60 * 24));
    if (daysSince > 80) {
      const services = ['Botox', 'Filler', 'HydraFacial', 'IPL', 'Microneedling'];
      const svc = services[Math.floor(Math.random() * services.length)];
      alerts.push({
        id: `RET-${alerts.length}`,
        patientId: p.id,
        patientName: `${p.firstName} ${p.lastName}`,
        lastVisit: p.lastVisit,
        daysSince,
        lastService: svc,
        suggestedAction: daysSince > 100 ? `${svc} follow-up overdue — send re-engagement` : `Time for ${svc} maintenance`,
        priority: daysSince > 100 ? 'high' : 'medium',
        status: 'pending',
        contacted: false,
      });
    }
  });
  set('ms_retention_alerts', alerts);

  // Social media connections
  set('ms_social_connections', { instagram: true, facebook: true, x: false, linkedin: false, tiktok: false });

  // Settings
  set('ms_settings', {
    businessName: 'Your MedSpa',
    tagline: 'Where Science Meets Beauty',
    email: 'info@yourmedspa.com',
    phone: '(480) 555-0100',
  });

  localStorage.setItem('ms_initialized', 'true');
}
