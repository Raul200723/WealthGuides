(function () {
  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.getElementById('mobile-nav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', function () {
    var isOpen = mobileNav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close on escape, return focus to toggle
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  // Close mobile menu automatically if resized to desktop width
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 960 && mobileNav.classList.contains('open')) {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();

// Active-page nav highlighting (the header/footer markup is identical across
// every page, so this is applied client-side by matching the current path).
(function () {
  var path = window.location.pathname;
  document.querySelectorAll('.primary-nav a, .mobile-nav a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (!href || href === '/') return;
    if (path === href || path.startsWith(href)) {
      a.setAttribute('aria-current', 'page');
    }
  });
})();

// Back-to-top button
(function () {
  var btn = document.querySelector('.back-to-top');
  if (!btn) return;
  var onScroll = function () {
    if (window.scrollY > 800) btn.classList.add('visible');
    else btn.classList.remove('visible');
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
