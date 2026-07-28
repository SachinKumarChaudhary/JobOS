function closeSidebar() {
  const overlay = document.getElementById('sidebarOverlay');
  overlay?.classList.remove('open');
  document.querySelector('.mobile-menu-btn')?.setAttribute('aria-expanded', 'false');
}

function toggleSidebar() {
  const overlay = document.getElementById('sidebarOverlay');
  const isOpen = overlay?.classList.toggle('open');
  document.querySelector('.mobile-menu-btn')?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
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
  window.dispatchEvent(new CustomEvent('app:navigate', { detail: normalizedHash }));
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

  const menuBtn = document.querySelector('.mobile-menu-btn');
  if (menuBtn) {
    menuBtn.addEventListener('click', function(event) {
      event.preventDefault();
      event.stopPropagation();
      toggleSidebar();
    });

    menuBtn.addEventListener('touchend', function(event) {
      event.preventDefault();
      event.stopPropagation();
      toggleSidebar();
    });
  }

  document.querySelector('.sidebar-overlay')?.addEventListener('click', function(event) {
    if (event.target === this || event.target.classList.contains('backdrop')) {
      closeSidebar();
    }
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      closeSidebar();
    }
  });

  setActiveNav(window.location.hash || '#dashboard');
}

window.closeSidebar = closeSidebar;
window.toggleSidebar = toggleSidebar;

export { closeSidebar, toggleSidebar, setActiveNav, navigateToRoute, initNavigation };
