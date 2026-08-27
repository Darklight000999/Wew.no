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
   COMMAND CENTER & VAULT
   ========================================================= */
menuButton.addEventListener("click", () => menuOverlay.classList.toggle("open"));
document.querySelectorAll(".menu-link").forEach(link => {
  link.addEventListener("click", () => menuOverlay.classList.remove("open"));
});

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
   THREE.JS HYPER-REALISTIC SOLAR SYSTEM
   ========================================================= */
const canvas = document.getElementById("threeCanvas");
const scene = new THREE.Scene();
// No fog, so the background video remains perfectly visible
const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 5, 20); 

// alpha: true allows the video behind the canvas to show through!
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// Lighting
const ambientLight = new THREE.AmbientLight(0x222233); 
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xffeedd, 3.5, 300); 
scene.add(sunLight);

const solarSystem = new THREE.Group();
solarSystem.rotation.x = Math.PI / 8; // Tilt
scene.add(solarSystem);

// 1. THE SUN
const sunGeo = new THREE.SphereGeometry(2.5, 64, 64);
const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 }); 
const sun = new THREE.Mesh(sunGeo, sunMat);
solarSystem.add(sun);

// Corona
const coronaGeo = new THREE.SphereGeometry(2.9, 64, 64);
const coronaMat = new THREE.MeshBasicMaterial({ 
    color: 0xff6600, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending 
});
const corona = new THREE.Mesh(coronaGeo, coronaMat);
solarSystem.add(corona);

// 2. THE PLANETS
const planets = [];
function createPlanet(radius, color, distance, speed, hasRings = false) {
    const pivot = new THREE.Group();
    solarSystem.add(pivot);

    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.6, metalness: 0.1 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.x = distance;
    pivot.add(mesh);

    const pathGeo = new THREE.RingGeometry(distance - 0.02, distance + 0.02, 128);
    const pathMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = Math.PI / 2;
    solarSystem.add(path);

    if (hasRings) {
        const ringGeo = new THREE.RingGeometry(radius * 1.4, radius * 2.2, 64);
        const ringMat = new THREE.MeshStandardMaterial({ color: 0xddccaa, transparent: true, opacity: 0.85, side: THREE.DoubleSide });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.PI / 2.2;
        mesh.add(ring);
    }
    planets.push({ pivot, mesh, speed });
}

createPlanet(0.2, 0x888888, 4, 0.008);           // Mercury
createPlanet(0.35, 0xeebb88, 6.5, 0.006);        // Venus
createPlanet(0.4, 0x2277ff, 9.5, 0.004);         // Earth
createPlanet(0.25, 0xff4422, 12.5, 0.003);       // Mars
createPlanet(1.2, 0xcc9966, 18, 0.002);          // Jupiter
createPlanet(0.9, 0xeaddb5, 24, 0.0015, true);   // Saturn

// Parallax
let targetX = 0, targetY = 0, mouseX = 0, mouseY = 0;
window.addEventListener("mousemove", (e) => {
  targetX = (e.clientX / window.innerWidth - 0.5) * 2;
  targetY = (e.clientY / window.innerHeight - 0.5) * 1.5;
});

function animate(){
  requestAnimationFrame(animate);
  
  mouseX += (targetX - mouseX) * 0.05;
  mouseY += (targetY - mouseY) * 0.05;
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (5 - mouseY - camera.position.y) * 0.05; 
  camera.lookAt(0, -1, 0);

  corona.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.03);
  
  planets.forEach((p) => {
      p.pivot.rotation.y += p.speed; 
      p.mesh.rotation.y += p.speed * 5; 
  });

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
