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

    // ===== HORIZONTAL SCROLL PROJECTS GALLERY =====
    const scrollContainer = document.getElementById('projectsScrollContainer');
    const gallery = document.getElementById('projectsGallery');
    const progressFill = document.getElementById('projectsScrollProgress');

    if (scrollContainer && gallery) {
        function updateHorizontalScroll() {
            const rect = scrollContainer.getBoundingClientRect();
            const containerHeight = scrollContainer.offsetHeight;
            const viewportHeight = window.innerHeight;
            const totalScrollable = containerHeight - viewportHeight;

            if (totalScrollable <= 0) return;

            const currentScroll = -rect.top;
            let progress = currentScroll / totalScrollable;
            progress = Math.max(0, Math.min(1, progress));

            const galleryWidth = gallery.scrollWidth;
            const viewportWidth = window.innerWidth;
            const paddingLeft = Math.max(24, (viewportWidth - 1200) / 2 + 24);
            const totalDistance = Math.max(0, galleryWidth - viewportWidth + paddingLeft + 60);

            gallery.style.transform = `translateX(-${progress * totalDistance}px)`;

            if (progressFill) {
                progressFill.style.width = `${progress * 100}%`;
            }
        }

        window.addEventListener('scroll', updateHorizontalScroll, { passive: true });
        window.addEventListener('resize', updateHorizontalScroll, { passive: true });
        updateHorizontalScroll();
    }

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

    // ===== INTERACTIVE EMBER CONSTELLATION CANVAS =====
    const particleContainer = document.getElementById('particles');
    if (particleContainer) {
        particleContainer.innerHTML = '';
        const canvas = document.createElement('canvas');
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
        particleContainer.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = (canvas.width = particleContainer.offsetWidth);
        let height = (canvas.height = particleContainer.offsetHeight);

        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 35 : 65;
        const particles = [];

        let mouse = { x: -1000, y: -1000, radius: 140 };

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        }, { passive: true });

        window.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
        });

        window.addEventListener('resize', () => {
            if (!particleContainer) return;
            width = canvas.width = particleContainer.offsetWidth;
            height = canvas.height = particleContainer.offsetHeight;
        }, { passive: true });

        class EmberParticle {
            constructor() {
                this.reset(true);
            }

            reset(initial = false) {
                this.x = Math.random() * width;
                this.y = initial ? Math.random() * height : height + Math.random() * 20;
                this.size = Math.random() * 2.6 + 0.8;
                this.speedY = -(Math.random() * 0.7 + 0.3);
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.alpha = Math.random() * 0.6 + 0.2;
                this.targetAlpha = this.alpha;
                this.glow = Math.random() * 8 + 4;
                // Hue spectrum: Electric Violet to Neon Pink and Lavender
                const colors = [
                    'rgba(139, 92, 246, ',
                    'rgba(236, 72, 153, ',
                    'rgba(167, 139, 250, ',
                    'rgba(244, 114, 182, '
                ];
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;

                // Mouse interaction repulsion
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 3;
                    this.y -= (dy / dist) * force * 3;
                }

                if (this.y < -20 || this.x < -20 || this.x > width + 20) {
                    this.reset(false);
                }
            }

            draw() {
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `${this.color}${this.alpha})`;
                ctx.shadowColor = 'rgba(139, 92, 246, 0.7)';
                ctx.shadowBlur = this.glow;
                ctx.fill();
                ctx.restore();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new EmberParticle());
        }

        let animationFrameId;
        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            // Connect nearby particles with subtle glowing lines
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxDist = 95;

                    if (dist < maxDist) {
                        const alpha = (1 - dist / maxDist) * 0.18;
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach((p) => {
                p.update();
                p.draw();
            });

            animationFrameId = requestAnimationFrame(animateCanvas);
        }

        animateCanvas();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMain);
} else {
    initMain();
}
