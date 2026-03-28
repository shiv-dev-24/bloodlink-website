const translations = {
  en: {
    navHome: 'Home', navRequest: 'Request Blood', navDonate:'Become a Donor', navLearn:'Learn About Blood Donation', navDonors:'Donor List', navCoord:'Coordinator', navContact:'Contact', navAbout:'About',
    heroTitle: 'Save Lives – Donate Blood', heroText:'BloodLink connects patients, donors and coordinators in emergencies. Switch language instantly and help more people.', heroCTA1:'Request Blood', heroCTA2:'Become a Donor',
    statsTitle:'Live Impact Stats', stat1:'Total Donations', stat2:'Active Donors', stat3:'Requests Served', stat4:'Lives Saved',
    learnTitle:'Blood Donation Knowledge Hub',
    requestTitle:'Emergency Blood Request', donateTitle:'Donor Registration', eligibilityTitle:'Medical History & Eligibility Check',
    statusPending:'Pending', statusAccepted:'Accepted', statusFulfilled:'Fulfilled',
    eligibilityWarning:'You may not be eligible to donate blood currently.',
    noMedical:'No medical history (Safe to donate)',
  },
  hi: {
    navHome:'होम', navRequest:'रक्त मांगें', navDonate:'डोनर बनें', navLearn:'रक्त दान के बारे में जानें', navDonors:'डोनर सूची', navCoord:'समन्वयक', navContact:'संपर्क', navAbout:'जानकारी',
    heroTitle:'जीवन बचाएं – रक्त दान करें', heroText:'BloodLink आपातकालीन में रोगी, दाता और समन्वयकों को जोड़ता है। भाषा तुरंत बदलें और अधिक लोगों की मदद करें।', heroCTA1:'रक्त मांगें', heroCTA2:'डोनर बनें',
    statsTitle:'जीवंत प्रभाव सांख्यिकी', stat1:'कुल दान', stat2:'सक्रिय दाता', stat3:'मांगे पूरी', stat4:'बचाई गई जानें',
    learnTitle:'रक्त दान ज्ञान केंद्र', requestTitle:'आपातकालीन रक्त अनुरोध', donateTitle:'डोनर पंजीकरण', eligibilityTitle:'चिकित्सा इतिहास और पात्रता जांच',
    statusPending:'लंबित', statusAccepted:'स्वीकृत', statusFulfilled:'पूरा', eligibilityWarning:'आप वर्तमान में रक्त दान करने के लिए पात्र नहीं हो सकते।', noMedical:'कोई चिकित्सा इतिहास नहीं (दान करने के लिए सुरक्षित)',
  },
  mr: {
    navHome:'मुख्यपृष्ठ', navRequest:'रक्त मागा', navDonate:'दानदार बना', navLearn:'रक्तदानाबद्दल शिका', navDonors:'दानदार यादी', navCoord:'समन्वयक', navContact:'संपर्क', navAbout:'बद्दल',
    heroTitle:'जीवन वाचवा – रक्तदान करा', heroText:'BloodLink आपत्कालीन मध्ये रुग्ण, दाता आणि समन्वयकांना जोडतो. भाषा त्वरित बदला आणि अधिक लोकांची मदत करा.', heroCTA1:'रक्त मागा', heroCTA2:'दानदार बना',
    statsTitle:'प्रभावी आकडेवारी', stat1:'एकूण दान', stat2:'सक्रिय दाते', stat3:'मागण्या पूर्ण', stat4:'वाचवलेली जीवनं',
    learnTitle:'रक्तदान ज्ञान केंद्र', requestTitle:'आपत्कालीन रक्त विनंती', donateTitle:'दानदार नोंदणी', eligibilityTitle:'वैद्यकीय इतिहास आणि पात्रता तपासणी',
    statusPending:'प्रलंबित', statusAccepted:'स्वीकृत', statusFulfilled:'पूर्ण', eligibilityWarning:'आप सध्या रक्तदान करण्यास पात्र नसाल.', noMedical:'वैद्यकीय इतिहास नाही (दानासाठी सुरक्षित)',
  },
};

function setLanguage(lang) {
  if (!translations[lang]) lang='en';
  const map = translations[lang];
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key=el.dataset.i18n;
    if (map[key]) el.textContent = map[key];
  });
  document.documentElement.lang = lang;
  localStorage.setItem('bloodlinkLang', lang);
}

function initLanguage() {
  const saved = localStorage.getItem('bloodlinkLang') || 'en';
  const select = document.getElementById('langSelect');
  if (select) select.value = saved;
  setLanguage(saved);
}

function getConditionReasons() {
  return {
    'Diabetes':'Uncontrolled diabetes may increase donation risk during and after the process.',
    'Low Hemoglobin':'Low hemoglobin can cause weakness, fainting, and insufficient oxygen transport.',
    'Heart Disease':'Heart conditions may worsen under donation-induced stress.',
    'HIV':'HIV is transmissible through blood; donation is unsafe.',
    'Hepatitis B':'Hepatitis B can be transmitted and poses risk to recipients.',
    'Hepatitis C':'Hepatitis C can be transmitted and poses risk to recipients.',
    'Malaria':'Malaria can be transmitted through blood and is disqualifying presently.',
    'Recent Surgery':'Body needs recovery; donation can impair healing.',
    'Asthma':'Severe asthma may require medical clearance before donating.',
    'Thyroid Disorder':'Uncontrolled thyroid disease may cause donor risk.',
    'High Blood Pressure':'Uncontrolled hypertension may make donation unsafe.',
    'Covid-19':'Recent COVID-19 recovery may require waiting period.',
  };
}

function setupDonorForm() {
  const form = document.getElementById('donorForm');
  const reasonsDiv = document.getElementById('medicalReasons');
  const warnDiv = document.getElementById('eligibilityAlert');
  if (!form) return;
  const conds = Array.from(form.querySelectorAll('input[name="medicalHistory"]'));
  const otherInput = form.querySelector('#otherCondition');

  function updateStatus() {
    const selected = conds.filter(c=>c.checked).map(c=>c.value);
    const restricted = selected.filter(s=>Object.keys(getConditionReasons()).includes(s));
    if (restricted.length>0) {
      warnDiv.textContent = translations[document.documentElement.lang]?.eligibilityWarning || translations.en.eligibilityWarning;
      warnDiv.style.display = 'block';
      let html = '<ul style="margin:0;padding-left:1.2rem;">';
      restricted.forEach(r=>{
        const text = getConditionReasons()[r] || 'This condition may affect eligibility.';
        html += `<li><strong>${r}:</strong> ${text}</li>`;
      });
      html += '</ul>';
      reasonsDiv.innerHTML = html;
    } else if (selected.length===0) {
      warnDiv.style.display='none';
      reasonsDiv.textContent='Please select your conditions or no medical history.';
    } else {
      warnDiv.style.display='none';
      reasonsDiv.textContent='Your selections show no restricted conditions. Good job.';
    }
  }

  conds.forEach(c=>c.addEventListener('change',updateStatus));

  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const bloodGroup = form['bloodGroup'].value;
    const age = Number(form['age'].value);
    const weight = Number(form['weight'].value);
    const selected = conds.filter(c=>c.checked).map(c=>c.value);
    if (!bloodGroup || !age || !weight) {
      alert('Fill required fields.'); return;
    }
    if (age < 18 || age > 65) { alert('Donor age should be between 18 and 65 years.'); return; }
    if (weight < 50) { alert('Weight should be at least 50 kg.'); return; }
    if (selected.includes('No medical history (Safe to donate)') && selected.length>1) {
      alert('If you check No medical history, do not select other conditions.'); return; }

    const restricted = selected.filter(s=>Object.keys(getConditionReasons()).includes(s));
    if (restricted.length>0) {
      alert('Medical conditions selected indicate you may not be eligible currently. Coordinator contact will follow.');
    } else {
      alert('Registration successful. Thank you for signing up as a donor!');
      form.reset();
      updateStatus();
    }
  });

  updateStatus();
}

function setupRequestPage() {
  const form = document.getElementById('requestForm');
  if (!form) return;
  const levelEl = document.getElementById('urgencyLevel');
  const displayUrgency = document.getElementById('textUrgency');
  form.addEventListener('change', ()=>{
    const value = form['emergencyLevel'].value;
    if (value==='high') { levelEl.textContent='Critical'; levelEl.className='badge badge-critical'; displayUrgency.textContent='Critical priority: reach nearby donors ASAP.'; }
    else if (value==='medium') { levelEl.textContent='Urgent'; levelEl.className='badge badge-warning'; displayUrgency.textContent='Urgent: please coordinate quickly.'; }
    else { levelEl.textContent='Normal'; levelEl.className='badge badge-ok'; displayUrgency.textContent='Standard request.'; }
  });
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Request submitted. NSS coordinator will process immediately.');
    form.reset();
  });
}

function setupDonorList() {
  const table = document.getElementById('donorTable');
  if (!table) return;
  const rows = Array.from(table.querySelectorAll('tbody tr'));
  const group = document.getElementById('filterBlood');
  const city = document.getElementById('filterCity');
  const avail = document.getElementById('filterAvailability');
  const search = document.getElementById('filterSearch');

  function applyFilter() {
    const g=group?.value || ''; const c=city?.value||''; const a=avail?.value||''; const q=search?.value.toLowerCase()||'';
    rows.forEach(tr=>{
      const cells=[...tr.children].map(td=>td.textContent.toLowerCase());
      const blood=cells[1]; const location=cells[2]; const status=cells[3];
      const matches = (!g||blood===g.toLowerCase()) && (!c||location===c.toLowerCase()) && (!a||status===a.toLowerCase()) && (q===''||cells.some(cell=>cell.includes(q)));
      tr.style.display = matches ? '' : 'none';
    });
  }

  [group,city,avail,search].filter(Boolean).forEach(el=>el.addEventListener('input', applyFilter));
}

function setupCoordinator() {
  const table = document.getElementById('coordTable');
  if (!table) return;
  table.querySelectorAll('.statusControl').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const row = btn.closest('tr');
      const status = row.querySelector('.reqStatus');
      const next = btn.dataset.next;
      status.textContent = next;
      if (next === 'Fulfilled' || next==='पूर्ण' || next==='पूरा') {
        status.style.color='#2e7d32';
      } else if (next === 'Accepted' || next==='स्वीकृत' || next==='स्वीकृत') {
        status.style.color='#ef6c00';
      } else { status.style.color='#b71c1c'; }
    });
  });
}

function initPage() {
  initLanguage();
  setupDonorForm();
  setupRequestPage();
  setupDonorList();
  setupCoordinator();
}

document.addEventListener('DOMContentLoaded', initPage);
