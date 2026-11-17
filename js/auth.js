/**
 * STACKLY PIZZA SHOP - AUTHENTICATION CONTROLLER
 * Handles simulated role-based login & signup with session persistence
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Password Visibility Toggle
  document.querySelectorAll('.toggle-password-icon').forEach(icon => {
    icon.addEventListener('click', () => {
      const input = icon.previousElementSibling;
      if (!input) return;
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
      } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
      }
    });
  });

  // 2. Login Form Handler
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const roleSelect = document.getElementById('login-role');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const submitBtn = document.getElementById('btn-login-submit');

    // Quick clear on input
    [roleSelect, emailInput, passwordInput].forEach(inp => {
      if (inp) {
        inp.addEventListener('input', () => StacklyValidate.clearError(inp));
        inp.addEventListener('change', () => StacklyValidate.clearError(inp));
      }
    });

    if (roleSelect && emailInput) {
      roleSelect.addEventListener('change', () => {
        if (roleSelect.value === 'Admin') {
          emailInput.placeholder = 'e.g. chef.marco@stackly.com';
        } else {
          emailInput.placeholder = 'e.g. arun.kumar@gmail.com';
        }
      });
    }

    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const role = roleSelect.value;
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!role) {
        StacklyValidate.showError(roleSelect, 'Please select a role (Admin or Client).');
        isValid = false;
      } else {
        StacklyValidate.clearError(roleSelect);
      }

      if (!StacklyValidate.isValidEmail(email)) {
        StacklyValidate.showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        StacklyValidate.clearError(emailInput);
      }

      if (!StacklyValidate.isNotEmpty(password)) {
        StacklyValidate.showError(passwordInput, 'Password is required.');
        isValid = false;
      } else {
        StacklyValidate.clearError(passwordInput);
      }

      if (!isValid) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Authenticating...';

      // Frontend demonstration authentication
      setTimeout(() => {
        function formatNameFromEmail(str) {
          if (!str || typeof str !== 'string') return 'User';
          const prefix = str.split('@')[0].trim();
          if (!prefix) return 'User';
          const parts = prefix.split(/[._\-+]+/).filter(Boolean);
          if (parts.length === 0) return 'User';
          return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()).join(' ');
        }

        function getInitialsFromName(name, strEmail) {
          if (!name && strEmail) name = formatNameFromEmail(strEmail);
          if (!name) return 'US';
          const parts = name.trim().split(/\s+/).filter(Boolean);
          if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
          } else if (parts.length === 1) {
            const letters = parts[0].replace(/[^a-zA-Z]/g, '');
            if (letters.length >= 2) {
              return letters.substring(0, 2).toUpperCase();
            } else if (letters.length === 1) {
              return (letters.charAt(0) + 'X').toUpperCase();
            }
          }
          return 'US';
        }

        const formattedName = formatNameFromEmail(email);
        const initials = getInitialsFromName(formattedName, email);

        const sessionUser = {
          name: formattedName,
          email: email,
          role: role,
          initials: initials
        };

        if (typeof StacklyStorage !== 'undefined') {
          StacklyStorage.setSession(sessionUser, role);
        }
        localStorage.setItem('stackly_auth_user', JSON.stringify(sessionUser));
        localStorage.setItem('stackly_user', JSON.stringify(sessionUser));
        localStorage.setItem('stackly_session_user', JSON.stringify(sessionUser));
        localStorage.setItem('stackly_session_role', role);
        sessionStorage.setItem('stackly_session_user', JSON.stringify(sessionUser));
        sessionStorage.setItem('stackly_session_role', role);

        if (role === 'Admin') {
          localStorage.setItem('stackly_admin_user', JSON.stringify(sessionUser));
        } else {
          localStorage.setItem('stackly_client_user', JSON.stringify(sessionUser));
        }

        StacklyUI.showToast(`Welcome back, ${sessionUser.name}! Logging you in...`, 'fa-circle-check');

        setTimeout(() => {
          if (role === 'Admin') {
            window.location.href = 'admindashboard.html';
          } else {
            window.location.href = 'userdashboard.html';
          }
        }, 800);
      }, 700);
    });
  }

  // 3. Signup Form Handler
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    const roleSelect = document.getElementById('signup-role');
    const nameInput = document.getElementById('signup-name');
    const emailInput = document.getElementById('signup-email');
    const passwordInput = document.getElementById('signup-password');
    const confirmInput = document.getElementById('signup-confirm-password');
    const termsCheck = document.getElementById('signup-terms');
    const submitBtn = document.getElementById('btn-signup-submit');

    [roleSelect, nameInput, emailInput, passwordInput, confirmInput, termsCheck].forEach(inp => {
      if (inp) {
        inp.addEventListener('input', () => StacklyValidate.clearError(inp));
        inp.addEventListener('change', () => StacklyValidate.clearError(inp));
      }
    });

    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      const role = roleSelect.value;
      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmInput.value;
      const termsAccepted = termsCheck.checked;

      if (!role) {
        StacklyValidate.showError(roleSelect, 'Please select your account type.');
        isValid = false;
      } else {
        StacklyValidate.clearError(roleSelect);
      }

      if (!StacklyValidate.isNotEmpty(name)) {
        StacklyValidate.showError(nameInput, 'Full name is required.');
        isValid = false;
      } else {
        StacklyValidate.clearError(nameInput);
      }

      if (!StacklyValidate.isValidEmail(email)) {
        StacklyValidate.showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        StacklyValidate.clearError(emailInput);
      }

      if (!StacklyValidate.hasMinLength(password, 6)) {
        StacklyValidate.showError(passwordInput, 'Password must be at least 6 characters.');
        isValid = false;
      } else {
        StacklyValidate.clearError(passwordInput);
      }

      if (password !== confirmPassword) {
        StacklyValidate.showError(confirmInput, 'Passwords do not match.');
        isValid = false;
      } else {
        StacklyValidate.clearError(confirmInput);
      }

      if (!termsAccepted) {
        StacklyValidate.showError(termsCheck, 'You must agree to the Terms & Conditions.');
        isValid = false;
      } else {
        StacklyValidate.clearError(termsCheck);
      }

      if (!isValid) return;

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating Account...';

      setTimeout(() => {
        // Save user into localStorage
        const newUser = {
          name,
          email,
          role,
          password
        };

        StacklyStorage.registerUser(newUser);
        StacklyUI.showToast('Account created successfully! Redirecting to login...', 'fa-user-check');

        setTimeout(() => {
          window.location.href = 'Login.html';
        }, 1200);
      }, 800);
    });
  }
});
