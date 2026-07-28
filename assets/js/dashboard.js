import { mockData, showToast } from './utils.js';

function initDashboard() {
  const dashboard = document.getElementById('dashboard');
  if (!dashboard) return;

  const data = mockData.dashboard;

  const statsGrid = dashboard.querySelector('.stats-grid');
  if (statsGrid) {
    statsGrid.innerHTML = data.stats.map(stat => `
      <div class="card dashboard-card">
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:8px">
          <div style="width:16px;height:16px;background:var(--gray-200);border-radius:4px;flex-shrink:0"></div>
          <span class="metric-label">${stat.label}</span>
        </div>
        <div class="metric-value">${stat.value}</div>
        <div class="metric-meta">${stat.meta}</div>
      </div>
    `).join('');
  }

  const recentTableBody = dashboard.querySelector('.recent-table tbody');
  if (recentTableBody) {
    recentTableBody.innerHTML = data.recentApplications.map(item => `
      <tr>
        <td><div class="cell-flex"><span class="avatar-sm">${item.company[0]}</span><span style="font-weight:600;color:var(--gray-900)">${item.position}</span></div></td>
        <td>${item.company}</td>
        <td class="hide-mobile">${item.date}</td>
        <td><span class="badge ${item.badge || ''}">${item.status}</span></td>
      </tr>
    `).join('');
  }

  const recommendedJobsContainer = dashboard.querySelector('.dash-content .card:nth-child(2) > div:last-child');
  if (recommendedJobsContainer) {
    recommendedJobsContainer.innerHTML = data.recommendedJobs.map(job => `
      <div class="job-card">
        <div class="initial-box">${job.initials}</div>
        <div class="job-info">
          <div class="title">${job.title}</div>
          <div class="meta">${job.company} — ${job.location}</div>
          <div class="salary">${job.salary}</div>
        </div>
      </div>
    `).join('');
  }

  const interviewsContainer = dashboard.querySelector('.dash-bottom .card:nth-child(1) > div:last-child');
  if (interviewsContainer) {
    interviewsContainer.innerHTML = data.interviews.map(item => `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0">
        <div><div style="font-size:12px;font-weight:600;color:var(--gray-900)">${item.title}</div><div style="font-size:10px;color:var(--gray-400)">${item.time}</div></div>
        <div style="display:flex;gap:6px;align-items:center"><span class="badge ${item.tagClass}">${item.tag}</span><span style="font-size:10px;color:var(--gray-400)">${item.duration}</span></div>
      </div>
    `).join('');
  }

  const activityContainer = dashboard.querySelector('.dash-bottom .card:nth-child(2) > div:last-child');
  if (activityContainer) {
    activityContainer.innerHTML = data.activity.map(item => `
      <div style="display:flex;gap:10px;padding:8px 0">
        <div style="display:flex;flex-direction:column;align-items:center;gap:2px">
          <div style="width:10px;height:10px;border-radius:50%;background:var(--gray-600);flex-shrink:0"></div>
          <div style="width:2px;height:28px;background:var(--gray-200)"></div>
        </div>
        <div><div style="font-size:11px;font-weight:600;color:var(--gray-900)">${item.title}</div><div style="font-size:10px;color:var(--gray-400)">${item.meta}</div></div>
      </div>
    `).join('');
  }

  dashboard.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const label = this.textContent.trim();
      const message = label.includes('Export')
        ? 'Dashboard export started'
        : label.includes('Post')
          ? 'Job posting flow opened'
          : 'Dashboard action triggered';
      showToast(message);
    });
  });

  dashboard.querySelectorAll('.dashboard-card').forEach(card => {
    card.addEventListener('click', function() {
      const isActive = this.style.transform === 'translateY(-2px)';
      this.style.transform = isActive ? '' : 'translateY(-2px)';
      showToast(isActive ? 'Metric card deselected' : 'Metric card selected');
    });
  });
}

export { initDashboard };
