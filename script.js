document.addEventListener("DOMContentLoaded", () => {
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  const backdrop = $("[data-modal-backdrop]");
  const modals = $$(".modal");
  const mediaModal = $("#mediaModal");
  const mediaImage = $("#mediaModalImage");
  const mediaVideo = $("#mediaModalVideo");
  const mediaCaption = $("#mediaModalCaption");
  let scrollPosition = 0;

  function disableScroll() {
    scrollPosition = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
  }

  function enableScroll() {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.right = "";
    document.body.style.width = "";
    window.scrollTo(0, scrollPosition);
  }

  function resetMediaModal() {
    if (mediaImage) {
      mediaImage.hidden = true;
      mediaImage.removeAttribute("src");
    }
    if (mediaVideo) {
      mediaVideo.pause();
      mediaVideo.hidden = true;
      mediaVideo.removeAttribute("src");
      mediaVideo.load();
    }
    if (mediaCaption) {
      mediaCaption.hidden = true;
      mediaCaption.textContent = "";
    }
  }

  function openModal(modalEl) {
    if (!modalEl || !backdrop) return;
    backdrop.hidden = false;
    modalEl.hidden = false;
    disableScroll();
  }

  function closeAllModals() {
    if (backdrop) backdrop.hidden = true;
    modals.forEach((modal) => {
      modal.hidden = true;
    });
    resetMediaModal();
    enableScroll();
  }

  function openMedia(src, kind, label) {
    if (!src || !mediaModal) return;
    resetMediaModal();

    if (kind === "video" && mediaVideo) {
      mediaVideo.src = src;
      mediaVideo.hidden = false;
      mediaVideo.load();
      mediaVideo.play().catch(() => { });
    } else if (mediaImage) {
      mediaImage.src = src;
      mediaImage.hidden = false;
    }

    if (mediaCaption && label) {
      mediaCaption.textContent = label;
      mediaCaption.hidden = false;
    }

    openModal(mediaModal);
  }

  $$('[data-close-modal]').forEach((button) => {
    button.addEventListener('click', closeAllModals);
  });

  if (backdrop) {
    backdrop.addEventListener('click', (event) => {
      if (event.target === backdrop) closeAllModals();
    });
  }

  $$('[data-open-modal]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const card = event.currentTarget.closest('[data-modal-target]');
      if (!card) return;
      openModal(document.getElementById(card.getAttribute('data-modal-target')));
    });
  });

  $$('[data-modal-target].project-card, [data-modal-target].featured-project, [data-modal-target].creative-project').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('a') || event.target.closest('[data-open-modal]')) return;
      openModal(document.getElementById(card.getAttribute('data-modal-target')));
    });
  });

  $$('[data-media-src]').forEach((item) => {
    item.addEventListener('click', (event) => {
      event.stopPropagation();
      openMedia(
        item.getAttribute('data-media-src'),
        item.getAttribute('data-media-kind') || 'image',
        item.getAttribute('data-media-label') || item.getAttribute('aria-label') || ''
      );
    });
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAllModals();
  });

  $$('video[autoplay][muted]').forEach((video) => {
    video.play().catch(() => { });
  });
});
