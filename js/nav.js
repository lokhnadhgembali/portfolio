// ========================================
// NAVIGATION COMPONENT
// Dynamic nav bar, footer, theme toggle, scroll progress
// ========================================

(function () {
  const navPages = [
    { name: 'Home',           href: 'index.html' },
    { name: 'About',          href: 'about.html' },
    { name: 'Skills',         href: 'skills.html' },
    { name: 'Projects',       href: 'projects.html' },
    { name: 'Education',      href: 'education.html' },
    { name: 'Certifications', href: 'certifications.html' },
    { name: 'Resume',         href: 'resume.html' },
    { name: 'Contact',        href: 'contact.html' }
  ];

  const rawPage = window.location.pathname.split('/').pop() || 'index.html';
  const currentPage = rawPage.replace(/\.html$/, '') || 'index';

  // ===== THEME =====
  function getTheme() {
    return localStorage.getItem('portfolio-theme') || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
    updateThemeIcon(theme);
    updateNavbarBg(theme);
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById('themeToggle');
    if (!btn) return;
    const sun = btn.querySelector('.icon-sun');
    const moon = btn.querySelector('.icon-moon');
    if (sun) sun.style.display = theme === 'dark' ? 'block' : 'none';
    if (moon) moon.style.display = theme === 'dark' ? 'none' : 'block';
    btn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }

  function toggleTheme() {
    const current = getTheme();
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  function updateNavbarBg(theme) {
    // Theme-aware styling is handled via CSS variables
    // Scroll effect is handled by .scrolled class toggle
  }

  // ===== CREATE SCROLL PROGRESS BAR =====
  function createScrollProgress() {
    const bar = document.createElement('div');
    bar.id = 'scroll-progress';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  // ===== CREATE NAV =====
  function createNav() {
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.id = 'navbar';

    const linksHTML = navPages.map(page => {
      const pageSlug = page.href.replace(/\.html$/, '') || 'index';
      const isActive = currentPage === pageSlug;
      return `<a href="${page.href}" class="${isActive ? 'active' : ''}">${page.name}</a>`;
    }).join('');

    nav.innerHTML = `
      <div class="container">
        <a href="index.html" class="nav-logo">GL.</a>
        <div class="nav-right">
          <div class="nav-links" id="navLinks">
            ${linksHTML}
          </div>
          <button class="theme-toggle" id="themeToggle" title="Toggle Theme" aria-label="Toggle Theme">
            <!-- Sun icon (shown in dark mode) -->
            <svg class="icon-sun" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/>
              <line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/>
              <line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
            <!-- Moon icon (shown in light mode) -->
            <svg class="icon-moon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
          <div class="nav-toggle" id="navToggle" aria-label="Toggle Menu">
            <span></span><span></span><span></span>
          </div>
        </div>
      </div>
    `;

    document.body.prepend(nav);

    // Theme toggle click
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);

    // Mobile toggle
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        toggle.classList.remove('active');
        links.classList.remove('open');
      }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        if (window.pageYOffset > 80) {
          navbar.classList.add('scrolled');
        } else {
          navbar.classList.remove('scrolled');
        }
      }
    }, { passive: true });
  }

  // ===== CREATE FOOTER =====
  function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
      <div class="container">
        <div class="footer-content">
          <div class="footer-social">
            <a href="https://github.com/lokhnadhgembali" target="_blank" title="GitHub" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/lokhnadh/" target="_blank" title="LinkedIn" rel="noopener noreferrer">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="mailto:lokhnadhgembali@gmail.com" title="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </a>
          </div>
          <div class="footer-links">
            ${navPages.map(p => `<a href="${p.href}">${p.name}</a>`).join('')}
          </div>
          <p class="footer-copyright">© 2026 Gembali Lokhnadh · Crafted with passion &amp; code.</p>
        </div>
      </div>
    `;
    document.body.appendChild(footer);
  }

  // ===== BACKGROUND EFFECTS =====
  function createBgEffects() {
    const grid = document.createElement('div');
    grid.className = 'bg-grid';
    document.body.prepend(grid);

    const glow1 = document.createElement('div');
    glow1.className = 'bg-glow bg-glow-1';
    document.body.prepend(glow1);

    const glow2 = document.createElement('div');
    glow2.className = 'bg-glow bg-glow-2';
    document.body.prepend(glow2);
  }

  // ===== INITIALIZE =====
  // Apply theme immediately (before DOMContentLoaded) to avoid flash
  applyTheme(getTheme());

  document.addEventListener('DOMContentLoaded', () => {
    createBgEffects();
    createScrollProgress();
    createNav();
    createFooter();
    // Re-apply theme icons after nav is created
    applyTheme(getTheme());
  });
})();
