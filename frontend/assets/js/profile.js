import { mockData, showToast, createModal, getStoredProfile, setStoredProfile } from './utils.js';

function initProfile() {
  const profileSection = document.getElementById('profile');
  if (!profileSection) return;

  let profile = { ...mockData.profile, ...getStoredProfile() };

  function renderProfile() {
    const avatar = profileSection.querySelector('.avatar');
    if (avatar) {
      avatar.innerHTML = profile.avatarUrl ? `<img src="${profile.avatarUrl}" alt="profile" style="width:100%;height:100%;object-fit:cover;border-radius:50%">` : profile.initials;
    }

    const headerName = profileSection.querySelector('.profile-header .pinfo h3');
    const headerRole = profileSection.querySelector('.profile-header .pinfo .prole');
    const headerMeta = profileSection.querySelector('.profile-header .pinfo div[style*="display:flex"]');

    if (headerName) headerName.textContent = profile.name;
    if (headerRole) headerRole.textContent = profile.role;
    if (headerMeta) {
      headerMeta.innerHTML = `<span>${profile.location}</span><span style="color:var(--gray-300)">·</span><span>${profile.email}</span>`;
    }

    const skillsGrid = profileSection.querySelector('.skills-grid');
    if (skillsGrid) {
      skillsGrid.innerHTML = profile.skills.map(skill => `<span class="tag">${skill}</span>`).join('');
    }

    const personalInfoCard = profileSection.querySelector('.profile-layout > div:first-child .card:first-child');
    if (personalInfoCard) {
      personalInfoCard.innerHTML = `
        <div style="font-size:12px;font-weight:600;color:var(--gray-900);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Personal Info</div>
        <div style="font-size:11px">
          <div style="margin-bottom:8px"><span style="color:var(--gray-400);font-size:10px">Full Name</span><div style="color:var(--gray-900);font-weight:600;margin-top:2px">${profile.name}</div></div>
          <div class="divider"></div>
          <div style="margin-bottom:8px"><span style="color:var(--gray-400);font-size:10px">Email</span><div style="color:var(--gray-900);font-weight:600;margin-top:2px">${profile.email}</div></div>
          <div class="divider"></div>
          <div style="margin-bottom:8px"><span style="color:var(--gray-400);font-size:10px">Phone</span><div style="color:var(--gray-900);font-weight:600;margin-top:2px">${profile.phone}</div></div>
          <div class="divider"></div>
          <div><span style="color:var(--gray-400);font-size:10px">Location</span><div style="color:var(--gray-900);font-weight:600;margin-top:2px">${profile.location}</div></div>
        </div>
      `;
    }

    const resumeCard = profileSection.querySelector('.profile-layout > div:first-child .card:last-child');
    if (resumeCard) {
      resumeCard.innerHTML = `
        <div style="font-size:12px;font-weight:600;color:var(--gray-900);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Resume</div>
        <div style="border:1px solid var(--gray-200);border-radius:var(--radius-sm);background:var(--gray-50);padding:10px;text-align:center">
          <div style="font-size:10px;color:var(--gray-500);margin-bottom:2px">${profile.resumeName || 'Sahil_Kumar_Resume.pdf'}</div>
          <div style="font-size:10px;color:var(--gray-300);margin-bottom:8px">${profile.resumeDate || 'Uploaded Jul 20, 2026'}</div>
          <div style="display:flex;gap:6px;justify-content:center">
            <label class="btn btn-xs" for="resume-upload">Upload</label>
            <input id="resume-upload" type="file" accept="application/pdf,.doc,.docx" hidden>
          </div>
        </div>
      `;
    }

    profileSection.querySelectorAll('.tag').forEach(tag => {
      tag.addEventListener('click', function() {
        this.style.background = 'var(--gray-200)';
        showToast('Skill selected');
      });
    });
  }

  const editButton = profileSection.querySelector('.btn.btn-primary');
  if (editButton) {
    editButton.addEventListener('click', function(event) {
      event.preventDefault();
      createModal({
        title: 'Edit profile',
        body: `
          <div style="display:grid;gap:10px">
            <input id="profile-name" class="input" value="${profile.name}">
            <input id="profile-role" class="input" value="${profile.role}">
            <input id="profile-email" class="input" value="${profile.email}">
            <input id="profile-phone" class="input" value="${profile.phone}">
            <input id="profile-location" class="input" value="${profile.location}">
            <input id="profile-skills" class="input" value="${profile.skills.join(', ')}">
          </div>
        `,
        confirmText: 'Save',
        onConfirm: () => {
          const nextProfile = {
            ...profile,
            name: document.getElementById('profile-name').value,
            role: document.getElementById('profile-role').value,
            email: document.getElementById('profile-email').value,
            phone: document.getElementById('profile-phone').value,
            location: document.getElementById('profile-location').value,
            skills: document.getElementById('profile-skills').value.split(',').map(item => item.trim()).filter(Boolean)
          };
          profile = nextProfile;
          setStoredProfile(profile);
          renderProfile();
          showToast('Profile updated');
        }
      });
    });
  }

  const avatar = profileSection.querySelector('.avatar');
  if (avatar) {
    avatar.addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
          profile.avatarUrl = reader.result;
          setStoredProfile(profile);
          renderProfile();
          showToast('Profile image updated');
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });
  }

  profileSection.addEventListener('change', function(event) {
    if (event.target.id === 'resume-upload') {
      const file = event.target.files?.[0];
      if (!file) return;
      profile.resumeName = file.name;
      profile.resumeDate = `Uploaded ${new Date().toLocaleDateString()}`;
      setStoredProfile(profile);
      renderProfile();
      showToast('Resume uploaded');
    }
  });

  renderProfile();
}

export { initProfile };
