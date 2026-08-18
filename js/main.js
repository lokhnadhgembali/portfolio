// ========================================
// MAIN JAVASCRIPT
// Animations, typing effect, interactions
// ========================================

function initMain() {

    // ===== SCROLL REVEAL ANIMATIONS =====
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .scale-in, .exp-item').forEach(el => {
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
            'Problem Solver',
            'Open Source Contributor'
        ];
        let roleIndex = 0, charIndex = 0, isDeleting = false, typeSpeed = 80;

        function typeEffect() {
            const currentRole = roles[roleIndex];
            if (!isDeleting) {
                typingEl.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                if (charIndex === currentRole.length) { isDeleting = true; typeSpeed = 2000; }
                else { typeSpeed = 80; }
            } else {
                typingEl.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
                if (charIndex === 0) {
                    isDeleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                    typeSpeed = 500;
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
            if (current >= target) { current = target; clearInterval(timer); }
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
                const show = filter === 'all' || card.getAttribute('data-category') === filter;
                card.style.display = show ? 'block' : 'none';
                if (show) card.style.animation = 'slideUp 0.3s ease forwards';
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

            if (!name || !email || !subject || !message) { alert('Please fill in all fields.'); return; }
            if (!isValidEmail(email)) { alert('Please enter a valid email address.'); return; }

            const submitBtn = document.getElementById('submitBtn');
            const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
            const successMsg = document.getElementById('successMessage');
            const errorMsg = document.getElementById('errorMessage');

            // Hide previous status messages
            if (successMsg) successMsg.classList.remove('show');
            if (errorMsg) errorMsg.style.display = 'none';

            // Show loading state
            if (submitBtn) submitBtn.disabled = true;
            if (btnText) btnText.textContent = 'Sending...';

            const formData = new FormData(contactForm);
            
            // Check if key is placeholder
            if (formData.get('access_key') === 'YOUR_ACCESS_KEY_HERE') {
                alert('Setup Reminder: Please replace the placeholder "YOUR_ACCESS_KEY_HERE" inside contact.html with your free Access Key from web3forms.com to receive form submissions directly in your email!');
                if (submitBtn) submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Send Message';
                return;
            }

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    if (successMsg) successMsg.classList.add('show');
                    contactForm.reset();
                } else {
                    console.error(json);
                    if (errorMsg) {
                        errorMsg.textContent = `❌ ${json.message || 'Something went wrong.'}`;
                        errorMsg.style.display = 'block';
                    }
                }
            })
            .catch(error => {
                console.error(error);
                if (errorMsg) {
                    errorMsg.textContent = '❌ Network error. Please try again later.';
                    errorMsg.style.display = 'block';
                }
            })
            .then(() => {
                if (submitBtn) submitBtn.disabled = false;
                if (btnText) btnText.textContent = 'Send Message';
                setTimeout(() => {
                    if (successMsg) successMsg.classList.remove('show');
                }, 6000);
            });
        });
    }

    function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    // ===== PARTICLES (hero section) =====
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
        for (let i = 0; i < 35; i++) {
            const particle = document.createElement('div');
            const isOrange = Math.random() > 0.4;
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: ${isOrange ? 'rgba(249,115,22,0.35)' : 'rgba(251,146,60,0.25)'};
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: particleFloat ${Math.random() * 12 + 6}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particleContainer.appendChild(particle);
        }

        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0%, 100% { transform: translate(0,0) scale(1); opacity: 0.4; }
                33% { transform: translate(${Math.random()*80-40}px, ${Math.random()*-100}px) scale(1.4); opacity: 0.9; }
                66% { transform: translate(${Math.random()*60-30}px, ${Math.random()*-160}px) scale(0.7); opacity: 0.2; }
            }
        `;
        document.head.appendChild(style);
    }

    // ===== ROLLING TEXT LABELS =====
    const labels = document.querySelectorAll('.section-label');
    labels.forEach(label => {
        if (!label.querySelector('.label-window')) {
            const text = label.textContent.trim();
            label.innerHTML = `
                <span class="label-window">
                    <span class="label-copy">${text}</span>
                    <span class="label-copy label-copy--incoming" aria-hidden="true">${text}</span>
                </span>
                <span class="label-icon" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="m9 18 6-6-6-6"/>
                    </svg>
                </span>
            `;
        }

        // Interactive animation queue matching React Motion logic
        let active = false;
        let animating = false;
        let pending = null;

        function requestActive(next) {
            if (next === active) {
                pending = null;
                return;
            }
            if (animating) {
                pending = next;
                return;
            }
            animating = true;
            active = next;
            if (active) label.classList.add('active');
            else label.classList.remove('active');

            setTimeout(() => {
                animating = false;
                if (pending !== null && pending !== active) {
                    const nextReq = pending;
                    pending = null;
                    requestActive(nextReq);
                } else {
                    pending = null;
                }
            }, 350);
        }

        label.addEventListener('mouseenter', () => requestActive(true));
        label.addEventListener('mouseleave', () => requestActive(false));
        label.addEventListener('focus', () => requestActive(true));
        label.addEventListener('blur', () => requestActive(false));
        label.addEventListener('click', () => {
            label.classList.add('is-rolling');
            setTimeout(() => label.classList.remove('is-rolling'), 600);
        });
    });

    // Auto-roll when scrolled into view
    const labelObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                setTimeout(() => {
                    el.classList.add('is-rolling');
                    setTimeout(() => el.classList.remove('is-rolling'), 700);
                }, 200);
                labelObserver.unobserve(el);
            }
        });
    }, { threshold: 0.6 });

    labels.forEach(l => labelObserver.observe(l));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMain);
} else {
    initMain();
}
