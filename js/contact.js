/**
 * STACKLY PIZZA SHOP - CONTACT CONTROLLER & FAQ ACCORDION
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. FAQ Accordion Toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    if (header) {
      header.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        // Close all
        faqItems.forEach(i => i.classList.remove('active'));
        // Toggle current
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // 2. Contact Form Validation & Simulated Submission
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const phoneInput = document.getElementById('contact-phone');
    const typeSelect = document.getElementById('contact-type');
    const orderInput = document.getElementById('contact-order-id');
    const subjectInput = document.getElementById('contact-subject');
    const messageInput = document.getElementById('contact-message');
    const submitBtn = document.getElementById('btn-submit-contact');
    const statusBox = document.getElementById('contact-status-box');

    // Real-time input clearing
    [nameInput, emailInput, phoneInput, typeSelect, subjectInput, messageInput].forEach(inp => {
      if (inp) {
        inp.addEventListener('input', () => StacklyValidate.clearError(inp));
        inp.addEventListener('change', () => StacklyValidate.clearError(inp));
      }
    });

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Name
      if (!StacklyValidate.isNotEmpty(nameInput.value)) {
        StacklyValidate.showError(nameInput, 'Full name is required.');
        isValid = false;
      } else {
        StacklyValidate.clearError(nameInput);
      }

      // Email
      if (!StacklyValidate.isValidEmail(emailInput.value)) {
        StacklyValidate.showError(emailInput, 'Please enter a valid email address.');
        isValid = false;
      } else {
        StacklyValidate.clearError(emailInput);
      }

      // Phone
      if (!StacklyValidate.isValidPhone(phoneInput.value)) {
        StacklyValidate.showError(phoneInput, 'Please enter a valid phone number (10-15 digits).');
        isValid = false;
      } else {
        StacklyValidate.clearError(phoneInput);
      }

      // Inquiry Type
      if (!StacklyValidate.isNotEmpty(typeSelect.value)) {
        StacklyValidate.showError(typeSelect, 'Please select an inquiry type.');
        isValid = false;
      } else {
        StacklyValidate.clearError(typeSelect);
      }

      // Subject
      if (!StacklyValidate.isNotEmpty(subjectInput.value)) {
        StacklyValidate.showError(subjectInput, 'Subject is required.');
        isValid = false;
      } else {
        StacklyValidate.clearError(subjectInput);
      }

      // Message
      if (!StacklyValidate.hasMinLength(messageInput.value, 10)) {
        StacklyValidate.showError(messageInput, 'Message must be at least 10 characters.');
        isValid = false;
      } else {
        StacklyValidate.clearError(messageInput);
      }

      if (!isValid) return;

      // Simulated Submission
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing Demonstration...';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';

        if (statusBox) {
          statusBox.innerHTML = `
            <div style="background:rgba(229,9,20,0.15); border:1px solid var(--primary); padding:1.25rem; border-radius:var(--radius-md); color:var(--secondary); text-align:left; margin-top:1.5rem;">
              <h4 style="color:var(--primary); font-size:1.1rem; font-weight:700; margin-bottom:0.35rem;">
                <i class="fa-solid fa-circle-check"></i> Demonstration Inquiry Logged!
              </h4>
              <p style="font-size:0.88rem; line-height:1.5; color:var(--white-80);">
                Thank you, <strong>${nameInput.value}</strong>. Note: Since STACKLY is a frontend demonstration website with no backend database, your inquiry has been simulated and saved to local demonstration memory.
              </p>
            </div>
          `;
        }

        StacklyUI.showToast('Inquiry recorded locally (Frontend Demonstration)!', 'fa-envelope-circle-check');
        contactForm.reset();
      }, 1000);
    });
  }
});
