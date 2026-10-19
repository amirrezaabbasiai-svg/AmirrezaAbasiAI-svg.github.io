const $ = s => document.querySelector(s);
const $$ = s => document.querySelectorAll(s);

// Theme
const themeToggle = $('#themeToggle');
function setTheme(t){
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  themeToggle.innerHTML = t === 'dark' ? '<i class="fa-regular fa-sun"></i>' : '<i class="fa-regular fa-moon"></i>';
}
setTheme(localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeToggle.addEventListener('click', ()=>{
  const cur = document.documentElement.getAttribute('data-theme');
  setTheme(cur === 'dark' ? 'light' : 'dark');
});

// Mobile menu
$('#hamburger').addEventListener('click', ()=> $('#mobileMenu').classList.toggle('open'));
$$('#mobileMenu a').forEach(a=>a.addEventListener('click', ()=> $('#mobileMenu').classList.remove('open')));

// Year
$('#year').textContent = new Date().getFullYear();

// Form
function handleForm(e){
  e.preventDefault();
  $('#formSuccess').classList.remove('hidden');
  e.target.reset();
  setTimeout(()=> $('#formSuccess').classList.add('hidden'), 4000);
}
window.handleForm = handleForm;

// Edit mode
let editing = false;
function toggleEdit(on){
  editing = on;
  document.body.classList.toggle('editing', on);
  document.documentElement.setAttribute('data-editing', on);
  $('#editBanner').classList.toggle('active', on);
  $('#editBtn').innerHTML = on ? '<i class="fa-solid fa-check"></i> Editing...' : '<i class="fa-solid fa-pen"></i> Customize';
  if(on){
    $$('[data-edit]').forEach(el=>{
      el.contentEditable = true;
      el.addEventListener('blur', saveEdits);
      el.addEventListener('keydown', e=>{
        if(e.key === 'Enter' && !e.shiftKey){
          e.preventDefault();
          el.blur();
        }
      });
    });
  } else {
    $$('[data-edit]').forEach(el=>{
      el.contentEditable = false;
      el.removeEventListener('blur', saveEdits);
    });
    saveEdits();
  }
}
window.toggleEdit = toggleEdit;

function saveEdits(){
  const data = {};
  $$('[data-edit]').forEach(el=>{
    data[el.getAttribute('data-edit')] = el.innerHTML;
  });
  localStorage.setItem('portfolio_edits', JSON.stringify(data));
}
function loadEdits(){
  const raw = localStorage.getItem('portfolio_edits');
  if(!raw) return;
  try{
    const data = JSON.parse(raw);
    Object.entries(data).forEach(([k,v])=>{
      const el = document.querySelector(`[data-edit="${k}"]`);
      if(el) el.innerHTML = v;
    });
  }catch(e){}
}
loadEdits();

// Photo upload
$('#photoUpload').addEventListener('change', e=>{
  const file = e.target.files[0];
  if(!file) return;
  const url = URL.createObjectURL(file);
  const wrap = $('#profileImg');
  wrap.innerHTML = `<img src="${url}" alt="Profile photo">`;
  // Save to localStorage as data URL for persistence
  const reader = new FileReader();
  reader.onload = ()=> localStorage.setItem('portfolio_photo', reader.result);
  reader.readAsDataURL(file);
});
const savedPhoto = localStorage.getItem('portfolio_photo');
if(savedPhoto){
  $('#profileImg').innerHTML = `<img src="${savedPhoto}" alt="Profile photo">`;
}

// Customize modal
function openCustomize(){
  $('#customizeModal').classList.remove('hidden');
}
function closeCustomize(){
  $('#customizeModal').classList.add('hidden');
}
window.closeCustomize = closeCustomize;
window.openCustomize = openCustomize;

$('#editBtn').addEventListener('click', (e)=>{
  e.preventDefault();
  if(!editing) openCustomize();
  else toggleEdit(false);
});

// Quick edit apply
function applyQuickEdit(){
  const map = {
    inpName: ['heroName1','profileName','footerName'],
    inpTitle: ['heroTitle','profileRole'],
    inpEmail: ['email','cEmail'],
    inpLocation: ['profileLocation','cLoc','qfLocation'],
    inpLinkedin: ['linkedin','cLinked'],
    inpGithub: ['github']
  };
  Object.entries(map).forEach(([inputId, editKeys])=>{
    const val = document.getElementById(inputId).value.trim();
    if(!val) return;
    editKeys.forEach(k=>{
      const el = document.querySelector(`[data-edit="${k}"]`);
      if(el) el.textContent = val;
    });
  });
  // availability/title special
  const titleVal = $('#inpTitle').value.trim();
  if(titleVal){
    const tEl = document.querySelector('[data-edit="profileRole"]');
    if(tEl) tEl.textContent = titleVal;
  }
  saveEdits();
  closeCustomize();
  // Auto show edit hint
  toggleEdit(true);
}
window.applyQuickEdit = applyQuickEdit;

function resetAll(){
  localStorage.removeItem('portfolio_edits');
  localStorage.removeItem('portfolio_photo');
  location.reload();
}
window.resetAll = resetAll;

// Allow clicking customize via modal button alternative
// Enable edit on data-edit click when not editing? Offer to enable
$$('[data-edit]').forEach(el=>{
  el.addEventListener('click', ()=>{
    if(!editing){
      // subtle hint: open customize
      // but don't intrude every time; just once
      if(!localStorage.getItem('hint_shown')){
        localStorage.setItem('hint_shown','1');
      }
    }
  });
});

// Pre-fill modal from current edits
function syncModalInputs(){
  const get = k => {
    const el = document.querySelector(`[data-edit="${k}"]`);
    return el ? el.textContent.trim() : '';
  };
  $('#inpName').placeholder = get('heroName1') || 'Your name';
  $('#inpTitle').placeholder = get('heroTitle') || 'Your title';
  $('#inpEmail').placeholder = get('email') || 'your@email.com';
  $('#inpLocation').placeholder = get('profileLocation') || 'City, Country';
}
document.addEventListener('click', e=>{
  if(e.target.closest('#editBtn')) syncModalInputs();
});

// Smooth nav active
const sections = ['about','experience','projects','skills','contact'];
const navLinks = $$('.nav-links a');
window.addEventListener('scroll', ()=>{
  const y = window.scrollY + 120;
  let active = null;
  sections.forEach(id=>{
    const el = document.getElementById(id);
    if(el && el.offsetTop <= y) active = id;
  });
  navLinks.forEach(a=>{
    a.style.color = a.getAttribute('href') === '#'+active ? 'var(--text)' : '';
    a.style.fontWeight = a.getAttribute('href') === '#'+active ? '700' : '';
  });
});

// Reveal on scroll
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.style.opacity = 1;
      e.target.style.transform = 'translateY(0)';
    }
  });
},{threshold:0.08});
$$('.section, .tl-card, .project-card, .skill-group').forEach(el=>{
  el.style.opacity = 0;
  el.style.transform = 'translateY(12px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});
