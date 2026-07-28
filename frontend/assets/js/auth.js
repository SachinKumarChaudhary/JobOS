import { showToast } from './utils.js';

function initAuth() {
  document.querySelectorAll('#login .btn, #register .btn').forEach(button => {
    button.addEventListener('click', function(event) {
      event.preventDefault();
      const form = this.closest('form');
      const email = form?.querySelector('input[type="email"]')?.value || '';
      const password = form?.querySelector('input[type="password"]')?.value || '';

      if (!email || !password) {
        showToast('Please complete the form before continuing');
        return;
      }

      showToast('Authentication flow ready');
    });
  });
}

export { initAuth };
