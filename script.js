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

// Form handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('appointment-form');
    const submitBtn = document.getElementById('submit-btn');

    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);

            // Validate form
            if (!validateForm(data)) {
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Show success message
                showToast('¡Cita agendada exitosamente!', 'Nos pondremos en contacto contigo pronto para confirmar tu cita.', 'success');

                // Reset form
                form.reset();

            } catch (error) {
                showToast('Error', 'Hubo un problema al enviar tu solicitud. Por favor, intenta de nuevo.', 'error');
            } finally {
                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = 'Agendar Cita';
            }
        });
    }
});

// Form validation
function validateForm(data) {
    const requiredFields = ['name', 'email', 'phone', 'date', 'time', 'reason'];

    for (const field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showToast('Error', `Por favor completa el campo ${getFieldName(field)}.`, 'error');
            return false;
        }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showToast('Error', 'Por favor ingresa un email válido.', 'error');
        return false;
    }

    // Phone validation (basic)
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(data.phone.replace(/\s+/g, ''))) {
        showToast('Error', 'Por favor ingresa un teléfono válido (solo números).', 'error');
        return false;
    }

    return true;
}

function getFieldName(field) {
    const fieldNames = {
        name: 'Nombre completo',
        email: 'Correo electrónico',
        phone: 'Teléfono',
        date: 'Fecha preferida',
        time: 'Hora preferida',
        reason: 'Motivo de la consulta'
    };
    return fieldNames[field] || field;
}

// Toast notification system
function showToast(title, description, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.toast');
    existingToasts.forEach(toast => toast.remove());

    // Create new toast
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="title">${title}</div>
        <div class="description">${description}</div>
    `;

    document.body.appendChild(toast);

    // Show toast
    setTimeout(() => toast.classList.add('show'), 100);

    // Hide toast after 5 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
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