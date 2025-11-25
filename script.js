/* ------------------ 1. Panel lateral (menu) ------------------ */
const menuBtn = document.getElementById('menuBtn');
const sidePanel = document.getElementById('sidePanel');
// nuevo: botón de cierre
const sideCloseBtn = document.getElementById('sideCloseBtn');

menuBtn.addEventListener('click', () => {
  sidePanel.classList.toggle('open');
  sidePanel.setAttribute('aria-hidden', String(!sidePanel.classList.contains('open')));
});

// cerrar desde el botón interior
if (sideCloseBtn){
  sideCloseBtn.addEventListener('click', () => {
    sidePanel.classList.remove('open');
    sidePanel.setAttribute('aria-hidden', 'true');
  });
}

// Cerrar panel al hacer click fuera (ya existente): sin cambios lógicos
document.addEventListener('click', (e) => {
  if (!sidePanel.contains(e.target) && !menuBtn.contains(e.target) && sidePanel.classList.contains('open')) {
    sidePanel.classList.remove('open');
    sidePanel.setAttribute('aria-hidden', 'true');
  }
});

// Cerrar con Escape para mejor accesibilidad
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && sidePanel.classList.contains('open')) {
    sidePanel.classList.remove('open');
    sidePanel.setAttribute('aria-hidden', 'true');
  }
});


/* ------------------ 2. Carrusel (6 imágenes) ------------------ */
const carouselImg = document.getElementById('carouselImg');
const images = [
  'https://via.placeholder.com/800x400?text=Imagen+Rutas', 
  'https://via.placeholder.com/800x400?text=Imagen+Asignación', 
  'https://via.placeholder.com/800x400?text=Imagen+Seguimiento', 
  'https://via.placeholder.com/800x400?text=Imagen+Reportes', 
  'https://via.placeholder.com/800x400?text=Imagen+Control', 
  'https://via.placeholder.com/800x400?text=Imagen+API' 
];
let cIndex = 0; 

function showImage(i){
  // Aplicar fade-out
  carouselImg.style.opacity = 0;
  
  // Esperar que termine el fade-out para cambiar la imagen y hacer fade-in
  setTimeout(()=> {
    const newIndex = (i + images.length) % images.length;
    carouselImg.src = images[newIndex];
    carouselImg.alt = `Carrusel ${newIndex + 1}`;
    // Aplicar fade-in
    carouselImg.style.opacity = 1;
  }, 300); // 300ms coincide con la transición en CSS
}

/* ------------------ 3. Escritura animada (Sincronizada con Carrusel y Info Card) ------------------ */
const typingEl = document.getElementById('typing');
const infoCardText = document.getElementById('infoCardText');
const infoCard = document.getElementById('infoCard');

const ventajas = [
  'Rutas optimizadas',
  'Asignación automática',
  'Seguimiento en tiempo real',
  'Reportes y métricas',
  'Control de entregas',
  'Integraciones API'
];

// Descripciones sincronizadas con las ventajas
const descripciones = [
    'Encuentra el camino más rápido para tu flota. Reducimos el consumo de combustible y aumentamos la eficiencia de cada repartidor.',
    'Distribuye pedidos a tus repartidores automáticamente según su ubicación, disponibilidad y capacidad de carga.',
    'Monitorea la ubicación exacta y el estado de cada entrega desde tu panel de control, en vivo y sin demoras.',
    'Genera análisis detallados sobre rendimiento, tiempos de entrega y satisfacción del cliente para optimizar tu operación.',
    'Asegura la correcta finalización de cada entrega con firmas digitales, fotos de prueba y códigos de verificación.',
    'Conecta fácilmente nuestro sistema con tus plataformas de e-commerce, facturación y gestión de inventario existentes.'
];

let vIndex = 0;
let charIndex = 0;
let deleting = false;
let pause = 1500; // Pausa al mostrar palabra completa

// Función que actualiza el texto de la tarjeta con animación de fade
function updateInfoCard(index) {
    infoCard.style.opacity = 0;
    
    setTimeout(() => {
        infoCardText.textContent = descripciones[index];
        infoCard.style.opacity = 1;
    }, 200); 
}


function tick(){
  const current = ventajas[vIndex];
  
  if (!deleting){
    // Escribiendo
    charIndex++;
    typingEl.textContent = current.slice(0, charIndex);
    
    if (charIndex === current.length){
      // Palabra completa, esperar antes de borrar
      deleting = true;
      setTimeout(tick, pause);
      return;
    }
  } else {
    // Borrando
    charIndex--;
    typingEl.textContent = current.slice(0, charIndex);
    
    if (charIndex <= 0){
      // Palabra borrada
      deleting = false;
      // Pasar a la siguiente ventaja/imagen
      vIndex = (vIndex + 1) % ventajas.length;
      
      // *** SINCRONIZACIÓN DE ELEMENTOS ***
      cIndex = vIndex;
      showImage(cIndex);
      updateInfoCard(vIndex);
      
      // Pausa breve antes de escribir la nueva palabra
      setTimeout(tick, 500);
      return;
    }
  }
  
  // Velocidad de escritura/borrado
  setTimeout(tick, deleting ? 90 : 140);
}

// Iniciar la animación y elementos al cargar
document.addEventListener('DOMContentLoaded', () => {
  showImage(0); 
  updateInfoCard(0);
  setTimeout(tick, 700);
});

/* ------------------ 4. Accessibility: Enlaces con Smooth Scroll ------------------ */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', function(e){
    const target = document.querySelector(this.getAttribute('href'));
    if (target){
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth', block:'start'});
      // cerrar panel si está abierto (en móvil)
      if (sidePanel.classList.contains('open')) { 
        sidePanel.classList.remove('open');
        sidePanel.setAttribute('aria-hidden', 'true');
      }
    }
  });
});

/* ------------------ 5. Lógica de Tema Eliminada ------------------ */
// No hay código de theme switcher aquí. El diseño es fijo en Light Mode.