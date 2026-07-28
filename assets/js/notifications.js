import { mockData, showToast, getStoredNotifications, setStoredNotifications } from './utils.js';

function initNotifications() {
  const section = document.getElementById('notifications');
  if (!section) return;

  let notifications = [...getStoredNotifications()];
  if (!notifications.length) {
    notifications = mockData.notifications;
  }

  function renderNotifications(filter = 'all') {
    const list = section.querySelector('div[style*="padding:0 16px"]');
    if (!list) return;

    const visible = notifications.filter(item => {
      const text = `${item.title} ${item.message}`.toLowerCase();
      if (filter === 'unread') return item.unread;
      if (filter === 'applications') return text.includes('application') || item.category === 'Applications';
      if (filter === 'interviews') return text.includes('interview') || item.category === 'Interviews';
      return true;
    });

    list.innerHTML = visible.map(item => `
      <div class="notif-item ${item.unread ? 'unread' : ''}" data-id="${item.id}">
        <div class="dot ${item.unread ? 'dot-active' : ''}"></div>
        <div style="flex:1;min-width:0">
          <div style="font-size:12px;font-weight:${item.unread ? '600' : '500'};color:var(--gray-900)">${item.title}</div>
          <div style="font-size:10px;color:var(--gray-400);margin-top:2px">${item.message}</div>
          <div style="font-size:10px;color:var(--gray-300);margin-top:6px">${item.time}</div>
        </div>
        <div style="font-size:10px;color:var(--gray-400);font-weight:600;flex-shrink:0;cursor:pointer" data-action="dismiss">Dismiss</div>
      </div>
    `).join('');

    list.querySelectorAll('.dot').forEach(dot => {
      dot.addEventListener('click', function() {
        const item = this.closest('.notif-item');
        const id = Number(item?.dataset.id);
        notifications = notifications.map(entry => entry.id === id ? { ...entry, unread: false } : entry);
        setStoredNotifications(notifications);
        renderNotifications(currentFilter);
        showToast('Notification marked as read');
      });
    });

    list.querySelectorAll('[data-action="dismiss"]').forEach(button => {
      button.addEventListener('click', function() {
        const item = this.closest('.notif-item');
        const id = Number(item?.dataset.id);
        notifications = notifications.filter(entry => entry.id !== id);
        setStoredNotifications(notifications);
        renderNotifications(currentFilter);
        showToast('Notification dismissed');
      });
    });
  }

  let currentFilter = 'all';
  const tabs = section.querySelectorAll('.notif-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(item => item.classList.remove('active'));
      tab.classList.add('active');
      currentFilter = tab.textContent.trim().toLowerCase();
      renderNotifications(currentFilter);
    });
  });

  section.querySelector('.btn.btn-ghost')?.addEventListener('click', function() {
    notifications = notifications.map(item => ({ ...item, unread: false }));
    setStoredNotifications(notifications);
    renderNotifications(currentFilter);
    showToast('All notifications marked as read');
  });

  renderNotifications();
}

export { initNotifications };
