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
      mediaVideo.play().catch(() => {});
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
      if (event.target.closest('a') || event.target.closest('[data-open-modal]') || event.target.closest('.sprite-card')) return;
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
    video.play().catch(() => {});
  });

  const GRAVEFALL_SOURCE_PALETTE = {
    light: [0xca, 0x75, 0xca],
    mid: [0xb6, 0x54, 0xb7],
    dark: [0x94, 0x2f, 0x97]
  };

  const PLAYER_THEMES = {
    fighter: { light: '#FF8A80', mid: '#E53935', dark: '#8E1B1B' },
    wizard: { light: '#82B1FF', mid: '#1E88E5', dark: '#0D47A1' },
    assassin: { light: '#FFF59D', mid: '#FDD835', dark: '#C6A700' },
    ranger: { light: '#A5D6A7', mid: '#43A047', dark: '#1B5E20' }
  };

  const spriteRoot = './Images/GraveFallBlenderTextures/Character Sprites';
  const enemyRoot = `${spriteRoot}/Enemies`;
  const gravefallSprites = {
    fighter: {
      name: 'Fighter',
      theme: PLAYER_THEMES.fighter,
      frames: [
        ['Idle stance', `${spriteRoot}/Fighter_Idle_Stance.png`],
        ['Buff stance', `${spriteRoot}/Fighter_Buff_Stance.png`],
        ['Hurt stance', `${spriteRoot}/Fighter_Hurt_Stance.png`],
        ['Bruised stance', `${spriteRoot}/Fighter_Bruised_Stance.png`],
        ['Dying stance', `${spriteRoot}/Fighter_Dying_Stance.png`],
        ['Downed stance', `${spriteRoot}/Fighter_Downed_Stance.png`],
        ['Attack item', `${spriteRoot}/Fighter_Item_Attack.png`],
        ['Defend item', `${spriteRoot}/Fighter_Item_Defend.png`],
        ['Potion item', `${spriteRoot}/Fighter_Item_Potion.png`],
        ['Speed potion', `${spriteRoot}/Fighter_Item_Speed_Potion.png`],
        ['Tombstone', `${spriteRoot}/Fighter_Tombstone.png`]
      ]
    },
    ranger: {
      name: 'Ranger',
      theme: PLAYER_THEMES.ranger,
      frames: [
        ['Idle stance', `${spriteRoot}/Ranger_Idle_Stance.png`],
        ['Buff stance', `${spriteRoot}/Ranger_Buff_Stance.png`],
        ['Hurt stance', `${spriteRoot}/Ranger_Hurt_Stance.png`],
        ['Bruised stance', `${spriteRoot}/Ranger_Bruised_Stance.png`],
        ['Dying stance', `${spriteRoot}/Ranger_Dying_Stance.png`],
        ['Downed stance', `${spriteRoot}/Ranger_Downed_Stance.png`],
        ['Attack item', `${spriteRoot}/Ranger_Item_Attack.png`],
        ['Defend item', `${spriteRoot}/Ranger_Item_Defend.png`],
        ['Potion item', `${spriteRoot}/Ranger_Item_Potion.png`],
        ['Speed potion', `${spriteRoot}/Ranger_Item_Speed_Potion.png`],
        ['Tombstone', `${spriteRoot}/Ranger_Tombstone.png`]
      ]
    },
    wizard: {
      name: 'Wizard',
      theme: PLAYER_THEMES.wizard,
      frames: [
        ['Idle stance', `${spriteRoot}/Wizard_Idle_Stance.png`],
        ['Buff stance', `${spriteRoot}/Wizard_Buff_Stance.png`],
        ['Hurt stance', `${spriteRoot}/Wizard_Hurt_Stance.png`],
        ['Bruised stance', `${spriteRoot}/Wizard_Bruised_Stance.png`],
        ['Dying stance', `${spriteRoot}/Wizard_Dying_Stance.png`],
        ['Downed stance', `${spriteRoot}/Wizard_Downed_Stance.png`],
        ['Attack item', `${spriteRoot}/Wizard_Item_Attack.png`],
        ['Defend item', `${spriteRoot}/Wizard_Item_Defend.png`],
        ['Potion item', `${spriteRoot}/Wizard_Item_Potion.png`],
        ['Speed potion', `${spriteRoot}/Wizard_Item_Speed_Potion.png`],
        ['Tombstone', `${spriteRoot}/Wizard_Tombstone.png`]
      ]
    },
    assassin: {
      name: 'Assassin',
      theme: PLAYER_THEMES.assassin,
      frames: [
        ['Idle stance', `${spriteRoot}/Assassin_Idle_Stance.png`],
        ['Buff stance', `${spriteRoot}/Assassin_Buff_Stance.png`],
        ['Hurt stance', `${spriteRoot}/Assassin_Hurt_Stance.png`],
        ['Bruised stance', `${spriteRoot}/Assassin_Bruised_Stance.png`],
        ['Dying stance', `${spriteRoot}/Assassin_Dying_Stance.png`],
        ['Downed stance', `${spriteRoot}/Assassin_Downed_Stance.png`],
        ['Attack item', `${spriteRoot}/Assassin_Item_Attack.png`],
        ['Defend item', `${spriteRoot}/Assassin_Item_Defend.png`],
        ['Potion item', `${spriteRoot}/Assassin_Item_Potion.png`],
        ['Speed potion', `${spriteRoot}/Assassin_Item_Speed_Potion.png`],
        ['Tombstone', `${spriteRoot}/Assassin_Tombstone.png`]
      ]
    },
    bonecaller: {
      name: 'Bone Caller',
      frames: [
        ['Idle', `${enemyRoot}/BoneCaller_Idle_T.png`],
        ['Hurt', `${enemyRoot}/BoneCaller_Hurt_T.png`],
        ['Bruised', `${enemyRoot}/BoneCaller_Bruised_T.png`],
        ['Dying', `${enemyRoot}/BoneCaller_Dying_T.png`],
        ['Killed', `${enemyRoot}/BoneCaller_Killed_T.png`]
      ]
    },
    cryptimpaler: {
      name: 'Crypt Impaler',
      frames: [
        ['Idle', `${enemyRoot}/CryptImpaler_Idle_T.png`],
        ['Hurt', `${enemyRoot}/CryptImpaler_Hurt_T.png`],
        ['Bruised', `${enemyRoot}/CryptImpaler_Bruised_T.png`],
        ['Dying', `${enemyRoot}/CryptImpaler_Dying_T.png`],
        ['Killed', `${enemyRoot}/CryptImpaler_Killed_T.png`]
      ]
    }
  };

  const imageCache = new Map();

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16)
    ];
  }

  function loadImage(src) {
    if (imageCache.has(src)) return imageCache.get(src);
    const promise = new Promise((resolve, reject) => {
      const image = new Image();
      image.decoding = 'async';
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
    imageCache.set(src, promise);
    return promise;
  }

  function applyPaletteSwap(ctx, width, height, theme) {
    if (!theme) return;
    const replacements = {
      light: hexToRgb(theme.light),
      mid: hexToRgb(theme.mid),
      dark: hexToRgb(theme.dark)
    };
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const keys = Object.keys(GRAVEFALL_SOURCE_PALETTE);

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      for (const key of keys) {
        const [sr, sg, sb] = GRAVEFALL_SOURCE_PALETTE[key];
        const matches = Math.abs(data[i] - sr) <= 6 && Math.abs(data[i + 1] - sg) <= 6 && Math.abs(data[i + 2] - sb) <= 6;
        if (matches) {
          const [tr, tg, tb] = replacements[key];
          data[i] = tr;
          data[i + 1] = tg;
          data[i + 2] = tb;
          break;
        }
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }

  async function drawSprite(canvas, sprite, frameIndex) {
    if (!canvas || !sprite || !sprite.frames?.length) return;
    const [stateName, src] = sprite.frames[frameIndex % sprite.frames.length];
    const image = await loadImage(src);

    const sourceCanvas = document.createElement('canvas');
    sourceCanvas.width = image.width;
    sourceCanvas.height = image.height;
    const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true });
    sourceCtx.clearRect(0, 0, sourceCanvas.width, sourceCanvas.height);
    sourceCtx.drawImage(image, 0, 0);
    applyPaletteSwap(sourceCtx, sourceCanvas.width, sourceCanvas.height, sprite.theme);

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = false;

    const scale = Math.max(1, Math.floor(Math.min((canvas.width * 0.82) / sourceCanvas.width, (canvas.height * 0.82) / sourceCanvas.height)));
    const drawWidth = sourceCanvas.width * scale;
    const drawHeight = sourceCanvas.height * scale;
    const offsetX = Math.round((canvas.width - drawWidth) / 2);
    const offsetY = Math.round((canvas.height - drawHeight) / 2);

    ctx.drawImage(sourceCanvas, 0, 0, sourceCanvas.width, sourceCanvas.height, offsetX, offsetY, drawWidth, drawHeight);
    return stateName;
  }

  const previewCanvas = $('#gravefallPreviewCanvas');
  const previewName = $('#gravefallPreviewName');
  const previewState = $('#gravefallPreviewState');
  const spriteCards = $$('.sprite-card');
  let activeSpriteKey = 'fighter';
  let activePreviewTimer = null;

  function setActiveSprite(key) {
    activeSpriteKey = key;
    spriteCards.forEach((card) => {
      card.classList.toggle('is-active', card.getAttribute('data-gravefall-key') === key);
    });

    if (activePreviewTimer) window.clearInterval(activePreviewTimer);

    let frameIndex = 0;
    const sprite = gravefallSprites[key];
    if (!sprite || !previewCanvas) return;

    const render = async () => {
      const stateName = await drawSprite(previewCanvas, sprite, frameIndex);
      if (previewName) previewName.textContent = sprite.name;
      if (previewState) previewState.textContent = stateName || '';
      frameIndex = (frameIndex + 1) % sprite.frames.length;
    };

    render();
    activePreviewTimer = window.setInterval(render, 1100);
  }

  if (spriteCards.length) {
    spriteCards.forEach((card, cardIndex) => {
      const key = card.getAttribute('data-gravefall-key');
      const sprite = gravefallSprites[key];
      const canvas = $('.sprite-card-canvas', card);
      const stateNode = $('[data-sprite-state]', card);
      let frameIndex = 0;

      const renderThumb = async () => {
        if (!sprite || !canvas) return;
        const stateName = await drawSprite(canvas, sprite, frameIndex);
        if (stateNode && stateName) stateNode.textContent = stateName;
        frameIndex = (frameIndex + 1) % sprite.frames.length;
      };

      renderThumb();
      window.setInterval(renderThumb, 1200 + cardIndex * 120);

      card.addEventListener('click', (event) => {
        event.stopPropagation();
        setActiveSprite(key);
      });
    });

    setActiveSprite(activeSpriteKey);
  }

  const tiltCards = $$('.token-card');
  tiltCards.forEach((card, index) => {
    card.style.setProperty('--token-delay', `${index * 0.12}s`);

    card.addEventListener('pointermove', (event) => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      const rotateY = (x - 0.5) * 12;
      const rotateX = (0.5 - y) * 12;
      card.style.setProperty('--token-rotate-x', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--token-rotate-y', `${rotateY.toFixed(2)}deg`);
      card.style.setProperty('--token-glow-x', `${(x * 100).toFixed(1)}%`);
      card.style.setProperty('--token-glow-y', `${(y * 100).toFixed(1)}%`);
    });

    function clearTilt() {
      card.style.setProperty('--token-rotate-x', '0deg');
      card.style.setProperty('--token-rotate-y', '0deg');
    }

    card.addEventListener('pointerleave', clearTilt);
    card.addEventListener('pointerup', clearTilt);
  });
});
