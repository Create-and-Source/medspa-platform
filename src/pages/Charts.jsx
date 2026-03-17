// Clinical Charts — SOAP notes, injection maps, treatment documentation
import { useState, useEffect, useRef, useCallback } from 'react';
import { useStyles } from '../theme';
import { getPatients, getServices, getProviders, subscribe } from '../data/store';

const CHARTS_KEY = 'ms_charts';
function getCharts() { try { return JSON.parse(localStorage.getItem(CHARTS_KEY)) || []; } catch { return []; } }
function saveCharts(c) { localStorage.setItem(CHARTS_KEY, JSON.stringify(c)); }

// ── Zone definitions ──────────────────────────────────────────────────────────

const FACE_ZONES = [
  { id: 'forehead', label: 'Forehead', x: 50, y: 15 },
  { id: 'glabella', label: 'Glabella (11s)', x: 50, y: 22 },
  { id: 'crow-l', label: 'Crows Feet L', x: 28, y: 28 },
  { id: 'crow-r', label: 'Crows Feet R', x: 72, y: 28 },
  { id: 'brow-l', label: 'Brow L', x: 34, y: 25 },
  { id: 'brow-r', label: 'Brow R', x: 66, y: 25 },
  { id: 'temple-l', label: 'Temple L', x: 22, y: 22 },
  { id: 'temple-r', label: 'Temple R', x: 78, y: 22 },
  { id: 'cheek-l', label: 'Cheek L', x: 32, y: 45 },
  { id: 'cheek-r', label: 'Cheek R', x: 68, y: 45 },
  { id: 'naso-l', label: 'Nasolabial L', x: 38, y: 52 },
  { id: 'naso-r', label: 'Nasolabial R', x: 62, y: 52 },
  { id: 'lips-upper', label: 'Upper Lip', x: 50, y: 58 },
  { id: 'lips-lower', label: 'Lower Lip', x: 50, y: 63 },
  { id: 'marionette-l', label: 'Marionette L', x: 40, y: 68 },
  { id: 'marionette-r', label: 'Marionette R', x: 60, y: 68 },
  { id: 'chin', label: 'Chin', x: 50, y: 73 },
  { id: 'jawline-l', label: 'Jawline L', x: 28, y: 62 },
  { id: 'jawline-r', label: 'Jawline R', x: 72, y: 62 },
  { id: 'neck', label: 'Neck', x: 50, y: 85 },
];

const BODY_ZONES = [
  { id: 'chin-neck', label: 'Chin / Neck', x: 50, y: 8 },
  { id: 'chest', label: 'Chest', x: 50, y: 18 },
  { id: 'arm-l', label: 'Left Arm', x: 18, y: 30 },
  { id: 'arm-r', label: 'Right Arm', x: 82, y: 30 },
  { id: 'abdomen', label: 'Abdomen', x: 50, y: 34 },
  { id: 'flank-l', label: 'Left Flank', x: 28, y: 38 },
  { id: 'flank-r', label: 'Right Flank', x: 72, y: 38 },
  { id: 'back', label: 'Back', x: 50, y: 45 },
  { id: 'buttocks', label: 'Buttocks', x: 50, y: 54 },
  { id: 'thigh-l', label: 'Left Thigh', x: 36, y: 66 },
  { id: 'thigh-r', label: 'Right Thigh', x: 64, y: 66 },
  { id: 'knee-l', label: 'Left Knee', x: 38, y: 78 },
  { id: 'knee-r', label: 'Right Knee', x: 62, y: 78 },
];

const SCALP_ZONES = [
  { id: 'frontal', label: 'Frontal', x: 50, y: 18 },
  { id: 'temporal-l', label: 'Temporal L', x: 18, y: 40 },
  { id: 'temporal-r', label: 'Temporal R', x: 82, y: 40 },
  { id: 'crown', label: 'Crown', x: 50, y: 42 },
  { id: 'vertex', label: 'Vertex', x: 50, y: 60 },
  { id: 'occipital', label: 'Occipital', x: 50, y: 80 },
];

// ── Map type resolver ─────────────────────────────────────────────────────────

function getMapType(serviceId, services) {
  if (!serviceId) return 'face'; // default
  const svc = services.find(s => s.id === serviceId);
  if (!svc) return 'face';

  // Hair Restoration specifically
  if (serviceId === 'SVC-25') return 'scalp';

  const cat = (svc.category || '').toLowerCase();

  // Face-oriented services
  if (['injectables', 'injectable', 'skin', 'lifting', 'laser'].includes(cat)) return 'face';

  // Body services
  if (['body', 'surgical'].includes(cat)) return 'body';

  // No-map services: Wellness (IV, HRT, Weight Loss), Consultation, Packages
  if (['wellness', 'consultation', 'packages'].includes(cat)) return 'none';

  return 'face';
}

function getZonesForType(mapType) {
  if (mapType === 'face') return FACE_ZONES;
  if (mapType === 'body') return BODY_ZONES;
  if (mapType === 'scalp') return SCALP_ZONES;
  return [];
}

function getMapLabel(mapType) {
  if (mapType === 'face') return 'Injection Map';
  if (mapType === 'body') return 'Treatment Zones';
  if (mapType === 'scalp') return 'Scalp Map';
  return null;
}

// ── SVG outlines ──────────────────────────────────────────────────────────────

function FaceSVG() {
  return (
    <svg viewBox="0 0 200 260" style={{ width: '100%', height: '100%', position: 'absolute' }}>
      <ellipse cx="100" cy="110" rx="72" ry="90" fill="none" stroke="#DDD" strokeWidth="1.5" />
      <ellipse cx="70" cy="85" rx="10" ry="6" fill="none" stroke="#DDD" strokeWidth="1" />
      <ellipse cx="130" cy="85" rx="10" ry="6" fill="none" stroke="#DDD" strokeWidth="1" />
      <path d="M90 120 Q100 130 110 120" fill="none" stroke="#DDD" strokeWidth="1" />
      <path d="M85 150 Q100 165 115 150" fill="none" stroke="#DDD" strokeWidth="1" />
      <line x1="100" y1="200" x2="100" y2="240" stroke="#DDD" strokeWidth="1" />
    </svg>
  );
}

function BodySVG() {
  return (
    <svg viewBox="0 0 200 320" style={{ width: '100%', height: '100%', position: 'absolute' }}>
      {/* Head */}
      <ellipse cx="100" cy="20" rx="16" ry="18" fill="none" stroke="#DDD" strokeWidth="1.5" />
      {/* Neck */}
      <line x1="94" y1="38" x2="94" y2="48" stroke="#DDD" strokeWidth="1" />
      <line x1="106" y1="38" x2="106" y2="48" stroke="#DDD" strokeWidth="1" />
      {/* Torso */}
      <path d="M94 48 L70 52 L60 80 L58 130 L68 160 L78 170 L78 170" fill="none" stroke="#DDD" strokeWidth="1.5" />
      <path d="M106 48 L130 52 L140 80 L142 130 L132 160 L122 170 L122 170" fill="none" stroke="#DDD" strokeWidth="1.5" />
      {/* Waist / hip line */}
      <path d="M78 170 Q100 178 122 170" fill="none" stroke="#DDD" strokeWidth="1" />
      {/* Left arm */}
      <path d="M70 52 L48 68 L32 110 L28 140 L34 142 L44 112 L60 80" fill="none" stroke="#DDD" strokeWidth="1.2" />
      {/* Right arm */}
      <path d="M130 52 L152 68 L168 110 L172 140 L166 142 L156 112 L140 80" fill="none" stroke="#DDD" strokeWidth="1.2" />
      {/* Left leg */}
      <path d="M78 170 L76 210 L74 250 L70 290 L64 300 L80 300 L78 290 L82 250 L84 210 L88 170" fill="none" stroke="#DDD" strokeWidth="1.2" />
      {/* Right leg */}
      <path d="M112 170 L116 210 L118 250 L122 290 L120 300 L136 300 L130 290 L126 250 L124 210 L122 170" fill="none" stroke="#DDD" strokeWidth="1.2" />
      {/* Center line (subtle) */}
      <line x1="100" y1="48" x2="100" y2="170" stroke="#EEE" strokeWidth="0.5" strokeDasharray="4 3" />
    </svg>
  );
}

function ScalpSVG() {
  return (
    <svg viewBox="0 0 200 260" style={{ width: '100%', height: '100%', position: 'absolute' }}>
      {/* Top-down head outline */}
      <ellipse cx="100" cy="120" rx="75" ry="90" fill="none" stroke="#DDD" strokeWidth="1.5" />
      {/* Ear bumps */}
      <ellipse cx="24" cy="130" rx="8" ry="16" fill="none" stroke="#DDD" strokeWidth="1" />
      <ellipse cx="176" cy="130" rx="8" ry="16" fill="none" stroke="#DDD" strokeWidth="1" />
      {/* Hairline guide */}
      <path d="M45 60 Q100 30 155 60" fill="none" stroke="#E5E5E5" strokeWidth="1" strokeDasharray="4 3" />
      {/* Region dividers (subtle) */}
      <line x1="100" y1="40" x2="100" y2="210" stroke="#EEE" strokeWidth="0.5" strokeDasharray="4 3" />
      <line x1="35" y1="120" x2="165" y2="120" stroke="#EEE" strokeWidth="0.5" strokeDasharray="4 3" />
      {/* Crown circle marker */}
      <circle cx="100" cy="110" r="18" fill="none" stroke="#E8E8E8" strokeWidth="0.8" strokeDasharray="3 3" />
    </svg>
  );
}

// ── Vitals & Measurements panel (for no-map services) ─────────────────────────

function VitalsPanel({ form, setForm, s }) {
  const measurements = form.measurements || { weight: '', bmi: '', waistCircumference: '', measurementNotes: '' };

  const updateMeasurement = (key, value) => {
    setForm({ ...form, measurements: { ...measurements, [key]: value } });
  };

  return (
    <div>
      <label style={{ ...s.label, marginBottom: 12 }}>Vitals & Measurements</label>
      <div style={{ background: '#FAFAFA', borderRadius: 12, border: '1px solid #E5E5E5', padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          <div>
            <label style={{ ...s.label, fontSize: 11 }}>Weight (lbs)</label>
            <input
              value={measurements.weight || ''}
              onChange={e => updateMeasurement('weight', e.target.value)}
              style={s.input}
              placeholder="e.g., 178"
            />
          </div>
          <div>
            <label style={{ ...s.label, fontSize: 11 }}>BMI</label>
            <input
              value={measurements.bmi || ''}
              onChange={e => updateMeasurement('bmi', e.target.value)}
              style={s.input}
              placeholder="e.g., 28.7"
            />
          </div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ ...s.label, fontSize: 11 }}>Waist Circumference (in)</label>
          <input
            value={measurements.waistCircumference || ''}
            onChange={e => updateMeasurement('waistCircumference', e.target.value)}
            style={s.input}
            placeholder="e.g., 36"
          />
        </div>
        <div>
          <label style={{ ...s.label, fontSize: 11 }}>Measurement Notes</label>
          <textarea
            value={measurements.measurementNotes || ''}
            onChange={e => updateMeasurement('measurementNotes', e.target.value)}
            rows={4}
            style={{ ...s.input, resize: 'vertical', lineHeight: 1.6 }}
            placeholder="Body composition notes, progress observations, dosage adjustments..."
          />
        </div>
      </div>
    </div>
  );
}

// ── Seed data ─────────────────────────────────────────────────────────────────

function initCharts() {
  // Always reseed if empty or only has old 3 charts
  const existing = getCharts();
  if (existing.length >= 8) return;
  localStorage.removeItem('ms_charts_init');
  saveCharts([
    {
      id: 'CHT-1', patientId: 'PAT-1000', patientName: 'Emma Johnson', providerId: 'PRV-1',
      date: '2026-03-10', serviceId: 'SVC-1', serviceName: 'Botox',
      mapType: 'face',
      subjective: 'Patient presents for routine Botox. Concerned about forehead lines deepening and early crows feet. No new medications. Denies pregnancy. Last Botox 4 months ago — satisfied with results but wants slightly heavier dose on forehead this time.',
      objective: 'Moderate dynamic rhytids across forehead. Moderate glabellar lines (11s). Mild-moderate crows feet bilateral. Mild bunny lines noted. Skin in good condition, well-hydrated.',
      assessment: 'Excellent candidate for neuromodulator treatment. Forehead, glabella, lateral canthal lines, and bunny lines.',
      plan: '38 units Botox total: 12 units forehead (6 injection sites), 14 units glabella (5 sites), 8 units crows feet (3 sites bilateral), 4 units bunny lines (2 sites). Follow up 2 weeks for assessment. Discuss nasolabial filler at follow-up.',
      injectionMap: { forehead: '12u BTX', glabella: '14u BTX', 'crow-l': '4u BTX', 'crow-r': '4u BTX', 'brow-l': '2u lift', 'brow-r': '2u lift' },
      vitals: { bp: '118/76', pulse: '72', temp: '98.6' },
      medications: 'None',
      status: 'signed',
      createdAt: '2026-03-10T10:30:00Z',
    },
    {
      id: 'CHT-2', patientId: 'PAT-1001', patientName: 'Olivia Williams', providerId: 'PRV-1',
      date: '2026-03-11', serviceId: 'SVC-2', serviceName: 'Juvederm Filler',
      mapType: 'face',
      subjective: 'Patient desires volume restoration to nasolabial folds and cheeks. Reports looking "tired and hollow." No previous filler. No allergies. Not pregnant. Stopped fish oil 7 days ago as instructed.',
      objective: 'Moderate volume loss bilateral malar region. Deep nasolabial folds. Mild marionette lines. Mild jowling. Skin type II, good elasticity for age.',
      assessment: 'Candidate for HA filler. Recommend cheek volumization with Voluma followed by Juvederm Ultra for nasolabial folds. Vascular anatomy reviewed — no contraindications.',
      plan: '2 syringes Juvederm Voluma XC bilateral cheeks (1 per side, deep injection supraperiosteal). 1 syringe Juvederm Ultra XC bilateral nasolabial folds. Aspiration before injection. Ice post-procedure. Return 2 weeks for assessment, may need touch-up. Emergency protocol reviewed with patient (vascular occlusion signs).',
      injectionMap: { 'cheek-l': '1 syr Voluma', 'cheek-r': '1 syr Voluma', 'naso-l': '0.5 syr Ultra', 'naso-r': '0.5 syr Ultra' },
      vitals: { bp: '124/80', pulse: '76', temp: '98.4' },
      medications: 'Lisinopril 10mg daily',
      status: 'signed',
      createdAt: '2026-03-11T11:00:00Z',
    },
    {
      id: 'CHT-3', patientId: 'PAT-1003', patientName: 'Ava Jones', providerId: 'PRV-2',
      date: '2026-03-12', serviceId: 'SVC-6', serviceName: 'IPL Photofacial',
      mapType: 'face',
      subjective: 'Follow-up IPL session 3 of 3. Reports significant improvement in sun spots after sessions 1 and 2. No adverse reactions. Wearing SPF 50 daily as instructed.',
      objective: 'Marked improvement in pigmentation bilateral cheeks and nose. Remaining focal hyperpigmentation left cheekbone. Skin texture improved. No scarring or hypopigmentation from prior sessions.',
      assessment: 'Excellent response to IPL series. Final session of planned protocol. Recommend maintenance every 6 months.',
      plan: 'IPL treatment bilateral cheeks, nose, and chin. Settings: 560nm filter, 15J/cm2, 3ms pulse, double pass on residual pigment left cheek. Post-care: SPF 50 daily, avoid sun exposure 2 weeks, gentle cleanser only for 48 hours. Follow up 4 weeks for final assessment. Discuss maintenance schedule.',
      injectionMap: { 'cheek-l': 'IPL 2x pass', 'cheek-r': 'IPL 1x', chin: 'IPL 1x' },
      vitals: { bp: '122/78', pulse: '68', temp: '98.4' },
      medications: 'Tretinoin 0.025% (paused 1 week pre-treatment)',
      status: 'signed',
      createdAt: '2026-03-12T14:00:00Z',
    },
    {
      id: 'CHT-4', patientId: 'PAT-1002', patientName: 'Sophia Brown', providerId: 'PRV-3',
      date: '2026-03-13', serviceId: 'SVC-28', serviceName: 'Morpheus8',
      mapType: 'face',
      subjective: 'Session 2 of Morpheus8 series for acne scarring. Tolerated first session well with mild redness for 3 days. Reports noticeably smoother texture already. Taking antiviral prophylaxis as prescribed.',
      objective: 'Healing well from session 1. Ice pick and boxcar scars bilateral cheeks improving. Skin well-hydrated. No post-inflammatory hyperpigmentation.',
      assessment: 'Excellent response. Continue RF microneedling protocol. Increase depth on deeper scars per patient tolerance.',
      plan: 'Morpheus8 full face: depth 3.0mm bilateral cheeks (increased from 2.5mm), 2.0mm forehead, 1.5mm perioral. 24 pin tip. RF energy level 5. Topical numbing 45 min prior (BLT 20/6/4). Post-care: HA serum, gentle cleanser, SPF 50. Avoid retinoids, exfoliants, and makeup 5 days. Session 3 in 4 weeks.',
      injectionMap: { 'cheek-l': '3.0mm depth', 'cheek-r': '3.0mm depth', forehead: '2.0mm', chin: '1.5mm' },
      vitals: { bp: '110/70', pulse: '74', temp: '98.6' },
      medications: 'Valacyclovir 500mg BID (prophylaxis)',
      status: 'signed',
      createdAt: '2026-03-13T09:00:00Z',
    },
    {
      id: 'CHT-5', patientId: 'PAT-1004', patientName: 'Isabella Martinez', providerId: 'PRV-1',
      date: '2026-03-14', serviceId: 'SVC-4', serviceName: 'PDO Threads',
      mapType: 'face',
      subjective: 'Patient presents for PDO thread lift consultation and treatment. Concerns: jowling, loss of jawline definition, mild neck laxity. Desires non-surgical lift. Not ready for facelift. No blood thinners. Stopped supplements 10 days ago.',
      objective: 'Moderate jowling bilateral. Loss of jawline definition. Mild platysmal banding. Moderate skin laxity lower face. Good skin thickness — appropriate for thread placement. Fitzpatrick III.',
      assessment: 'Good candidate for PDO cog thread lift bilateral jawline and lower face. Will provide significant lift with collagen stimulation over 3-6 months.',
      plan: '8 PDO cog threads bilateral jawline (4 per side). 4 smooth threads bilateral marionette area. Entry points: preauricular and temporal. Lidocaine 1% with epi for local anesthesia. Mark vectors with patient upright before reclining. Post-care: sleep on back elevated 1 week, soft diet 2 days, no dental work 2 weeks, no massage or pressure on face. Follow up 1 week then 1 month.',
      injectionMap: { 'jawline-l': '4 cog threads', 'jawline-r': '4 cog threads', 'marionette-l': '2 smooth', 'marionette-r': '2 smooth', 'temple-l': 'entry point', 'temple-r': 'entry point' },
      vitals: { bp: '128/82', pulse: '70', temp: '98.6' },
      medications: 'Levothyroxine 50mcg daily',
      status: 'signed',
      createdAt: '2026-03-14T13:00:00Z',
    },
    {
      id: 'CHT-6', patientId: 'PAT-1007', patientName: 'Amelia Thompson', providerId: 'PRV-4',
      date: '2026-03-14', serviceId: 'SVC-15', serviceName: 'Awake Liposuction',
      mapType: 'body',
      subjective: 'Pre-operative consultation and procedure for awake liposuction of bilateral flanks and lower abdomen. Patient is 5\'6", 148 lbs, BMI 23.9. Has been stable at this weight for 6+ months. Diet and exercise resistant fat deposits. Non-smoker. No bleeding disorders. Clearance from PCP obtained.',
      objective: 'Bilateral flank lipodystrophy with moderate pinch test. Lower abdominal adiposity below umbilicus. Good skin elasticity — expect adequate retraction. No hernias palpated. Markings placed with patient standing.',
      assessment: 'Excellent candidate for tumescent liposuction under local anesthesia. Estimated 1200-1500cc total aspirate. BodyTite RF-assisted for skin tightening adjunct.',
      plan: 'Tumescent infiltration bilateral flanks and lower abdomen (Klein solution: 1L NS + 50cc 1% lido + 1mg epi per bag). Power-assisted liposuction (PAL) with 3.7mm cannula. BodyTite internal RF probe for skin tightening post-aspiration. Total aspirate: 700cc right flank, 650cc left flank, 450cc lower abdomen. Compression garment 6 weeks. Drain placement bilateral if >500cc per side. Post-op: ambulate same day, light activity 1 week, full activity 4 weeks. Follow up 1 day, 1 week, 1 month, 3 months.',
      injectionMap: { 'flank-l': '650cc aspirate', 'flank-r': '700cc aspirate', abdomen: '450cc aspirate' },
      vitals: { bp: '120/74', pulse: '68', temp: '98.6' },
      medications: 'Oral contraceptive (Yaz)',
      status: 'signed',
      createdAt: '2026-03-14T08:00:00Z',
    },
    {
      id: 'CHT-7', patientId: 'PAT-1005', patientName: 'Mia Garcia', providerId: 'PRV-1',
      date: '2026-03-15', serviceId: 'SVC-11', serviceName: 'Medical Weight Loss',
      mapType: 'none',
      subjective: 'Month 2 follow-up for semaglutide weight loss program. Started at 0.25mg weekly, increased to 0.5mg 4 weeks ago. Reports decreased appetite, occasional mild nausea first 2 days after injection (improving). No vomiting or diarrhea. Eating 80-100g protein daily. Walking 30 min 5x/week. Starting weight: 187 lbs. Current: 178 lbs (-9 lbs).',
      objective: 'Weight 178 lbs (down from 187 lbs at start, 183 lbs last visit). BMI 30.2 → 28.7. Waist circumference 36" (was 38"). Injection site: no erythema or induration. No signs of dehydration.',
      assessment: 'Excellent response to semaglutide. 4.8% body weight loss in 8 weeks. Tolerating dose increase well. On track for target.',
      plan: 'Increase to semaglutide 1.0mg weekly starting next injection. Continue protein target 80-100g/day. Add resistance training 2x/week to preserve lean mass. Labs: CMP, lipid panel, A1C at 3-month mark. Continue weekly self-injection — reviewed technique. Return 4 weeks for dose evaluation. Goal: 160 lbs (15% body weight loss).',
      injectionMap: {},
      measurements: { weight: '178', bmi: '28.7', waistCircumference: '36', measurementNotes: 'Down 9 lbs from 187 start weight. Waist down 2 inches. Tolerating 0.5mg well, increasing to 1.0mg. Target: 160 lbs.' },
      vitals: { bp: '126/80', pulse: '76', temp: '98.6' },
      medications: 'Semaglutide 0.5mg weekly (increasing to 1.0mg), Metformin 500mg BID',
      status: 'signed',
      createdAt: '2026-03-15T10:00:00Z',
    },
    {
      id: 'CHT-8', patientId: 'PAT-1010', patientName: 'Lily Lee', providerId: 'PRV-2',
      date: '2026-03-15', serviceId: 'SVC-2', serviceName: 'Lip Filler',
      mapType: 'face',
      subjective: 'Patient presents for lip augmentation. First time filler patient. Desires subtle, natural enhancement — "I want my lips to look like mine but better." Showed reference photos. No allergies. Not pregnant. Stopped ibuprofen 7 days ago.',
      objective: 'Thin upper lip with mild asymmetry (right side slightly smaller). Adequate vermillion border. Good hydration. No active cold sores. Fitzpatrick II.',
      assessment: 'Candidate for conservative lip augmentation. Recommend 0.5-1 syringe Juvederm Ultra XC. Discussed that less is more for first treatment — can always add more.',
      plan: '0.7 syringe Juvederm Ultra XC: 0.3cc upper lip (focus on cupids bow and right side correction), 0.2cc lower lip (subtle volume), 0.2cc border definition. Dental block bilateral infraorbital nerve. Slow injection with aspiration. Ice pre and post. Post-care: no kissing or straws 24 hours, ice 10 min on/off, sleep elevated tonight. Arnica gel for bruising. Follow up 2 weeks — may add remaining 0.3cc at that time.',
      injectionMap: { 'lips-upper': '0.3cc JUV', 'lips-lower': '0.2cc JUV' },
      vitals: { bp: '116/72', pulse: '82', temp: '98.6' },
      medications: 'None',
      status: 'draft',
      createdAt: '2026-03-15T14:00:00Z',
    },
  ]);
  localStorage.setItem('ms_charts_init', 'true');
}

// ── Main component ────────────────────────────────────────────────────────────

export default function Charts() {
  const s = useStyles();
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);
  useEffect(() => { initCharts(); setTick(t => t + 1); }, []);

  const [charts, setCharts] = useState(getCharts);
  const [activeId, setActiveId] = useState(null);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingZone, setEditingZone] = useState(null);
  const [zoneValue, setZoneValue] = useState('');
  const [form, setForm] = useState({
    patientId: '', serviceId: '', providerId: '',
    subjective: '', objective: '', assessment: '', plan: '',
    injectionMap: {}, vitals: { bp: '', pulse: '', temp: '' },
    medications: '', status: 'draft', mapType: 'face',
    measurements: { weight: '', bmi: '', waistCircumference: '', measurementNotes: '' },
  });

  const patients = getPatients();
  const services = getServices();
  const providers = getProviders();

  const refresh = () => { setCharts(getCharts()); };
  const active = charts.find(c => c.id === activeId);

  // Derive current map type from selected service
  const currentMapType = getMapType(form.serviceId, services);
  const currentZones = getZonesForType(currentMapType);
  const currentMapLabel = getMapLabel(currentMapType);

  const filtered = charts.filter(c => {
    if (search) {
      const q = search.toLowerCase();
      if (!c.patientName?.toLowerCase().includes(q) && !c.serviceName?.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => b.date.localeCompare(a.date));

  const openNew = () => {
    setActiveId(null);
    setForm({
      patientId: '', serviceId: '', providerId: '',
      subjective: '', objective: '', assessment: '', plan: '',
      injectionMap: {}, vitals: { bp: '', pulse: '', temp: '' },
      medications: '', status: 'draft', mapType: 'face',
      measurements: { weight: '', bmi: '', waistCircumference: '', measurementNotes: '' },
    });
    setShowNew(true);
  };

  const openChart = (chart) => {
    setActiveId(chart.id);
    setForm({
      patientId: chart.patientId, serviceId: chart.serviceId, providerId: chart.providerId,
      subjective: chart.subjective, objective: chart.objective, assessment: chart.assessment, plan: chart.plan,
      injectionMap: chart.injectionMap || {}, vitals: chart.vitals || { bp: '', pulse: '', temp: '' },
      medications: chart.medications || '', status: chart.status,
      mapType: chart.mapType || getMapType(chart.serviceId, services),
      measurements: chart.measurements || { weight: '', bmi: '', waistCircumference: '', measurementNotes: '' },
    });
    setShowNew(true);
  };

  const handleSave = (sign = false) => {
    const pat = patients.find(p => p.id === form.patientId);
    const svc = services.find(sv => sv.id === form.serviceId);
    const mapType = getMapType(form.serviceId, services);
    const data = {
      ...form,
      mapType,
      patientName: pat ? `${pat.firstName} ${pat.lastName}` : 'Unknown',
      serviceName: svc?.name || 'Service',
      date: new Date().toISOString().slice(0, 10),
      status: sign ? 'signed' : 'draft',
    };

    const all = getCharts();
    if (activeId) {
      const idx = all.findIndex(c => c.id === activeId);
      if (idx >= 0) all[idx] = { ...all[idx], ...data };
    } else {
      data.id = `CHT-${Date.now()}`;
      data.createdAt = new Date().toISOString();
      all.unshift(data);
    }
    saveCharts(all);
    refresh();
    setShowNew(false);
  };

  const addInjectionPoint = (zoneId) => {
    setEditingZone(zoneId);
    setZoneValue(form.injectionMap[zoneId] || '');
  };

  const saveZone = () => {
    if (editingZone) {
      const map = { ...form.injectionMap };
      if (zoneValue.trim()) map[editingZone] = zoneValue.trim();
      else delete map[editingZone];
      setForm({ ...form, injectionMap: map });
    }
    setEditingZone(null);
  };

  // Get the zone label for the editing popover
  const getEditingZoneLabel = () => {
    if (!editingZone) return '';
    const allZones = [...FACE_ZONES, ...BODY_ZONES, ...SCALP_ZONES];
    return allZones.find(z => z.id === editingZone)?.label || editingZone;
  };

  // Summary line for chart list cards
  const getChartZoneSummary = (chart) => {
    const count = Object.keys(chart.injectionMap || {}).length;
    const mt = chart.mapType || getMapType(chart.serviceId, services);
    if (mt === 'none' && chart.measurements?.weight) return 'vitals recorded';
    if (count === 0) return null;
    if (mt === 'body') return `${count} body zones`;
    if (mt === 'scalp') return `${count} scalp zones`;
    return `${count} injection sites`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ font: `600 26px ${s.FONT}`, color: s.text, marginBottom: 4 }}>Clinical Charts</h1>
          <p style={{ font: `400 14px ${s.FONT}`, color: s.text2 }}>SOAP notes, injection mapping, and treatment documentation</p>
        </div>
        <button onClick={openNew} style={s.pillAccent}>+ New Chart</button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search patient or service..." style={{ ...s.input, maxWidth: 260 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          {[['all', 'All'], ['draft', 'Drafts'], ['signed', 'Signed']].map(([id, label]) => (
            <button key={id} onClick={() => setStatusFilter(id)} style={{
              ...s.pill, padding: '7px 14px', fontSize: 12,
              background: statusFilter === id ? s.accent : 'transparent',
              color: statusFilter === id ? s.accentText : s.text2,
              border: statusFilter === id ? `1px solid ${s.accent}` : '1px solid #E5E5E5',
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Charts List */}
      <div style={{ display: 'grid', gap: 10 }}>
        {filtered.map(chart => {
          const prov = providers.find(p => p.id === chart.providerId);
          const zoneSummary = getChartZoneSummary(chart);
          return (
            <div key={chart.id} onClick={() => openChart(chart)} style={{
              ...s.cardStyle, padding: '18px 22px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = s.shadowMd}
            onMouseLeave={e => e.currentTarget.style.boxShadow = s.shadow}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: chart.status === 'signed' ? '#F0FDF4' : '#FFF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', font: `500 12px ${s.FONT}`, color: chart.status === 'signed' ? s.success : s.warning }}>
                  {chart.patientName?.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div style={{ font: `500 14px ${s.FONT}`, color: s.text }}>{chart.patientName} — {chart.serviceName}</div>
                  <div style={{ font: `400 12px ${s.FONT}`, color: s.text2 }}>{prov?.name?.split(',')[0] || 'Provider'} · {chart.date}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {zoneSummary && <span style={{ padding: '3px 8px', borderRadius: 100, background: '#F5F5F5', font: `400 10px ${s.MONO}`, color: s.text2 }}>{zoneSummary}</span>}
                <span style={{
                  padding: '3px 10px', borderRadius: 100, font: `500 10px ${s.FONT}`, textTransform: 'uppercase',
                  background: chart.status === 'signed' ? '#F0FDF4' : '#FFF7ED',
                  color: chart.status === 'signed' ? s.success : s.warning,
                }}>{chart.status}</span>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div style={{ ...s.cardStyle, padding: 48, textAlign: 'center', font: `400 14px ${s.FONT}`, color: s.text3 }}>No charts found</div>
        )}
      </div>

      {/* Chart Editor Modal */}
      {showNew && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 300 }} onClick={() => setShowNew(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 900, width: '95%', boxShadow: s.shadowLg, maxHeight: '92vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <h2 style={{ font: `600 22px ${s.FONT}`, color: s.text, marginBottom: 20 }}>{activeId ? 'Edit Chart' : 'New Clinical Chart'}</h2>

            {/* Patient / Service / Provider */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 20 }}>
              <div>
                <label style={s.label}>Patient</label>
                <select value={form.patientId} onChange={e => setForm({ ...form, patientId: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  <option value="">Select...</option>
                  {patients.map(p => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Service</label>
                <select value={form.serviceId} onChange={e => setForm({ ...form, serviceId: e.target.value, injectionMap: {} })} style={{ ...s.input, cursor: 'pointer' }}>
                  <option value="">Select...</option>
                  {services.map(sv => <option key={sv.id} value={sv.id}>{sv.name}</option>)}
                </select>
              </div>
              <div>
                <label style={s.label}>Provider</label>
                <select value={form.providerId} onChange={e => setForm({ ...form, providerId: e.target.value })} style={{ ...s.input, cursor: 'pointer' }}>
                  <option value="">Select...</option>
                  {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
            </div>

            {/* Vitals */}
            <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
              {[['bp', 'Blood Pressure'], ['pulse', 'Pulse'], ['temp', 'Temp (F)']].map(([key, label]) => (
                <div key={key} style={{ flex: 1 }}>
                  <label style={s.label}>{label}</label>
                  <input value={form.vitals[key] || ''} onChange={e => setForm({ ...form, vitals: { ...form.vitals, [key]: e.target.value } })} style={s.input} placeholder={key === 'bp' ? '120/80' : key === 'pulse' ? '72' : '98.6'} />
                </div>
              ))}
              <div style={{ flex: 2 }}>
                <label style={s.label}>Current Medications</label>
                <input value={form.medications} onChange={e => setForm({ ...form, medications: e.target.value })} style={s.input} placeholder="List medications" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: currentMapType === 'none' ? '1fr 320px' : '1fr 320px', gap: 20 }}>
              {/* SOAP Notes */}
              <div>
                {[
                  { key: 'subjective', label: 'S — Subjective', placeholder: 'Chief complaint, patient history, symptoms, concerns...' },
                  { key: 'objective', label: 'O — Objective', placeholder: 'Physical findings, observations, measurements...' },
                  { key: 'assessment', label: 'A — Assessment', placeholder: 'Clinical assessment, diagnosis, treatment candidacy...' },
                  { key: 'plan', label: 'P — Plan', placeholder: 'Treatment performed, products/units used, post-care instructions, follow-up...' },
                ].map(field => (
                  <div key={field.key} style={{ marginBottom: 14 }}>
                    <label style={{ ...s.label, color: s.accent }}>{field.label}</label>
                    <textarea value={form[field.key]} onChange={e => setForm({ ...form, [field.key]: e.target.value })} rows={3} style={{ ...s.input, resize: 'vertical', lineHeight: 1.6 }} placeholder={field.placeholder} />
                  </div>
                ))}
              </div>

              {/* Right panel: Map or Vitals based on service type */}
              <div>
                {currentMapType === 'none' ? (
                  <VitalsPanel form={form} setForm={setForm} s={s} />
                ) : (
                  <>
                    <label style={{ ...s.label, marginBottom: 12 }}>{currentMapLabel}</label>
                    <div style={{
                      position: 'relative', width: '100%',
                      aspectRatio: currentMapType === 'body' ? '0.625' : '0.75',
                      background: '#FAFAFA', borderRadius: 12, border: '1px solid #E5E5E5', overflow: 'hidden',
                    }}>
                      {/* SVG outline */}
                      {currentMapType === 'face' && <FaceSVG />}
                      {currentMapType === 'body' && <BodySVG />}
                      {currentMapType === 'scalp' && <ScalpSVG />}

                      {/* Zone points */}
                      {currentZones.map(zone => {
                        const hasValue = form.injectionMap[zone.id];
                        return (
                          <div key={zone.id} onClick={() => addInjectionPoint(zone.id)} style={{
                            position: 'absolute', left: `${zone.x}%`, top: `${zone.y}%`,
                            transform: 'translate(-50%, -50%)', cursor: 'pointer', zIndex: 10,
                          }}>
                            <div style={{
                              width: hasValue ? 24 : 14, height: hasValue ? 24 : 14, borderRadius: '50%',
                              background: hasValue ? s.accent : 'rgba(0,0,0,0.08)',
                              border: hasValue ? 'none' : '1.5px dashed #CCC',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              font: `600 8px ${s.MONO}`, color: s.accentText,
                              transition: 'all 0.15s',
                            }}>
                              {hasValue && form.injectionMap[zone.id]}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div style={{ font: `400 10px ${s.FONT}`, color: s.text3, marginTop: 6, textAlign: 'center' }}>
                      {currentMapType === 'face' && 'Click points to add injection details'}
                      {currentMapType === 'body' && 'Click zones to add treatment details'}
                      {currentMapType === 'scalp' && 'Click zones to add treatment details'}
                    </div>

                    {/* Active zones list */}
                    {Object.keys(form.injectionMap).length > 0 && (
                      <div style={{ marginTop: 10 }}>
                        {Object.entries(form.injectionMap).map(([zoneId, val]) => {
                          const zone = currentZones.find(z => z.id === zoneId);
                          if (!zone) return null;
                          return (
                            <div key={zoneId} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 0', font: `400 11px ${s.FONT}`, color: s.text2 }}>
                              <span>{zone?.label}</span>
                              <span style={{ font: `500 11px ${s.MONO}`, color: s.accent }}>{val}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowNew(false)} style={s.pillGhost}>Cancel</button>
              <button onClick={() => handleSave(false)} style={s.pillOutline}>Save Draft</button>
              <button onClick={() => handleSave(true)} style={s.pillAccent}>Sign & Lock</button>
            </div>
          </div>
        </div>
      )}

      {/* Zone Edit Popover */}
      {editingZone && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 400 }} onClick={() => setEditingZone(null)}>
          <div style={{ background: '#fff', borderRadius: 12, padding: 24, width: 280, boxShadow: s.shadowLg }} onClick={e => e.stopPropagation()}>
            <div style={{ font: `600 14px ${s.FONT}`, color: s.text, marginBottom: 12 }}>{getEditingZoneLabel()}</div>
            <input value={zoneValue} onChange={e => setZoneValue(e.target.value)} style={s.input} placeholder={currentMapType === 'face' ? 'e.g., 10u Botox' : currentMapType === 'body' ? 'e.g., 500cc aspirate' : 'e.g., PRP 3cc'} autoFocus onKeyDown={e => e.key === 'Enter' && saveZone()} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={() => { setZoneValue(''); saveZone(); }} style={{ ...s.pillGhost, padding: '6px 12px', fontSize: 11, color: s.danger }}>Clear</button>
              <button onClick={saveZone} style={{ ...s.pillAccent, padding: '6px 16px', fontSize: 12 }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
