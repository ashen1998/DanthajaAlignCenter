/* ==========================================================================
   forms.js — client-side validation + submit handling for consultation forms.
   No backend yet: data is logged to the console, then the visitor is sent
   to thank-you.html.
   ========================================================================== */
(function () {
  'use strict';

  var SERVICE_PARAM = {
    'in-house': 'Danthaja In-House Aligners',
    invisalign: 'Premium Invisalign',
    assessment: 'Clear Aligner Assessment',
    'face-smile': 'Face and Smile Plan'
  };
  var uid = 0;

  function fieldWrap(input) { return input.closest('.field') || input.closest('.consent'); }

  function validate(input) {
    var wrap = fieldWrap(input);
    var ok = input.checkValidity();
    if (ok && input.type === 'tel' && input.value.trim()) {
      ok = /^[+\d][\d\s()-]{6,}$/.test(input.value.trim());
      input.setCustomValidity(ok ? '' : 'Please enter a valid mobile number.');
    }
    if (wrap) {
      wrap.classList.toggle('has-error', !ok);
      // Link the error message to the field only while it is shown.
      var err = wrap.querySelector('.error');
      if (err) {
        if (!err.id) err.id = 'field-err-' + (++uid);
        if (ok) input.removeAttribute('aria-describedby');
        else input.setAttribute('aria-describedby', err.id);
      }
    }
    input.setAttribute('aria-invalid', String(!ok));
    return ok;
  }

  document.querySelectorAll('form[data-consult-form]').forEach(function (form) {
    // Pre-select service from ?service= param or data-default-service.
    var select = form.querySelector('select[name="service"]');
    var param = new URLSearchParams(location.search).get('service');
    var wanted = SERVICE_PARAM[param] || form.getAttribute('data-default-service');
    if (select && wanted) select.value = wanted;

    // Earliest preferred date = today.
    var date = form.querySelector('input[type="date"]');
    if (date) date.min = new Date().toISOString().slice(0, 10);

    // Attach campaign params captured by layout.js.
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid'].forEach(function (k) {
      var v = null;
      try { v = sessionStorage.getItem('dac_' + k); } catch (e) { /* ignore */ }
      if (v) {
        var h = document.createElement('input');
        h.type = 'hidden'; h.name = k; h.value = v;
        form.appendChild(h);
      }
    });
    var page = document.createElement('input');
    page.type = 'hidden'; page.name = 'source_page'; page.value = location.pathname.split('/').pop() || 'index.html';
    form.appendChild(page);

    form.querySelectorAll('input, select, textarea').forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value || input.type === 'checkbox') validate(input); });
      input.addEventListener('input', function () { if (fieldWrap(input) && fieldWrap(input).classList.contains('has-error')) validate(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var inputs = Array.prototype.slice.call(form.querySelectorAll('input:not([type="hidden"]), select, textarea'));
      var firstBad = null;
      inputs.forEach(function (input) { if (!validate(input) && !firstBad) firstBad = input; });
      if (firstBad) {
        firstBad.focus();
        var status = form.querySelector('[data-form-status]');
        if (status) status.textContent = 'Please check the highlighted fields.';
        return;
      }

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });

      /* ==================================================================
         TODO: REAL FORM SUBMISSION / CRM INTEGRATION GOES HERE.
         e.g. fetch('https://your-endpoint/api/leads', { method: 'POST',
         headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
         ================================================================== */
      console.log('[Danthaja] Consultation request:', data);

      // TODO: fire form submit conversion event here (GA4 generate_lead / Meta Lead).
      if (window.dacTrack) window.dacTrack('form_submit', { form: form.getAttribute('data-consult-form'), service: data.service });

      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }
      setTimeout(function () { location.href = 'thank-you.html'; }, 400);
    });
  });
})();
