document.documentElement.classList.add('js-enabled');

// ---------- dark mode toggle ----------
(() => {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const root = document.documentElement;

  const setPressed = () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-pressed', String(isDark));
    btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  };
  setPressed(); // reflects the theme the inline head script already applied

  btn.addEventListener('click', () => {
    const isDark = root.getAttribute('data-theme') === 'dark';
    if (isDark) {
      root.removeAttribute('data-theme');
      localStorage.setItem('duoops-theme', 'light');
    } else {
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('duoops-theme', 'dark');
    }
    setPressed();
  });
})();

// ---------- scroll progress ----------
(() => {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;
  const update = () => {
    const h = document.documentElement;
    const scrollable = h.scrollHeight - h.clientHeight;
    const pct = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
  };
  document.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();

// ---------- reveal on scroll ----------
(() => {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => el.classList.add('in-view'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  targets.forEach((el) => io.observe(el));
})();

// ---------- scrollspy nav ----------
(() => {
  const navLinks = document.querySelectorAll('nav.links a[data-nav]');
  const sections = ['top', 'about', 'skills', 'pipeline', 'team', 'contact'].map((id) =>
    document.getElementById(id)
  );

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = e.target.id;
          navLinks.forEach((a) =>
            a.classList.toggle('active', a.getAttribute('href') === '#' + id)
          );
        }
      });
    },
    { threshold: 0.4, rootMargin: '-80px 0px -40% 0px' }
  );
  sections.forEach((s) => s && spy.observe(s));
})();

// ---------- local, in-browser photo preview ----------
// No upload happens anywhere — the chosen file is only read into
// this tab's memory via a local object URL.
document.querySelectorAll('.photo-frame input[type="file"]').forEach((input) => {
  input.addEventListener('change', (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const frame = input.closest('.photo-frame');
    const img = frame.querySelector('img');
    const url = URL.createObjectURL(file);

    img.src = url;
    frame.classList.add('has-photo');
  });
});
