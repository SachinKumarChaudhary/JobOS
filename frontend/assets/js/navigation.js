function closeSidebar() {
  document.getElementById('sidebarOverlay')?.classList.remove('open');
}

function setActiveNav(hash) {
  const route = (hash || '#dashboard').replace('#', '') || 'dashboard';
  document.querySelectorAll('.screen-nav a, .sidebar-overlay a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const isActive = href === `#${route}`;
    link.classList.toggle('active', isActive);
  });
}

function navigateToRoute(hash) {
  const normalizedHash = hash.startsWith('#') ? hash : `#${hash}`;
  window.location.hash = normalizedHash;
  setActiveNav(normalizedHash);
  if (typeof renderPage === 'function') {
    renderPage(normalizedHash);
  }
}

function initNavigation() {
  document.querySelectorAll('.screen-nav a, .sidebar-overlay a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (!href.startsWith('#')) return;

    link.addEventListener('click', function(event) {
      event.preventDefault();
      closeSidebar();
      navigateToRoute(href);
    });
  });

  setActiveNav(window.location.hash || '#dashboard');

  window.addEventListener('hashchange', function() {
    setActiveNav(window.location.hash || '#dashboard');
    if (typeof renderPage === 'function') {
      renderPage(window.location.hash || '#dashboard');
    }
  });
}

function bindHashLinks(container) {
  if (!container) return;
  container.querySelectorAll('a[href^="#"]').forEach(link => {
    if (link.closest('.screen-nav, .sidebar-overlay')) return;
    link.addEventListener('click', function(event) {
      event.preventDefault();
      navigateToRoute(link.getAttribute('href'));
    });
  });
}
