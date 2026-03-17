// Inicializar Iconos Lucide
lucide.createIcons();

// 1. Efecto Typewriter (Hero)
const words = ["Innovadoras", "Escalables", "Inteligentes", "Dinámicas", "Ágiles"];
let wordIdx = 0;
let charIdx = 0;
let isDeleting = false;
const typewriterEl = document.getElementById('typewriter');

function type() {
    const currentWord = words[wordIdx % words.length];
    
    if (isDeleting) {
        typewriterEl.textContent = currentWord.substring(0, charIdx - 1);
        charIdx--;
    } else {
        typewriterEl.textContent = currentWord.substring(0, charIdx + 1);
        charIdx++;
    }

    let typeSpeed = isDeleting ? 50 : 150;

    if (!isDeleting && charIdx === currentWord.length) {
        typeSpeed = 2000; // Pausa al final
        isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        wordIdx++;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// 2. Scroll Animation (Reemplaza a Framer Motion)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 3. Navbar Sticky Effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Iniciar funciones
document.addEventListener('DOMContentLoaded', () => {
    type();
});