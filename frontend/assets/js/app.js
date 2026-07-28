import { initNavigation } from './navigation.js';
import { initDashboard } from './dashboard.js';
import { initJobs } from './jobs.js';
import { initProfile } from './profile.js';
import { initSettings } from './settings.js';
import { initNotifications } from './notifications.js';
import { initAuth } from './auth.js';
import { setLoading, applyTheme, getStoredTheme, showToast } from './utils.js';

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

  setLoading(true);
  try {
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

    if (route === 'dashboard') {
      initDashboard();
    }
    if (route === 'search' || route === 'details' || route === 'saved') {
      initJobs();
    }
    if (route === 'profile') {
      initProfile();
    }
    if (route === 'settings') {
      initSettings();
    }
    if (route === 'notifications') {
      initNotifications();
    }
    if (route === 'login' || route === 'register') {
      initAuth();
    }
  } catch (error) {
    console.error('Page render failed', error);
    showToast('Unable to load this page');
  } finally {
    setLoading(false);
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  applyTheme(getStoredTheme());
  await loadPageFragments();
  initNavigation();

  window.addEventListener('app:navigate', function(event) {
    renderPage(event.detail);
  });

  await renderPage(window.location.hash || '#dashboard');
});

window.renderPage = renderPage;
export { renderPage };
