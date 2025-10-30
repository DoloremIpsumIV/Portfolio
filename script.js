document.addEventListener("DOMContentLoaded", () => {
  // Modal-hantering för projekt och galleribilder

  var backdrop = document.querySelector("[data-modal-backdrop]");
  var modals = document.querySelectorAll(".modal");

  function openModal(modalEl) {
    if (!modalEl) return;
    backdrop.hidden = false;
    modalEl.hidden = false;
    disableScroll();
  }

  function closeAllModals() {
    backdrop.hidden = true;
    modals.forEach((m) => {
      m.hidden = true;
    });
    enableScroll();
  }

  // Stängknappar
  document.querySelectorAll("[data-close-modal]").forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
  });

  // Klick på backdrop stänger
  if (backdrop) {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  }

  // Öppna projektmodaler
  document.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      var card = e.currentTarget.closest("[data-modal-target]");
      if (!card) return;
      var modalId = card.getAttribute("data-modal-target");
      var modalEl = document.getElementById(modalId);
      openModal(modalEl);
    });
  });

  // Klicka på hela projektkortet öppnar också modal
  document
    .querySelectorAll(".project-card[data-modal-target]")
    .forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.matches("[data-open-modal]")) return;
        var modalId = card.getAttribute("data-modal-target");
        var modalEl = document.getElementById(modalId);
        openModal(modalEl);
      });
    });

  // Galleria till bildmodal
  var imgModal = document.getElementById("imgModal");
  var imgModalPreview = document.getElementById("imgModalPreview");

  document.querySelectorAll(".gallery-item").forEach((item) => {
    item.addEventListener("click", () => {
      var largeSrc = item.getAttribute("data-img");
      if (imgModalPreview && largeSrc) {
        imgModalPreview.src = largeSrc;
      }
      openModal(imgModal);
    });
  });

  // ESC för att stänga modal
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });

  // Lås scroll när modal är öppen
  var scrollPosition = 0;

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
});
