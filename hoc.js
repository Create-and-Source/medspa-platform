// ═══════════════════════════════════════════════
//  HOC SHARED DATA LAYER — Haus of Confidence
// ═══════════════════════════════════════════════
const HOC = {
  // ── Keys ────────────────────────────────────
  K: {
    pts:'hoc_p', appts:'hoc_a', txns:'hoc_t', ba:'hoc_ba',
    charts:'hoc_charts', memberships:'hoc_memberships',
    packages:'hoc_packages', inventory:'hoc_inventory',
    reminders:'hoc_reminders', settings:'hoc_settings'
  },

  // ── Providers ──────────────────────────────
  PROVIDERS: [
    { name: 'Sara Ameli', title: 'DNP, FNP-C', role: 'Founder & NP', locations: ['scottsdale-main','scottsdale-flagship'] },
    { name: 'Dr. Todd Malan', title: 'Cosmetic Surgeon', role: 'Surgeon', locations: ['scottsdale-flagship'] },
    { name: 'Dr. Margaret Husami', title: 'NMD', role: 'Naturopathic MD', locations: ['scottsdale-flagship'] },
    { name: 'Shay', title: 'Aesthetician', role: 'Provider', locations: ['scottsdale-main'] },
    { name: 'Cierra', title: 'Aesthetician', role: 'Provider', locations: ['scottsdale-main'] },
  ],

  // ── Services ───────────────────────────────
  SERVICES: [
    'LipoAway Consult','LipoAway Procedure','Fat Transfer','BodyTite',
    'Botox','Dermal Fillers','Lip Fillers','Sculptra & Radiesse','PDO Thread Lift',
    'RF Microneedling','IPL Photofacial','Chemical Peel','Laser Skin Resurfacing',
    'Laser Hair Removal','Unicorn Facial','Facial',
    'Stem Cell Therapy','Natural Growth Factor Injections',
    'Hormone Replacement Therapy','Medical Weight Loss','IV Therapy',
    'Hair Restoration','FemiLift','BTL Emsella',
    'Regenerative Joint Therapy','Biological Age Testing',
    'Kybella / Liquid Lipo','Consultation',
  ],

  // ── Locations ──────────────────────────────
  LOCATIONS: [
    { id: 'scottsdale-main', name: 'Old Town — Winfield Scott', address: '4205 N Winfield Scott Plaza, Suite 6, Scottsdale, AZ 85251' },
    { id: 'scottsdale-flagship', name: 'Old Town — Brown Ave', address: '4236 N. Brown Ave, Scottsdale, AZ' },
  ],

  // ── Storage ──────────────────────────────────
  load(k){ try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return[];} },
  save(k,d){ localStorage.setItem(k,JSON.stringify(d)); },
  uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6); },
  today(){ return new Date().toISOString().slice(0,10); },

  // ── Formatters ───────────────────────────────
  fa(n){ return '$'+Number(n||0).toLocaleString(); },
  fd(d){ if(!d)return'—'; const[,m,day]=d.split('-'); return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+m-1]+' '+day; },
  ft(t){ if(!t)return'—'; const[h,m]=t.split(':'); const hr=+h; return(hr===0?12:hr>12?hr-12:hr)+':'+m+(hr<12?' AM':' PM'); },
  pn(p){ return(p?.first||'')+(p?.last?' '+p.last:''); },
  pi(p){ return((p?.first||'')[0]||'')+((p?.last||'')[0]||''); },
  sc(s){ return s==='Confirmed'||s==='Active'?'st-ok':s==='Completed'||s==='Paid'?'st-info':'st-pend'; },
  monthName(i){ return['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]; },

  // ── Patient helpers ──────────────────────────
  gp(id){ return this.load(this.K.pts).find(p=>p.id===id)||{}; },

  // ── Seed demo data ───────────────────────────
  seed(){
    if(localStorage.getItem('hoc_seed_v3')) return;
    // Clear old seed
    localStorage.removeItem('hoc_seed_v2');
    const t = this.today();
    const loc1 = 'scottsdale-main';
    const loc2 = 'scottsdale-flagship';
    const pts=[
      {id:'p1',first:'Maria',last:'G',phone:'(602) 555-0143',email:'maria@email.com',dob:'1988-04-12',source:'Instagram',notes:'No known allergies',location:loc1,created:Date.now()},
      {id:'p2',first:'Jessica',last:'T',phone:'(480) 555-0287',email:'jessica@email.com',dob:'1995-07-23',source:'Google',notes:'',location:loc1,created:Date.now()},
      {id:'p3',first:'Amanda',last:'K',phone:'(623) 555-0391',email:'amanda@email.com',dob:'1991-02-14',source:'Referral',notes:'Sensitive skin',location:loc1,created:Date.now()},
      {id:'p4',first:'Nicole',last:'B',phone:'(480) 555-0518',email:'nicole@email.com',dob:'1983-09-30',source:'TikTok',notes:'',location:loc2,created:Date.now()},
      {id:'p5',first:'Rachel',last:'M',phone:'(602) 555-0774',email:'rachel@email.com',dob:'1979-11-05',source:'Google',notes:'Prefers afternoons',location:loc2,created:Date.now()},
      {id:'p6',first:'Carmen',last:'L',phone:'(480) 555-0922',email:'carmen@email.com',dob:'1990-06-18',source:'Instagram',notes:'',location:loc1,created:Date.now()},
      {id:'p7',first:'Diana',last:'R',phone:'(480) 555-1133',email:'diana@email.com',dob:'1985-03-22',source:'Yelp',notes:'',location:loc2,created:Date.now()},
      {id:'p8',first:'Sophia',last:'W',phone:'(602) 555-1245',email:'sophia@email.com',dob:'1993-08-09',source:'Instagram',notes:'Interested in stem cells',location:loc2,created:Date.now()},
    ];
    const appts=[
      {id:'a1',patientId:'p1',date:t,time:'09:00',service:'LipoAway Consult',provider:'Dr. Todd Malan',status:'Confirmed',notes:'',location:loc2},
      {id:'a2',patientId:'p2',date:t,time:'10:30',service:'Dermal Fillers',provider:'Sara Ameli',status:'Confirmed',notes:'',location:loc1},
      {id:'a3',patientId:'p3',date:t,time:'11:15',service:'RF Microneedling',provider:'Shay',status:'Pending',notes:'',location:loc1},
      {id:'a4',patientId:'p4',date:t,time:'13:00',service:'Medical Weight Loss',provider:'Dr. Margaret Husami',status:'Confirmed',notes:'',location:loc2},
      {id:'a5',patientId:'p5',date:t,time:'14:30',service:'Botox',provider:'Sara Ameli',status:'Confirmed',notes:'',location:loc1},
      {id:'a6',patientId:'p6',date:t,time:'15:45',service:'Fat Transfer Consult',provider:'Dr. Todd Malan',status:'Pending',notes:'',location:loc2},
      {id:'a7',patientId:'p7',date:t,time:'09:30',service:'Stem Cell Therapy',provider:'Dr. Todd Malan',status:'Confirmed',notes:'',location:loc2},
      {id:'a8',patientId:'p8',date:t,time:'16:00',service:'Facial',provider:'Cierra',status:'Confirmed',notes:'',location:loc1},
    ];
    const past = [
      {id:'a10',patientId:'p1',date:'2026-03-01',time:'10:00',service:'LipoAway Procedure',provider:'Dr. Todd Malan',status:'Completed',notes:'',location:loc2},
      {id:'a11',patientId:'p2',date:'2026-03-02',time:'11:00',service:'Botox',provider:'Sara Ameli',status:'Completed',notes:'',location:loc1},
      {id:'a12',patientId:'p3',date:'2026-03-03',time:'09:30',service:'RF Microneedling',provider:'Shay',status:'Completed',notes:'',location:loc1},
      {id:'a13',patientId:'p4',date:'2026-03-05',time:'14:00',service:'Medical Weight Loss',provider:'Dr. Margaret Husami',status:'Completed',notes:'',location:loc2},
      {id:'a14',patientId:'p5',date:'2026-03-06',time:'13:30',service:'Dermal Fillers',provider:'Sara Ameli',status:'Completed',notes:'',location:loc1},
      {id:'a15',patientId:'p1',date:'2026-03-08',time:'10:00',service:'Fat Transfer',provider:'Dr. Todd Malan',status:'Completed',notes:'',location:loc2},
      {id:'a16',patientId:'p6',date:'2026-03-10',time:'11:30',service:'Botox',provider:'Sara Ameli',status:'Completed',notes:'',location:loc1},
      {id:'a17',patientId:'p7',date:'2026-03-11',time:'14:00',service:'Stem Cell Therapy',provider:'Dr. Todd Malan',status:'Completed',notes:'',location:loc2},
      {id:'a18',patientId:'p8',date:'2026-03-12',time:'09:00',service:'IPL Photofacial',provider:'Cierra',status:'Completed',notes:'',location:loc1},
      {id:'a19',patientId:'p2',date:'2026-03-12',time:'14:00',service:'LipoAway Consult',provider:'Dr. Todd Malan',status:'Completed',notes:'',location:loc2},
      {id:'a20',patientId:'p3',date:'2026-03-13',time:'09:00',service:'Facial',provider:'Shay',status:'Completed',notes:'',location:loc1},
    ];
    const txns=[
      {id:'t1',patientId:'p1',service:'LipoAway Consult',amount:150,method:'Visa ···4821',status:'Paid',date:t,location:loc2},
      {id:'t2',patientId:'p2',service:'Dermal Fillers',amount:720,method:'Visa ···2290',status:'Paid',date:t,location:loc1},
      {id:'t3',patientId:'p4',service:'Medical Weight Loss',amount:350,method:'Amex ···3804',status:'Paid',date:t,location:loc2},
      {id:'t4',patientId:'p3',service:'RF Microneedling',amount:1200,method:'Pending',status:'Due',date:t,location:loc1},
      {id:'t5',patientId:'p6',service:'Fat Transfer Consult',amount:200,method:'Pending',status:'Due',date:t,location:loc2},
      {id:'t6',patientId:'p1',service:'LipoAway Procedure',amount:4800,method:'Visa ···4821',status:'Paid',date:'2026-03-01',location:loc2},
      {id:'t7',patientId:'p2',service:'Botox',amount:350,method:'MC ···9912',status:'Paid',date:'2026-03-02',location:loc1},
      {id:'t8',patientId:'p3',service:'RF Microneedling',amount:1200,method:'Cash',status:'Paid',date:'2026-03-03',location:loc1},
      {id:'t9',patientId:'p4',service:'Medical Weight Loss',amount:350,method:'Visa ···7721',status:'Paid',date:'2026-03-05',location:loc2},
      {id:'t10',patientId:'p5',service:'Dermal Fillers',amount:720,method:'Amex ···5544',status:'Paid',date:'2026-03-06',location:loc1},
      {id:'t11',patientId:'p1',service:'Fat Transfer',amount:2400,method:'Affirm Financing',status:'Paid',date:'2026-03-08',location:loc2},
      {id:'t12',patientId:'p6',service:'Botox',amount:350,method:'Visa ···3381',status:'Paid',date:'2026-03-10',location:loc1},
      {id:'t13',patientId:'p7',service:'Stem Cell Therapy',amount:3500,method:'Visa ···6622',status:'Paid',date:'2026-03-11',location:loc2},
      {id:'t14',patientId:'p8',service:'IPL Photofacial',amount:450,method:'Cash',status:'Paid',date:'2026-03-12',location:loc1},
      {id:'t15',patientId:'p2',service:'LipoAway Consult',amount:150,method:'Cash',status:'Paid',date:'2026-03-12',location:loc2},
      {id:'t16',patientId:'p3',service:'Facial',amount:180,method:'Visa ···8821',status:'Paid',date:'2026-03-13',location:loc1},
    ];
    const charts=[
      {id:'c1',patientId:'p1',appointmentId:'a10',date:'2026-03-01',provider:'Dr. Todd Malan',service:'LipoAway Procedure',type:'SOAP',subjective:'Patient reports stubborn abdominal fat unresponsive to diet/exercise. Goal: visible waist reduction.',objective:'3.5in pre-treatment abdominal circumference. Healthy for procedure. No contraindications.',assessment:'Ideal LipoAway candidate. Healthy BMI. Realistic expectations.',plan:'LipoAway abdomen. 500ml expected removal. Compression garment 2 weeks. F/U in 4 weeks.',injectables:[],created:Date.now()},
      {id:'c2',patientId:'p2',appointmentId:'a11',date:'2026-03-02',provider:'Sara Ameli',service:'Botox',type:'SOAP',subjective:'Moderate forehead lines and crow\'s feet. Wants natural look.',objective:'Moderate animation lines forehead. Moderate crow\'s feet bilateral.',assessment:'Good candidate. Skin elasticity intact.',plan:'Botox: 20u forehead, 12u glabella, 10u crow\'s feet bilateral. F/U 2 weeks.',injectables:[{product:'Botox',units:42,zones:'Forehead 20u, Glabella 12u, Crow\'s feet 10u bilateral',lot:'BTX2024-881',exp:'2026-12-01'}],created:Date.now()},
      {id:'c3',patientId:'p5',appointmentId:'a14',date:'2026-03-06',provider:'Sara Ameli',service:'Dermal Fillers',type:'SOAP',subjective:'Lip volume loss, wants subtle enhancement. Nasolabial folds.',objective:'Mild lip deflation. Moderate NLF bilateral.',assessment:'Conservative filler candidate. Agree on natural enhancement.',plan:'1ml Juvederm Ultra XC lips. 1ml Restylane NLF bilateral. Ice 10min post.',injectables:[{product:'Juvederm Ultra XC',units:1,zones:'Lips',lot:'JUV2025-442',exp:'2027-06-01'},{product:'Restylane',units:2,zones:'Nasolabial folds bilateral',lot:'RST2025-119',exp:'2027-03-01'}],created:Date.now()},
    ];
    const memberships=[
      {id:'m1',name:'Glow Monthly',price:199,interval:'monthly',services:['One Facial/month','10% off all injectables','Priority booking'],active:true,color:'#F00573'},
      {id:'m2',name:'Confidence Club',price:349,interval:'monthly',services:['One Botox session/month','One Facial/month','15% off all services','VIP scheduling'],active:true,color:'#c41068'},
      {id:'m3',name:'Total Transformation',price:599,interval:'monthly',services:['Two treatments/month','20% off all services','Free consultations','Complimentary add-ons'],active:true,color:'#722A82'},
    ];
    const members=[
      {id:'mb1',patientId:'p1',membershipId:'m2',status:'Active',startDate:'2026-01-01',nextBilling:'2026-04-01',totalPaid:1047},
      {id:'mb2',patientId:'p3',membershipId:'m1',status:'Active',startDate:'2026-02-01',nextBilling:'2026-04-01',totalPaid:398},
      {id:'mb3',patientId:'p5',membershipId:'m3',status:'Active',startDate:'2026-01-15',nextBilling:'2026-04-15',totalPaid:1797},
      {id:'mb4',patientId:'p7',membershipId:'m2',status:'Active',startDate:'2026-02-15',nextBilling:'2026-04-15',totalPaid:698},
    ];
    const inventory=[
      {id:'i1',name:'Botox (Allergan)',category:'Injectable',unit:'vial (100u)',qty:8,reorder:3,cost:400,price:null,lot:'BTX2024-881',exp:'2026-12-01',location:'Fridge A'},
      {id:'i2',name:'Juvederm Ultra XC',category:'Injectable',unit:'syringe (1ml)',qty:12,reorder:4,cost:185,price:null,lot:'JUV2025-442',exp:'2027-06-01',location:'Fridge A'},
      {id:'i3',name:'Restylane',category:'Injectable',unit:'syringe (1ml)',qty:9,reorder:4,cost:165,price:null,lot:'RST2025-119',exp:'2027-03-01',location:'Fridge A'},
      {id:'i4',name:'Sculptra',category:'Injectable',unit:'vial',qty:5,reorder:2,cost:320,price:null,lot:'SCP2025-007',exp:'2027-01-15',location:'Fridge B'},
      {id:'i5',name:'Lidocaine 1%',category:'Anesthetic',unit:'vial (20ml)',qty:24,reorder:6,cost:8,price:null,lot:'LID2025-444',exp:'2027-09-01',location:'Cabinet 1'},
      {id:'i6',name:'Tumescent Solution',category:'Anesthetic',unit:'bag (500ml)',qty:15,reorder:5,cost:22,price:null,lot:'TUM2025-113',exp:'2026-11-01',location:'Cabinet 1'},
      {id:'i7',name:'IV Bags (Lactated Ringer)',category:'IV Therapy',unit:'bag (1L)',qty:30,reorder:10,cost:12,price:null,lot:'IVL2025-882',exp:'2027-04-01',location:'Supply Room'},
      {id:'i8',name:'Semaglutide',category:'Weight Loss',unit:'pen',qty:18,reorder:6,cost:280,price:null,lot:'SEM2025-229',exp:'2027-02-28',location:'Fridge B'},
      {id:'i9',name:'Compression Garments',category:'Supplies',unit:'unit',qty:20,reorder:5,cost:35,price:null,lot:null,exp:null,location:'Storage'},
      {id:'i10',name:'Microneedling Cartridges',category:'Supplies',unit:'pack (10)',qty:6,reorder:2,cost:65,price:null,lot:'MNC2025-771',exp:'2027-12-01',location:'Cabinet 2'},
      {id:'i11',name:'Kybella',category:'Injectable',unit:'vial (2ml)',qty:6,reorder:2,cost:550,price:null,lot:'KYB2025-330',exp:'2027-08-01',location:'Fridge A'},
      {id:'i12',name:'Stem Cell Kit',category:'Regenerative',unit:'kit',qty:4,reorder:1,cost:1200,price:null,lot:'SCK2025-012',exp:'2027-05-01',location:'Fridge B'},
    ];
    this.save(this.K.pts, pts);
    this.save(this.K.appts, [...appts,...past]);
    this.save(this.K.txns, txns);
    this.save(this.K.charts, charts);
    this.save(this.K.memberships, memberships);
    this.save('hoc_members', members);
    this.save(this.K.inventory, inventory);
    localStorage.setItem('hoc_seed_v3','1');
  }
};
HOC.seed();
