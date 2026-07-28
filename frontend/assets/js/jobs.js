import { mockData, showToast, getStoredJobs, saveStoredJobs } from './utils.js';
import { navigateToRoute } from './navigation.js';

function initJobs() {
  const searchSection = document.getElementById('search');
  const detailsSection = document.getElementById('details');
  const savedSection = document.getElementById('saved');

  const state = {
    query: '',
    filters: new Set(),
    sort: 'relevance',
    jobs: [...mockData.jobs.searchResults]
  };

  function getVisibleJobs() {
    const query = state.query.trim().toLowerCase();
    const filtered = state.jobs.filter(job => {
      const matchesQuery = !query || [job.title, job.company, job.location, job.description, ...job.tags].join(' ').toLowerCase().includes(query);
      const matchesFilters = state.filters.size === 0 || Array.from(state.filters).every(filter => {
        if (filter === 'remote') return job.location.toLowerCase().includes('remote');
        if (filter === 'full-time') return job.title.toLowerCase().includes('engineer') || job.title.toLowerCase().includes('developer');
        return true;
      });
      return matchesQuery && matchesFilters;
    });

    const sorted = [...filtered];
    if (state.sort === 'salary') {
      sorted.sort((a, b) => Number(b.salary.replace(/[^0-9]/g, '')) - Number(a.salary.replace(/[^0-9]/g, '')));
    }

    return sorted;
  }

  function renderSearchResults() {
    if (!searchSection) return;

    const grid = searchSection.querySelector('.job-grid');
    const count = searchSection.querySelector('.count strong');
    const visibleJobs = getVisibleJobs();

    if (grid) {
      grid.innerHTML = visibleJobs.map(job => `
        <div class="card" data-job-id="${job.id}">
          <div style="display:flex;gap:10px;margin-bottom:8px">
            <div class="initial-box">${job.company[0]}</div>
            <div><div style="font-size:12px;font-weight:600;color:var(--gray-900)">${job.title}</div><div style="font-size:10px;color:var(--gray-400)">${job.company} — ${job.location}</div></div>
          </div>
          <div style="font-size:10px;color:var(--gray-500);margin-bottom:10px">${job.description}</div>
          <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px">
            ${job.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            <span style="font-size:12px;font-weight:700;color:var(--gray-900)">${job.salary}</span>
            <div style="display:flex;gap:6px">
              <button class="btn btn-sm btn-primary" data-action="apply">Apply</button>
              <button class="btn btn-sm" data-action="save">Save</button>
            </div>
          </div>
        </div>
      `).join('');
    }

    if (count) {
      count.textContent = visibleJobs.length;
    }

    grid?.querySelectorAll('[data-action="save"]').forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        const card = this.closest('.card');
        const jobId = Number(card?.dataset.jobId);
        const job = state.jobs.find(item => item.id === jobId);
        if (!job) return;

        const savedJobs = getStoredJobs();
        if (!savedJobs.some(item => item.id === job.id)) {
          savedJobs.push({ ...job, savedAt: new Date().toISOString() });
          saveStoredJobs(savedJobs);
        }
        showToast(`${job.title} saved for later`);
      });
    });

    grid?.querySelectorAll('[data-action="apply"]').forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        const card = this.closest('.card');
        const jobId = Number(card?.dataset.jobId);
        const job = state.jobs.find(item => item.id === jobId);
        if (!job) return;
        showToast(`Application started for ${job.title}`);
        navigateToRoute('tracker');
      });
    });
  }

  if (searchSection) {
    const searchInput = searchSection.querySelector('.search-bar-wrap input');
    if (searchInput) {
      searchInput.removeAttribute('readonly');
      searchInput.setAttribute('placeholder', 'Search jobs, companies, skills...');
      searchInput.addEventListener('input', function() {
        state.query = this.value;
        renderSearchResults();
      });
    }

    searchSection.querySelectorAll('.check-item').forEach(item => {
      item.addEventListener('click', function() {
        const label = this.textContent.trim().toLowerCase();
        const box = this.querySelector('.box');
        if (box) {
          box.classList.toggle('checked');
          const filterValue = label.includes('remote') ? 'remote' : label.includes('full-time') ? 'full-time' : 'other';
          if (box.classList.contains('checked')) {
            state.filters.add(filterValue);
          } else {
            state.filters.delete(filterValue);
          }
        }
        renderSearchResults();
        showToast('Filter updated');
      });
    });

    const searchButton = Array.from(searchSection.querySelectorAll('.btn')).find(btn => btn.textContent.includes('Search'));
    const clearButton = Array.from(searchSection.querySelectorAll('.btn')).find(btn => btn.textContent.includes('Clear'));
    const applyButton = searchSection.querySelector('.filter-panel .btn');
    const sortPill = searchSection.querySelector('.sort .pill');

    if (searchButton) {
      searchButton.addEventListener('click', function(event) {
        event.preventDefault();
        renderSearchResults();
        showToast('Search results refreshed');
      });
    }

    if (clearButton) {
      clearButton.addEventListener('click', function(event) {
        event.preventDefault();
        if (searchInput) {
          searchInput.value = '';
          state.query = '';
        }
        state.filters.clear();
        searchSection.querySelectorAll('.box.checked').forEach(box => box.classList.remove('checked'));
        renderSearchResults();
        showToast('Filters cleared');
      });
    }

    if (applyButton) {
      applyButton.addEventListener('click', function(event) {
        event.preventDefault();
        renderSearchResults();
        showToast('Filters applied');
      });
    }

    if (sortPill) {
      sortPill.addEventListener('click', function() {
        const options = ['Most Relevant', 'Highest Salary', 'Newest'];
        const currentIndex = options.indexOf(this.textContent.trim());
        const nextIndex = (currentIndex + 1) % options.length;
        this.textContent = options[nextIndex];
        state.sort = nextIndex === 1 ? 'salary' : 'relevance';
        renderSearchResults();
        showToast('Sort updated');
      });
    }

    searchSection.querySelectorAll('.page').forEach(page => {
      page.addEventListener('click', function() {
        searchSection.querySelectorAll('.page').forEach(item => item.classList.remove('active'));
        this.classList.add('active');
        showToast('Page changed');
      });
    });

    renderSearchResults();
  }

  if (savedSection) {
    const savedJobs = getStoredJobs();
    const grid = savedSection.querySelector('.job-grid');
    if (grid) {
      grid.innerHTML = savedJobs.length
        ? savedJobs.map(job => `
          <div class="card">
            <div style="display:flex;gap:10px;margin-bottom:8px">
              <div class="initial-box">${job.company[0]}</div>
              <div><div style="font-size:12px;font-weight:600;color:var(--gray-900)">${job.title}</div><div style="font-size:10px;color:var(--gray-400)">${job.company} — ${job.location}</div></div>
            </div>
            <div style="font-size:10px;color:var(--gray-500);margin-bottom:10px">${job.description}</div>
            <div style="display:flex;gap:6px;padding-top:8px;border-top:1px solid var(--gray-100)">
              <button class="btn btn-sm btn-primary" data-action="apply">Apply</button>
              <button class="btn btn-sm" data-action="remove">Remove</button>
            </div>
          </div>
        `).join('')
        : '<div class="card">No saved jobs yet. Save one from the job search page.</div>';
    }

    savedSection.querySelector('.btn.btn-ghost')?.addEventListener('click', function(event) {
      event.preventDefault();
      saveStoredJobs([]);
      if (grid) {
        grid.innerHTML = '<div class="card">No saved jobs yet. Save one from the job search page.</div>';
      }
      showToast('Saved jobs cleared');
    });

    grid?.querySelectorAll('[data-action="remove"]').forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        const card = this.closest('.card');
        const title = card?.querySelector('div > div > div')?.textContent || '';
        const nextJobs = getStoredJobs().filter(job => job.title !== title);
        saveStoredJobs(nextJobs);
        card?.remove();
        showToast('Job removed from saved list');
      });
    });

    grid?.querySelectorAll('[data-action="apply"]').forEach(button => {
      button.addEventListener('click', function(event) {
        event.preventDefault();
        showToast('Application started from saved jobs');
        navigateToRoute('tracker');
      });
    });
  }
}

export { initJobs };
