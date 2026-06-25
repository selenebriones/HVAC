# MXHVAC - Landing Page

Este proyecto es la Landing Page oficial para **MXHVAC**, una empresa 100% mexicana especializada en climatización industrial y sistemas de volumen de refrigerante variable (VRF) de máxima eficiencia.

## 🚀 Tecnologías Utilizadas

La Landing Page está construida bajo un stack moderno y enfocado en el alto rendimiento y la excelencia visual:

- **Framework:** [Astro](https://astro.build/) - Elegido por su velocidad extrema y generación de sitios estáticos (SSG).
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) - Para el diseño responsivo, clases utilitarias y efectos visuales avanzados (como el *glassmorphism*).
- **Animaciones:** [GSAP (GreenSock)](https://gsap.com/) & ScrollTrigger - Para animaciones complejas basadas en el desplazamiento (*scroll*) del usuario, dándole una sensación muy "premium" y fluida a la navegación.
- **Íconos:** [Phosphor Icons](https://phosphoricons.com/) - Una librería de íconos elegante y limpia.
- **Tipografía:** [Outfit](https://fonts.google.com/specimen/Outfit) (Google Fonts).

## 📁 Estructura del Proyecto

El código está estructurado para que sea fácil de mantener y escalar. Los archivos principales en los que trabajarás son:

### 1. `src/layouts/Layout.astro`
Es el cascarón principal del sitio. Aquí encontrarás:
- **Head de HTML:** Meta tags, configuración SEO, favicons, fuentes e importación de la librería de Phosphor Icons.
- **Navegación Global (Header):** El menú superior flotante. Los enlaces anclan a las secciones de `index.astro`.
- **Footer (Pie de página):** Información de contacto, menú de navegación secundario y enlaces legales.
- **Scripts Globales:** Aquí se importan e inicializan GSAP y ScrollTrigger.

### 2. `src/pages/index.astro`
Contiene toda la estructura visual y de contenido de la landing page. Está dividida por secciones con sus respectivos `id` (para la navegación):
- **Hero (`#hero`):** La sección principal impactante con el título y llamado a la acción inicial.
- **Soluciones Especializadas (`#soluciones-especializadas`):** Contiene el detalle técnico (en tarjetas con diseño visual) de Chillers de Absorción, Tecnología VRF y Motogeneradores. Las tarjetas incluyen botones para "Descargar Ficha Técnica".
- **Equipamiento y Proyectos (`#equipamiento`):** Muestra el portafolio y el alcance del equipamiento periférico y sistemas de distribución.
- **Servicios (`#servicios`):** Lista los servicios integrales y cómo se ejecutan los proyectos "Llave en Mano".
- **Carrusel de Clientes/Marcas:** Animación infinita (marquee) utilizando CSS puro para mostrar los logotipos de empresas y clientes (ej. Vicot) en escala de grises.
- **Contacto / Nosotros (`#contacto`):** Sección inferior con un resumen corporativo de la empresa y un formulario de contacto.

### 3. `public/`
Aquí se almacenan los assets estáticos (imágenes, logos, favicons). Cualquier archivo aquí puesto se puede referenciar directamente con `/nombre_del_archivo.extensión`.
- `/clientes/`: Logotipos para el carrusel de marcas.
- `/soluciones_especializadas/`: Imágenes de fondo que se usan en las tarjetas de la sección de Soluciones.

## 🎨 Guía de Estilo y Diseño

- **Paleta de Colores:** 
  - **Fondo / Secundario:** Tonos muy oscuros como `#0A192F` y `#050d1a` para dar ese look técnico e industrial moderno.
  - **Acento (Primario):** Cyan brillante (`#00D2FF` o clases `text-accent`) para llamadas a la acción, íconos y destellos de luz.
- **Efectos:** Gran énfasis en opacidades tenues (`bg-white/10`), bordes semi-transparentes (`border-white/10`) y filtros `backdrop-blur` (Glassmorphism) para crear profundidad entre los fondos oscuros y los elementos en primer plano.

## 💻 Comandos Útiles

Astro proporciona comandos muy sencillos de utilizar para el desarrollo:

```bash
# Instalar todas las dependencias (La primera vez que clonas el repositorio)
npm install

# Iniciar el servidor local de desarrollo
# Por reglas del proyecto, utilizar el modo background si es necesario, o el comando estándar:
npm run dev
# (El servidor usualmente correrá en http://localhost:4321)

# Construir el sitio para producción
npm run build

# Previsualizar el build de producción en local
npm run preview
```

## 🛠 Cómo hacer futuras actualizaciones

1. **Editar contenido de texto o tarjetas:** Busca directamente en `src/pages/index.astro`. Todo el HTML está semánticamente ordenado por comentarios `<!-- Nombre de Sección -->`.
2. **Cambiar imágenes:** Sube la nueva imagen a la carpeta `public/` correspondiente, luego actualiza la ruta del atributo `src="..."` de la etiqueta `<img>` en el `.astro`.
3. **Modificar datos de contacto:** Puedes actualizar la dirección o teléfonos en el pie de página abriendo `src/layouts/Layout.astro`.
4. **Modificar enlaces del Menú:** Dirígete a la etiqueta `<nav>` dentro de `src/layouts/Layout.astro`.
