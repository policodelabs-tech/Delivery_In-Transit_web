// Esperamos a que todo el HTML cargue antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

  // 1. Menú móvil (Optimizado con validaciones)
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });

    // Cerrar menú al hacer clic en un enlace
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // 2. Animaciones al hacer scroll (Mejora de rendimiento)
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Dejamos de observar el elemento una vez que ya se animó para ahorrar recursos del navegador
        obs.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.scroll-section').forEach(el => observer.observe(el));

  // 3. Scroll suave para enlaces internos
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      // Solo actuamos si el enlace no es solo un "#" vacío
      if (href !== '#') {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // 4. Botón de descarga y Toast (Con prevención de múltiples clics)
  const downloadBtn = document.getElementById('download-btn');
  const toast = document.getElementById('download-toast');
  let toastTimeout; // Guardamos el temporizador

  if (downloadBtn && toast) {
    downloadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Si el usuario hace clic varias veces rápido, reiniciamos el contador para que no se oculte antes de tiempo
      clearTimeout(toastTimeout);
      toast.classList.remove('hidden');
      
      toastTimeout = setTimeout(() => {
        toast.classList.add('hidden');
      }, 4000);
    });
  }

  // 5. Inicializar iconos Lucide (Validando que la librería cargó)
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

});