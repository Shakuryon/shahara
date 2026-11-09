(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  $('#year').textContent = new Date().getFullYear();

  // Jump nav: highlight the section currently in view
  const links = $$('.jumps a');
  const sections = links.map(a => $(a.getAttribute('href')));
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => s && spy.observe(s));

  // Story timeline draws itself as you scroll
  const tl = $('#timeline');
  const grow = () => {
    const r = tl.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.7 - r.top) / r.height));
    tl.style.setProperty('--grow', p.toFixed(3));
  };
  addEventListener('scroll', grow, { passive: true });
  addEventListener('resize', grow);
  grow();

  // Toast
  const toast = $('#toast');
  let t;
  const say = msg => {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(t);
    t = setTimeout(() => toast.classList.remove('show'), 2600);
  };

  // Demo bag (no payments, just shows what buying could feel like)
  let count = 0, total = 0;
  $$('.add').forEach(b => b.addEventListener('click', () => {
    count++; total += Number(b.dataset.price);
    $('#cartCount').textContent = count;
    say(`${b.dataset.name} added. Bag total $${total}`);
  }));
  $('#cartBtn').addEventListener('click', () =>
    say(count ? `Demo bag: ${count} item(s), $${total}. Checkout goes live with a shop.` : 'Your bag is empty. Add a print to try it.'));

// Hamburger menu for small screens
const nav = $('.nav'), jumps = $('.jumps'), cartBtn = $('#cartBtn');
jumps.id = 'jumps';
const burger = document.createElement('button');
burger.className = 'menu-btn';
burger.type = 'button';
burger.setAttribute('aria-label', 'Open menu');
burger.setAttribute('aria-expanded', 'false');
burger.setAttribute('aria-controls', 'jumps');
burger.innerHTML = '<span></span><span></span><span></span>';
cartBtn.after(burger);

const setMenu = open => {
  jumps.classList.toggle('open', open);
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', String(open));
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
burger.addEventListener('click', () => setMenu(!jumps.classList.contains('open')));
links.forEach(a => a.addEventListener('click', () => setMenu(false)));
addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
document.addEventListener('click', e => { if (!nav.contains(e.target)) setMenu(false); });
matchMedia('(min-width: 769px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  // Contact form (demo only, nothing is sent)
  const form = $('#orderForm'), msg = $('#formMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    ['name', 'email', 'type'].forEach(n => {
      const f = form.elements[n];
      const bad = !f.value.trim() || (n === 'email' && !/^\S+@\S+\.\S+$/.test(f.value));
      f.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { msg.textContent = 'Please fill in your name, a valid email, and what you are looking for.'; return; }
    msg.textContent = `Thank you, ${form.elements.name.value.trim()}. Shahara will reply to ${form.elements.email.value.trim()} soon. (Demo: nothing was sent.)`;
    form.reset();
  });
})();
