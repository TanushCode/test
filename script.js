/**
 * Warm Editorial Portfolio Interactive Engine
 * Pure vanilla JavaScript with no external dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initCopyrightYear();
  initMobileMenu();
  initActiveNavObserver();
  initSkillsFilter();
  initProjectsFilter();
  initContactForm();
  initClipboardButtons();
  initBackToTop();
});

/**
 * 1. Set current year in footer dynamically
 */
function initCopyrightYear() {
  const yearElement = document.getElementById('currentYear');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * 2. Mobile Drawer Navigation
 */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const drawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (!menuBtn || !drawer) return;

  function toggleDrawer() {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    } else {
      drawer.classList.add('open');
      menuBtn.setAttribute('aria-expanded', 'true');
    }
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDrawer();
  });

  // Close when clicking any link
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      drawer.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * 3. Active Nav Highlighting on Scroll via IntersectionObserver
 */
function initActiveNavObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * 4. Technical Skills Category Filter
 */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-chip');
  const skillTags = document.querySelectorAll('.skill-tag');

  if (!filterBtns.length || !skillTags.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active button style
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const selectedCategory = btn.getAttribute('data-skill-category');

      skillTags.forEach((tag) => {
        const tagCategory = tag.getAttribute('data-category');
        if (selectedCategory === 'all' || tagCategory === selectedCategory) {
          tag.classList.remove('hidden');
          tag.style.opacity = '0';
          tag.style.transform = 'scale(0.9)';
          setTimeout(() => {
            tag.style.opacity = '1';
            tag.style.transform = 'scale(1)';
          }, 30);
        } else {
          tag.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * 5. Project Category Filter
 */
function initProjectsFilter() {
  const filterTabs = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (!filterTabs.length || !projectCards.length) return;

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      filterTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCategory === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * 6. Interactive Contact Form with Validation & Feedback
 */
function initContactForm() {
  const form = document.getElementById('portfolioContactForm');
  const nameInput = document.getElementById('contactName');
  const emailInput = document.getElementById('contactEmail');
  const subjectInput = document.getElementById('contactSubject');
  const messageInput = document.getElementById('contactMessage');
  const charCounter = document.getElementById('charCounter');
  const submitBtn = document.getElementById('submitFormBtn');
  const successAlert = document.getElementById('formSuccessAlert');

  if (!form) return;

  // Real-time character count
  if (messageInput && charCounter) {
    messageInput.addEventListener('input', () => {
      const length = messageInput.value.length;
      charCounter.textContent = `${length} / 1000`;
      if (length > 900) {
        charCounter.style.color = 'var(--accent-terracotta)';
      } else {
        charCounter.style.color = 'var(--text-muted)';
      }
    });
  }

  // Helper validation functions
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  function setFieldValidity(input, isValid) {
    if (isValid) {
      input.classList.remove('is-invalid');
    } else {
      input.classList.add('is-invalid');
    }
  }

  // Input event clear errors
  [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
    if (!input) return;
    input.addEventListener('input', () => {
      if (input.classList.contains('is-invalid')) {
        setFieldValidity(input, true);
      }
    });
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => setFieldValidity(input, true));
    }
  });

  // Submit Handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isFormValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      setFieldValidity(nameInput, false);
      isFormValid = false;
    } else {
      setFieldValidity(nameInput, true);
    }

    // Validate Email
    if (!validateEmail(emailInput.value.trim())) {
      setFieldValidity(emailInput, false);
      isFormValid = false;
    } else {
      setFieldValidity(emailInput, true);
    }

    // Validate Subject
    if (!subjectInput.value) {
      setFieldValidity(subjectInput, false);
      isFormValid = false;
    } else {
      setFieldValidity(subjectInput, true);
    }

    // Validate Message (min 10 chars)
    if (messageInput.value.trim().length < 10) {
      setFieldValidity(messageInput, false);
      isFormValid = false;
    } else {
      setFieldValidity(messageInput, true);
    }

    if (!isFormValid) {
      showToast('Please correct the highlighted fields before transmitting.', 3500);
      return;
    }

    // Loading State
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;

    // Simulate network transmission
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      submitBtn.disabled = false;

      // Reveal success banner
      if (successAlert) {
        successAlert.classList.add('visible');
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      showToast('✓ Note dispatched to Tanush successfully!');

      // Reset form fields
      form.reset();
      if (charCounter) charCounter.textContent = '0 / 1000';

      // Hide success alert after 8 seconds
      setTimeout(() => {
        if (successAlert) successAlert.classList.remove('visible');
      }, 8000);
    }, 750);
  });
}

/**
 * 7. Copy-to-Clipboard Buttons
 */
function initClipboardButtons() {
  const quickCopyBtn = document.getElementById('quickCopyEmailBtn');
  const quickCopyText = document.getElementById('quickCopyText');

  const cardCopyBtn = document.getElementById('copyEmailCardBtn');
  const cardCopyText = document.getElementById('copyEmailCardText');

  const email = 'tanush.dev@example.com';

  function copyAction(textTarget, initialLabel) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(email).then(() => {
        onCopySuccess(textTarget, initialLabel);
      }).catch(() => fallbackCopy(textTarget, initialLabel));
    } else {
      fallbackCopy(textTarget, initialLabel);
    }
  }

  function fallbackCopy(textTarget, initialLabel) {
    const tempInput = document.createElement('input');
    tempInput.value = email;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      onCopySuccess(textTarget, initialLabel);
    } catch (err) {
      showToast('Unable to copy automatically.');
    }
    document.body.removeChild(tempInput);
  }

  function onCopySuccess(textTarget, initialLabel) {
    if (textTarget) {
      textTarget.textContent = 'Copied to Clipboard!';
      setTimeout(() => {
        textTarget.textContent = initialLabel;
      }, 2500);
    }
    showToast(`✓ Copied ${email} to clipboard!`);
  }

  if (quickCopyBtn) {
    quickCopyBtn.addEventListener('click', () => {
      copyAction(quickCopyText, 'Copy Email');
    });
  }

  if (cardCopyBtn) {
    cardCopyBtn.addEventListener('click', () => {
      copyAction(cardCopyText, `Copy ${email}`);
    });
  }
}

/**
 * 8. Back To Top Smooth Scrolling
 */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Global Toast Notification Helper
 */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  if (window._toastTimeout) {
    clearTimeout(window._toastTimeout);
  }

  window._toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}
