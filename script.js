// Menü bekommt beim Scrollen einen Glas-Hintergrund
const kopf = document.querySelector('.kopf');
const onScroll = () => kopf.classList.toggle('gescrollt', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// Handy-Menü öffnen und schliessen
const knopf = document.querySelector('.menu-knopf');
knopf.onclick = () => {
  const offen = kopf.classList.toggle('offen');
  knopf.setAttribute('aria-expanded', offen);
  knopf.setAttribute('aria-label', offen ? 'Menü schliessen' : 'Menü öffnen');
  document.body.style.overflow = offen ? 'hidden' : '';
};
addEventListener('keydown', e => { if (e.key === 'Escape' && kopf.classList.contains('offen')) knopf.click(); });

// Inhalte sanft einblenden, sobald sie sichtbar werden
const beobachter = new IntersectionObserver(eintraege => eintraege.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('sichtbar'); beobachter.unobserve(e.target); }
}), { threshold: 0.12 });
document.querySelectorAll('.zeige, .teil-bild, .herzlinie, .herzband').forEach(el => beobachter.observe(el));

// Jahreszahl im Footer immer aktuell
document.querySelectorAll('.jahr').forEach(el => el.textContent = new Date().getFullYear());

// WhatsApp-Knopf wandert je nach Scrollposition sanft am rechten Rand mit
const wa = document.querySelector('.wa-knopf');
if (wa) {
  const ruhig = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let jetzt = null;
  const ziel = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    const anteil = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    const oben = innerHeight * 0.18, unten = innerHeight * 0.82 - wa.offsetHeight;
    return oben + (unten - oben) * anteil;
  };
  const schritt = () => {
    const z = ziel();
    jetzt = (jetzt === null || ruhig) ? z : jetzt + (z - jetzt) * 0.08;
    wa.style.setProperty('--wa-y', jetzt.toFixed(1) + 'px');
    if (Math.abs(z - jetzt) > 0.3) requestAnimationFrame(schritt); else laeuft = false;
  };
  let laeuft = false;
  const anstossen = () => { if (!laeuft) { laeuft = true; requestAnimationFrame(schritt); } };
  addEventListener('scroll', anstossen, { passive: true });
  addEventListener('resize', anstossen);
  anstossen();
}

// Hero-Höhe einmal fixieren, damit «simple smooth safe» am iPhone beim Scrollen nicht grösser/kleiner wird
(() => {
  let breite = innerWidth;
  const setze = () => document.documentElement.style.setProperty('--hero-h', innerHeight + 'px');
  setze();
  addEventListener('resize', () => { if (innerWidth !== breite) { breite = innerWidth; setze(); } });
})();
