// ===== Navigation Scroll Effect =====
// Use passive listener for better scroll performance
const navbar = document.querySelector('.navbar');
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

// ===== Mobile Menu Toggle =====
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
    mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// ===== FAQ Accordion =====
const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
        // Close other items
        faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    });
});

// ===== Smooth Scroll for Navigation Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Close mobile menu if open
            navLinks.classList.remove('active');
            mobileMenuBtn.classList.remove('active');
            mobileMenuBtn.setAttribute('aria-expanded', 'false');

            // Scroll to target
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Form Handling =====
const bookingForm = document.getElementById('booking-form');

bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(bookingForm);
    const data = Object.fromEntries(formData.entries());

    // Simple validation
    if (!data.checkin || !data.checkout) {
        alert('Please select check-in and check-out dates.');
        return;
    }

    const checkinDate = new Date(data.checkin);
    const checkoutDate = new Date(data.checkout);

    if (checkoutDate <= checkinDate) {
        alert('Check-out date must be after check-in date.');
        return;
    }

    // Success message (in real app, this would send to server)
    alert(`Thank you for your interest!\n\nBooking Details:\nCheck-in: ${data.checkin}\nCheck-out: ${data.checkout}\nGuests: ${data.guests}\nRoom: ${data['room-type']}\n\nWe will contact you shortly to confirm your reservation.`);

    // Reset form
    bookingForm.reset();
});

// ===== Set Minimum Date for Check-in =====
const checkinInput = document.getElementById('checkin');
const checkoutInput = document.getElementById('checkout');

// Set minimum date to today
const today = new Date().toISOString().split('T')[0];
checkinInput.setAttribute('min', today);

// Update checkout min date when checkin changes
checkinInput.addEventListener('change', () => {
    const checkinDate = new Date(checkinInput.value);
    checkinDate.setDate(checkinDate.getDate() + 1);
    const minCheckout = checkinDate.toISOString().split('T')[0];
    checkoutInput.setAttribute('min', minCheckout);

    // Clear checkout if it's before new min
    if (checkoutInput.value && checkoutInput.value < minCheckout) {
        checkoutInput.value = '';
    }
});

// ===== Intersection Observer for Animations =====
// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.service-card, .room-card, .pricing-card, .about-image, .about-content').forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
    });
}

// Add animation styles dynamically
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-ready {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    /* Mobile menu styles */
    @media (max-width: 768px) {
        .nav-links {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background-color: var(--color-white);
            flex-direction: column;
            padding: 20px;
            gap: 16px;
            box-shadow: var(--shadow-md);
            display: none;
        }
        
        .nav-links.active {
            display: flex;
        }
        
        .nav-links a {
            color: var(--color-text) !important;
            padding: 10px 0;
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(5px, -5px);
        }
    }
`;
document.head.appendChild(animationStyles);

// ===== Lazy Load Hero Background =====
// Defer hero background loading for faster initial render
const hero = document.querySelector('.hero');
if (hero) {
    const heroImg = new Image();
    heroImg.onload = () => {
        hero.style.backgroundImage = `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&h=1080&fit=crop&auto=format&q=80')`;
    };
    heroImg.src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&h=1080&fit=crop&auto=format&q=80';
}

// ===== Lazy Load CTA Background =====
const cta = document.querySelector('.cta');
if (cta) {
    const ctaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const ctaImg = new Image();
                ctaImg.onload = () => {
                    cta.style.backgroundImage = `url('https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&h=800&fit=crop&auto=format&q=80')`;
                };
                ctaImg.src = 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&h=800&fit=crop&auto=format&q=80';
                ctaObserver.unobserve(cta);
            }
        });
    }, { rootMargin: '200px' });
    ctaObserver.observe(cta);
}
