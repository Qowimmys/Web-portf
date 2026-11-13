(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* 1. Tahun Dinamis di Footer */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* 2. Scroll Progress Bar */
  const progressBar = $('#scrollProgress');
  let ticking = false;

  const updateScroll = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? window.scrollY / maxScroll : 0;
    if (progressBar) progressBar.style.transform = `scaleX(${ratio})`;
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScroll);
      ticking = true;
    }
  }, { passive: true });
  updateScroll();

  /* 3. Mobile Navigation Toggle */
  const menuToggle = $('#menuToggle');
  const mobileNav = $('#mobileNav');

  const toggleMenu = (forceState) => {
    const isOpen = typeof forceState === 'boolean' ? forceState : !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', isOpen);
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => toggleMenu());
    $$('.m-link', mobileNav).forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });
  }

  /* 4. Filter Kategori Karya (Works) */
  const filterChips = $$('.chip[data-filter]');
  const workCards = $$('.product-card[data-cat]');
  const dropdownFilterLinks = $$('[data-filter-link]');

  const applyFilter = (category) => {
    filterChips.forEach(chip => {
      const active = chip.dataset.filter === category;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-selected', String(active));
    });

    workCards.forEach(card => {
      const match = category === 'all' || card.dataset.cat === category;
      card.classList.toggle('is-hidden', !match);
      if (match) card.classList.add('visible');
    });
  };

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => applyFilter(chip.dataset.filter));
  });

  dropdownFilterLinks.forEach(link => {
    link.addEventListener('click', () => {
      applyFilter(link.dataset.filterLink);
    });
  });

  /* 5. Modal Detail Proyek */
  const modal = $('#projectModal');
  const modalClose = $('#modalClose');
  const modalTitle = $('#modalTitle');
  const modalRole = $('#modalRole');
  const modalYear = $('#modalYear');
  const modalDesc = $('#modalDesc');
  const modalCta = $('#modalCta');

  const openProjectModal = (btn) => {
    modalTitle.textContent = btn.dataset.title || '';
    modalRole.textContent = btn.dataset.role || '';
    modalYear.textContent = btn.dataset.year || '';
    modalDesc.textContent = btn.dataset.desc || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  $$('.detail-btn').forEach(btn => {
    btn.addEventListener('click', () => openProjectModal(btn));
  });

  if (modalClose) modalClose.addEventListener('click', closeProjectModal);
  if (modalCta) modalCta.addEventListener('click', closeProjectModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeProjectModal();
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      toggleMenu(false);
    }
  });

  /* 6. Reveal Animation saat Scroll */
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealItems.forEach(el => observer.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('visible'));
  }
})();
