/* ==========================================================================
   nav.js — condensing sticky header, mobile menu, sticky mobile CTA bar
   ========================================================================== */
(function () {
  'use strict';

  var header = document.getElementById('site-header');
  var menu = document.getElementById('mobile-menu');
  var bar = document.getElementById('mobile-cta-bar');
  var M = window.Motion;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Condense header on scroll ---- */
  var ticking = false;
  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 24);
    if (bar) bar.classList.toggle('is-visible', y > 320);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  if (!header || !menu) return;
  var toggle = header.querySelector('.nav-toggle');
  var panel = menu.querySelector('.mobile-menu__panel');
  var lastFocus = null;

  function openMenu() {
    lastFocus = document.activeElement;
    menu.hidden = false;
    document.body.classList.add('menu-open');
    header.classList.add('is-solid');
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('aria-label', 'Close menu');
    if (M && !reduce) {
      M.animate(menu, { opacity: [0, 1] }, { duration: 0.3 });
      M.animate(panel, { x: ['100%', '0%'] }, { type: 'spring', stiffness: 260, damping: 32 });
      M.animate(panel.querySelectorAll('.mobile-menu__group, .mobile-menu__ctas'), { opacity: [0, 1], x: [24, 0] }, { delay: M.stagger(0.04, { startDelay: 0.12 }), duration: 0.4 });
    }
    var first = panel.querySelector('a');
    if (first) first.focus({ preventScroll: true });
  }

  function closeMenu() {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open menu');
    document.body.classList.remove('menu-open');
    header.classList.remove('is-solid');
    function done() { menu.hidden = true; if (lastFocus) lastFocus.focus({ preventScroll: true }); }
    if (M && !reduce) {
      M.animate(panel, { x: '100%' }, { duration: 0.3, ease: [0.4, 0, 1, 1] });
      M.animate(menu, { opacity: 0 }, { duration: 0.3 }).then(done);
    } else {
      done();
    }
  }

  toggle.addEventListener('click', function () {
    if (menu.hidden) openMenu(); else closeMenu();
  });
  menu.addEventListener('click', function (e) {
    if (e.target === menu) closeMenu();
  });
  document.addEventListener('keydown', function (e) {
    if (menu.hidden) return;
    if (e.key === 'Escape') { closeMenu(); return; }
    if (e.key === 'Tab') {
      // Simple focus trap: toggle button + panel links.
      var nodes = [toggle].concat(Array.prototype.slice.call(panel.querySelectorAll('a, button')));
      var i = nodes.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); nodes[nodes.length - 1].focus(); }
      else if (!e.shiftKey && i === nodes.length - 1) { e.preventDefault(); nodes[0].focus(); }
    }
  });
  window.matchMedia('(min-width: 1080px)').addEventListener('change', function (mq) {
    if (mq.matches && !menu.hidden) closeMenu();
  });
})();
