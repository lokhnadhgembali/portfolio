// ========================================
// NAVIGATION COMPONENT
// Dynamic nav bar injection for all pages
// ========================================

(function () {
  const navPages = [
    { name: 'Home', href: 'index.html', icon: '🏠' },
    { name: 'About', href: 'about.html', icon: '👤' },
    { name: 'Skills', href: 'skills.html', icon: '⚡' },
    { name: 'Projects', href: 'projects.html', icon: '💼' },
    { name: 'Education', href: 'education.html', icon: '🎓' },
    { name: 'Certifications', href: 'certifications.html', icon: '📜' },
    { name: 'Resume', href: 'resume.html', icon: '📄' },
    { name: 'Contact', href: 'contact.html', icon: '✉️' }
  ];

  // Normalise current path — strip .html so it works whether the
  // server serves /about.html or /about (clean-URL mode like npx serve)
  const rawPage = window.location.pathname.split('/').pop() || 'index.html';
  const currentPage = rawPage.replace(/\.html$/, '') || 'index';

  function createNav() {
    const nav = document.createElement('nav');
    nav.className = 'navbar';
    nav.id = 'navbar';

    const linksHTML = navPages.map(page => {
      // Normalise page.href the same way so both sides are extension-free
      const pageSlug = page.href.replace(/\.html$/, '') || 'index';
      const isActive = currentPage === pageSlug;
      return `<a href="${page.href}" class="${isActive ? 'active' : ''}">${page.name}</a>`;
    }).join('');

    nav.innerHTML = `
      <div class="container">
        <a href="index.html" class="nav-logo">GL</a>
        <div class="nav-links" id="navLinks">
          ${linksHTML}
        </div>
        <div class="nav-toggle" id="navToggle">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    `;

    document.body.prepend(nav);

    // Mobile toggle
    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
    });

    // Close mobile menu on link click
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        links.classList.remove('open');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        toggle.classList.remove('active');
        links.classList.remove('open');
      }
    });
  }

  function createFooter() {
    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = `
      <div class="container">
        <div class="footer-content">
          <div class="footer-social">
            <a href="https://github.com/lokhnadhgembali" target="_blank" title="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
            </a>
            <a href="https://www.linkedin.com/in/lokhnadh/" target="_blank" title="LinkedIn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a href="mailto:lokhnadhgembali@gmail.com" title="Email">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </a>
          </div>
          <div class="footer-links">
            ${navPages.map(p => `<a href="${p.href}">${p.name}</a>`).join('')}
          </div>
          <p class="footer-copyright">© 2026 Gembali Lokhnadh. Crafted with passion & code.</p>
        </div>
      </div>
    `;
    document.body.appendChild(footer);
  }

  // Background effects
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

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    createBgEffects();
    createNav();
    createFooter();
  });
})();
