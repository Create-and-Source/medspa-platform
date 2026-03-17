import{E as e,G as t,H as n,W as r,j as i,q as a,x as o}from"./store-CTGwobvr.js";var s=a(t(),1),c=r(),l=`ms_waivers`;function u(){try{return JSON.parse(localStorage.getItem(l))||[]}catch{return[]}}function d(e){localStorage.setItem(l,JSON.stringify(e))}var f=[{id:`general`,name:`General Treatment Consent`,category:`Required`,content:`INFORMED CONSENT FOR AESTHETIC TREATMENT

I, [Patient Name], voluntarily consent to the following aesthetic treatment(s): [Treatment Name].

I understand that:
1. The procedure, its risks, benefits, and alternatives have been explained to me
2. Results may vary and are not guaranteed
3. I may experience side effects including but not limited to: redness, swelling, bruising, pain, infection, scarring, or allergic reaction
4. I have disclosed all relevant medical history, medications, and allergies
5. I agree to follow all pre- and post-treatment instructions provided

I have had the opportunity to ask questions and all questions have been answered to my satisfaction.

I authorize [Provider Name] to perform the treatment and take clinical photographs for my medical record.

Patient Signature: _________________________
Date: ____________
Witness: _________________________`},{id:`botox`,name:`Botox/Neurotoxin Consent`,category:`Injectable`,content:`INFORMED CONSENT FOR BOTULINUM TOXIN (BOTOX/DYSPORT/XEOMIN)

I understand that botulinum toxin is a purified protein that temporarily relaxes muscles to reduce the appearance of wrinkles.

RISKS include but are not limited to:
- Bruising, swelling, or redness at injection sites
- Headache
- Temporary eyelid or brow drooping (ptosis)
- Asymmetry
- Allergic reaction (rare)
- Results typically last 3-4 months

CONTRAINDICATIONS:
- Pregnancy or breastfeeding
- Neuromuscular disorders (myasthenia gravis, ALS)
- Allergy to botulinum toxin or albumin
- Active infection at treatment site

I confirm I am NOT pregnant, nursing, or planning to become pregnant.
I have disclosed all medications including blood thinners and supplements.

Patient Signature: _________________________
Date: ____________`},{id:`filler`,name:`Dermal Filler Consent`,category:`Injectable`,content:`INFORMED CONSENT FOR DERMAL FILLER INJECTION

I understand that hyaluronic acid dermal fillers are used to restore volume, smooth lines, and enhance facial features.

RISKS include but are not limited to:
- Bruising, swelling, tenderness at injection sites
- Asymmetry or irregularities
- Infection
- Nodule formation
- Vascular occlusion (rare but serious — may cause tissue death or vision changes)
- Allergic reaction
- Migration of filler material

EMERGENCY: If I experience sudden vision changes, severe pain, or skin blanching after treatment, I will contact the office immediately.

I understand that filler can be dissolved with hyaluronidase if needed.

Patient Signature: _________________________
Date: ____________`},{id:`laser`,name:`Laser/IPL Consent`,category:`Laser`,content:`INFORMED CONSENT FOR LASER/IPL TREATMENT

RISKS include:
- Burns or blistering
- Hyperpigmentation or hypopigmentation
- Scarring (rare)
- Eye injury if protective eyewear is removed
- Incomplete results requiring additional sessions

PRE-TREATMENT REQUIREMENTS:
- No sun exposure or tanning 2 weeks before/after
- Discontinue retinoids 5-7 days prior
- No self-tanner on treatment area
- Shave treatment area (laser hair removal only)

Patient Signature: _________________________
Date: ____________`},{id:`photo`,name:`Photo/Marketing Consent`,category:`Optional`,content:`CONSENT FOR PHOTOGRAPHS AND MARKETING USE

I authorize [Business Name] to take before and after photographs of my treatment.

I consent to the use of these photographs for:
[ ] Medical records only
[ ] Medical records AND anonymous marketing (face not identifiable)
[ ] Medical records AND identifiable marketing (social media, website, print)

I understand I may revoke this consent at any time in writing.

Patient Signature: _________________________
Date: ____________`},{id:`hipaa`,name:`HIPAA Privacy Notice`,category:`Required`,content:`ACKNOWLEDGMENT OF RECEIPT OF HIPAA PRIVACY NOTICE

I acknowledge that I have received a copy of [Business Name]'s Notice of Privacy Practices. This notice describes how my health information may be used and disclosed, and how I can access this information.

I understand my rights regarding my protected health information.

Patient Signature: _________________________
Date: ____________`},{id:`medical-history`,name:`Medical History Form`,category:`Required`,content:`PATIENT MEDICAL HISTORY

Please answer the following:
- Current medications: _______________
- Known allergies: _______________
- Previous cosmetic procedures: _______________
- Medical conditions (diabetes, autoimmune, bleeding disorders): _______________
- Are you pregnant or nursing? [ ] Yes [ ] No
- Do you have a history of cold sores? [ ] Yes [ ] No
- Do you have a pacemaker or metal implants? [ ] Yes [ ] No
- Are you currently using retinoids or blood thinners? [ ] Yes [ ] No

I certify that the above information is accurate and complete.

Patient Signature: _________________________
Date: ____________`}];function p(){if(localStorage.getItem(`ms_waivers_init`))return;let e=new Date,t=t=>new Date(e-t*864e5).toISOString();d([{id:`W-1`,templateId:`general`,patientId:`PAT-1000`,patientName:`Emma Johnson`,signedAt:t(5),signatureData:`Emma Johnson`,witnessName:`Jessica Park, NP`,status:`signed`,expiresAt:t(-360)},{id:`W-2`,templateId:`botox`,patientId:`PAT-1000`,patientName:`Emma Johnson`,signedAt:t(5),signatureData:`Emma Johnson`,witnessName:`Dr. Sarah Mitchell`,status:`signed`,expiresAt:t(-360)},{id:`W-3`,templateId:`photo`,patientId:`PAT-1000`,patientName:`Emma Johnson`,signedAt:t(5),signatureData:`Emma Johnson`,witnessName:``,status:`signed`,photoConsent:`identifiable`,expiresAt:t(-360)},{id:`W-4`,templateId:`general`,patientId:`PAT-1003`,patientName:`Ava Jones`,signedAt:t(30),signatureData:`Ava Jones`,witnessName:`Emily Chen, RN`,status:`signed`,expiresAt:t(-335)},{id:`W-5`,templateId:`laser`,patientId:`PAT-1003`,patientName:`Ava Jones`,signedAt:t(30),signatureData:`Ava Jones`,witnessName:`Jessica Park, NP`,status:`signed`,expiresAt:t(-335)},{id:`W-6`,templateId:`general`,patientId:`PAT-1005`,patientName:`Mia Garcia`,signedAt:null,signatureData:null,witnessName:``,status:`pending`,expiresAt:null},{id:`W-7`,templateId:`hipaa`,patientId:`PAT-1002`,patientName:`Sophia Brown`,signedAt:t(20),signatureData:`Sophia Brown`,witnessName:``,status:`signed`,expiresAt:t(-345)}]),localStorage.setItem(`ms_waivers_init`,`true`)}function m(){let t=n(),[,r]=(0,s.useState)(0);(0,s.useEffect)(()=>i(()=>r(e=>e+1)),[]),(0,s.useEffect)(()=>{p(),r(e=>e+1)},[]);let[a,l]=(0,s.useState)(u),[m,h]=(0,s.useState)(`waivers`),[g,_]=(0,s.useState)(``),[v,y]=(0,s.useState)(`all`),[b,x]=(0,s.useState)(!1),[S,C]=(0,s.useState)({patientId:``,templateIds:[]}),[w,T]=(0,s.useState)(null),[E,D]=(0,s.useState)(null),[O,k]=(0,s.useState)(``);(0,s.useRef)(null);let[A,j]=(0,s.useState)(!1),M=o(),N=e(),P=()=>l(u()),F=a.filter(e=>{if(g){let t=g.toLowerCase();if(!e.patientName?.toLowerCase().includes(t))return!1}return!(v!==`all`&&e.status!==v)}).sort((e,t)=>(t.signedAt||`9999`).localeCompare(e.signedAt||`9999`)),I=a.filter(e=>e.status===`signed`).length,L=a.filter(e=>e.status===`pending`).length,R=()=>{if(!S.patientId||S.templateIds.length===0)return;let e=M.find(e=>e.id===S.patientId),t=u();S.templateIds.forEach(n=>{t.push({id:`W-${Date.now()}-${n}`,templateId:n,patientId:S.patientId,patientName:e?`${e.firstName} ${e.lastName}`:`Unknown`,signedAt:null,signatureData:null,witnessName:``,status:`pending`,expiresAt:null})}),d(t),P(),x(!1),C({patientId:``,templateIds:[]})},z=e=>{O.trim()&&(d(u().map(t=>{if(t.id===e){let e=new Date;return e.setFullYear(e.getFullYear()+1),{...t,status:`signed`,signedAt:new Date().toISOString(),signatureData:O,expiresAt:e.toISOString()}}return t})),P(),D(null),k(``))},B=e=>{C(t=>({...t,templateIds:t.templateIds.includes(e)?t.templateIds.filter(t=>t!==e):[...t.templateIds,e]}))};return(0,c.jsxs)(`div`,{children:[(0,c.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,alignItems:`flex-start`,marginBottom:24,flexWrap:`wrap`,gap:12},children:[(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`h1`,{style:{font:`600 26px ${t.FONT}`,color:t.text,marginBottom:4},children:`Consent & Waivers`}),(0,c.jsx)(`p`,{style:{font:`400 14px ${t.FONT}`,color:t.text2},children:`Digital consent forms, e-signatures, and compliance tracking`})]}),(0,c.jsx)(`button`,{onClick:()=>x(!0),style:t.pillAccent,children:`+ Send Waivers`})]}),(0,c.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fit, minmax(160px, 1fr))`,gap:12,marginBottom:24},children:[{label:`Total Waivers`,value:a.length},{label:`Signed`,value:I,color:t.success},{label:`Pending Signature`,value:L,color:L>0?t.warning:t.success},{label:`Templates`,value:f.length}].map(e=>(0,c.jsxs)(`div`,{style:{...t.cardStyle,padding:`14px 18px`},children:[(0,c.jsx)(`div`,{style:{font:`400 10px ${t.MONO}`,textTransform:`uppercase`,letterSpacing:1,color:t.text3,marginBottom:4},children:e.label}),(0,c.jsx)(`div`,{style:{font:`600 22px ${t.FONT}`,color:e.color||t.text},children:e.value})]},e.label))}),(0,c.jsx)(`div`,{style:{display:`flex`,gap:0,marginBottom:20,background:`#F0F0F0`,borderRadius:8,overflow:`hidden`,width:`fit-content`},children:[[`waivers`,`Patient Waivers`],[`templates`,`Templates`]].map(([e,n])=>(0,c.jsx)(`button`,{onClick:()=>h(e),style:{padding:`9px 20px`,background:m===e?`#fff`:`transparent`,border:`none`,font:`500 13px ${t.FONT}`,color:m===e?t.text:t.text3,cursor:`pointer`,borderRadius:m===e?8:0,boxShadow:m===e?t.shadow:`none`},children:n},e))}),m===`waivers`&&(0,c.jsxs)(c.Fragment,{children:[(0,c.jsxs)(`div`,{style:{display:`flex`,gap:12,marginBottom:16,flexWrap:`wrap`},children:[(0,c.jsx)(`input`,{value:g,onChange:e=>_(e.target.value),placeholder:`Search patient...`,style:{...t.input,maxWidth:240}}),(0,c.jsx)(`div`,{style:{display:`flex`,gap:6},children:[[`all`,`All`],[`signed`,`Signed`],[`pending`,`Pending`]].map(([e,n])=>(0,c.jsx)(`button`,{onClick:()=>y(e),style:{...t.pill,padding:`6px 14px`,fontSize:12,background:v===e?t.accent:`transparent`,color:v===e?t.accentText:t.text2,border:v===e?`1px solid ${t.accent}`:`1px solid #E5E5E5`},children:n},e))})]}),(0,c.jsx)(`div`,{style:t.tableWrap,children:(0,c.jsxs)(`table`,{style:{width:`100%`,borderCollapse:`collapse`},children:[(0,c.jsx)(`thead`,{children:(0,c.jsx)(`tr`,{style:{borderBottom:`1px solid #E5E5E5`},children:[`Patient`,`Form`,`Status`,`Signed`,`Expires`,`Actions`].map(e=>(0,c.jsx)(`th`,{style:{padding:`12px 14px`,font:`500 11px ${t.MONO}`,textTransform:`uppercase`,letterSpacing:1,color:t.text3,textAlign:`left`},children:e},e))})}),(0,c.jsxs)(`tbody`,{children:[F.map(e=>{let n=f.find(t=>t.id===e.templateId),r=e.expiresAt&&new Date(e.expiresAt)<new Date;return(0,c.jsxs)(`tr`,{style:{borderBottom:`1px solid #F5F5F5`},children:[(0,c.jsx)(`td`,{style:{padding:`12px 14px`,font:`500 13px ${t.FONT}`,color:t.text},children:e.patientName}),(0,c.jsxs)(`td`,{style:{padding:`12px 14px`},children:[(0,c.jsx)(`div`,{style:{font:`400 13px ${t.FONT}`,color:t.text},children:n?.name||`Unknown`}),(0,c.jsx)(`div`,{style:{font:`400 10px ${t.FONT}`,color:t.text3},children:n?.category})]}),(0,c.jsx)(`td`,{style:{padding:`12px 14px`},children:(0,c.jsx)(`span`,{style:{padding:`3px 10px`,borderRadius:100,font:`500 10px ${t.FONT}`,textTransform:`uppercase`,background:e.status===`signed`?`#F0FDF4`:`#FFF7ED`,color:e.status===`signed`?t.success:t.warning},children:r?`Expired`:e.status})}),(0,c.jsx)(`td`,{style:{padding:`12px 14px`,font:`400 12px ${t.FONT}`,color:t.text2},children:e.signedAt?new Date(e.signedAt).toLocaleDateString(`en-US`,{month:`short`,day:`numeric`,year:`numeric`}):`—`}),(0,c.jsx)(`td`,{style:{padding:`12px 14px`,font:`400 12px ${t.FONT}`,color:r?t.danger:t.text3},children:e.expiresAt?new Date(e.expiresAt).toLocaleDateString(`en-US`,{month:`short`,day:`numeric`,year:`numeric`}):`—`}),(0,c.jsx)(`td`,{style:{padding:`12px 14px`},children:(0,c.jsxs)(`div`,{style:{display:`flex`,gap:4},children:[(0,c.jsx)(`button`,{onClick:()=>T(n),style:{...t.pillGhost,padding:`4px 8px`,fontSize:10},children:`View`}),e.status===`pending`&&(0,c.jsx)(`button`,{onClick:()=>{D(e.id),k(``)},style:{...t.pillAccent,padding:`4px 10px`,fontSize:10},children:`Sign`})]})})]},e.id)}),F.length===0&&(0,c.jsx)(`tr`,{children:(0,c.jsx)(`td`,{colSpan:`6`,style:{padding:40,textAlign:`center`,font:`400 13px ${t.FONT}`,color:t.text3},children:`No waivers found`})})]})]})})]}),m===`templates`&&(0,c.jsx)(`div`,{style:{display:`grid`,gridTemplateColumns:`repeat(auto-fill, minmax(300px, 1fr))`,gap:12},children:f.map(e=>(0,c.jsxs)(`div`,{style:{...t.cardStyle,padding:20},children:[(0,c.jsxs)(`div`,{style:{display:`flex`,justifyContent:`space-between`,marginBottom:8},children:[(0,c.jsx)(`div`,{style:{font:`600 14px ${t.FONT}`,color:t.text},children:e.name}),(0,c.jsx)(`span`,{style:{padding:`2px 8px`,borderRadius:100,background:`#F5F5F5`,font:`500 10px ${t.FONT}`,color:t.text2},children:e.category})]}),(0,c.jsxs)(`div`,{style:{font:`400 12px ${t.FONT}`,color:t.text3,lineHeight:1.5,maxHeight:80,overflow:`hidden`,marginBottom:12},children:[e.content.slice(0,150),`...`]}),(0,c.jsx)(`button`,{onClick:()=>T(e),style:{...t.pillOutline,padding:`5px 12px`,fontSize:11},children:`Preview`})]},e.id))}),b&&(0,c.jsx)(`div`,{style:{position:`fixed`,inset:0,background:`rgba(0,0,0,0.4)`,display:`flex`,alignItems:`center`,justifyContent:`center`,zIndex:300},onClick:()=>x(!1),children:(0,c.jsxs)(`div`,{style:{background:`#fff`,borderRadius:16,padding:32,maxWidth:520,width:`90%`,boxShadow:t.shadowLg,maxHeight:`90vh`,overflowY:`auto`},onClick:e=>e.stopPropagation(),children:[(0,c.jsx)(`h2`,{style:{font:`600 20px ${t.FONT}`,color:t.text,marginBottom:20},children:`Send Consent Forms`}),(0,c.jsxs)(`div`,{style:{marginBottom:16},children:[(0,c.jsx)(`label`,{style:t.label,children:`Patient`}),(0,c.jsxs)(`select`,{value:S.patientId,onChange:e=>C({...S,patientId:e.target.value}),style:{...t.input,cursor:`pointer`},children:[(0,c.jsx)(`option`,{value:``,children:`Select patient...`}),M.map(e=>(0,c.jsxs)(`option`,{value:e.id,children:[e.firstName,` `,e.lastName]},e.id))]})]}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`label`,{style:t.label,children:`Select Forms`}),(0,c.jsx)(`div`,{style:{display:`grid`,gap:6},children:f.map(e=>(0,c.jsxs)(`label`,{style:{display:`flex`,alignItems:`center`,gap:10,padding:`10px 14px`,borderRadius:8,border:S.templateIds.includes(e.id)?`2px solid ${t.accent}`:`1px solid #E5E5E5`,cursor:`pointer`},children:[(0,c.jsx)(`input`,{type:`checkbox`,checked:S.templateIds.includes(e.id),onChange:()=>B(e.id),style:{accentColor:t.accent}}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(`div`,{style:{font:`500 13px ${t.FONT}`,color:t.text},children:e.name}),(0,c.jsx)(`div`,{style:{font:`400 11px ${t.FONT}`,color:t.text3},children:e.category})]})]},e.id))})]}),(0,c.jsxs)(`div`,{style:{display:`flex`,gap:10,marginTop:20,justifyContent:`flex-end`},children:[(0,c.jsx)(`button`,{onClick:()=>x(!1),style:t.pillGhost,children:`Cancel`}),(0,c.jsxs)(`button`,{onClick:R,style:{...t.pillAccent,opacity:S.patientId&&S.templateIds.length>0?1:.4},children:[`Send `,S.templateIds.length,` Form`,S.templateIds.length===1?``:`s`]})]})]})}),w&&(0,c.jsx)(`div`,{style:{position:`fixed`,inset:0,background:`rgba(0,0,0,0.5)`,display:`flex`,alignItems:`center`,justifyContent:`center`,zIndex:300},onClick:()=>T(null),children:(0,c.jsxs)(`div`,{style:{background:`#fff`,borderRadius:16,padding:32,maxWidth:640,width:`90%`,boxShadow:t.shadowLg,maxHeight:`85vh`,overflowY:`auto`},onClick:e=>e.stopPropagation(),children:[(0,c.jsx)(`h2`,{style:{font:`600 18px ${t.FONT}`,color:t.text,marginBottom:16},children:w.name}),(0,c.jsx)(`div`,{style:{font:`400 13px ${t.FONT}`,color:t.text2,lineHeight:1.8,whiteSpace:`pre-wrap`,background:`#FAFAFA`,padding:20,borderRadius:10,border:`1px solid #F0F0F0`},children:w.content.replace(/\[Business Name\]/g,N.businessName||`Your MedSpa`)}),(0,c.jsx)(`button`,{onClick:()=>T(null),style:{...t.pillGhost,marginTop:16},children:`Close`})]})}),E&&(0,c.jsx)(`div`,{style:{position:`fixed`,inset:0,background:`rgba(0,0,0,0.4)`,display:`flex`,alignItems:`center`,justifyContent:`center`,zIndex:300},onClick:()=>D(null),children:(0,c.jsxs)(`div`,{style:{background:`#fff`,borderRadius:16,padding:32,maxWidth:400,width:`90%`,boxShadow:t.shadowLg},onClick:e=>e.stopPropagation(),children:[(0,c.jsx)(`h2`,{style:{font:`600 18px ${t.FONT}`,color:t.text,marginBottom:16},children:`Sign Consent Form`}),(0,c.jsxs)(`div`,{style:{marginBottom:16},children:[(0,c.jsx)(`label`,{style:t.label,children:`Type Full Legal Name`}),(0,c.jsx)(`input`,{value:O,onChange:e=>k(e.target.value),style:{...t.input,fontSize:18,fontStyle:`italic`,textAlign:`center`},placeholder:`Full Name`,autoFocus:!0})]}),(0,c.jsx)(`div`,{style:{padding:16,background:`#FAFAFA`,borderRadius:10,textAlign:`center`,marginBottom:16,border:`1px dashed #DDD`,minHeight:60,display:`flex`,alignItems:`center`,justifyContent:`center`},children:O?(0,c.jsx)(`span`,{style:{font:`italic 28px 'Georgia', serif`,color:t.text},children:O}):(0,c.jsx)(`span`,{style:{font:`400 13px ${t.FONT}`,color:t.text3},children:`Signature preview`})}),(0,c.jsxs)(`div`,{style:{display:`flex`,gap:10,justifyContent:`flex-end`},children:[(0,c.jsx)(`button`,{onClick:()=>D(null),style:t.pillGhost,children:`Cancel`}),(0,c.jsx)(`button`,{onClick:()=>z(E),disabled:!O.trim(),style:{...t.pillAccent,opacity:O.trim()?1:.4},children:`Sign & Submit`})]})]})})]})}export{m as default};