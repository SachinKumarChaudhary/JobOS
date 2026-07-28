function initNavigation() {
  showScreen(window.location.hash.slice(1) || 'dashboard');
  window.addEventListener('hashchange', () => {
    showScreen(window.location.hash.slice(1) || 'dashboard');
  });
}

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const screen = document.getElementById(id);
  if (screen) screen.classList.add('active');
  document.querySelectorAll('.screen-nav a, .sidebar-drawer a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + id);
  });
}

function closeSidebar() {
  document.getElementById('sidebarOverlay')?.classList.remove('open');
}

document.querySelectorAll('.screen-nav a, .sidebar-drawer a').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const target = this.getAttribute('href').slice(1);
    showScreen(target);
    history.pushState(null, '', '#' + target);
    closeSidebar();
  });
});

window.addEventListener('hashchange', () => {
  showScreen(window.location.hash.slice(1) || 'dashboard');
});
