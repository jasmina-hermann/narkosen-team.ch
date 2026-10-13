// Header wird beim Scrollen weiss und kompakt
const header = document.querySelector('header');
const onScroll = () => header && header.classList.toggle('scrolled', scrollY > 30);
addEventListener('scroll', onScroll, { passive: true }); onScroll();

// Mobiles Menü
const navLinks = document.querySelector('.nav-links');
const menuBtn = document.querySelector('.menu-btn');
if (menuBtn && navLinks) {
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.onclick = () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  };
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false');
  }));
}

// Aktuelle Seite im Menü markieren
const clean = p => p.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/$/, '') || '/';
const here = clean(location.pathname);
if (navLinks) navLinks.querySelectorAll('a:not(.btn)').forEach(a => {
  if (a.closest('.lang')) return;
  const target = clean(new URL(a.getAttribute('href'), location.href).pathname);
  if (target === here) a.classList.add('active');
});

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
  const en = document.documentElement.lang === 'en';
  const d = new FormData(form);
  const body = `${en ? 'Name' : 'Name'}: ${d.get('name')}\n${en ? 'Email' : 'E-Mail'}: ${d.get('email')}\n${en ? 'Phone' : 'Telefon'}: ${d.get('phone')}\n\n${d.get('message')}`;
  location.href = `mailto:info@narkose-team.ch?subject=${encodeURIComponent((en ? 'Enquiry: ' : 'Anfrage: ') + d.get('topic'))}&body=${encodeURIComponent(body)}`;
};
