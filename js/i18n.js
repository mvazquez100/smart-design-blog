/* ==========================================================================
   Smart Design · Blog personal
   Archivo: js/i18n.js   (i18n = "internationalization": soporte de idiomas)

   Cambia el idioma del sitio entre español (es) e inglés (en).

   CÓMO FUNCIONA
   1. El HTML está escrito en español y cada texto traducible lleva un atributo:
        <h2 data-i18n="como-trabajo">Cómo trabajo</h2>        → traduce el contenido
        <img data-i18n-attr="alt:clave" alt="...">            → traduce un atributo
        <meta data-i18n-attr="content:clave" ...>             → traduce otro atributo
      Con varios atributos se separan con punto y coma:  "alt:clave1;aria-label:clave2"
   2. js/translations.js contiene el diccionario { es: {...}, en: {...} }.
   3. Este archivo busca cada clave en el idioma elegido y reemplaza el texto.
   4. El idioma elegido se guarda en el navegador (localStorage) y se recuerda
      en todas las páginas y en la próxima visita.
   5. Al cambiar de idioma se emite el evento "sd:langchange" para que
      js/script.js actualice los textos que genera por su cuenta.

   BUENAS PRÁCTICAS aplicadas en este archivo:
   [BP-I18N-1] Textos separados del código: se traducen editando translations.js.
   [BP-I18N-2] Se actualiza <html lang="..."> para lectores de pantalla y buscadores.
   [BP-I18N-3] Los botones de idioma usan aria-pressed (el estado se anuncia).
   [BP-I18N-4] localStorage dentro de try/catch: si el navegador lo bloquea, el sitio sigue funcionando.
   [BP-I18N-5] Si falta una traducción, se muestra el español en lugar de dejar el texto vacío.
   ========================================================================== */

(function () {
  'use strict';

  const DEFAULT_LANG = 'es';
  const SUPPORTED = ['es', 'en'];
  const STORAGE_KEY = 'sd-lang';
  const dictionary = window.SD_TRANSLATIONS || {};

  let currentLang = DEFAULT_LANG;

  /* Lee el idioma guardado (devuelve null si no hay o si el navegador lo bloquea) */
  function readSavedLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return SUPPORTED.indexOf(saved) !== -1 ? saved : null;
    } catch (error) {
      return null;
    }
  }

  function saveLang(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (error) { /* se ignora */ }
  }

  /* Devuelve el texto de una clave en el idioma actual.
     "vars" rellena variables: t('ui-showing-many', { n: 3 }) reemplaza {n} por 3. */
  function t(key, vars) {
    const table = dictionary[currentLang] || {};
    const fallback = dictionary[DEFAULT_LANG] || {};
    let text = table[key] !== undefined ? table[key] : fallback[key];
    if (text === undefined) { return key; }   // clave inexistente: se muestra la clave (ayuda a detectar errores)
    if (vars) {
      Object.keys(vars).forEach(function (name) {
        text = text.split('{' + name + '}').join(vars[name]);
      });
    }
    return text;
  }

  /* Aplica el idioma actual a toda la página */
  function applyLanguage() {
    document.documentElement.lang = currentLang;

    // 1) Textos: data-i18n="clave"
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      const text = t(el.getAttribute('data-i18n'));
      if (el.tagName === 'TITLE') { el.textContent = text; } else { el.innerHTML = text; }
    });

    // 2) Atributos: data-i18n-attr="alt:clave;aria-label:clave2"
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        const cut = pair.indexOf(':');
        el.setAttribute(pair.slice(0, cut), t(pair.slice(cut + 1)));
      });
    });

    // 3) Estado visual de los botones ES / EN
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === currentLang));
    });

    // 4) Aviso para que script.js actualice sus propios textos
    document.dispatchEvent(new CustomEvent('sd:langchange', { detail: { lang: currentLang } }));
  }

  function setLang(lang) {
    if (SUPPORTED.indexOf(lang) === -1) { return; }
    currentLang = lang;
    saveLang(lang);
    applyLanguage();
  }

  /* Un solo escuchador de clics para los dos botones (delegación de eventos) */
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-lang]');
    if (btn) { setLang(btn.getAttribute('data-lang')); }
  });

  /* Se publica una pequeña API para que script.js use t() */
  window.SD_I18N = { t: t, setLang: setLang, getLang: function () { return currentLang; } };

  /* Arranque: idioma guardado o español por defecto.
     Si ya está en español no hace falta reescribir el HTML (ya viene en español). */
  currentLang = readSavedLang() || DEFAULT_LANG;
  if (currentLang !== DEFAULT_LANG) {
    applyLanguage();
  } else {
    document.querySelectorAll('[data-lang]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === currentLang));
    });
  }
})();
