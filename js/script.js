/* ==========================================================================
   Smart Design · Blog personal
   Archivo: js/script.js

   Módulos (cada uno es una función independiente):
     1. initCarousel  → carrusel de imágenes de la página de inicio
     2. initCards     → resaltar tarjetas con el mouse y mostrar detalles al hacer clic
     3. initFilters   → filtrar entradas/proyectos por categoría
     4. initForms     → validar formularios con retroalimentación en tiempo real
     5. initFooterYear→ año automático en el pie de página

   IDIOMAS: los mensajes que crea este archivo (botones, errores, avisos) se piden
   con t('clave') a js/i18n.js y se actualizan al recibir el evento "sd:langchange".

   BUENAS PRÁCTICAS aplicadas en este archivo:
   [BP-JS-1] "use strict" y todo dentro de una función (IIFE): no se ensucia el ámbito global.
   [BP-JS-2] const/let en vez de var; funciones pequeñas con un solo propósito.
   [BP-JS-3] Cada módulo se activa solo si encuentra su HTML en la página.
   [BP-JS-4] Accesibilidad: aria-expanded, aria-pressed, aria-live, aria-invalid y teclado.
   [BP-JS-5] Se respeta prefers-reduced-motion (el carrusel no avanza solo).
   [BP-JS-6] Se usan atributos data-* para conectar HTML y JS sin depender de estilos.
   ========================================================================== */

(function () {
  'use strict';

  /* Traducción de los mensajes de este archivo (viene de js/i18n.js) */
  const t = function (key, vars) { return window.SD_I18N ? window.SD_I18N.t(key, vars) : key; };

  /* Ejecuta una función cada vez que cambia el idioma */
  const onLanguageChange = function (fn) { document.addEventListener('sd:langchange', fn); };

  /* Detecta si la persona pidió menos movimiento en su sistema */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. CARRUSEL
     HTML esperado: <div data-carousel> con .sd-slide, botones [data-carousel-prev],
     [data-carousel-next], [data-carousel-toggle] y un contenedor [data-carousel-dots].
     ------------------------------------------------------------------------ */
  function initCarousel(root) {
    const slides = Array.from(root.querySelectorAll('.sd-slide'));
    const btnPrev = root.querySelector('[data-carousel-prev]');
    const btnNext = root.querySelector('[data-carousel-next]');
    const btnToggle = root.querySelector('[data-carousel-toggle]');
    const dotsBox = root.querySelector('[data-carousel-dots]');
    const slidesBox = root.querySelector('.sd-slides');
    const INTERVAL_MS = 5000;

    let index = 0;
    let timer = null;
    let autoplay = !prefersReducedMotion; // el usuario puede pausar con el botón

    /* Crea un punto (botón) por cada diapositiva */
    const dots = slides.map(function (slide, i) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'sd-dot';
      dot.addEventListener('click', function () { goTo(i); restart(); });
      dotsBox.appendChild(dot);
      return dot;
    });

    /* Etiqueta accesible de cada punto, en el idioma actual */
    function labelDots() {
      dots.forEach(function (dot, i) {
        dot.setAttribute('aria-label', t('ui-go-to-slide', { n: i + 1, total: slides.length }));
      });
    }

    /* Muestra la diapositiva "n" (da la vuelta si se pasa de los extremos) */
    function goTo(n) {
      index = (n + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        const active = i === index;
        slide.classList.toggle('is-active', active);
        slide.setAttribute('aria-hidden', String(!active));
        // Los enlaces de diapositivas ocultas no deben recibir foco con Tab
        slide.querySelectorAll('a').forEach(function (a) { a.tabIndex = active ? 0 : -1; });
      });
      dots.forEach(function (dot, i) { dot.setAttribute('aria-current', String(i === index)); });
    }

    function start() {
      stop();
      if (autoplay) { timer = setInterval(function () { goTo(index + 1); }, INTERVAL_MS); }
    }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { start(); }

    /* Texto del botón pausa/reproducir y aviso para lectores de pantalla */
    function updateToggle() {
      btnToggle.textContent = t(autoplay ? 'ui-pause' : 'ui-play');
      btnToggle.setAttribute('aria-pressed', String(!autoplay));
      // Si avanza solo, no se anuncia cada cambio; si está en pausa, sí.
      slidesBox.setAttribute('aria-live', autoplay ? 'off' : 'polite');
    }

    btnPrev.addEventListener('click', function () { goTo(index - 1); restart(); });
    btnNext.addEventListener('click', function () { goTo(index + 1); restart(); });
    btnToggle.addEventListener('click', function () { autoplay = !autoplay; updateToggle(); start(); });

    /* Pausa temporal mientras el mouse o el foco están sobre el carrusel */
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', start);

    /* Teclado: flechas izquierda/derecha */
    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goTo(index - 1); restart(); }
      if (e.key === 'ArrowRight') { goTo(index + 1); restart(); }
    });

    /* Táctil: deslizar el dedo para cambiar de diapositiva */
    let touchX = null;
    root.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', function (e) {
      if (touchX === null) { return; }
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 40) { goTo(index + (dx < 0 ? 1 : -1)); restart(); }
      touchX = null;
    }, { passive: true });

    onLanguageChange(function () { labelDots(); updateToggle(); });

    labelDots();
    goTo(0);
    updateToggle();
    start();
  }

  /* ------------------------------------------------------------------------
     2. TARJETAS: resaltar al pasar el mouse y mostrar detalles al hacer clic
     HTML esperado: [data-card-group] > [data-card] con un botón [data-card-toggle]
     que apunta (aria-controls) al panel de detalles.
     ------------------------------------------------------------------------ */
  function initCards(group) {
    const cards = Array.from(group.querySelectorAll('[data-card]'));

    cards.forEach(function (card) {
      /* Resaltar: la tarjeta activa se destaca y las demás se atenúan (ver CSS) */
      function highlightOn() {
        group.classList.add('has-highlight');
        card.classList.add('is-highlighted');
      }
      function highlightOff() {
        group.classList.remove('has-highlight');
        card.classList.remove('is-highlighted');
      }
      card.addEventListener('mouseenter', highlightOn);
      card.addEventListener('mouseleave', highlightOff);
      card.addEventListener('focusin', highlightOn);   // lo mismo con el teclado
      card.addEventListener('focusout', highlightOff);

      /* Mostrar/ocultar detalles al hacer clic */
      const btn = card.querySelector('[data-card-toggle]');
      const panel = document.getElementById(btn.getAttribute('aria-controls'));
      /* El texto del botón depende de si el panel está abierto y del idioma */
      function syncLabel() {
        btn.textContent = t(btn.getAttribute('aria-expanded') === 'true' ? 'ui-hide-details' : 'ui-show-details');
      }
      btn.addEventListener('click', function () {
        const wasOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!wasOpen));
        panel.hidden = wasOpen;
        syncLabel();
      });
      onLanguageChange(syncLabel);
      syncLabel();
    });
  }

  /* ------------------------------------------------------------------------
     3. FILTROS por categoría
     HTML esperado: [data-filter-group="#id-del-contenedor"] con botones
     [data-filter="slug"]; los elementos filtrables llevan data-category="slug".
     ------------------------------------------------------------------------ */
  function initFilters(group) {
    const container = document.querySelector(group.getAttribute('data-filter-group'));
    const buttons = Array.from(group.querySelectorAll('[data-filter]'));
    const items = Array.from(container.querySelectorAll('[data-category]'));
    const status = group.querySelector('[data-filter-status]');

    let visible = 0;

    /* Mensaje para lectores de pantalla: cuántos elementos se muestran */
    function showStatus() {
      status.textContent = visible === 1 ? t('ui-showing-one') : t('ui-showing-many', { n: visible });
    }

    function apply(category) {
      visible = 0;
      buttons.forEach(function (b) {
        const active = b.getAttribute('data-filter') === category;
        b.classList.toggle('is-active', active);
        b.setAttribute('aria-pressed', String(active));
      });
      items.forEach(function (item) {
        const show = category === 'todos' || item.getAttribute('data-category') === category;
        item.hidden = !show;
        if (show) { visible += 1; }
      });
      showStatus();
    }
    onLanguageChange(showStatus);

    buttons.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
    });

    /* Si la URL trae #logos, #color, etc., se aplica ese filtro al abrir la página */
    const fromHash = decodeURIComponent(window.location.hash.slice(1));
    const valid = buttons.some(function (b) { return b.getAttribute('data-filter') === fromHash; });
    apply(valid ? fromHash : 'todos');
  }

  /* ------------------------------------------------------------------------
     4. VALIDACIÓN DE FORMULARIOS (en tiempo real)
     Cada campo declara su regla con data-rule="name|email|select|message|checked".
     Se valida al escribir (input), al salir del campo (blur) y al enviar (submit).
     ------------------------------------------------------------------------ */
  const rules = {
    name: function (value) {
      return value.trim().length >= 3 ? '' : t('err-name');
    },
    email: function (value) {
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
      return ok ? '' : t('err-email');
    },
    select: function (value) {
      return value ? '' : t('err-select');
    },
    message: function (value) {
      const n = value.trim().length;
      return n >= 20 ? '' : t('err-message', { n: n });
    },
    checked: function (value, field) {
      return field.checked ? '' : t('err-checked');
    }
  };

  /* Valida un campo, pinta el estado (válido/inválido) y devuelve true/false */
  function validateField(field) {
    const rule = rules[field.getAttribute('data-rule')];
    const feedback = document.getElementById(field.getAttribute('aria-describedby'));
    const error = rule(field.value, field);

    field.classList.toggle('is-invalid', error !== '');
    field.classList.toggle('is-valid', error === '');
    field.setAttribute('aria-invalid', String(error !== ''));
    if (feedback) { feedback.textContent = error; }
    return error === '';
  }

  function initForms(form) {
    const fields = Array.from(form.querySelectorAll('[data-rule]'));
    const success = form.querySelector('[data-form-success]');
    const counter = form.querySelector('[data-counter]');
    const messageField = form.querySelector('textarea');

    fields.forEach(function (field) {
      const eventName = field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';
      field.addEventListener(eventName, function () { validateField(field); });
      field.addEventListener('blur', function () { validateField(field); });
    });

    /* Si cambia el idioma, los mensajes de error visibles se vuelven a escribir */
    onLanguageChange(function () {
      fields.forEach(function (field) {
        if (field.classList.contains('is-invalid')) { validateField(field); }
      });
    });

    /* Contador de caracteres del mensaje */
    if (counter && messageField) {
      messageField.addEventListener('input', function () {
        counter.textContent = messageField.value.length + ' / ' + messageField.maxLength;
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault(); // no recarga la página (esta práctica es solo front-end)
      const results = fields.map(validateField);
      const firstInvalid = fields[results.indexOf(false)];

      if (firstInvalid) {
        success.hidden = true;
        firstInvalid.focus(); // lleva al primer error
        return;
      }
      form.reset();
      fields.forEach(function (f) {
        f.classList.remove('is-valid', 'is-invalid');
        f.removeAttribute('aria-invalid');
      });
      if (counter) { counter.textContent = '0 / ' + messageField.maxLength; }
      success.hidden = false; // mensaje de éxito (role="status" lo anuncia)
    });
  }

  /* ------------------------------------------------------------------------
     5. AÑO DEL PIE DE PÁGINA
     ------------------------------------------------------------------------ */
  function initFooterYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = new Date().getFullYear();
    });
  }
  /* Al cambiar de idioma se reescribe el pie de página, así que se vuelve a poner el año */
  onLanguageChange(initFooterYear);

  /* ------------------------------------------------------------------------
     Arranque: cuando el HTML está listo se activa cada módulo si existe
     ------------------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-carousel]').forEach(initCarousel);
    document.querySelectorAll('[data-card-group]').forEach(initCards);
    document.querySelectorAll('[data-filter-group]').forEach(initFilters);
    document.querySelectorAll('form[data-validate]').forEach(initForms);
    initFooterYear();
  });
})();
