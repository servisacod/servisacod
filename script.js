// JavaScript for interactivity

// Global state
let isScrolled = false;
let captchaCorrectAnswer = 0;

// --- CAPTCHA LOGIC ---
function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaCorrectAnswer = num1 + num2;
    const captchaLabel = document.getElementById('captcha-label');
    if(captchaLabel) {
        captchaLabel.textContent = `Para verificar que no eres un robot, ¿cuánto es ${num1} + ${num2}?`;
    }
}

// --- UI HELPERS ---
function handleScroll() {
    const nav = document.getElementById('navigation');
    if (!nav) return;
    const scrolled = window.scrollY > 20;

    if (scrolled !== isScrolled) {
        isScrolled = scrolled;
        if (scrolled) {
            nav.classList.add('bg-background/95', 'backdrop-blur-md', 'shadow-soft');
            nav.classList.remove('bg-transparent');
        } else {
            nav.classList.remove('bg-background/95', 'backdrop-blur-md', 'shadow-soft');
            nav.classList.add('bg-transparent');
        }
    }
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const navHeight = 80; // Height of fixed navigation
        const offsetTop = element.offsetTop - navHeight;

        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    if (!mobileMenu || !menuIcon) return;

    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>`;
    } else {
        mobileMenu.classList.add('hidden');
        menuIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>`;
    }
}

// --- FORM VALIDATION ---
function validateForm(data) {
    const requiredFields = ['name', 'company', 'email', 'phone', 'reason'];

    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            Swal.fire({
                icon: 'warning',
                title: 'Campo Incompleto',
                text: `Por favor, completa el campo: ${getFieldName(field)}`,
            });
            return false;
        }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        Swal.fire({ icon: 'error', title: 'Email Inválido', text: 'Por favor, ingresa una dirección de correo electrónico válida.' });
        return false;
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(data.phone.replace(/\s+/g, ''))) {
        Swal.fire({ icon: 'error', title: 'Teléfono Inválido', text: 'Por favor, ingresa un número de teléfono válido (solo números, sin espacios ni guiones).' });
        return false;
    }

    return true;
}

function getFieldName(field) {
    const fieldNames = {
        name: 'Nombre completo',
        company: 'Empresa',
        email: 'Correo electrónico',
        phone: 'Teléfono',
        reason: 'Mensaje'
    };
    return fieldNames[field] || field;
}

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
    // --- Initialize EmailJS ---
    // RECUERDA: Reemplaza con tus claves reales de EmailJS
    emailjs.init('mZp5cF-gAMXm8ABbP');

    // --- Initialize Form and Captcha ---
    const form = document.getElementById('appointment-form');
    const submitBtn = document.getElementById('submit-btn');
    generateCaptcha();

    if (form && submitBtn) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault(); // Previene el comportamiento por defecto del formulario

            // 1. Captcha Validation
            const userAnswer = parseInt(document.getElementById('captcha').value, 10);
            if (userAnswer !== captchaCorrectAnswer) {
                Swal.fire({ icon: 'error', title: 'Captcha incorrecto', text: 'Por favor, resuelve la suma correctamente para continuar.' });
                generateCaptcha();
                document.getElementById('captcha').value = '';
                return;
            }

            // 2. Form Field Validation
            const formData = { 
                name: document.getElementById('name').value,
                company: document.getElementById('company').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                reason: document.getElementById('reason').value
            };

            if (!validateForm(formData)) {
                return;
            }

            // 3. Send Email
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            try {
                // RECUERDA: Reemplaza con tus claves reales de EmailJS
                await emailjs.sendForm('service_wq7irpk', 'template_k661ka6', this);

                Swal.fire({ icon: 'success', title: '¡Solicitud Enviada!', text: 'Gracias por contactarnos. Nos pondremos en contacto contigo pronto.' });
                form.reset();

            } catch (error) {
                console.error('Error de EmailJS:', error);
                Swal.fire({ icon: 'error', title: 'Error al Enviar', text: 'Hubo un problema al enviar tu solicitud. Revisa la consola para más detalles.' });
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Solicitud';
                generateCaptcha();
            }
        });
    }

    // --- Initialize other UI features ---
    window.addEventListener('scroll', handleScroll);

    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a, #mobile-menu button');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Cierra el menú al hacer clic en un enlace
            const mobileMenu = document.getElementById('mobile-menu');
            if(mobileMenu && !mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        });
    });

    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.animate-fade-in');
    animateElements.forEach(element => observer.observe(element));

    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            const mobileMenu = document.getElementById('mobile-menu');
            if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                toggleMobileMenu();
            }
        }
    });
});