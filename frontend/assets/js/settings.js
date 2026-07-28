import { mockData, showToast, applyTheme, getStoredTheme, setStoredTheme, getStoredSettings, setStoredSettings } from './utils.js';

function initSettings() {
  const settingsSection = document.getElementById('settings');
  if (!settingsSection) return;

  let settings = { ...mockData.settings, ...getStoredSettings() };

  function renderSettings() {
    const inputs = settingsSection.querySelectorAll('.input-group .input');
    const values = [settings.fullName, settings.email, settings.jobTitle, settings.location];
    inputs.forEach((input, index) => {
      if (values[index]) {
        input.value = values[index];
      }
    });

    const bioBlock = settingsSection.querySelector('.input-group [style*="height:60px"]');
    if (bioBlock) {
      bioBlock.textContent = settings.bio;
    }

    const themeChip = settingsSection.querySelector('[data-theme-toggle]');
    if (themeChip) {
      themeChip.textContent = getStoredTheme() === 'dark' ? 'Dark mode' : 'Light mode';
    }
  }

  const tabs = settingsSection.querySelectorAll('.settings-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', function() {
      tabs.forEach(item => item.classList.remove('active'));
      this.classList.add('active');
      showToast('Settings tab changed');
    });
  });

  if (!settingsSection.querySelector('[data-theme-toggle]')) {
    const themeRow = document.createElement('div');
    themeRow.className = 'card';
    themeRow.style.marginBottom = '12px';
    themeRow.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div style="font-size:12px;font-weight:600;color:var(--gray-900)">Theme</div>
          <div style="font-size:10px;color:var(--gray-400)">Toggle between light and dark mode</div>
        </div>
        <button type="button" class="btn btn-sm" data-theme-toggle>${getStoredTheme() === 'dark' ? 'Dark mode' : 'Light mode'}</button>
      </div>
    `;
    settingsSection.querySelector('.settings-layout')?.insertBefore(themeRow, settingsSection.querySelector('.settings-layout .card'));
  }

  if (!settingsSection.querySelector('[data-notify-toggle]')) {
    const notifyRow = document.createElement('div');
    notifyRow.className = 'card';
    notifyRow.style.marginTop = '12px';
    notifyRow.innerHTML = `
      <div style="font-size:12px;font-weight:600;color:var(--gray-900);margin-bottom:10px">Notification preferences</div>
      <div style="display:grid;gap:8px">
        <label style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--gray-600)"><span>Email updates</span><input type="checkbox" data-notify-toggle="email" checked></label>
        <label style="display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--gray-600)"><span>Push alerts</span><input type="checkbox" data-notify-toggle="push" checked></label>
      </div>
    `;
    settingsSection.querySelector('.settings-layout')?.appendChild(notifyRow);
  }

  if (!settingsSection.querySelector('[data-password-form]')) {
    const passwordCard = document.createElement('div');
    passwordCard.className = 'card';
    passwordCard.style.marginTop = '12px';
    passwordCard.innerHTML = `
      <div style="font-size:12px;font-weight:600;color:var(--gray-900);margin-bottom:10px">Password</div>
      <form data-password-form style="display:grid;gap:10px">
        <input class="input" type="password" name="password" placeholder="New password" required>
        <input class="input" type="password" name="confirmPassword" placeholder="Confirm password" required>
        <div style="font-size:10px;color:var(--gray-400)" data-password-hint>Use 8+ characters with at least one number and one symbol.</div>
        <button class="btn btn-sm btn-primary" type="submit">Validate password</button>
      </form>
    `;
    settingsSection.querySelector('.settings-layout')?.appendChild(passwordCard);
  }

  settingsSection.querySelector('[data-theme-toggle]')?.addEventListener('click', function() {
    const nextTheme = getStoredTheme() === 'dark' ? 'light' : 'dark';
    setStoredTheme(nextTheme);
    applyTheme(nextTheme);
    this.textContent = nextTheme === 'dark' ? 'Dark mode' : 'Light mode';
    showToast(`Theme switched to ${nextTheme}`);
  });

  settingsSection.querySelectorAll('[data-notify-toggle]').forEach(toggle => {
    toggle.addEventListener('change', function() {
      settings.notifications = settings.notifications || {};
      settings.notifications[this.dataset.notifyToggle] = this.checked;
      setStoredSettings(settings);
      showToast('Notification settings updated');
    });
  });

  settingsSection.querySelector('[data-password-form]')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const password = this.password.value;
    const confirmPassword = this.confirmPassword.value;
    const hint = settingsSection.querySelector('[data-password-hint]');
    const valid = password.length >= 8 && /\d/.test(password) && /[^A-Za-z0-9]/.test(password) && password === confirmPassword;

    hint.textContent = valid ? 'Password looks strong.' : 'Password must be 8+ characters, include a number and a symbol, and match confirmation.';
    hint.style.color = valid ? 'var(--gray-700)' : 'var(--gray-600)';
    showToast(valid ? 'Password validated successfully' : 'Password validation failed');
  });

  settingsSection.querySelector('.btn.btn-primary')?.addEventListener('click', function(event) {
    event.preventDefault();
    settings.fullName = settingsSection.querySelectorAll('.input-group .input')[0]?.value || settings.fullName;
    settings.email = settingsSection.querySelectorAll('.input-group .input')[1]?.value || settings.email;
    settings.jobTitle = settingsSection.querySelectorAll('.input-group .input')[2]?.value || settings.jobTitle;
    settings.location = settingsSection.querySelectorAll('.input-group .input')[3]?.value || settings.location;
    settings.bio = settingsSection.querySelector('.input-group [style*="height:60px"]')?.textContent || settings.bio;
    setStoredSettings(settings);
    showToast('Settings saved');
  });

  renderSettings();
  applyTheme(getStoredTheme());
}

export { initSettings };
