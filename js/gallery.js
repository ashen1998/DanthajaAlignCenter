/* ==========================================================================
   gallery.js — filter tabs + accessible lightbox for the before/after gallery
   ========================================================================== */
(function () {
  'use strict';

  var tabs = document.querySelector('[data-gallery-tabs]');
  var grid = document.querySelector('[data-gallery]');
  var dialog = document.getElementById('lightbox');
  if (!grid) return;
  var M = window.Motion;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Filter tabs (ARIA tabs pattern, arrow-key navigation) ---- */
  if (tabs) {
    var buttons = Array.prototype.slice.call(tabs.querySelectorAll('[role="tab"]'));
    if (!grid.id) grid.id = 'gallery-panel';
    grid.setAttribute('role', 'tabpanel');
    buttons.forEach(function (b, i) {
      b.id = b.id || 'gallery-tab-' + i;
      b.setAttribute('aria-controls', grid.id);
    });
    grid.setAttribute('aria-labelledby', buttons[0].id);
    function select(btn) {
      buttons.forEach(function (b) {
        var on = b === btn;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
      });
      grid.setAttribute('aria-labelledby', btn.id);
      var filter = btn.getAttribute('data-filter');
      var shown = [];
      grid.querySelectorAll('.gallery-item').forEach(function (item) {
        var show = filter === 'all' || item.getAttribute('data-category') === filter;
        item.hidden = !show;
        if (show) shown.push(item);
      });
      if (M && !reduce) M.animate(shown, { opacity: [0, 1], y: [16, 0] }, { duration: 0.5, delay: M.stagger(0.05) });
    }
    buttons.forEach(function (b, i) {
      b.addEventListener('click', function () { select(b); });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = buttons[(i + 1) % buttons.length];
        if (e.key === 'ArrowLeft') n = buttons[(i - 1 + buttons.length) % buttons.length];
        if (n) { e.preventDefault(); n.focus(); select(n); }
      });
    });
  }

  /* ---- Lightbox ---- */
  if (!dialog || typeof dialog.showModal !== 'function') return;
  var pair = dialog.querySelector('.lightbox__pair');
  var caption = dialog.querySelector('.lightbox__caption');
  var opener = null;

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.gallery-item button');
    if (!btn) return;
    opener = btn;
    var fig = btn.closest('.gallery-item');
    pair.innerHTML = '';
    fig.querySelectorAll('.gallery-item__pair img').forEach(function (img) {
      var big = img.cloneNode();
      big.removeAttribute('loading');
      pair.appendChild(big);
    });
    caption.innerHTML = fig.querySelector('figcaption').innerHTML;
    dialog.showModal();
    if (M && !reduce) M.animate(dialog, { opacity: [0, 1], scale: [0.96, 1] }, { duration: 0.35 });
  });

  dialog.querySelector('.lightbox__close').addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener('close', function () { if (opener) opener.focus(); });
})();
