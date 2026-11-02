/**
 * Brightlands Derma – Main Application JavaScript
 * Handles navigation, sticky header, mobile drawer, accordions, and interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNavigation();
  initFaqAccordion();
  initActiveNavLink();
  initGalleryFilter();
  initBackToTop();
});

/**
 * Sticky Header on scroll
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * Mobile Navigation Drawer
 */
function initMobileNavigation() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  const backdrop = document.querySelector('.mobile-drawer-backdrop');
  const closeBtn = document.querySelector('.mobile-drawer-close');

  if (!toggleBtn || !drawer) return;

  const openDrawer = () => {
    drawer.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    toggleBtn.setAttribute('aria-expanded', 'true');
  };

  const closeDrawer = () => {
    drawer.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    toggleBtn.setAttribute('aria-expanded', 'false');
  };

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  // Submenu toggle inside mobile drawer
  const subMenuToggles = drawer.querySelectorAll('.mobile-nav-dropdown-toggle');
  subMenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = toggle.getAttribute('data-target');
      const targetMenu = document.getElementById(targetId);
      if (targetMenu) {
        targetMenu.classList.toggle('show');
        const icon = toggle.querySelector('i');
        if (icon) {
          icon.classList.toggle('bi-chevron-down');
          icon.classList.toggle('bi-chevron-up');
        }
      }
    });
  });

  // Close drawer when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });
}

/**
 * Accessible FAQ Accordion
 */
function initFaqAccordion() {
  const faqButtons = document.querySelectorAll('.faq-header-btn');

  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const targetId = btn.getAttribute('aria-controls');
      const content = document.getElementById(targetId);

      if (!content) return;

      // Close other accordions in the same group if desired
      const parentAccordion = btn.closest('.faq-accordion-group');
      if (parentAccordion) {
        const otherBtns = parentAccordion.querySelectorAll('.faq-header-btn');
        otherBtns.forEach(other => {
          if (other !== btn) {
            other.setAttribute('aria-expanded', 'false');
            const otherTarget = document.getElementById(other.getAttribute('aria-controls'));
            if (otherTarget) otherTarget.style.display = 'none';
          }
        });
      }

      // Toggle current
      btn.setAttribute('aria-expanded', !isExpanded);
      content.style.display = isExpanded ? 'none' : 'block';
    });
  });
}

/**
 * Highlight Current Active Page Link in Nav
 */
function initActiveNavLink() {
  const currentPath = window.location.pathname.replace(/\/$/, '');
  const navLinks = document.querySelectorAll('.nav-link-custom, .mobile-nav-links a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;
    
    const linkPath = href.replace(/\/$/, '').replace('.html', '');
    const cleanCurrent = currentPath.replace('.html', '');

    if (linkPath === cleanCurrent || (linkPath === '' && (cleanCurrent === '' || cleanCurrent === '/index'))) {
      link.classList.add('active');
    }
  });
}

/**
 * Gallery Tab Filtering
 */
function initGalleryFilter() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item-card');

  if (!filterBtns.length || !galleryItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Back to top helper
 */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }, { passive: true });

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
