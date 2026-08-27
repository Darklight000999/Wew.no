/* =========================================================
   DOM ELEMENTS & VARIABLES
   ========================================================= */
const bootScreen = document.getElementById("bootScreen");
const decryptButton = document.getElementById("decryptButton");
const bootVisual = document.getElementById("bootVisual");
const terminal = document.getElementById("terminal");
const bootCode = document.getElementById("bootCode");

const menuButton = document.getElementById("menuButton");
const menuOverlay = document.getElementById("menuOverlay");

const vaultBtn = document.getElementById("vaultBtn");
const clearanceKey = document.getElementById("clearanceKey");
const vaultMessage = document.getElementById("vaultMessage");
const vaultDashboard = document.getElementById("vaultDashboard");
const closeDashboard = document.getElementById("closeDashboard");

/* =========================================================
   CUSTOM CURSOR
   ========================================================= */
const cursor = document.getElementById("cursor");
window.addEventListener("mousemove", (event) => {
  cursor.style.left = event.clientX + "px";
  cursor.style.top = event.clientY + "px";
});
document.querySelectorAll(".hover-target").forEach((el) => {
  el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
  el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
});

/* =========================================================
   WEB AUDIO API
   ========================================================= */
let audioContext = null;
function createCyberSound() {
  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioContext.currentTime;

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(70, now);
    oscillator.frequency.exponentialRampToValueAtTime(30, now + 1.2);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.25, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start(now);
    oscillator.stop(now + 1.6);

    for (let i = 0; i < 12; i++) {
      const osc = audioContext.createOscillator();
      const g = audioContext.createGain();
      const start = now + 0.1 + i * 0.12;
      osc.type = "square";
      osc.frequency.value = 500 + Math.random() * 1200;
      g.gain.setValueAtTime(0.0001, start);
      g.gain.exponentialRampToValueAtTime(0.018, start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, start + 0.05);
      osc.connect(g);
      g.connect(audioContext.destination);
      osc.start(start);
      osc.stop(start + 0.06);
    }
  } catch (error) {
    console.log("Audio unavailable.");
  }
}

/* =========================================================
   BOOT SEQUENCE
   ========================================================= */
decryptButton.addEventListener("click", async () => {
  decryptButton.style.display = "none";
  bootVisual.classList.add("active");
  createCyberSound();

  const messages = [
    "INITIALIZING SECURE CHANNEL...",
    "VERIFYING CRYPTOGRAPHIC HANDSHAKE...",
    "BYPASSING SECURITY LAYER...",
    "SCANNING DIGITAL PERIMETER...",
    "IDENTITY MATRIX: VERIFIED",
    "ENCRYPTION: ACTIVE",
    "ACCESS GRANTED"
  ];
  terminal.innerHTML = "";

  for (let i = 0; i < messages.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 420));
    const line = document.createElement("div");
    line.textContent = "> " + messages[i];
    if (messages[i].includes("GRANTED") || messages[i].includes("VERIFIED")) line.classList.add("green");
    if (messages[i].includes("BYPASSING")) line.classList.add("red");
    terminal.appendChild(line);
    terminal.scrollTop = terminal.scrollHeight;
  }
  bootCode.textContent = "PROTOCOL DECRYPTED // ACCESS GRANTED";
  await new Promise(resolve => setTimeout(resolve, 600));
  bootScreen.classList.add("hidden");
  document.body.classList.remove("locked");
});

/* =========================================================
   COMMAND CENTER
   ========================================================= */
menuButton.addEventListener("click", () => menuOverlay.classList.toggle("open"));
document.querySelectorAll(".menu-link").forEach(link => {
  link.addEventListener("click", () => menuOverlay.classList.remove("open"));
});

/* =========================================================
   VAULT
   ========================================================= */
const DEMO_CLEARANCE_KEY = "DARKLIGHT-000999";
vaultBtn.addEventListener("click", () => {
  const entered = clearanceKey.value.trim();
  if (!entered) {
    vaultMessage.textContent = "CLEARANCE KEY REQUIRED";
    vaultMessage.style.color = "#ff3030";
    return;
  }
  if (entered === DEMO_CLEARANCE_KEY) {
    vaultMessage.textContent = "ACCESS GRANTED // OPENING VAULT";
    vaultMessage.style.color = "#9cff9c";
    setTimeout(() => { vaultDashboard.classList.add("active"); }, 700);
  } else {
    vaultMessage.textContent = "ACCESS DENIED // INVALID CLEARANCE";
    vaultMessage.style.color = "#ff3030";
    document.body.animate(
      [ { backgroundColor: "#050505" }, { backgroundColor: "#450000" }, { backgroundColor: "#050505" } ],
      { duration: 1000, iterations: 1 }
    );
  }
});
clearanceKey.addEventListener("keydown", (event) => { if (event.key === "Enter") vaultBtn.click(); });
closeDashboard.addEventListener("click", () => vaultDashboard.classList.remove("active"));

/* =========================================================
   THREE.JS COSMIC ENGINE
   ========================================================= */
const canvas = document.getElementById("threeCanvas");
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x020204, 0.035);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 1200);
camera.position.z = 7;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const starCount = window.innerWidth < 700 ? 1100 : 3200;
const starGeo = new THREE.BufferGeometry();
const starPos = new Float32Array(starCount * 3);
const starSize = new Float32Array(starCount);

for(let i=0; i<starCount; i++){
  const r = 18 + Math.random()*34;
  const theta = Math.random()*Math.PI*2;
  const phi = Math.acos((Math.random()*2)-1);
  starPos[i*3] = r*Math.sin(phi)*Math.cos(theta);
  starPos[i*3+1] = r*Math.cos(phi);
  starPos[i*3+2] = r*Math.sin(phi)*Math.sin(theta);
  starSize[i] = .5 + Math.random()*1.8;
}
starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
starGeo.setAttribute("size", new THREE.BufferAttribute(starSize, 1));

const starMat = new THREE.PointsMaterial({
  color: 0xd4af37, size: 0.028, transparent: true, opacity: 0.72,
  blending: THREE.AdditiveBlending, depthWrite: false
});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

const dustCount = window.innerWidth < 700 ? 650 : 1700;
const dustGeo = new THREE.BufferGeometry();
const dustPos = new Float32Array(dustCount * 3);

for(let i=0; i<dustCount; i++){
  const a = Math.random()*Math.PI*2;
  const radius = 1.8 + Math.pow(Math.random(), 0.65)*8;
  const y = (Math.random()-0.5)*2.4*(radius/8);
  dustPos[i*3] = Math.cos(a)*radius;
  dustPos[i*3+1] = y;
  dustPos[i*3+2] = Math.sin(a)*radius*0.72;
}
dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
const dustMat = new THREE.PointsMaterial({
  color: 0x8b0000, size: 0.022, transparent: true, opacity: 0.48,
  blending: THREE.AdditiveBlending, depthWrite: false
});
const dust = new THREE.Points(dustGeo, dustMat);
scene.add(dust);

const coreGeo = new THREE.SphereGeometry(1.12, 64, 64);
const coreMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
const core = new THREE.Mesh(coreGeo, coreMat);
core.position.z = -1.7;
scene.add(core);

const rings = [];
[[1.55, 0x8b0000, 0.030, 0.58], [1.88, 0xd4af37, 0.012, 0.32], [2.25, 0x8b0000, 0.009, 0.20]].forEach(([radius, color, width, opacity], idx) => {
  const g = new THREE.TorusGeometry(radius, width, 16, 180);
  const m = new THREE.MeshBasicMaterial({ color, transparent: true, opacity });
  const r = new THREE.Mesh(g, m);
  r.rotation.x = Math.PI / (2.1 + idx * 0.32);
  r.rotation.z = idx * 0.55;
  r.position.z = -1.65;
  scene.add(r); rings.push(r);
});

const corona = [];
for(let i=0; i<7; i++){
  const g = new THREE.TorusGeometry(1.28 + i * 0.055, 0.012, 12, 160);
  const m = new THREE.MeshBasicMaterial({ color: i%2 ? 0xd4af37 : 0x8b0000, transparent: true, opacity: 0.055 });
  const c = new THREE.Mesh(g, m);
  c.rotation.x = Math.PI / 2.25 + (i * 0.035);
  c.position.z = -1.62;
  scene.add(c); corona.push(c);
}

let targetX = 0, targetY = 0, mouseX = 0, mouseY = 0;
window.addEventListener("mousemove", (e) => {
  targetX = (e.clientX / window.innerWidth - 0.5) * 0.7;
  targetY = (e.clientY / window.innerHeight - 0.5) * 0.45;
});

function animate(){
  requestAnimationFrame(animate);
  mouseX += (targetX - mouseX) * 0.025;
  mouseY += (targetY - mouseY) * 0.025;

  stars.rotation.y += 0.00018; stars.rotation.x += 0.000035;
  dust.rotation.y -= 0.00042; dust.rotation.z += 0.00008;

  rings.forEach((r, i) => {
    r.rotation.z += 0.0008 * (i%2 ? -1 : 1);
    r.rotation.x += Math.sin(Date.now() * 0.0002 + i) * 0.000025;
  });
  corona.forEach((c, i) => c.rotation.z += 0.00025 * (i%2 ? -1 : 1));

  camera.position.x += (mouseX - camera.position.x) * 0.02;
  camera.position.y += (-mouseY - camera.position.y) * 0.02;
  camera.lookAt(0, 0, -1.2);

  const pulse = 1 + Math.sin(Date.now() * 0.0008) * 0.018;
  core.scale.setScalar(pulse);

  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* =========================================================
   SCROLL REVEAL
   ========================================================= */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".operation-card, .manifesto-quote, .vault-frame, .terminal-form").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(30px)";
  el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  observer.observe(el);
});

/* UNIVERSE READY */
window.addEventListener("load", () => setTimeout(() => document.documentElement.classList.add("universe-ready"), 250));

/* =========================================================
   THEME AND AUDIO CONTROLS
   ========================================================= */
(function(){
  const body = document.body;
  const darkBtn = document.getElementById('darkModeBtn');
  const lightBtn = document.getElementById('lightModeBtn');
  const soundBtn = document.getElementById('soundBtn');

  function setTheme(mode){
    body.classList.toggle('light-mode', mode === 'light');
    darkBtn.classList.toggle('active', mode !== 'light');
    lightBtn.classList.toggle('active', mode === 'light');
    localStorage.setItem('darklight-theme', mode);
  }
  const savedTheme = localStorage.getItem('darklight-theme') || 'dark';
  setTheme(savedTheme);
  darkBtn.onclick = () => setTheme('dark');
  lightBtn.onclick = () => setTheme('light');

  let soundOn = localStorage.getItem('darklight-sound') !== 'off';
  function updateSound(){
    soundBtn.textContent = soundOn ? '◉' : '○';
    soundBtn.classList.toggle('active', soundOn);
    localStorage.setItem('darklight-sound', soundOn ? 'on' : 'off');
  }
  updateSound();
  soundBtn.onclick = () => {
    soundOn = !soundOn; updateSound();
    if (soundOn && window.__dlAudio) window.__dlAudio.resume().catch(()=>{});
  };

  let audioCtx;
  function beep(freq=660, duration=0.055){
    if(!soundOn) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.018, audioCtx.currentTime + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      o.connect(g); g.connect(audioCtx.destination); o.start(); o.stop(audioCtx.currentTime + duration + 0.01);
      window.__dlAudio = audioCtx;
    } catch(e) {}
  }
  document.addEventListener('click', e => { if (e.target.closest('button,a')) beep(720, 0.04); }, { passive: true });

  window.generateDarklightRequestCode = function(){
    const now = new Date(), y = now.getFullYear();
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let r = '';
    for(let i=0; i<6; i++) r += chars[Math.floor(Math.random() * chars.length)];
    const code = 'DL-' + y + '-' + r;
    const box = document.getElementById('requestCodeBox');
    const value = document.getElementById('requestCodeValue');
    if (box && value) { value.textContent = code; box.style.display = 'block'; }
    return code;
  };
})();

/* =========================================================
   FORM DYNAMICS & WEB3FORMS HANDLER
   ========================================================= */
(function(){
  const form = document.getElementById('contactForm');
  const select = document.getElementById('socialSelect');
  const container = document.getElementById('socialFields');
  if(!form || !select || !container) return;

  const defs = {
    Telegram: { name: 'telegram_username', label: 'TELEGRAM USERNAME / ID', placeholder: '@USERNAME OR TELEGRAM ID' },
    Instagram: { name: 'instagram_username', label: 'INSTAGRAM USERNAME', placeholder: '@USERNAME' },
    X: { name: 'x_username', label: 'X USERNAME', placeholder: '@USERNAME' }
  };

  function selectedValues(){ return Array.from(select.selectedOptions).map(o => o.value); }

  function render(){
    const selected = selectedValues();
    container.innerHTML = '';
    selected.forEach(key => {
      const d = defs[key];
      const wrap = document.createElement('div');
      wrap.className = 'social-dynamic';
      wrap.innerHTML = `<label for="${d.name}">${d.label}</label>
                        <input id="${d.name}" name="${d.name}" type="text" maxlength="120" placeholder="${d.placeholder}" autocomplete="off" required>`;
      container.appendChild(wrap);
    });
  }
  select.addEventListener('change', render);
  render();

  function val(id){ const el = document.getElementById(id); return el ? (el.value || '').trim() : ''; }

  function buildMessage(code){
    const lines = [
      'DARKLIGHT000999 — SECURE REQUEST', '=================================', 'REQUEST CODE: ' + code, '',
      'DESIGNATION / ALIAS: ' + val('alias'), 'EMAIL ADDRESS: ' + val('email'), 'MOBILE NUMBER: ' + val('mobile'),
      'SECURE COMM PROTOCOL: ' + val('protocol'), 'NATURE OF THREAT: ' + val('threat'), '',
      'ADDITIONAL CONTACT CHANNELS: ' + (selectedValues().join(', ') || 'None'),
      selectedValues().includes('Telegram') ? 'TELEGRAM: ' + val('telegram_username') : '',
      selectedValues().includes('Instagram') ? 'INSTAGRAM: ' + val('instagram_username') : '',
      selectedValues().includes('X') ? 'X: ' + val('x_username') : '', '',
      'THE SITUATION:', val('situation')
    ].filter(Boolean);
    return lines.join('\n');
  }

  form.addEventListener('submit', async function(e){
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const old = btn ? btn.textContent : '';
    const requestCode = window.generateDarklightRequestCode();
    
    let codeEl = document.getElementById('web3RequestCode');
    if (codeEl) codeEl.value = requestCode;

    let msg = form.querySelector('textarea[name="message"]');
    if(!msg){ msg = document.createElement('textarea'); msg.name = 'message'; msg.hidden = true; form.appendChild(msg); }
    msg.value = buildMessage(requestCode);

    if (btn) { btn.disabled = true; btn.textContent = 'TRANSMITTING…'; }

    try {
      const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const data = await r.json().catch(() => ({}));
      if (!r.ok || data.success === false) throw new Error(data.message || 'Transmission failed');
      
      form.querySelectorAll('input:not([type="hidden"]), textarea, select').forEach(x => x.value = '');
      
      const box = document.getElementById('requestCodeBox'), val = document.getElementById('requestCodeValue'), st = document.getElementById('requestStatus');
      if (box && val) {
        val.textContent = requestCode; box.style.display = 'block';
        if (st) st.textContent = 'REQUEST RECEIVED • SECURE ACKNOWLEDGEMENT ISSUED';
        box.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        alert('REQUEST RECEIVED\nRequest Code: ' + requestCode);
      }
    } catch(err) {
      console.error(err); alert('Transmission could not be completed. Please try again.');
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = old; }
    }
  });
})();
