const pageRoutes = {
  dashboard: 'pages/dashboard.html',
  search: 'pages/job-search.html',
  details: 'pages/job-details.html',
  saved: 'pages/saved-jobs.html',
  tracker: 'pages/application-tracker.html',
  resume: 'pages/resume-assistant.html',
  notifications: 'pages/notifications.html',
  profile: 'pages/profile.html',
  settings: 'pages/settings.html',
  login: 'pages/login.html',
  register: 'pages/register.html'
};

async function loadPageFragments() {
  const navbarTarget = document.getElementById('navbar-root');

  const navbarResponse = await fetch('components/navbar.html');

  if (navbarTarget && navbarResponse.ok) {
    navbarTarget.innerHTML = await navbarResponse.text();
  }
}

async function renderPage(hash) {
  const route = (hash || '#dashboard').replace('#', '') || 'dashboard';
  const pagePath = pageRoutes[route] || pageRoutes.dashboard;
  const pageTarget = document.getElementById('page-root');

  if (!pageTarget) return;

  const response = await fetch(pagePath);

  if (!response.ok) {
    pageTarget.innerHTML = '<section class="screen active"><div class="screen-main"><div class="card">Page not found.</div></div></section>';
    return;
  }

  pageTarget.innerHTML = await response.text();

  const screen = pageTarget.querySelector('.screen');
  if (screen) {
    document.querySelectorAll('.screen').forEach(section => section.classList.remove('active'));
    screen.classList.add('active');
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  await loadPageFragments();

  if (typeof initNavigation === 'function') {
    initNavigation();
  }

  await renderPage(window.location.hash || '#dashboard');
});
