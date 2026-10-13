// Header wird beim Scrollen weiss und kompakt
const header = document.querySelector('header');
const onScroll = () => header.classList.toggle('scrolled', scrollY > 30);
addEventListener('scroll', onScroll); onScroll();

// Mobile Menü
const navLinks = document.querySelector('.nav-links');
document.querySelector('.menu-btn').onclick = () => navLinks.classList.toggle('open');

// Aktuelle Seite im Menü markieren
const page = location.pathname.split('/').pop() || 'index.html';
navLinks.querySelectorAll('a').forEach(a => { if (a.getAttribute('href') === page) a.classList.add('active'); });

// Elemente sanft einblenden, sobald sie sichtbar werden
const observer = new IntersectionObserver(entries => entries.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

// Kontaktformular: öffnet das E-Mail-Programm mit der fertigen Nachricht
const form = document.querySelector('form.card-form');
if (form) form.onsubmit = e => {
  e.preventDefault();
  const d = new FormData(form);
  const body = `Name: ${d.get('name')}\nE-Mail: ${d.get('email')}\nTelefon: ${d.get('phone')}\n\n${d.get('message')}`;
  location.href = `mailto:info@narkose-team.ch?subject=${encodeURIComponent('Anfrage: ' + d.get('topic'))}&body=${encodeURIComponent(body)}`;
};

// Patientenmonitor wie im Spital (nur auf der Startseite):
// die Kurve wird von links nach rechts neu geschrieben,
// vor dem Schreibpunkt wird die alte Kurve gelöscht.
const cv = document.getElementById('monitor');
if (cv) {
  const ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height, SPEED = 260, GAP = 28;   // Pixel pro Sekunde, Lücke
  const hrEl = document.getElementById('hr'), heartEl = document.getElementById('heart');
  const spo2El = document.getElementById('spo2'), bpEl = document.getElementById('bp');
  const g = (p, c, w, a) => a * Math.exp(-(((p - c) / w) ** 2));
  // Eine Herzaktion: P-Welle, QRS-Zacke, T-Welle
  const ecg = p => g(p,.12,.035,.12) + g(p,.27,.012,-.12) + g(p,.30,.011,1) + g(p,.33,.013,-.28) + g(p,.56,.055,.24);
  // Pulskurve (SpO₂), kommt etwas nach dem Herzschlag
  const pleth = p => { p = (p + .75) % 1; return g(p,.25,.1,1) + g(p,.5,.09,.35); };
  let x = 0, phase = 0, bpm = 72, prev = null, last = performance.now();

  ctx.lineWidth = 3; ctx.lineJoin = ctx.lineCap = 'round'; ctx.shadowBlur = 8;
  function step() {
    phase += 1 / (SPEED * 60 / bpm);
    if (phase >= 1) {                       // neuer Herzschlag
      phase -= 1;
      bpm = 68 + Math.round(Math.random() * 8);
      hrEl.textContent = bpm;
      heartEl.classList.add('beat'); setTimeout(() => heartEl.classList.remove('beat'), 150);
    }
    const y1 = H * .36 - ecg(phase) * H * .27, y2 = H * .9 - pleth(phase) * H * .2;
    ctx.clearRect(x, 0, GAP, H);
    if (prev) {
      ctx.strokeStyle = ctx.shadowColor = '#4ade80';
      ctx.beginPath(); ctx.moveTo(x - 1, prev[0]); ctx.lineTo(x, y1); ctx.stroke();
      ctx.strokeStyle = ctx.shadowColor = '#7dd3fc';
      ctx.beginPath(); ctx.moveTo(x - 1, prev[1]); ctx.lineTo(x, y2); ctx.stroke();
    }
    prev = [y1, y2];
    if (++x >= W) { x = 0; prev = null; }
  }
  function loop(now) {
    const n = Math.min(Math.round((now - last) / 1000 * SPEED), 60);
    if (n > 0) { for (let i = 0; i < n; i++) step(); last = now; }
    requestAnimationFrame(loop);
  }
  // Läuft immer, auch wenn am Computer "Animationen aus" eingestellt ist
  requestAnimationFrame(loop);

  // SpO₂ und Blutdruck ändern sich ab und zu ein wenig
  setInterval(() => {
    spo2El.textContent = (97 + Math.round(Math.random() * 2)) + '%';
    bpEl.textContent = (115 + Math.round(Math.random() * 7)) + '/' + (74 + Math.round(Math.random() * 5));
  }, 4000);
}
