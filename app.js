(() => {
  'use strict';
  const config = window.LP_CONFIG || {};
  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];
  const segments = [
    ['salao', 'Salão de beleza', 'beleza'], ['pet', 'Pet shop', 'comercio'],
    ['odonto', 'Odontologia', 'saude'], ['igreja', 'Igreja e comunidade', 'comunidade'],
    ['escola', 'Escola e curso', 'comunidade'], ['barbearia', 'Barbearia', 'beleza'],
    ['saude', 'Clínica e consultório', 'saude'], ['academia', 'Academia', 'saude'],
    ['imobiliaria', 'Imobiliária', 'comercio'], ['padaria', 'Padaria e confeitaria', 'comercio'],
    ['oficina', 'Oficina mecânica', 'comercio'], ['farmacia', 'Farmácia', 'saude'],
    ['loja', 'Loja de roupas', 'comercio'], ['contabil', 'Contabilidade', 'comercio'],
    ['estetica', 'Estética e spa', 'beleza']
  ];
  const gallery = $('#gallery');
  segments.forEach(([file, name, category]) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'gallery-card'; button.dataset.category = category;
    button.setAttribute('aria-label', `Ampliar modelo: ${name}`);
    const image = new Image(); image.src = `assets/${file}.webp`; image.alt = `Prévia do calendário 2027: ${name}`;
    image.loading = 'lazy'; image.decoding = 'async'; image.width = 320; image.height = 426;
    const caption = document.createElement('span'); caption.className = 'model-caption';
    const title = document.createElement('span'); title.textContent = name;
    const icon = document.createElement('span'); icon.textContent = '↗'; icon.setAttribute('aria-hidden', 'true');
    caption.append(title, icon); button.append(image, caption); gallery.append(button);
    button.addEventListener('click', () => {
      $('#large-image').src = image.src; $('#large-image').alt = image.alt;
      $('#large-caption').textContent = `${name} · prévia da coleção`;
      openDialog($('#image-dialog'));
    });
  });
  $$('.filter').forEach(button => button.addEventListener('click', () => {
    $$('.filter').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
    $$('.gallery-card').forEach(card => { card.hidden = button.dataset.filter !== 'todos' && card.dataset.category !== button.dataset.filter; });
  }));
  const days = Number.isInteger(config.garantiaDias) && config.garantiaDias > 0 ? config.garantiaDias : 30;
  $$('[data-guarantee]').forEach(el => { el.textContent = days; });
  $('#copyright-year').textContent = new Date().getFullYear();
  if (config.suporteEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.suporteEmail)) {
    $('#support-link').href = `mailto:${config.suporteEmail}`; $('#support-link').hidden = false;
  }
  const seller = [config.vendedor, config.documento].filter(Boolean).join(' · ');
  if (seller) { $('#seller-info').textContent = seller; $('#seller-info').hidden = false; }
  const dialogs = $$('dialog');
  let lastFocused = null;
  function openDialog(dialog) {
    if (dialogs.some(item => item.open)) return;
    lastFocused = document.activeElement;
    dialog.showModal(); document.body.classList.add('modal-open');
  }
  function closeDialog(dialog) { if (dialog.open) dialog.close(); }
  dialogs.forEach(dialog => {
    dialog.addEventListener('close', () => {
      document.body.classList.remove('modal-open');
      lastFocused?.focus({ preventScroll: true });
    });
    dialog.addEventListener('click', event => { if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog(dialog);
    } });
    dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => closeDialog(dialog)));
  });
  $('#basic-button').addEventListener('click', () => openDialog($('#upgrade-dialog')));
  let toastTimer;
  function toast(message) {
    clearTimeout(toastTimer); const el = $('#toast');
    const parent = dialogs.find(dialog => dialog.open) || document.body;
    parent.append(el); el.textContent = message; el.hidden = false;
    toastTimer = setTimeout(() => { el.hidden = true; document.body.append(el); }, 6500);
  }
  let departing = false;
  function checkout(key) {
    const link = config.checkout?.[key]?.trim();
    if (!link) { toast('Prévia: configure o link deste checkout no arquivo config.js para ativar a compra.'); return; }
    let url;
    try { url = new URL(link); if (url.protocol !== 'https:') throw new Error('invalid'); }
    catch { toast('O checkout precisa de um endereço completo e seguro, começando por https://.'); return; }
    if (config.preservarUTMs !== false) {
      const allowed = /^(utm_(source|medium|campaign|term|content|id)|fbclid|gclid|ttclid|src|sck)$/i;
      new URLSearchParams(location.search).forEach((value, name) => {
        if (allowed.test(name) && !url.searchParams.has(name)) url.searchParams.set(name, value);
      });
    }
    departing = true;
    document.dispatchEvent(new CustomEvent('lp:checkout', { detail: { plano: key } }));
    location.assign(url.href);
  }
  $$('[data-checkout]').forEach(button => button.addEventListener('click', () => checkout(button.dataset.checkout)));
  const wheelDialog = $('#wheel-dialog');
  const sessionKey = 'calendario-pro-2027-exit-shown';
  let exitShown = false;
  try { exitShown = sessionStorage.getItem(sessionKey) === '1'; } catch { /* Private browsers may block storage. */ }
  const start = Date.now();
  function showWheel(manual = false) {
    if (config.roletaAtiva === false || departing || dialogs.some(dialog => dialog.open)) return;
    if (!manual && (exitShown || Date.now() - start < 10000 || window.scrollY < 250)) return;
    exitShown = true;
    try { sessionStorage.setItem(sessionKey, '1'); } catch { /* In-memory fallback remains active. */ }
    openDialog(wheelDialog);
  }
  document.addEventListener('mouseout', event => {
    if (!event.relatedTarget && event.clientY <= 6 && matchMedia('(hover: hover) and (pointer: fine)').matches) showWheel();
  });
  // Mobile browsers do not reliably expose exit intent. Offer a dismissible
  // recovery modal after a deliberate upward return near the top of the page.
  let previousY = window.scrollY, maxY = window.scrollY, framePending = false;
  window.addEventListener('scroll', () => {
    if (framePending) return;
    framePending = true;
    requestAnimationFrame(() => {
      const y = window.scrollY; maxY = Math.max(maxY, y);
      if (matchMedia('(pointer: coarse)').matches && maxY > 1200 && previousY - y > 80 && y > 250 && y < 700) showWheel();
      previousY = y; framePending = false;
    });
  }, { passive: true });
  $$('[data-open-wheel]').forEach(button => {
    button.hidden = config.roletaAtiva === false;
    button.addEventListener('click', () => showWheel(true));
  });
  let spinning = false, spun = false;
  $('#spin-button').addEventListener('click', () => {
    if (spinning || spun) return;
    spinning = true; const button = $('#spin-button');
    button.disabled = true; button.textContent = 'LIBERANDO SUA CONDIÇÃO…';
    $('#wheel').style.transform = 'rotate(1800deg)';
    const duration = matchMedia('(prefers-reduced-motion: reduce)').matches ? 80 : 3500;
    setTimeout(() => {
      spinning = false; spun = true; button.hidden = true; $('#wheel-result').hidden = false;
      $('#wheel-result').querySelector('button').focus({ preventScroll: true });
    }, duration);
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      $('#mobile-bar').classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0 });
    observer.observe($('#planos'));
  }
  // Keep the useful direct-to-plans campaign URL from the reference.
  if (new URLSearchParams(location.search).get('secao') === 'planos') {
    requestAnimationFrame(() => $('#planos').scrollIntoView({ behavior: 'instant' }));
  }
})();
