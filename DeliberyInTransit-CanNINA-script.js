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

// 6. Lógica de Autenticación (Login / Registro con Render)
  const authModal = document.getElementById('auth-modal');
  const btnOpenLogin = document.getElementById('btn-open-login');
  const btnOpenLoginMobile = document.getElementById('btn-open-login-mobile');
  const btnCloseModal = document.getElementById('close-modal-btn');

  const loginContainer = document.getElementById('login-container');
  const registerContainer = document.getElementById('register-container');
  const showRegisterBtn = document.getElementById('show-register');
  const showLoginBtn = document.getElementById('show-login');

  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const loginMessage = document.getElementById('loginMessage');
  const registerMessage = document.getElementById('registerMessage');

  // URL DE TU SERVIDOR EN RENDER
  const API_URL = "https://delivery-web-backend.onrender.com/api/auth";

  // Función para abrir y cerrar la ventana
  function openModal() {
    authModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Bloquea el scroll del fondo
    if (typeof lucide !== 'undefined') lucide.createIcons(); // Recarga los íconos
  }

  function closeModal() {
    authModal.classList.add('hidden');
    document.body.style.overflow = '';
    loginForm.reset();
    registerForm.reset();
    loginMessage.textContent = '';
    registerMessage.textContent = '';
  }

  if (btnOpenLogin) btnOpenLogin.addEventListener('click', openModal);
  if (btnOpenLoginMobile) btnOpenLoginMobile.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);

  // Animación para alternar entre Login y Registro
  showRegisterBtn.addEventListener('click', () => {
    loginContainer.classList.add('hidden');
    registerContainer.classList.remove('hidden');
    loginMessage.textContent = '';
  });

  showLoginBtn.addEventListener('click', () => {
    registerContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
    registerMessage.textContent = '';
  });

  function showAuthMessage(element, text, isSuccess) {
    element.textContent = text;
    element.style.color = isSuccess ? '#00d278' : '#ff6b6b';
  }

  // Petición al Backend: REGISTRO
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    
    showAuthMessage(registerMessage, "Procesando...", true);

    try {
      const response = await fetch(`${API_URL}/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.text();
      
      if (response.ok) {
        showAuthMessage(registerMessage, data, true);
        registerForm.reset();
        setTimeout(() => {
          showLoginBtn.click();
          showAuthMessage(loginMessage, "Cuenta creada. Por favor, inicia sesión.", true);
        }, 2000);
      } else {
        showAuthMessage(registerMessage, data, false);
      }
    } catch (error) {
      showAuthMessage(registerMessage, "Error al conectar con el servidor.", false);
    }
  });

  // Petición al Backend: LOGIN
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    showAuthMessage(loginMessage, "Verificando credenciales...", true);

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.text();
      
      if (response.ok) {
        showAuthMessage(loginMessage, "Acceso concedido. Cargando panel...", true);
        // Aquí conectaremos la redirección al panel de control en el futuro
      } else if (response.status === 403) {
        showAuthMessage(loginMessage, data, false); // Aviso de licencia expirada
      } else {
        showAuthMessage(loginMessage, data, false); // Credenciales inválidas
      }
    } catch (error) {
      showAuthMessage(loginMessage, "Error al conectar con el servidor.", false);
    }
  });

});