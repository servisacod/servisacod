// JavaScript for interactivity

// Navigation scroll effect
let isScrolled = false;

function handleScroll() {
    const nav = document.getElementById('navigation');
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

// Smooth scrolling to sections
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

// Mobile menu toggle
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        // Change hamburger to X
        menuIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        `;
    } else {
        mobileMenu.classList.add('hidden');
        // Change X back to hamburger
        menuIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
        `;
    }
}

let captchaCorrectAnswer = 0;

function generateCaptcha() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    captchaCorrectAnswer = num1 + num2;
    document.getElementById('captcha-label').textContent = `¿Cuánto es ${num1} + ${num2}?`;
}

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your Public Key
    emailjs.init('mZp5cF-gAMXm8ABbP'); // <--- Reemplaza con tu Public Key de EmailJS

    const form = document.getElementById('appointment-form');
    const submitBtn = document.getElementById('submit-btn');

    generateCaptcha(); // Generate initial captcha

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // --- Captcha Validation ---
            const userAnswer = parseInt(document.getElementById('captcha').value, 10);
            if (userAnswer !== captchaCorrectAnswer) {
                Swal.fire({
                    icon: 'error',
                    title: 'Captcha incorrecto',
                    text: 'Por favor, resuelve la suma correctamente para continuar.',
                });
                generateCaptcha(); // Generate a new question
                document.getElementById('captcha').value = '';
                return;
            }

            // --- Form Field Validation ---
            const name = document.getElementById('name').value;
            const company = document.getElementById('company').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const reason = document.getElementById('reason').value;

            if (!validateForm({ name, company, email, phone, reason })) {
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            try {
                // Send email using EmailJS
                await emailjs.sendForm("service_wq7irpk","template_k661ka6", this);

                // Show success message with SweetAlert2
                Swal.fire({
                    icon: 'success',
                    title: '¡Solicitud Enviada!',
                    text: 'Gracias por contactarnos. Nos pondremos en contacto contigo pronto.',
                });

                // Reset form
                form.reset();

            } catch (error) {
                console.error('Failed to send email:', error);
                // Show error message with SweetAlert2
                Swal.fire({
                    icon: 'error',
                    title: 'Error al Enviar',
                    text: 'Hubo un problema al enviar tu solicitud. Por favor, intenta de nuevo más tarde.',
                });
            } finally {
                // Reset button and generate new captcha
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Solicitud';
                generateCaptcha();
            }
        });
    }
});

// Form validation
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

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        Swal.fire({
            icon: 'error',
            title: 'Email Inválido',
            text: 'Por favor, ingresa una dirección de correo electrónico válida.',
        });
        return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(data.phone.replace(/\s+/g, ''))) {
        Swal.fire({
            icon: 'error',
            title: 'Teléfono Inválido',
            text: 'Por favor, ingresa un número de teléfono válido (solo números, sin espacios ni guiones).',
        });
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


// WhatsApp functionality
function openWhatsApp() {
    const phone = '525512345678';
    const message = encodeURIComponent('Hola, me gustaría agendar una cita médica');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    // Handle scroll for navigation
    window.addEventListener('scroll', handleScroll);

    // Handle mobile menu clicks
    const mobileMenuLinks = document.querySelectorAll('#mobile-menu a, #mobile-menu button');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', toggleMobileMenu);
    });

    // Handle WhatsApp buttons
    const whatsappButtons = document.querySelectorAll('[onclick*="handleWhatsApp"], [onclick*="openWhatsApp"]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', openWhatsApp);
    });

    // Add fade-in animation to elements
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    // Observe elements that should animate in
    const animateElements = document.querySelectorAll('.animate-fade-in');
    animateElements.forEach(element => {
        observer.observe(element);
    });
});

// Handle window resize for mobile menu
window.addEventListener('resize', function() {
    if (window.innerWidth >= 768) {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const menuIcon = document.getElementById('menu-icon');
            if (menuIcon) {
                menuIcon.innerHTML = `
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                `;
            }
        }
    }
});

// Handle smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    const target = e.target.closest('a[href^="#"]');
    if (target) {
        e.preventDefault();
        const targetId = target.getAttribute('href').substring(1);
        scrollToSection(targetId);
    }
});

// Add loading animation to images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });
});

// Handle form input focus effects
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});
