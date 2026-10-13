SMART DESIGN - BLOG PERSONAL
Evaluación final · Escenario 3: Blog personal
=====================================================================

DESCRIPCIÓN
Sitio web de un blog personal basado en mi negocio, Smart Design, que ofrece
landing pages y logos. Aplica estructura HTML semántica, diseño CSS con
Bootstrap, interacción con JavaScript y buenas prácticas de desarrollo web.

CÓMO ABRIRLO
1. Descomprimir la carpeta completa (no mover archivos por separado).
2. Abrir index.html en el navegador. Requiere conexión a internet para cargar
   Bootstrap y las fuentes desde su CDN.

ESTRUCTURA DE ARCHIVOS
(raiz del proyecto y del repositorio)
  index.html                  Página de inicio
  sobre-mi.html               Página subordinada 1
  servicios.html              Página subordinada 2
  portafolio.html             Página subordinada 3
  proceso.html                Página subordinada 4
  blog.html                   Página subordinada 5
  articulo-landing-pages.html Página subordinada 6
  articulo-logos.html         Página subordinada 7
  articulo-color.html         Página subordinada 8
  articulo-tipografia.html    Página subordinada 9
  recursos.html               Página subordinada 10
  faq.html                    Página subordinada 11
  contacto.html               Página subordinada 12
  css/styles.css              Estilos personalizados
  js/script.js                Interacciones con JavaScript
  js/i18n.js                  Cambio de idioma (español / inglés)
  js/translations.js          Diccionario de traducciones es / en
  assets/images/              Imágenes (logo y 15 ilustraciones SVG)
  README.txt                  Este archivo

CUMPLIMIENTO DE LOS REQUISITOS (Rúbrica 7.1)
1. Estructura HTML
   - Encabezado (<header>), cuerpo (<main>) y pie de página (<footer>) en todas las páginas.
   - Elementos semánticos: header, nav, main, section, article, aside, figure,
     figcaption, time, footer.
   - Página de inicio con carrusel, últimas entradas, servicios y llamada a la acción.
   - 12 páginas subordinadas (el mínimo pedido es 10).
2. Diseño CSS
   - Bootstrap 5.3.3 por CDN (rejilla, navbar, acordeón, formularios, utilidades).
   - css/styles.css personaliza la identidad: colores y forma del logo, tipografías
     Sora y Newsreader, cortes diagonales inspirados en el hexágono.
   - Diseño responsivo (móvil, tableta y escritorio) con la rejilla de Bootstrap
     y media queries propias.
3. Interacción con JavaScript (js/script.js)
   - Carrusel de imágenes en la página de inicio (automático, con botones,
     puntos, pausa, teclado y deslizamiento táctil).
   - Resaltar tarjetas al pasar el mouse y mostrar detalles al hacer clic
     (servicios, portafolio e inicio).
   - Validación de formularios en tiempo real (contacto y suscripción).
   - Extra: filtros por categoría en blog.html y portafolio.html.
   - Extra: selector de idioma ES / EN en el menú (js/i18n.js).
4. Buenas prácticas (identificadas en el código con etiquetas [BP-...])
   HTML
   - Idioma (lang="es"), UTF-8, meta viewport, título y descripción únicos por página.
   - Texto alternativo (alt) en cada imagen; width y height para evitar saltos
     de diseño; loading="lazy" en imágenes fuera de pantalla.
   - Jerarquía de encabezados (un solo h1 por página), migas de pan y enlace
     "Saltar al contenido".
   - Enlaces externos con rel="noopener noreferrer".
   - Scripts al final del <body>.
   CSS
   - Variables CSS, enfoque mobile-first, clases con prefijo "sd-".
   - Foco visible para teclado, contraste de color AA y respeto a
     prefers-reduced-motion.
   JavaScript
   - "use strict", código dentro de una función (sin variables globales),
     const/let, funciones pequeñas y atributos data-* para conectar con el HTML.
   - Accesibilidad: aria-expanded, aria-pressed, aria-live, aria-invalid.
   General
   - HTML, CSS y JavaScript en archivos separados; sin estilos ni scripts en línea.
   - Código comentado, con sangría uniforme y nombres descriptivos.
   - Bootstrap cargado con integridad (SRI) para garantizar que el archivo es el original.

IDIOMAS (ESPAÑOL / INGLÉS)
- Los botones ES y EN del menú cambian todo el sitio: textos, descripciones,
  etiquetas de accesibilidad, mensajes de error y atributo lang de <html>.
- El idioma elegido se recuerda en las demás páginas y en la próxima visita
  (localStorage). Por defecto el sitio abre en español.
- Cómo funciona: cada texto del HTML tiene data-i18n="clave"; js/i18n.js busca
  esa clave en js/translations.js y reemplaza el texto.
- Para cambiar una traducción o añadir un texto nuevo, edita la clave en los
  dos idiomas de js/translations.js.

NOTAS
- Los proyectos del portafolio son trabajos de práctica con marcas ficticias.
- Los formularios solo validan en el navegador; no envían datos a ningún servidor.
- Las ilustraciones son originales y se crearon para este proyecto. El logo
  (logo-completo.png y logo-marca.png) pertenece a Smart Design.
