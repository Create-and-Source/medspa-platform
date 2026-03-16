// ═══════════════════════════════════════════════
//  HOC Help Chat Widget — Haus of Confidence
//  Built-in knowledge base, no external API
// ═══════════════════════════════════════════════
(function(){
'use strict';

// ── Knowledge Base ──────────────────────────────
const KB = [
  // Navigation & Pages
  { keys:['dashboard','home','main','overview','start'],
    a:'The Dashboard is your home screen. It shows today\'s appointments, total patients, unread messages, and monthly revenue — all updating in real time. Go to: sidebar → Dashboard.' },
  { keys:['appointment','booking','schedule','book','calendar'],
    a:'To manage appointments, go to sidebar → Appointments. Click "+ New Appointment" to book one — pick a patient, date, time, service, and provider. Click "Edit" on any appointment to change details. You can also book from the Dashboard.' },
  { keys:['patient','add patient','new patient','patient list','client'],
    a:'Go to sidebar → Patients. Click "+ New Patient" to add someone — enter their name, phone, email, DOB, and source. Click any patient name to see their full profile with appointment history, payment history, and lifetime value. Use the search bar to find patients by name, phone, or email.' },
  { keys:['payment','charge','billing','invoice','revenue','money','stripe','card'],
    a:'Go to sidebar → Payments. Use the "Quick Charge" panel on the right — select a patient, service, and amount, then click "Charge Card." The payment is recorded instantly and updates the dashboard revenue. You can also send an invoice by text. For live card processing, paste your Stripe publishable key.' },
  { keys:['message','sms','text','email','inbox','reply','send message'],
    a:'Go to sidebar → Messages. Click any conversation in the inbox to view the thread. Type your reply at the bottom and click Send — messages are saved and persist between sessions. Suggested replies appear automatically for incoming messages.' },
  { keys:['before','after','photo','camera','before and after','b&a','session'],
    a:'Go to sidebar → Before & After. Click "+ New Session" to start — pick a patient, select a body zone, and add notes. The camera opens with a guide overlay for consistent positioning. After capturing, you\'ll see a comparison view. Click Save to store the session.' },
  { keys:['chart','soap','soap note','clinical','treatment record','documentation','charting'],
    a:'Go to sidebar → Charting & SOAP. Click "+ New Chart Note" to create one — select a patient, provider, date, service, and chart type. Fill in the SOAP fields (Subjective, Objective, Assessment, Plan) and add injectable tracking if needed. View all past records in the Treatment History tab.' },
  { keys:['analytics','report','stats','performance','revenue report','growth'],
    a:'Go to sidebar → Analytics. View revenue charts, appointment breakdowns, provider leaderboards, patient acquisition sources, retention funnels, top patients by lifetime value, and no-show rates. Use the date range pills to filter by period.' },
  { keys:['membership','member','subscribe','plan','package','recurring','glow','confidence club','transformation'],
    a:'Go to sidebar → Memberships. View and manage membership plans (Glow Monthly $199, Confidence Club $349, Total Transformation $599). See active subscribers, bundled packages, and patient financing through Affirm. Each plan includes service discounts and priority booking.' },
  { keys:['inventory','supply','stock','reorder','expiry','injectable','lot'],
    a:'Go to sidebar → Inventory. Track all injectables (Botox, Juvederm, Restylane, Sculptra, Kybella, etc.), supplies, and equipment. See quantity levels, reorder alerts, expiry dates, and lot numbers. Click "+ Add Item" to add new inventory. The Alerts tab shows low-stock and expiring items.' },
  { keys:['booking','online booking','patient booking','self-service','book online'],
    a:'Go to sidebar → Online Booking. This is the patient-facing booking page where clients can choose a service, select a provider, pick a date and time, and confirm their appointment. Share the booking link with patients for self-service scheduling.' },
  { keys:['kiosk','check-in','check in','intake','new patient check','walk-in','walkin'],
    a:'Go to sidebar → Patient Check-In. This opens the kiosk for walk-in patients to fill out their info, medical history, treatment preferences, consent forms, and signature — all from a tablet. The patient is automatically added to your system.' },
  { keys:['patient portal','portal','my appointments','my account','patient login','my portal','patient-facing'],
    a:'The Patient Portal (patient-portal.html) is a patient-facing page where clients can look up their account by email or phone. Once logged in, they see their profile info, upcoming appointments, past visits, payment history, and lifetime value. Share the link with patients so they can check their own appointment status and records.' },

  // Providers
  { keys:['provider','staff','doctor','who works','team','practitioner'],
    a:'Your providers are: Sara Ameli (DNP, FNP-C — Founder, works at both locations), Dr. Todd Malan (Cosmetic Surgeon — Flagship location), Dr. Margaret Husami (NMD — Flagship location), Shay (Aesthetician — Main location), and Cierra (Aesthetician — Main location).' },
  { keys:['sara','ameli','founder','dnp','nurse practitioner'],
    a:'Sara Ameli is the Founder of Haus of Confidence. She\'s a DNP, FNP-C (Board-Certified Nurse Practitioner) specializing in injectables and wellness. She works at both locations.' },
  { keys:['todd','malan','surgeon','cosmetic surgeon','lipoaway doctor'],
    a:'Dr. Todd Malan is a Cosmetic Surgeon who pioneered cosmetic stem cell therapies. He specializes in LipoAway, fat transfer, BodyTite, and stem cell treatments. He works at the Flagship (Brown Ave) location.' },
  { keys:['margaret','husami','naturopathic','nmd','integrative'],
    a:'Dr. Margaret Husami is a Board-Certified Naturopathic Medical Doctor (NMD) with 10+ years in aesthetic and integrative medicine. She specializes in regenerative treatments, hormone replacement, and medical weight loss. She works at the Flagship location.' },
  { keys:['shay','cierra','aesthetician','esthetician'],
    a:'Shay and Cierra are Aestheticians at the Main (Winfield Scott) location. They handle services like RF Microneedling, IPL Photofacial, facials, chemical peels, and laser treatments.' },

  // Locations
  { keys:['location','address','where','scottsdale','old town','office','clinic','switch location'],
    a:'Haus of Confidence has 2 locations, both in Old Town Scottsdale:\n\n1. Main (Winfield Scott): 4205 N Winfield Scott Plaza, Suite 6, Scottsdale, AZ 85251 — traditional medspa services\n2. Flagship (Brown Ave): 4236 N. Brown Ave, Scottsdale, AZ — surgical, regenerative, and stem cell center\n\nSwitch between locations using the dropdown at the top of the sidebar.' },
  { keys:['winfield','main location','original location'],
    a:'The Main location is at 4205 N Winfield Scott Plaza, Suite 6, Scottsdale, AZ 85251. This is the original medspa offering injectables, facials, laser treatments, and aesthetic services. Providers: Sara Ameli, Shay, Cierra.' },
  { keys:['brown ave','flagship','surgical','regenerative','stem cell'],
    a:'The Flagship location is at 4236 N. Brown Ave, Old Town Scottsdale. This is the new 2,000 sq ft center focused on surgical procedures, regenerative wellness, and stem cell treatments. Providers: Sara Ameli, Dr. Todd Malan, Dr. Margaret Husami.' },

  // Services
  { keys:['lipoaway','lipo','liposuction','awake lipo','fat removal'],
    a:'LipoAway is the signature awake liposuction procedure — removes 2-5 inches of stubborn fat in a single treatment with NO general anesthesia. Book a LipoAway Consult ($150) first, then the procedure ($4,800+). Provider: Dr. Todd Malan at the Flagship location.' },
  { keys:['botox','wrinkle','forehead','crow','frown','relaxer'],
    a:'Botox (wrinkle relaxers) starts at $350. Used for forehead lines, crow\'s feet, frown lines, and more. Providers: Sara Ameli, Shay. Book via sidebar → Appointments → + New Appointment → select "Botox."' },
  { keys:['filler','dermal','lip filler','cheek','jawline','juvederm','restylane','volume'],
    a:'Dermal Fillers start at $720. Options include lip fillers, cheek augmentation, jawline contouring, and nasolabial fold treatment. Products: Juvederm, Restylane. Providers: Sara Ameli. Sculptra & Radiesse (collagen stimulators) are also available from $800.' },
  { keys:['microneedling','rf','collagen','skin tighten'],
    a:'RF Microneedling is $1,200 per session. It\'s a collagen induction therapy for skin tightening and texture improvement. Provider: Shay at the Main location.' },
  { keys:['weight loss','semaglutide','ozempic','wegovy','glp'],
    a:'Medical Weight Loss uses Semaglutide at $350/month. Managed by Dr. Margaret Husami at the Flagship location. Book via sidebar → Appointments → select "Medical Weight Loss."' },
  { keys:['fat transfer','natural augment','bbl'],
    a:'Fat Transfer (natural augmentation using your own fat) starts at $2,400. Provider: Dr. Todd Malan at the Flagship location.' },
  { keys:['hormone','hrt','testosterone','estrogen','bioidentical'],
    a:'Hormone Replacement Therapy (HRT) starts at $250/month. Managed by Dr. Margaret Husami at the Flagship location. Includes bioidentical hormone optimization.' },
  { keys:['iv therapy','drip','hydration','vitamin','immunity'],
    a:'IV Therapy starts at $199. Options include hydration, immunity boosters, energy drips, and vitamin infusions. Available at both locations.' },
  { keys:['thread','pdo','lift','non-surgical lift'],
    a:'PDO Thread Lift starts at $1,500. A non-surgical lift and tightening treatment. Provider: Sara Ameli.' },
  { keys:['laser','hair removal','ipl','photofacial','skin resurfacing'],
    a:'Laser services include: Laser Hair Removal (from $200), IPL Photofacial (from $350), and Laser Skin Resurfacing. Providers: Shay, Cierra at the Main location.' },
  { keys:['facial','unicorn','prx','skin treatment','peel','chemical peel'],
    a:'Facials start at $180. The Unicorn Facial uses PRX-T33 technology. Chemical Peels start at $150. Provider: Cierra at the Main location.' },
  { keys:['kybella','liquid lipo','double chin','submental'],
    a:'Kybella / Liquid Lipo is an injectable fat dissolving treatment for the chin area, starting at $600. Provider: Sara Ameli.' },
  { keys:['hair restoration','hair loss','hair regrowth','prp hair','growth factor'],
    a:'Hair Restoration uses Natural Growth Factor Injections starting at $1,200. Provider: Sara Ameli.' },
  { keys:['bodytite','body contouring','minimally invasive'],
    a:'BodyTite is a minimally invasive body contouring procedure starting at $3,500. Provider: Dr. Todd Malan at the Flagship location.' },
  { keys:['feminlift','emsella','feminine','pelvic','women'],
    a:'FemiLift and BTL Emsella are feminine wellness treatments available at the practice. Ask your provider for pricing and details.' },
  { keys:['service','what do you offer','menu','treatment','price','cost','how much'],
    a:'Services include: LipoAway ($4,800+), Fat Transfer ($2,400+), BodyTite ($3,500+), Botox ($350+), Dermal Fillers ($720+), Lip Fillers, Sculptra & Radiesse ($800+), PDO Thread Lift ($1,500+), Kybella ($600+), RF Microneedling ($1,200), IPL Photofacial ($350+), Chemical Peel ($150+), Laser Hair Removal ($200+), Facials ($180+), Stem Cell Therapy ($3,500+), HRT ($250/mo), Medical Weight Loss ($350/mo), IV Therapy ($199+), Hair Restoration ($1,200+), and Consultations (complimentary).' },

  // How-to
  { keys:['how','help','what can','guide','tutorial','get started'],
    a:'I can help with: navigating the platform, booking appointments, adding patients, recording payments, taking before/after photos, creating SOAP notes, managing inventory, setting up memberships, and info about providers, services, and locations. Just ask!' },
  { keys:['import','migrate','data','clover','vagaro','jane','csv','spreadsheet'],
    a:'To import data from another system, go to sidebar → Patients → "Import Data." Choose your source (Clover, Jane App, Vagaro, Meevo, or CSV/Spreadsheet), upload your export file, and confirm the import.' },
  { keys:['financing','affirm','payment plan','cherry','carecredit'],
    a:'Patient financing is available through Cherry, CareCredit, and Affirm. Go to sidebar → Memberships → Financing tab. Click "Connect" on any provider to link your merchant account. Use "Simulate Patient Application" to demo the approval flow. Patients can apply in 60 seconds with a soft credit check.' },
  { keys:['phone','contact','email','call','reach'],
    a:'Haus of Confidence contact info:\nPhone: (480) 493-5921\nEmail: info@hausofconfidence.com\nInstagram: @hausmedspa\nWebsite: hausofconfidence.com' },

  // Round 2 features
  { keys:['provider calendar','provider view','side by side','multi provider','calendar view','daily schedule'],
    a:'In the Appointments view, click "Provider View" to see a side-by-side daily calendar with columns for each provider (Sara Ameli, Dr. Todd Malan, Dr. Margaret Husami, Shay, Cierra). Click any appointment block to edit it. Toggle back to list view with the same button.' },
  { keys:['treatment plan','multi visit','series','recurring treatment','maintenance plan'],
    a:'Create treatment plans from the Dashboard — click "+ Treatment Plan." Set a patient, service, number of sessions, and interval (weeks between sessions). Active plans appear on the dashboard with progress bars. Click "View" to check off completed sessions.' },
  { keys:['rebook','rebooking','overdue','follow up','due for','touch up','reminder'],
    a:'The Dashboard automatically shows "Rebooking Reminders" for patients who are overdue for their next treatment. For example, Botox patients due every 90 days, Facial patients every 30 days. Click "Rebook" to quickly schedule their next appointment.' },

  // Round 3 features
  { keys:['consent','consent form','informed consent','waiver','signature form'],
    a:'Go to sidebar → Charting & SOAP → Consent Forms tab. Create custom consent forms per service with editable text, required checkboxes, and signature fields. Click "Preview" to see a printable version. Three starter forms are included (LipoAway, Injectable, General). You can edit or create new ones.' },
  { keys:['commission','payroll','pay','salary','provider pay','revenue split','compensation'],
    a:'Go to sidebar → Analytics and scroll to "Provider Commission & Payroll Tracker." It shows each provider\'s revenue generated, number of services, commission rate, calculated commission, base salary, and total pay. Rates are configurable per provider.' },
  { keys:['patient portal','portal','my appointments','my account','patient login'],
    a:'The Patient Portal (sidebar → Patient Tools → Patient Portal) is a patient-facing page. Click "View My Portal" to enter as Maria G (demo mode). It shows: profile info, active membership plan with perks, upcoming appointments, past visits, payment history, and lifetime value. Use "View as Member" on the Dashboard for the same view inside the admin app.' },
  { keys:['package','bundle','package builder','create package','sell package'],
    a:'Go to sidebar → Memberships → Packages tab. View existing packages (LipoAway Bundle, Botox Maintenance, etc.) or click "+ Create Package" to build a new one. Set a name, description, included services, price, and savings amount.' },
  { keys:['edit plan','edit membership','change plan','manage subscriber','pause','cancel member'],
    a:'To edit a membership plan, go to Memberships → click "Edit" on any plan card. To manage a subscriber (change plan, pause, cancel, or remove), go to the Subscribers tab and click "Manage" next to their name.' },
  { keys:['draft','save draft','chart draft'],
    a:'When creating a SOAP note in Charting, click "Save Draft" to save your work without signing. Drafts are stored and can be completed later. Click "Sign & Save Chart" when the note is finalized.' },
  { keys:['view as member','member view','member portal','demo member','preview member','what patients see'],
    a:'On the Dashboard, click "View as Member" to see the platform from a patient\'s perspective. It opens a full-screen preview showing Maria G\'s member portal: upcoming appointments, past visits, membership plan (Confidence Club), lifetime value, payment history, and a "Book Again" button. Close it with the X button top-right.' },
  { keys:['retail','product','skincare','sell','front desk','gift card','supplement','sunscreen','serum'],
    a:'Go to sidebar → Inventory → Retail Products tab. This tracks products sold at the front desk — skincare (SkinMedica TNS Serum, Revision Brightening Serum, Elta MD Sunscreen, ZO Exfoliating Polish), pain cream, and gift cards ($100/$250/$500). Each product shows retail price, cost, profit margin %, and stock level. Click "Sell" to record a quick sale — it deducts 1 from stock and logs the transaction. Stats at the top show inventory value at cost, at retail, potential profit, and total sales revenue. Low stock alerts appear when qty drops below reorder level.' },
  { keys:['waitlist','waiting','wait list','full','slot'],
    a:'In Appointments, click "Waitlist" to view and manage patients waiting for availability. Click "+ Add to Waitlist" to add a patient with their preferred service and provider. When a slot opens, click "Book Now" to move them straight into the appointment form.' },
  { keys:['recurring','repeat','automatic','auto book','regular','maintenance','schedule recurring'],
    a:'When creating a new appointment, check the "Repeat this appointment" box. Choose the interval (every 4, 6, 8, 12, or 26 weeks) and how many times (3, 4, 6, or 12). All recurring appointments are created at once when you save.' },
  { keys:['print','day sheet','daily schedule','front desk','printable'],
    a:'In Appointments, click "Print Day Sheet" to open a printable daily schedule. It shows all appointments for the selected day with patient names, phone numbers, services, providers, status, and notes. The browser print dialog opens automatically.' },
  { keys:['referral','referred','refer','credit','who referred'],
    a:'When adding or editing a patient, use the "Referred By" dropdown to select the referring patient. The referral shows on the patient detail view. Track referral sources across your patient base.' },
  { keys:['review','google review','yelp','rating','feedback','reputation'],
    a:'On any patient\'s detail view, click "Request Google Review" to send them a review request (demo simulates the message). Post-visit review requests can also be automated via Settings → Notifications.' },
  { keys:['loyalty','points','rewards','redeem','earn'],
    a:'Patients earn 1 loyalty point per $1 spent. View points on any patient\'s detail page. Click "Redeem Points" to apply rewards: 100 pts = $10 off, 250 pts = $25 off, 500 pts = Free Facial, 1000 pts = Free Botox. Configure rates in Settings → Loyalty Program.' },
  { keys:['gift card redeem','apply gift card','use gift card','gift card balance'],
    a:'In Payments, click "Redeem Gift Card" under Quick Charge. Enter the gift card code to apply the balance to the current transaction. Demo accepts any code starting with "GC" followed by the amount (e.g. GC100, GC250).' },
  { keys:['export','csv','download','report','pdf'],
    a:'In Analytics, click "Export CSV" to download a revenue report as a CSV file with all transactions. In Settings, click "Export All Data (JSON)" to download a complete backup of all platform data.' },
  { keys:['setting','settings','config','preferences','hours','business hours','notification','tax','integration'],
    a:'Go to sidebar → Settings. Configure: business name and contact info, tax rate, business hours per day, notification preferences (reminders, review requests, rebooking, birthday messages, low stock alerts), integration connections (Stripe, Twilio, EmailJS, Google Business, Boulevard), loyalty program rates, and data management (export/reset).' },
  { keys:['assign consent','attach consent','consent patient'],
    a:'When creating a SOAP note in Charting, click "Attach Consent Form" to link a consent form to the patient. Select from your created forms — it will be assigned to the patient and flagged for review at their next visit.' },
];

// ── Matcher ─────────────────────────────────────
function findAnswer(q) {
  const input = q.toLowerCase().trim();
  if (!input) return null;

  let bestMatch = null;
  let bestScore = 0;

  for (const entry of KB) {
    let score = 0;
    for (const key of entry.keys) {
      if (input.includes(key)) {
        score += key.split(' ').length + key.length / 10;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = entry;
    }
  }

  if (bestMatch && bestScore > 0) return bestMatch.a;

  // Fuzzy: check if any word from input appears in any key
  const words = input.split(/\s+/).filter(w => w.length > 2);
  for (const entry of KB) {
    for (const key of entry.keys) {
      for (const word of words) {
        if (key.includes(word)) return entry.a;
      }
    }
  }

  return null;
}

// ── Build Widget ────────────────────────────────
function init() {
  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #hoc-chat-fab{position:fixed;bottom:24px;right:24px;width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#F00573,#722A82);color:#fff;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(240,5,115,.35);display:flex;align-items:center;justify-content:center;font-size:22px;z-index:9999;transition:transform .15s,box-shadow .15s;}
    #hoc-chat-fab:hover{transform:scale(1.08);box-shadow:0 6px 24px rgba(240,5,115,.45);}
    #hoc-chat-panel{position:fixed;bottom:88px;right:24px;width:360px;max-height:500px;background:#fff;border-radius:14px;box-shadow:0 8px 40px rgba(0,0,0,.18);z-index:9999;display:none;flex-direction:column;overflow:hidden;font-family:'Montserrat',sans-serif;border:1px solid #e5e1e8;}
    #hoc-chat-panel.open{display:flex;}
    .hoc-chat-hdr{background:#F00573;color:#fff;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;flex-shrink:0;}
    .hoc-chat-hdr-title{font-family:'Poppins',sans-serif;font-size:14px;font-weight:600;}
    .hoc-chat-hdr-sub{font-size:10px;opacity:.8;margin-top:1px;}
    .hoc-chat-close{background:none;border:none;color:#fff;font-size:18px;cursor:pointer;padding:0 2px;opacity:.8;}
    .hoc-chat-close:hover{opacity:1;}
    .hoc-chat-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;min-height:200px;max-height:340px;}
    .hoc-chat-msg{max-width:88%;padding:10px 14px;border-radius:12px;font-size:12.5px;line-height:1.55;white-space:pre-line;word-wrap:break-word;}
    .hoc-chat-msg.bot{align-self:flex-start;background:#f4f3f5;color:#1a1418;border-bottom-left-radius:4px;}
    .hoc-chat-msg.user{align-self:flex-end;background:#F00573;color:#fff;border-bottom-right-radius:4px;}
    .hoc-chat-input-wrap{display:flex;gap:8px;padding:12px 14px;border-top:1px solid #e5e1e8;background:#fff;flex-shrink:0;}
    .hoc-chat-input{flex:1;padding:9px 12px;border:1px solid #d1cdd6;border-radius:8px;font-size:13px;font-family:'Montserrat',sans-serif;color:#1a1418;outline:none;background:#fff;}
    .hoc-chat-input:focus{border-color:#F00573;}
    .hoc-chat-send{background:#F00573;color:#fff;border:none;border-radius:8px;padding:9px 16px;font-size:12px;font-weight:500;cursor:pointer;font-family:'Montserrat',sans-serif;white-space:nowrap;transition:opacity .12s;}
    .hoc-chat-send:hover{opacity:.88;}
    @media(max-width:480px){#hoc-chat-panel{right:8px;left:8px;width:auto;bottom:80px;max-height:70vh;}}
  `;
  document.head.appendChild(style);

  // FAB button
  const fab = document.createElement('button');
  fab.id = 'hoc-chat-fab';
  fab.innerHTML = '?';
  fab.title = 'Help';
  fab.onclick = toggleChat;
  document.body.appendChild(fab);

  // Chat panel
  const panel = document.createElement('div');
  panel.id = 'hoc-chat-panel';
  panel.innerHTML = `
    <div class="hoc-chat-hdr">
      <div>
        <div class="hoc-chat-hdr-title">Platform Help</div>
        <div class="hoc-chat-hdr-sub">Haus of Confidence</div>
      </div>
      <button class="hoc-chat-close" onclick="document.getElementById('hoc-chat-panel').classList.remove('open')">&times;</button>
    </div>
    <div class="hoc-chat-body" id="hoc-chat-body">
      <div class="hoc-chat-msg bot">Hi! I'm your platform assistant. Ask me anything about navigating the system, services, providers, locations, or how to complete a task.</div>
    </div>
    <div class="hoc-chat-input-wrap">
      <input class="hoc-chat-input" id="hoc-chat-input" type="text" placeholder="Ask a question..." autocomplete="off">
      <button class="hoc-chat-send" id="hoc-chat-send">Send</button>
    </div>
  `;
  document.body.appendChild(panel);

  // Events
  document.getElementById('hoc-chat-send').onclick = handleSend;
  document.getElementById('hoc-chat-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') handleSend();
  });
}

function toggleChat() {
  const panel = document.getElementById('hoc-chat-panel');
  panel.classList.toggle('open');
  if (panel.classList.contains('open')) {
    setTimeout(function(){ document.getElementById('hoc-chat-input').focus(); }, 100);
  }
}

function addMsg(text, type) {
  const body = document.getElementById('hoc-chat-body');
  const div = document.createElement('div');
  div.className = 'hoc-chat-msg ' + type;
  div.textContent = text;
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function handleSend() {
  const input = document.getElementById('hoc-chat-input');
  const q = input.value.trim();
  if (!q) return;

  addMsg(q, 'user');
  input.value = '';

  const answer = findAnswer(q);
  setTimeout(function() {
    addMsg(answer || "I don't have that answer — ask your administrator.", 'bot');
  }, 300);
}

// Init on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
