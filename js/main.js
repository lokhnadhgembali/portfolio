// ========================================
// MAIN JAVASCRIPT
// Animations, typing effect, interactions
// ========================================

document.addEventListener('DOMContentLoaded', () => {

    // ===== SCROLL REVEAL ANIMATIONS =====
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve to allow re-entry animations if needed
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in').forEach(el => {
        observer.observe(el);
    });

    // ===== TYPING ANIMATION =====
    const typingEl = document.getElementById('typingText');
    if (typingEl) {
        const roles = [
            'Computer Science Student',
            'Data Analyst',
            'ML Enthusiast',
            'Web Developer',
            'Problem Solver'
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function typeEffect() {
            const currentRole = roles[roleIndex];

            if (!isDeleting) {
                typingEl.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentRole.length) {
                    isDeleting = true;
                    typeSpeed = 2000; // pause at end
                } else {
                    typeSpeed = 80;
                }
            } else {
                typingEl.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
                if (charIndex === 0) {
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    typeSpeed = 500; // pause before next
                }
            }

            setTimeout(typeEffect, typeSpeed);
        }

        typeEffect();
    }

    // ===== ANIMATED COUNTERS =====
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-count'));
                const suffix = entry.target.getAttribute('data-suffix') || '';
                animateCounter(entry.target, target, suffix);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));

    function animateCounter(element, target, suffix) {
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 30);
    }

    // ===== ANIMATED PROGRESS BARS =====
    const progressBars = document.querySelectorAll('.progress-fill');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.getAttribute('data-width');
                entry.target.style.width = width + '%';
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    progressBars.forEach(bar => progressObserver.observe(bar));

    // ===== PROJECT FILTER =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'slideUp 0.3s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ===== CONTACT FORM =====
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('formName').value.trim();
            const email = document.getElementById('formEmail').value.trim();
            const subject = document.getElementById('formSubject').value.trim();
            const message = document.getElementById('formMessage').value.trim();

            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields.');
                return;
            }

            if (!isValidEmail(email)) {
                alert('Please enter a valid email address.');
                return;
            }

            // Show success (simulated)
            const successMsg = document.getElementById('successMessage');
            if (successMsg) {
                successMsg.classList.add('show');
                contactForm.reset();
                setTimeout(() => {
                    successMsg.classList.remove('show');
                }, 5000);
            }
        });
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== NAVBAR SCROLL EFFECT =====
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            navbar.style.background = 'rgba(0, 0, 0, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(0, 0, 0, 0.85)';
            navbar.style.boxShadow = 'none';
        }

        lastScroll = currentScroll;
    });

    // ===== PARTICLES (lightweight) =====
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 1}px;
        height: ${Math.random() * 4 + 1}px;
        background: ${Math.random() > 0.5 ? 'rgba(249, 115, 22, 0.3)' : 'rgba(251, 146, 60, 0.3)'};
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: particleFloat ${Math.random() * 10 + 5}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
      `;
            particleContainer.appendChild(particle);
        }

        // Add particle animation
        const style = document.createElement('style');
        style.textContent = `
      @keyframes particleFloat {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.5; }
        25% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -100}px) scale(1.5); opacity: 1; }
        50% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * -200}px) scale(0.8); opacity: 0.3; }
        75% { transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * -100}px) scale(1.2); opacity: 0.7; }
      }
    `;
        document.head.appendChild(style);
    }
});
