/**
 * STACKLY PIZZA SHOP - VALIDATION UTILITIES
 * Pure Vanilla JavaScript Field & Form Validations
 */

const StacklyValidate = (() => {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_REGEX = /^[+]?[\d\s-]{10,15}$/;

  const isValidEmail = (email) => EMAIL_REGEX.test(String(email).trim());
  const isValidPhone = (phone) => PHONE_REGEX.test(String(phone).trim());
  const isNotEmpty = (val) => String(val || '').trim().length > 0;
  const hasMinLength = (val, len) => String(val || '').trim().length >= len;

  const showError = (inputEl, message) => {
    inputEl.classList.add('is-invalid');
    let errEl = inputEl.parentNode.querySelector('.form-error-msg');
    if (!errEl) {
      errEl = document.createElement('div');
      errEl.className = 'form-error-msg';
      inputEl.parentNode.appendChild(errEl);
    }
    errEl.textContent = message;
    errEl.style.display = 'block';
  };

  const clearError = (inputEl) => {
    inputEl.classList.remove('is-invalid');
    const errEl = inputEl.parentNode.querySelector('.form-error-msg');
    if (errEl) {
      errEl.style.display = 'none';
    }
  };

  return {
    isValidEmail,
    isValidPhone,
    isNotEmpty,
    hasMinLength,
    showError,
    clearError
  };
})();
