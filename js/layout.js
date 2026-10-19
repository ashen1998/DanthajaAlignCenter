/* ==========================================================================
   layout.js — shared header, footer, mobile menu, sticky mobile CTA bar,
   reusable CTA band and icon sprite. One source of truth for every page.
   Works from file:// (no fetch), so index.html can be opened directly.
   ========================================================================== */
(function () {
  'use strict';

  /* ---- Clinic details (edit here once; used across the whole site) ----
     TODO: confirm Danthaja-specific phone, WhatsApp number and email.
     Phone + address currently mirror the Figma footer. */
  var SITE = {
    name: 'Danthaja Aligner Center',
    phoneDisplay: '+94 702 999 666',
    phoneHref: 'tel:+94702999666',
    whatsappHref: 'https://wa.me/94702999666?text=' + encodeURIComponent('Hi Danthaja Aligner Center, I would like to ask about clear aligners.'),
    email: 'info@danthaja.com',
    addressLines: ['Danthaja Aligner Center', 'L3-29, One Galle Face Mall,', 'Central Road, Colombo 02'],
    facebook: '#', // TODO: add social profile URLs
    instagram: '#'
  };
  window.DAC_SITE = SITE;

  /* ---- Icon sprite (referenced with <svg class="icon"><use href="#i-name"/></svg>) ---- */
  var ICONS = {
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    whatsapp: '<path fill="currentColor" stroke="none" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.7.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2l-.5-.3z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    flow: '<rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5M5 17v-3h14v3"/>',
    home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    stethoscope: '<path d="M5 3v6a5 5 0 0 0 10 0V3"/><path d="M10 14v2a5 5 0 0 0 10 0v-2"/><circle cx="20" cy="12" r="2"/>',
    scale: '<path d="M12 3v18M7 21h10M5 7h14M5 7l-3 7a3 3 0 0 0 6 0zM19 7l-3 7a3 3 0 0 0 6 0z"/>',
    aligner: '<path d="M4 9c0-3 3.5-5 8-5s8 2 8 5c0 4-2 8-4 9s-2-3-4-3-2 4-4 3-4-5-4-9z"/><path d="M8 8h8"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>',
    play: '<path fill="currentColor" stroke="none" d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z"/>',
    facebook: '<path fill="currentColor" stroke="none" d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H8v4h2v8h4v-8h3l1-4h-4V8.5c0-.3.2-.5.5-.5z"/>',
    instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<circle cx="9" cy="8" r="4"/><path d="M2 21a7 7 0 0 1 14 0M16 4a4 4 0 0 1 0 8M22 21a7 7 0 0 0-4-6.3"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.3L3 16M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8z"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 12h10"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M8.2 13 7 22l5-3 5 3-1.2-9"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>',
    cap: '<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    ring: '<circle cx="12" cy="14" r="7"/><path d="m9 3 3 4 3-4"/>',
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    brush: '<path d="M9 21h6M12 3v14M8 7h8M8 11h8"/>',
    droplet: '<path d="M12 2.7 6.3 8.4a8 8 0 1 0 11.4 0z"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5z"/><path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5"/>',
    tag: '<path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L2 12V2h10l8.6 8.6a2 2 0 0 1 0 2.8z"/><circle cx="7" cy="7" r="1.5"/>',
    card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20M6 15h4"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    pause: '<path fill="currentColor" stroke="none" d="M6 4h4v16H6zM14 4h4v16h-4z"/>'
  };

  function icon(name, cls) {
    return '<svg class="icon' + (cls ? ' ' + cls : '') + '" aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>';
  }
  window.DAC_ICON = icon;

  function injectSprite() {
    var symbols = Object.keys(ICONS).map(function (k) {
      return '<symbol id="i-' + k + '" viewBox="0 0 24 24">' + ICONS[k] + '</symbol>';
    }).join('');
    var holder = document.createElement('div');
    holder.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">' + symbols + '</svg>';
    document.body.insertBefore(holder.firstChild, document.body.firstChild);
  }

  /* ---- Navigation map. Top level mirrors the Figma header exactly. ---- */
  var NAV = [
    { label: 'Home', href: 'index.html' },
    { label: 'About', href: 'about.html', children: [
      { label: 'About Danthaja Aligner Center', href: 'about.html' },
      { label: 'Our Doctors', href: 'about.html#doctors' },
      { label: 'Before & After Gallery', href: 'before-after-gallery.html' },
      { label: 'Blog & Patient Education', href: 'blog.html', also: ['blog-in-house-vs-invisalign.html'] }
    ] },
    { label: 'Treatments', href: 'compare-aligners.html', children: [
      { label: 'Danthaja In-House Aligners', href: 'in-house-aligners.html', note: 'Accessible, locally supported' },
      { label: 'Premium Invisalign', href: 'invisalign-sri-lanka.html', note: 'With Dr Jeremy Perera' },
      { label: 'Compare Pathways', href: 'compare-aligners.html' },
      { label: 'How Aligners Work', href: 'how-aligners-work.html' },
      { label: 'Who Can Use Aligners?', href: 'who-can-use-aligners.html' },
      { label: 'Pricing & Payment Options', href: 'pricing.html' }
    ] },
    { label: 'Consultations', href: 'smile-assessment.html', children: [
      { label: 'Smile Assessment', href: 'smile-assessment.html' },
      { label: 'Clear Aligner Assessment Week', href: 'assessment-week.html' }
    ] },
    { label: 'Safety & Aftercare', href: 'safety-aftercare.html' },
    { label: 'FAQ', href: 'faqs.html' }
  ];

  var current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  function isCurrent(href) { return href.toLowerCase() === current; }
  function aria(href) { return isCurrent(href) ? ' aria-current="page"' : ''; }
  function groupActive(item) {
    if (isCurrent(item.href)) return true;
    return (item.children || []).some(function (c) {
      return isCurrent(c.href) || (c.also || []).some(isCurrent);
    });
  }

  function headerHTML() {
    var items = NAV.map(function (item) {
      var sub = '';
      if (item.children) {
        sub = '<div class="subnav"><ul>' + item.children.map(function (c) {
          return '<li><a href="' + c.href + '"' + aria(c.href) + ' data-track="nav_click">' + c.label + (c.note ? '<small>' + c.note + '</small>' : '') + '</a></li>';
        }).join('') + '</ul></div>';
      }
      return '<li class="' + (item.children ? 'has-sub' : '') + (groupActive(item) ? ' is-active' : '') + '">' +
        '<a href="' + item.href + '"' + aria(item.href) + ' data-track="nav_click">' + item.label + '</a>' + sub + '</li>';
    }).join('');

    return '' +
      '<div class="container header-inner">' +
        '<a class="brand" href="index.html"><img src="images/logo.svg" alt="Danthaja Aligner Center — home" width="121" height="56"></a>' +
        '<nav class="main-nav" aria-label="Primary"><ul>' + items + '</ul></nav>' +
        '<!-- TODO: fire contact CTA click event here -->' +
        '<a class="btn btn--primary btn--sm header-cta" href="contact-booking.html" data-track="cta_contact_header">' + icon('phone') + 'Contact Us</a>' +
        '<button class="nav-toggle" type="button" aria-expanded="false" aria-controls="mobile-menu" aria-label="Open menu"><span></span></button>' +
      '</div>';
  }

  function mobileMenuHTML() {
    var groups = NAV.map(function (item) {
      if (!item.children) {
        return '<div class="mobile-menu__group"><a href="' + item.href + '"' + aria(item.href) + '>' + item.label + '</a></div>';
      }
      return '<div class="mobile-menu__group"><span class="mobile-menu__label">' + item.label + '</span><ul>' +
        item.children.map(function (c) { return '<li><a href="' + c.href + '"' + aria(c.href) + '>' + c.label + '</a></li>'; }).join('') +
        '</ul></div>';
    }).join('');
    return '<div class="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="Site menu">' + groups +
      '<div class="mobile-menu__ctas">' +
        '<a class="btn btn--primary btn--block" href="smile-assessment.html" data-track="cta_book_mobile_menu">' + icon('calendar') + 'Book Your Aligner Assessment</a>' +
        '<a class="btn btn--outline btn--block" data-site="phone" href="' + SITE.phoneHref + '" data-track="call_click">' + icon('phone') + 'Call the clinic</a>' +
      '</div></div>';
  }

  function mobileBarHTML() {
    return '<!-- TODO: fire book / WhatsApp click events here -->' +
      '<a class="btn btn--primary" href="contact-booking.html" data-track="cta_book_sticky">' + icon('calendar') + 'Book Now</a>' +
      '<a class="btn btn--whatsapp" data-site="whatsapp" href="' + SITE.whatsappHref + '" target="_blank" rel="noopener" data-track="whatsapp_click">' + icon('whatsapp') + 'WhatsApp<span class="sr-only"> (opens in a new tab)</span></a>';
  }

  function footerHTML() {
    var year = new Date().getFullYear();
    return '' +
      '<div class="container">' +
        '<div class="footer-main">' +
          '<div class="footer-brand">' +
            '<img src="images/logo-white.svg" alt="Danthaja Aligner Center" width="155" height="72" loading="lazy">' +
            '<h2>Danthaja Aligner Center</h2>' +
            '<p>Clear aligners. Clear confidence. Professionally guided aligner care at One Galle Face, Colombo — part of the Danthaja and Vathraja dentofacial aesthetics destination.</p>' +
            '<div class="socials">' +
              '<a href="' + SITE.facebook + '" aria-label="Danthaja Aligner Center on Facebook" data-site="facebook">' + icon('facebook') + '</a>' +
              '<a href="' + SITE.instagram + '" aria-label="Danthaja Aligner Center on Instagram" data-site="instagram">' + icon('instagram') + '</a>' +
            '</div>' +
          '</div>' +
          '<div class="footer-contact">' +
            '<h3>Contact Us</h3>' +
            '<address>' + SITE.addressLines.join('<br>') + '<br><br>' +
              '<a href="' + SITE.phoneHref + '" data-site="phone" data-track="call_click">' + SITE.phoneDisplay + '</a><br>' +
              '<a href="mailto:' + SITE.email + '" data-site="email">' + SITE.email + '</a>' +
            '</address>' +
          '</div>' +
          '<div>' +
            '<h3>Quick Links</h3>' +
            '<ul>' +
              '<li><a href="about.html">About Us</a></li>' +
              '<li><a href="how-aligners-work.html">How Aligners Work</a></li>' +
              '<li><a href="who-can-use-aligners.html">Who Can Use Aligners?</a></li>' +
              '<li><a href="safety-aftercare.html">Safety &amp; Aftercare</a></li>' +
              '<li><a href="pricing.html">Pricing</a></li>' +
              '<li><a href="blog.html">Blog</a></li>' +
              '<li><a href="faqs.html">FAQs</a></li>' +
              '<li><a href="about.html#doctors">Our Doctors</a></li>' +
              '<li><a href="privacy.html">Privacy Notice</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h3>Pathways</h3>' +
            '<ul>' +
              '<li><a href="in-house-aligners.html">Danthaja In-House Aligners</a></li>' +
              '<li><a href="invisalign-sri-lanka.html">Premium Invisalign</a></li>' +
              '<li><a href="compare-aligners.html">Compare Pathways</a></li>' +
              '<li><a href="smile-assessment.html">Smile Assessment</a></li>' +
              '<li><a href="assessment-week.html">Assessment Week</a></li>' +
              '<li><a href="contact-booking.html">Contact Us</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-disclaimer">' +
          '<p><strong>Medical disclaimer:</strong> Information on this website is general and educational. It is not a diagnosis or a substitute for professional dental advice.</p>' +
          '<p>Treatment outcomes vary by individual and require professional consultation. Suitability for clear aligners is confirmed only after a clinical assessment.</p>' +
        '</div>' +
      '</div>' +
      '<div class="footer-bottom">Copyright &copy; ' + year + ' <em>Danthaja Aligner Center</em> &middot; Sister brand of <a href="https://www.vathraja.com" target="_blank" rel="noopener"><em>Vathraja Facial Chambers</em><span class="sr-only"> (opens in a new tab)</span></a></div>';
  }

  /* ---- Reusable booking CTA band: <div data-component="cta-band"></div> ---- */
  function ctaBandHTML(el) {
    var eyebrow = el.getAttribute('data-eyebrow') || 'Begin with a conversation';
    var source = el.getAttribute('data-source') || 'cta_band';
    // Doctor avatars for the "doctor-led" badge (same files as the doctor cards).
    var team = ['dr-surain-gomez', 'dr-jeremy-perera', 'dr-deepal-nanayakkara', 'dr-lashan-jayathilaka', 'dr-dhanusha-manoharan'];
    return '' +
      '<div class="cta-card" data-reveal>' +
        '<div class="cta-card__media">' +
          '<img src="images/cta-photo.jpg" alt="" width="1000" height="1100" loading="lazy">' +
          '<span class="cta-card__chip">' + icon('pin') + 'One Galle Face, Colombo</span>' +
          '<div class="cta-card__team">' +
            '<div class="cta-card__avatars" aria-hidden="true">' +
              team.map(function (t) { return '<img src="images/' + t + '.jpg" alt="" width="40" height="40" loading="lazy">'; }).join('') +
            '</div>' +
            '<p><strong>Doctor-led care</strong><span>Consultation first, every case</span></p>' +
          '</div>' +
        '</div>' +
        '<div class="cta-card__body">' +
          '<p class="cta-card__eyebrow">' + eyebrow + '</p>' +
          '<h2>Ready to take <span>the first step?</span></h2>' +
          '<p class="cta-card__text">Book a consultation at the Danthaja and Vathraja dentofacial aesthetics destination at One Galle Face, Colombo. Our team will help you understand your options, choose the right pathway, and plan care around your smile, skin, facial confidence, timeline, and clinical suitability.</p>' +
          '<div class="cta-card__actions">' +
            '<!-- TODO: fire booking CTA click event here -->' +
            '<a class="btn btn--primary" href="contact-booking.html" data-track="cta_book" data-track-source="' + source + '">' + icon('calendar') + 'Book a Consultation</a>' +
            '<!-- TODO: fire WhatsApp click event here -->' +
            '<a class="btn btn--outline" data-site="whatsapp" href="' + SITE.whatsappHref + '" target="_blank" rel="noopener" data-track="whatsapp_click" data-track-source="' + source + '">' + icon('whatsapp') + 'WhatsApp Us<span class="sr-only"> (opens in a new tab)</span></a>' +
          '</div>' +
          '<ul class="cta-card__contact">' +
            '<!-- TODO: fire call / email click events here -->' +
            '<li><a data-site="phone" href="' + SITE.phoneHref + '" data-track="call_click" data-track-source="' + source + '"><span class="cta-card__ic">' + icon('phone') + '</span><span><small>Call the clinic</small>' + SITE.phoneDisplay + '</span></a></li>' +
            '<li><a data-site="email-link" href="mailto:' + SITE.email + '" data-track="email_click" data-track-source="' + source + '"><span class="cta-card__ic">' + icon('mail') + '</span><span><small>Email us</small>' + SITE.email + '</span></a></li>' +
          '</ul>' +
        '</div>' +
      '</div>';
  }

  /* ---- Lightweight analytics hook ---- */
  window.dacTrack = function (event, data) {
    // TODO: connect GA4 (gtag('event', ...)), Meta Pixel and/or CRM here.
    if (window.console && console.debug) console.debug('[track]', event, data || {});
  };
  function captureCampaign() {
    // TODO: campaign source params — persisted so forms can attach them to leads.
    try {
      var params = new URLSearchParams(location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].forEach(function (k) {
        if (params.get(k)) sessionStorage.setItem('dac_' + k, params.get(k));
      });
    } catch (e) { /* storage unavailable */ }
  }

  function build() {
    injectSprite();

    var header = document.getElementById('site-header');
    if (header) header.innerHTML = headerHTML();

    var menu = document.getElementById('mobile-menu');
    if (menu) menu.innerHTML = mobileMenuHTML();

    var bar = document.getElementById('mobile-cta-bar');
    if (bar) bar.innerHTML = mobileBarHTML();

    var footer = document.getElementById('site-footer');
    if (footer) footer.innerHTML = footerHTML();

    document.querySelectorAll('[data-component="cta-band"]').forEach(function (el) { el.innerHTML = ctaBandHTML(el); });

    // Keep hard-coded contact links in page content in sync with SITE.
    document.querySelectorAll('[data-site="phone"]').forEach(function (a) { a.href = SITE.phoneHref; });
    document.querySelectorAll('[data-site="whatsapp"]').forEach(function (a) { a.href = SITE.whatsappHref; });
    document.querySelectorAll('[data-site="email-link"]').forEach(function (a) { a.href = 'mailto:' + SITE.email; });
    document.querySelectorAll('[data-site-text="phone"]').forEach(function (n) { n.textContent = SITE.phoneDisplay; });
    document.querySelectorAll('[data-site-text="email"]').forEach(function (n) { n.textContent = SITE.email; });

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-track]');
      if (t) window.dacTrack(t.getAttribute('data-track'), { source: t.getAttribute('data-track-source') || current, href: t.getAttribute('href') });
    });

    captureCampaign();
  }

  build();
})();
