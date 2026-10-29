// Theme (dark/light) - remembered in localStorage
const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
function applyTheme(t) {
  root.setAttribute('data-theme', t);
  themeBtn.textContent = t === 'dark' ? '☀️' : '🌙';
}
let saved = null;
try { saved = localStorage.getItem('theme'); } catch (e) {}
applyTheme(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
themeBtn.addEventListener('click', () => {
  const t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(t);
  try { localStorage.setItem('theme', t); } catch (e) {}
});

// Mobile menu
const navLinks = document.getElementById('navLinks');
document.getElementById('menuBtn').addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Typing effect
const roles = ['Web Developer', 'Python Developer', 'Generative AI Enthusiast', 'MCA Student'];
const typed = document.getElementById('typed');
let r = 0, c = 0, del = false;
(function type() {
  const word = roles[r];
  typed.textContent = word.slice(0, c);
  if (!del && c === word.length) { del = true; return setTimeout(type, 1400); }
  if (del && c === 0) { del = false; r = (r + 1) % roles.length; }
  c += del ? -1 : 1;
  setTimeout(type, del ? 45 : 90);
})();

// Reveal sections + animate skill bars
const bars = document.querySelectorAll('.bar i');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('visible');
    if (e.target.id === 'skills') bars.forEach(b => b.style.width = b.dataset.level + '%');
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(s => io.observe(s));

// Active nav link on scroll
const links = [...navLinks.querySelectorAll('a')];
const spy = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
document.querySelectorAll('main section').forEach(s => spy.observe(s));

// Project filters
document.querySelectorAll('.chip').forEach(chip => chip.addEventListener('click', () => {
  document.querySelectorAll('.chip').forEach(x => x.classList.remove('active'));
  chip.classList.add('active');
  document.querySelectorAll('.card').forEach(card =>
    card.classList.toggle('hide', chip.dataset.f !== 'all' && card.dataset.cat !== chip.dataset.f));
}));

// Contact form: validate, then open the visitor's email app
const form = document.getElementById('contactForm');
const msg = document.getElementById('formMsg');
form.addEventListener('submit', ev => {
  ev.preventDefault();
  const name = form.name.value.trim(), email = form.email.value.trim(), text = form.message.value.trim();
  msg.className = '';
  if (!name || !text) { msg.textContent = 'Please fill in your name and message.'; msg.className = 'err'; return; }
  if (!/^\S+@\S+\.\S+$/.test(email)) { msg.textContent = 'Please enter a valid email address.'; msg.className = 'err'; return; }
  const body = encodeURIComponent(text + '\n\nFrom: ' + name + ' (' + email + ')');
  location.href = 'mailto:youremail@example.com?subject=' + encodeURIComponent('Portfolio message from ' + name) + '&body=' + body;
  msg.textContent = 'Opening your email app...'; msg.className = 'ok';
  form.reset();
});

// Back to top + footer year
const topBtn = document.getElementById('topBtn');
addEventListener('scroll', () => topBtn.classList.toggle('show', scrollY > 500));
topBtn.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
document.getElementById('year').textContent = new Date().getFullYear();
