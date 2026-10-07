import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

// =====================
// PERSONALIZATION BLOCK
// =====================
const CONFIG = {
  NAME: "Sibgha",
  BIRTHDAY_DATE: "2026-10-08T00:00:00+05:00",
  MESSAGE: "I hope this year brings you as much joy and warmth as you bring to everyone around you. You deserve every bit of magic coming your way.",
  SIGNATURE: "— Someone who admires you",
  MEMORY_CAPTION_1: "That one unforgettable day.",
  MEMORY_CAPTION_2: "A moment worth keeping forever.",
  PHOTO_PATHS: [
    "public/media/WhatsApp Image 2026-10-07 at 10.23.36 PM.jpeg",
    "public/media/WhatsApp Image 2026-10-07 at 10.23.37 PM (3).jpeg",
    "public/media/WhatsApp Image 2026-10-07 at 10.23.37 PM (4).jpeg",
    "public/media/WhatsApp Image 2026-10-07 at 10.23.37 PM (5).jpeg",
    "public/media/WhatsApp Image 2026-10-07 at 10.23.37 PM (6).jpeg"
  ],
  // You can set an absolute path to a music file if you have one
  MUSIC_PATH: "" 
};

// =====================
// DOM INITIALIZATION
// =====================
document.getElementById("personal-name").textContent = CONFIG.NAME;
document.getElementById("final-name").textContent = CONFIG.NAME;
document.getElementById("personal-message-1").textContent = CONFIG.MESSAGE;
document.getElementById("personal-signature").textContent = CONFIG.SIGNATURE;
document.getElementById("gallery-caption").textContent = CONFIG.MEMORY_CAPTION_1;
document.getElementById("photo-1").src = CONFIG.PHOTO_PATHS[0];
document.getElementById("photo-2").src = CONFIG.PHOTO_PATHS[1];
document.getElementById("photo-3").src = CONFIG.PHOTO_PATHS[2];
document.getElementById("photo-4").src = CONFIG.PHOTO_PATHS[3];
document.getElementById("photo-5").src = CONFIG.PHOTO_PATHS[4];

// =====================
// COUNTDOWN
// =====================
const countdownEl = document.getElementById("countdown");
function updateCountdown() {
  const target = new Date(CONFIG.BIRTHDAY_DATE).getTime();
  const diff = Math.max(0, target - Date.now());
  const total = Math.floor(diff / 1000);
  
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  countdownEl.textContent = `${h} : ${m} : ${s}`;
}
updateCountdown();
setInterval(updateCountdown, 1000);

// =====================
// AUDIO SETUP
// =====================
let audioCtx;
const musicToggle = document.getElementById("musicToggle");
let isPlaying = false;
let bgMusic = null;

if (CONFIG.MUSIC_PATH) {
  bgMusic = new Audio(CONFIG.MUSIC_PATH);
  bgMusic.loop = true;
}

musicToggle.addEventListener("click", () => {
  isPlaying = !isPlaying;
  if (isPlaying) {
    musicToggle.classList.add("playing");
    musicToggle.innerHTML = `<span class="music-icon">♫</span> Music on`;
    if (bgMusic) {
      bgMusic.play();
    } else {
      // Fallback tiny chime if no music track provided
      playMagicalChime();
    }
  } else {
    musicToggle.classList.remove("playing");
    musicToggle.innerHTML = `<span class="music-icon">♫</span> Turn on the music`;
    if (bgMusic) bgMusic.pause();
  }
});

function playMagicalChime() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  
  [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, audioCtx.currentTime + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.05, audioCtx.currentTime + i * 0.1 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + i * 0.1 + 1);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(audioCtx.currentTime + i * 0.1);
    osc.stop(audioCtx.currentTime + i * 0.1 + 1);
  });
}

function playSoftPop() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.setValueAtTime(400, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.1);
  gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.1);
}

// =====================
// SCROLL OBSERVATION
// =====================
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
  observer.observe(el);
});

// Scroll Progress Bar
const progressBar = document.getElementById("progressBar");
window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.body.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  progressBar.style.width = scrollPercent + "%";
});

// =====================
// THREE.JS SETUP
// =====================
const container = document.getElementById("scene-container");
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0f0714, 0.02);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 12); // Initial distant camera

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); // Cap for mobile perf
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Variables for state
let isRevealed = false;
let targetCameraZ = 12;
let targetCameraY = 0;
const sceneGroup = new THREE.Group();
scene.add(sceneGroup);

// 1. Background Stars
const starsGeo = new THREE.BufferGeometry();
const starCount = 800; // optimized for mobile
const starPos = new Float32Array(starCount * 3);
for(let i=0; i < starCount * 3; i++) {
  starPos[i] = (Math.random() - 0.5) * 30;
}
starsGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
const starsMat = new THREE.PointsMaterial({ color: 0xffd6ef, size: 0.04, transparent: true, opacity: 0.6 });
const stars = new THREE.Points(starsGeo, starsMat);
scene.add(stars);

// 2. The Floating Heart / Gift
const heartShape = new THREE.Shape();
heartShape.moveTo(0, 0.5);
heartShape.bezierCurveTo(0, 0.1, -1.2, -0.2, -1.2, -1.3);
heartShape.bezierCurveTo(-1.2, -2.1, -0.2, -2.5, 0, -1.6);
heartShape.bezierCurveTo(0.2, -2.5, 1.2, -2.1, 1.2, -1.3);
heartShape.bezierCurveTo(1.2, -0.2, 0, 0.1, 0, 0.5);

const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.1, bevelThickness: 0.1 };
const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
heartGeo.center();
heartGeo.rotateX(Math.PI);

const heartMat = new THREE.MeshPhysicalMaterial({ 
  color: 0xf2a6be, 
  emissive: 0x4a1c35,
  roughness: 0.2, 
  metalness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.1
});
const mainHeart = new THREE.Mesh(heartGeo, heartMat);
mainHeart.scale.setScalar(0.8);
mainHeart.position.y = -0.5; // Offset slightly
sceneGroup.add(mainHeart);

// Inner glow
const glowGeo = new THREE.SphereGeometry(1.5, 16, 16);
const glowMat = new THREE.MeshBasicMaterial({ color: 0xf2a6be, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending });
const heartGlow = new THREE.Mesh(glowGeo, glowMat);
mainHeart.add(heartGlow);

// 3. Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const dirLight = new THREE.DirectionalLight(0xffd6ef, 1.5);
dirLight.position.set(2, 5, 4);
scene.add(dirLight);

// =====================
// INTERACTION LOGIC
// =====================
const startBtn = document.getElementById("startBtn");
const revealText = document.getElementById("revealText");

startBtn.addEventListener("click", () => {
  // Hide UI
  startBtn.classList.add("fade-out");
  document.querySelector('.hint-text').classList.add("hidden");
  
  // Transition camera
  isRevealed = true;
  targetCameraZ = 6; // Move camera closer
  
  playMagicalChime();
  createParticleBurst(0, 0, 0, 0xf2a6be, 60);

  // Show reveal text after delay
  setTimeout(() => {
    revealText.classList.add("show");
    document.body.style.overflow = "auto"; // Ensure scrolling is enabled
    // Soft scroll down slightly
    window.scrollBy({ top: window.innerHeight * 0.3, behavior: 'smooth' });
  }, 1200);
});

// Scene 6 Cake Interaction
const wishBtn = document.getElementById("wishBtn");
wishBtn.addEventListener("click", () => {
  playSoftPop();
  createParticleBurst(0, -1, 0, 0xe6c898, 120);
  wishBtn.textContent = "Wish Granted ✨";
  wishBtn.style.pointerEvents = "none";
  wishBtn.style.background = "rgba(230, 200, 152, 0.2)";
  wishBtn.style.color = "#e6c898";
  
  // Darken background momentarily
  const origFog = scene.fog.color.getHex();
  scene.fog.color.setHex(0x000000);
  setTimeout(() => {
    scene.fog.color.setHex(origFog);
  }, 2000);
});

// =====================
// PARTICLES
// =====================
const activeParticles = [];
function createParticleBurst(x, y, z, colorHex, amount) {
  const geom = new THREE.BufferGeometry();
  const pos = new Float32Array(amount * 3);
  const vel = [];
  
  for(let i=0; i<amount; i++) {
    pos[i*3] = x;
    pos[i*3+1] = y;
    pos[i*3+2] = z;
    
    vel.push({
      x: (Math.random() - 0.5) * 0.15,
      y: (Math.random() - 0.5) * 0.15,
      z: (Math.random() - 0.5) * 0.15
    });
  }
  geom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const mat = new THREE.PointsMaterial({
    color: colorHex, size: 0.08, transparent: true, opacity: 1, blending: THREE.AdditiveBlending
  });
  
  const particleSys = new THREE.Points(geom, mat);
  scene.add(particleSys);
  
  activeParticles.push({
    mesh: particleSys,
    velocities: vel,
    life: 1.0
  });
}

// =====================
// ANIMATION LOOP
// =====================
const clock = new THREE.Clock();

// Mobile scroll tying to 3D object rotation/position
let scrollY = 0;
window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
});

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();
  const t = clock.getElapsedTime();

  // Smooth Camera transition
  camera.position.z += (targetCameraZ - camera.position.z) * 2 * dt;
  
  // Idle animation for heart
  mainHeart.rotation.y = Math.sin(t * 0.5) * 0.3;
  mainHeart.position.y = -0.5 + Math.sin(t * 1.2) * 0.15;
  
  // Tie scroll to 3D position
  // Move group up as we scroll down, so it fades away
  const docH = window.innerHeight;
  const normalizedScroll = scrollY / docH; 
  
  if (isRevealed) {
    // When revealed, scroll moves the heart up and away
    sceneGroup.position.y = normalizedScroll * 10;
    sceneGroup.rotation.x = normalizedScroll * Math.PI * 0.5;
    
    // Also rotate stars slightly for parallax
    stars.rotation.y = t * 0.03 + normalizedScroll * 0.5;
  } else {
    stars.rotation.y = t * 0.02;
  }

  // Update particles
  for (let i = activeParticles.length - 1; i >= 0; i--) {
    const p = activeParticles[i];
    p.life -= dt * 0.8; // fade out speed
    if (p.life <= 0) {
      scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
      activeParticles.splice(i, 1);
      continue;
    }
    
    p.mesh.material.opacity = p.life;
    const positions = p.mesh.geometry.attributes.position.array;
    for (let j = 0; j < p.velocities.length; j++) {
      positions[j*3] += p.velocities[j].x;
      positions[j*3+1] += p.velocities[j].y;
      positions[j*3+2] += p.velocities[j].z;
      // gentle drag/gravity
      p.velocities[j].y -= dt * 0.05; 
    }
    p.mesh.geometry.attributes.position.needsUpdate = true;
  }

  renderer.render(scene, camera);
}
animate();

// Resize handler
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
