const STORAGE_KEYS = {
  savedJobs: 'gotjobalert.savedJobs',
  theme: 'gotjobalert.theme',
  profile: 'gotjobalert.profile',
  settings: 'gotjobalert.settings',
  notifications: 'gotjobalert.notifications'
};

const mockData = {
  dashboard: {
    stats: [
      { label: 'Total Applications', value: '248', meta: '↑ 12% vs last month' },
      { label: 'Active Jobs', value: '36', meta: '↑ 4 this week' },
      { label: 'Interviews', value: '14', meta: '↑ 2 scheduled' },
      { label: 'Offers', value: '7', meta: '↑ 3 this month' }
    ],
    recentApplications: [
      { position: 'Sr. Frontend Eng.', company: 'Google', date: '2 days ago', status: 'Interview', badge: 'badge-blue' },
      { position: 'Full Stack Dev.', company: 'Stripe', date: '3 days ago', status: 'Offer', badge: 'badge-green' },
      { position: 'React Native Dev.', company: 'Microsoft', date: '5 days ago', status: 'Applied', badge: '' },
      { position: 'Product Designer', company: 'Notion', date: '1 week ago', status: 'Rejected', badge: 'badge-red' }
    ],
    recommendedJobs: [
      { title: 'Senior Frontend Engineer', company: 'Google', location: 'Remote', salary: '$150k–$200k', initials: 'G' },
      { title: 'Full Stack Engineer', company: 'Stripe', location: 'San Francisco', salary: '$160k–$220k', initials: 'S' },
      { title: 'Product Designer', company: 'Notion', location: 'Remote', salary: '$130k–$170k', initials: 'N' }
    ],
    interviews: [
      { title: 'Google — Frontend', time: 'Tomorrow, 11:00 AM', tag: 'Virtual', tagClass: 'badge-blue', duration: '45m' },
      { title: 'Stripe — Full Stack', time: 'Wed, 2:00 PM', tag: 'On-site', tagClass: '', duration: '60m' },
      { title: 'Notion — Design', time: 'Fri, 10:30 AM', tag: 'Virtual', tagClass: 'badge-blue', duration: '30m' }
    ],
    activity: [
      { title: 'Applied to Google', meta: '2 hours ago' },
      { title: 'Resume reviewed by Stripe', meta: 'Yesterday' },
      { title: 'Interview scheduled with Notion', meta: '2 days ago' },
      { title: 'Offer from Microsoft', meta: '4 days ago' }
    ]
  },
  jobs: {
    searchResults: [
      { id: 1, title: 'Senior Frontend Engineer', company: 'Google', location: 'Remote', salary: '$150k–$200k', description: 'Build and scale Google Workspace frontend applications using React and TypeScript.', tags: ['React', 'TypeScript', 'GraphQL'] },
      { id: 2, title: 'Full Stack Engineer', company: 'Stripe', location: 'San Francisco', salary: '$160k–$220k', description: 'Build payment infrastructure APIs and dashboards for millions of businesses.', tags: ['Python', 'React', 'PostgreSQL'] },
      { id: 3, title: 'Product Designer', company: 'Notion', location: 'Remote', salary: '$130k–$170k', description: 'Design intuitive collaboration tools for millions of users worldwide.', tags: ['Figma', 'Design', 'Research'] },
      { id: 4, title: 'React Native Developer', company: 'Microsoft', location: 'Redmond', salary: '$130k–$170k', description: 'Develop cross-platform mobile experiences for Microsoft 365 suite.', tags: ['React Native', 'TypeScript'] }
    ]
  },
  profile: {
    name: 'Sahil Kumar',
    role: 'Senior Frontend Engineer',
    location: 'San Francisco, CA',
    email: 'sahil@email.com',
    phone: '+1 (555) 123-4567',
    initials: 'SK',
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'Next.js', 'Tailwind CSS', 'PostgreSQL', 'Docker', 'AWS', 'Figma']
  },
  settings: {
    fullName: 'Sahil Kumar',
    email: 'sahil@email.com',
    jobTitle: 'Senior Frontend Engineer',
    location: 'San Francisco, CA',
    bio: 'Passionate frontend engineer with 5+ years of experience in building elegant and responsive products.'
  },
  notifications: [
    { id: 1, title: 'Application received by Google', message: 'Your application for Senior Frontend Engineer has been received.', time: '2 hours ago', unread: true, category: 'Applications' },
    { id: 2, title: 'Interview scheduled with Stripe', message: 'Your technical interview has been scheduled for Wednesday.', time: '5 hours ago', unread: true, category: 'Interviews' },
    { id: 3, title: 'New job matches available', message: 'We found 5 new job matches based on your profile.', time: '1 day ago', unread: false, category: 'General' },
    { id: 4, title: 'Offer letter from Stripe', message: 'Congratulations! Stripe has sent you an offer letter.', time: '2 days ago', unread: false, category: 'Applications' }
  ]
};

function formatDate(date) {
  return date;
}

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch (error) {
    console.warn('Storage read failed', error);
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStoredJobs() {
  return readStorage(STORAGE_KEYS.savedJobs, []);
}

function saveStoredJobs(jobs) {
  writeStorage(STORAGE_KEYS.savedJobs, jobs);
}

function getStoredTheme() {
  return readStorage(STORAGE_KEYS.theme, 'light');
}

function setStoredTheme(theme) {
  writeStorage(STORAGE_KEYS.theme, theme);
}

function getStoredProfile() {
  return readStorage(STORAGE_KEYS.profile, mockData.profile);
}

function setStoredProfile(profile) {
  writeStorage(STORAGE_KEYS.profile, profile);
}

function getStoredSettings() {
  return readStorage(STORAGE_KEYS.settings, mockData.settings);
}

function setStoredSettings(settings) {
  writeStorage(STORAGE_KEYS.settings, settings);
}

function getStoredNotifications() {
  return readStorage(STORAGE_KEYS.notifications, mockData.notifications);
}

function setStoredNotifications(notifications) {
  writeStorage(STORAGE_KEYS.notifications, notifications);
}

function applyTheme(theme) {
  const root = document.documentElement;
  const isDark = theme === 'dark';

  if (isDark) {
    root.style.setProperty('--gray-50', '#111827');
    root.style.setProperty('--gray-100', '#1f2937');
    root.style.setProperty('--gray-200', '#374151');
    root.style.setProperty('--gray-300', '#64748b');
    root.style.setProperty('--gray-400', '#94a3b8');
    root.style.setProperty('--gray-500', '#cbd5e1');
    root.style.setProperty('--gray-600', '#f1f5f9');
    root.style.setProperty('--gray-700', '#f8fafc');
    root.style.setProperty('--gray-800', '#ffffff');
    root.style.setProperty('--gray-900', '#f8fafc');
    root.style.setProperty('--surface', '#0f172a');
    root.style.setProperty('--surface-elevated', '#111827');
    root.style.setProperty('--border', '#334155');
    document.body.dataset.theme = 'dark';
  } else {
    root.style.setProperty('--gray-50', '#eef2f6');
    root.style.setProperty('--gray-100', '#e3e8ef');
    root.style.setProperty('--gray-200', '#d2dae5');
    root.style.setProperty('--gray-300', '#b0bdcd');
    root.style.setProperty('--gray-400', '#7f8da2');
    root.style.setProperty('--gray-500', '#5d697d');
    root.style.setProperty('--gray-600', '#49556a');
    root.style.setProperty('--gray-700', '#303947');
    root.style.setProperty('--gray-800', '#202836');
    root.style.setProperty('--gray-900', '#0f172a');
    root.style.setProperty('--surface', '#f0f3f8');
    root.style.setProperty('--surface-elevated', '#f7f9fc');
    root.style.setProperty('--border', '#dde4ec');
    document.body.dataset.theme = 'light';
  }
}

function showToast(message) {
  const existing = document.getElementById('toast');
  if (existing) {
    existing.remove();
  }

  const toast = document.createElement('div');
  toast.id = 'toast';
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.right = '20px';
  toast.style.background = 'rgba(15, 23, 42, 0.92)';
  toast.style.color = '#fff';
  toast.style.padding = '10px 14px';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '9999';
  toast.style.fontSize = '13px';
  document.body.appendChild(toast);

  setTimeout(() => toast.remove(), 1800);
}

function setLoading(isLoading) {
  let overlay = document.getElementById('app-loader');

  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'app-loader';
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(255,255,255,0.75)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9998';
    overlay.innerHTML = '<div style="width:44px;height:44px;border-radius:999px;border:3px solid rgba(15,23,42,0.12);border-top-color:#0f172a;animation:spin 0.8s linear infinite"></div>';
    document.body.appendChild(overlay);
  }

  overlay.style.display = isLoading ? 'flex' : 'none';
}

function createModal({ title, body, confirmText = 'Save', cancelText = 'Cancel', onConfirm }) {
  const existing = document.getElementById('app-modal');
  if (existing) {
    existing.remove();
  }

  const overlay = document.createElement('div');
  overlay.id = 'app-modal';
  overlay.style.position = 'fixed';
  overlay.style.inset = '0';
  overlay.style.background = 'rgba(15, 23, 42, 0.45)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '10000';

  overlay.innerHTML = `
    <div style="background:#fff;border-radius:12px;width:min(92vw, 480px);padding:18px;box-shadow:0 10px 30px rgba(15,23,42,0.15)">
      <div style="font-size:14px;font-weight:700;color:var(--gray-900);margin-bottom:10px">${title}</div>
      <div>${body}</div>
      <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:16px">
        <button type="button" class="btn btn-sm btn-ghost" data-action="cancel">${cancelText}</button>
        <button type="button" class="btn btn-sm btn-primary" data-action="confirm">${confirmText}</button>
      </div>
    </div>
  `;

  overlay.querySelector('[data-action="cancel"]').addEventListener('click', () => overlay.remove());
  overlay.querySelector('[data-action="confirm"]').addEventListener('click', () => {
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
    overlay.remove();
  });

  document.body.appendChild(overlay);
  return overlay;
}

function closeModal() {
  document.getElementById('app-modal')?.remove();
}

export {
  STORAGE_KEYS,
  mockData,
  formatDate,
  readStorage,
  writeStorage,
  getStoredJobs,
  saveStoredJobs,
  getStoredTheme,
  setStoredTheme,
  getStoredProfile,
  setStoredProfile,
  getStoredSettings,
  setStoredSettings,
  getStoredNotifications,
  setStoredNotifications,
  applyTheme,
  showToast,
  setLoading,
  createModal,
  closeModal
};
