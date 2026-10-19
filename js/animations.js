/* ==========================================================================
   animations.js — Motion (motion.dev) powered reveals, hero, parallax,
   timeline, accordion, hero slider and quote carousel.
   Calm and unhurried by design: no bounces, no gimmicks.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  var M = window.Motion;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EASE = [0.16, 1, 0.3, 1]; // expo-out: fast start, long soft landing

  if (!M || reduce) {
    root.classList.add('motion-off');
    M = null;
  }
  root.classList.add('page-ready');

  var animate = M ? M.animate : null;
  var inView = M ? M.inView : null;

  /* ---- Scroll reveals ---- */
  if (M) {
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      var dir = el.getAttribute('data-reveal') || 'up';
      var from = { up: { y: 18 }, left: { x: -24 }, right: { x: 24 }, scale: { scale: 0.975 } }[dir] || { y: 18 };
      inView(el, function () {
        var kf = { opacity: [0, 1] };
        Object.keys(from).forEach(function (k) { kf[k] = [from[k], k === 'scale' ? 1 : 0]; });
        animate(el, kf, { duration: 1.1, ease: EASE, delay: parseFloat(el.getAttribute('data-delay') || 0) });
      }, { amount: 0.15 });
    });

    document.querySelectorAll('[data-reveal-stagger]').forEach(function (group) {
      var kids = Array.prototype.slice.call(group.children);
      inView(group, function () {
        animate(kids, { opacity: [0, 1], y: [16, 0] }, { duration: 1, ease: EASE, delay: M.stagger(0.07) });
      }, { amount: 0.1 });
    });
  }

  /* ---- Hero entrance + slow parallax ---- */
  var heroItems = document.querySelectorAll('[data-hero-item]');
  if (M && heroItems.length) {
    animate(heroItems, { opacity: [0, 1], y: [16, 0] }, { duration: 1.2, ease: EASE, delay: M.stagger(0.1, { startDelay: 0.1 }) });
  }
  var heroMedia = document.querySelector('[data-parallax]');
  if (M && heroMedia) {
    var heroEl = heroMedia.closest('section');
    M.scroll(animate(heroMedia, { y: ['0%', '12%'] }, { ease: 'linear' }), { target: heroEl, offset: ['start start', 'end start'] });
  }

  /* ---- Hero background slider ---- */
  document.querySelectorAll('[data-hero-slider]').forEach(function (hero) {
    var slides = hero.querySelectorAll('.hero__slide');
    var dotsWrap = hero.querySelector('.hero__dots');
    if (slides.length < 2 || !dotsWrap) return;
    var index = 0, timer;
    var dots = Array.prototype.map.call(slides, function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show slide ' + (i + 1) + ' of ' + slides.length);
      b.addEventListener('click', function () { go(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });
    var FADE_MS = 1600, busy = false, cleanup;
    function imgOf(n) { return slides[n].querySelector('img'); }
    // Make sure an image is loaded and decoded before it is shown (no pop-in).
    function ready(n) {
      var img = imgOf(n);
      if (!img) return Promise.resolve();
      img.loading = 'eager';
      if (img.complete && img.naturalWidth) return img.decode ? img.decode().catch(function () {}) : Promise.resolve();
      return new Promise(function (res) { img.addEventListener('load', res, { once: true }); img.addEventListener('error', res, { once: true }); })
        .then(function () { return img.decode ? img.decode().catch(function () {}) : null; });
    }
    function go(i) {
      var next = (i + slides.length) % slides.length;
      if (next === index || busy) return;
      busy = true;
      ready(next).then(function () {
        var prev = index;
        clearTimeout(cleanup);
        slides.forEach(function (s) { s.classList.remove('is-prev'); });
        slides[prev].classList.add('is-prev');      // stays solid underneath
        slides[prev].classList.remove('is-active');
        dots[prev].removeAttribute('aria-current');
        index = next;
        slides[index].classList.add('is-active');   // fades in on top
        dots[index].setAttribute('aria-current', 'true');
        cleanup = setTimeout(function () { slides[prev].classList.remove('is-prev'); }, FADE_MS + 100);
        busy = false;
        ready((index + 1) % slides.length);         // warm up the following slide
      });
    }
    slides = Array.prototype.slice.call(slides);
    setTimeout(function () { ready(1); }, 1500);   // preload slide 2 after first paint
    var paused = reduce;
    var pauseBtn = hero.querySelector('[data-hero-pause]');
    function restart() {
      clearInterval(timer);
      if (!paused) timer = setInterval(function () { if (!document.hidden) go(index + 1); }, 7000);
    }
    function setPaused(p) {
      paused = p;
      if (pauseBtn) {
        pauseBtn.setAttribute('aria-label', p ? 'Play background slideshow' : 'Pause background slideshow');
        pauseBtn.innerHTML = window.DAC_ICON ? window.DAC_ICON(p ? 'play' : 'pause') : '';
      }
      restart();
    }
    if (pauseBtn) {
      if (reduce) setPaused(true);
      pauseBtn.addEventListener('click', function () { setPaused(!paused); });
    }
    dots[0].setAttribute('aria-current', 'true');
    restart();
  });

  /* ---- Timeline: steps reveal in sequence, progress line follows scroll ---- */
  document.querySelectorAll('.timeline').forEach(function (tl) {
    var progress = tl.querySelector('.timeline__progress');
    if (!M) return;
    if (progress) {
      M.scroll(animate(progress, { scaleY: [0, 1] }, { ease: 'linear' }), { target: tl, offset: ['start 75%', 'end 60%'] });
    }
    tl.querySelectorAll('.timeline__step').forEach(function (step, i) {
      inView(step, function () {
        var body = step.querySelector('.timeline__body');
        var num = step.querySelector('.timeline__num');
        var fromX = window.innerWidth >= 900 ? (i % 2 ? -36 : 36) : 24;
        animate(step, { opacity: [0, 1] }, { duration: 0.4 });
        if (num) animate(num, { scale: [0.6, 1] }, { duration: 0.6, ease: EASE });
        if (body) animate(body, { opacity: [0, 1], x: [fromX, 0] }, { duration: 0.8, ease: EASE, delay: 0.1 });
      }, { amount: 0.4 });
    });
  });

  /* ---- Accordion (FAQs) ---- */
  document.querySelectorAll('[data-accordion]').forEach(function (acc, accIndex) {
    var single = acc.hasAttribute('data-single');
    acc.querySelectorAll('.accordion__item').forEach(function (item, i) {
      var btn = item.querySelector('.accordion__trigger');
      var panel = item.querySelector('.accordion__panel');
      var id = 'acc-' + accIndex + '-' + i;
      btn.id = id + '-btn';
      panel.id = id + '-panel';
      btn.setAttribute('aria-controls', panel.id);
      btn.setAttribute('aria-expanded', 'false');
      panel.setAttribute('role', 'region');
      panel.setAttribute('aria-labelledby', btn.id);
      panel.hidden = true;
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        if (single && !open) {
          acc.querySelectorAll('.accordion__item.is-open').forEach(function (other) { if (other !== item) setOpen(other, false); });
        }
        setOpen(item, !open);
      });
    });
    var first = acc.querySelector('[data-open] .accordion__trigger');
    if (first) setOpen(first.closest('.accordion__item'), true, true);
  });

  function setOpen(item, open, instant) {
    var btn = item.querySelector('.accordion__trigger');
    var panel = item.querySelector('.accordion__panel');
    btn.setAttribute('aria-expanded', String(open));
    item.classList.toggle('is-open', open);
    if (!M || instant) {
      panel.hidden = !open;
      panel.style.height = '';
      return;
    }
    if (open) {
      panel.hidden = false;
      var h = panel.scrollHeight;
      animate(panel, { height: [0, h + 'px'], opacity: [0, 1] }, { duration: 0.45, ease: EASE }).then(function () { panel.style.height = 'auto'; });
    } else {
      animate(panel, { height: [panel.offsetHeight + 'px', '0px'], opacity: [1, 0] }, { duration: 0.35, ease: EASE }).then(function () {
        panel.hidden = true; panel.style.height = '';
      });
    }
  }

  /* ---- Quote / review carousel: auto-rotate with prev/next ---- */
  document.querySelectorAll('[data-carousel]').forEach(function (car) {
    var slides = car.querySelectorAll('.quote-slide');
    var dotsWrap = car.querySelector('.dots');
    var prev = car.querySelector('[data-prev]');
    var next = car.querySelector('[data-next]');
    var live = car.querySelector('.quote-carousel__viewport');
    if (slides.length < 2) return;
    var index = 0, timer, paused = false;
    var dots = Array.prototype.map.call(slides, function (s, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Show item ' + (i + 1));
      b.addEventListener('click', function () { show(i, i > index ? 1 : -1); });
      if (dotsWrap) dotsWrap.appendChild(b);
      return b;
    });
    function show(i, dir) {
      if (i === index) return;
      var from = slides[index];
      var to = slides[(i + slides.length) % slides.length];
      dots[index].removeAttribute('aria-current');
      index = (i + slides.length) % slides.length;
      dots[index].setAttribute('aria-current', 'true');
      if (M) {
        animate(from, { opacity: [1, 0], x: [0, -30 * dir] }, { duration: 0.35 }).then(function () { from.classList.remove('is-active'); });
        to.classList.add('is-active');
        animate(to, { opacity: [0, 1], x: [30 * dir, 0] }, { duration: 0.55, ease: EASE, delay: 0.15 });
      } else {
        from.classList.remove('is-active');
        to.classList.add('is-active');
      }
    }
    dots[0].setAttribute('aria-current', 'true');
    if (prev) prev.addEventListener('click', function () { show(index - 1, -1); });
    if (next) next.addEventListener('click', function () { show(index + 1, 1); });
    car.addEventListener('mouseenter', function () { paused = true; });
    car.addEventListener('mouseleave', function () { paused = false; });
    car.addEventListener('focusin', function () { paused = true; if (live) live.setAttribute('aria-live', 'polite'); });
    car.addEventListener('focusout', function () { paused = false; });
    if (!reduce) timer = setInterval(function () { if (!paused) show(index + 1, 1); }, 7000);
  });

  /* ---- Count-up stats ---- */
  if (M) {
    document.querySelectorAll('[data-count]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-count'));
      var suffix = el.getAttribute('data-suffix') || '';
      inView(el, function () {
        animate(0, target, { duration: 1.6, ease: EASE, onUpdate: function (v) { el.textContent = Math.round(v) + suffix; } });
      });
    });
  }

  /* ---- Video placeholder ---- */
  document.querySelectorAll('[data-video-placeholder]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      // TODO: replace with the real doctor-led video embed (YouTube/Vimeo iframe or <video>).
      var cap = btn.closest('.video-frame').querySelector('figcaption');
      if (cap) cap.textContent = 'Doctor-led video coming soon — placeholder only.';
      window.dacTrack && window.dacTrack('video_play_click');
    });
  });
})();
