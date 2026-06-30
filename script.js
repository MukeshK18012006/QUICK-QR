(() => {
  const $ = (id) => document.getElementById(id);
  const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const els = {
    themeToggle: $('themeToggle'),
    statusBadge: $('statusBadge'),
    typeHint: $('typeHint'),
    contentType: $('contentType'),
    urlInput: $('urlInput'),
    pdfInput: $('pdfInput'),
    imageInput: $('imageInput'),
    multiUrlInput: $('multiUrlInput'),
    contactName: $('contactName'),
    contactPhone: $('contactPhone'),
    contactEmail: $('contactEmail'),
    contactCompany: $('contactCompany'),
    contactWebsite: $('contactWebsite'),
    contactAddress: $('contactAddress'),
    emailTo: $('emailTo'),
    emailSubject: $('emailSubject'),
    emailBody: $('emailBody'),
    smsPhone: $('smsPhone'),
    smsMessage: $('smsMessage'),
    wifiSsid: $('wifiSsid'),
    wifiPassword: $('wifiPassword'),
    wifiSecurity: $('wifiSecurity'),
    wifiHidden: $('wifiHidden'),
    storePlatform: $('storePlatform'),
    storeUrl: $('storeUrl'),
    textInput: $('textInput'),
    qrSize: $('qrSize'),
    qrMargin: $('qrMargin'),
    errorCorrection: $('errorCorrection'),
    moduleStyle: $('moduleStyle'),
    finderStyle: $('finderStyle'),
    cornerDotStyle: $('cornerDotStyle'),
    gradientType: $('gradientType'),
    solidGroup: $('solidGroup'),
    linearGroup: $('linearGroup'),
    radialGroup: $('radialGroup'),
    solidColor: $('solidColor'),
    linearStart: $('linearStart'),
    linearEnd: $('linearEnd'),
    gradientAngle: $('gradientAngle'),
    radialStart: $('radialStart'),
    radialEnd: $('radialEnd'),
    bgColor: $('bgColor'),
    autoThemeMatch: $('autoThemeMatch'),
    stylePreset: $('stylePreset'),
    logoMode: $('logoMode'),
    logoControls: $('logoControls'),
    logoDropzone: $('logoDropzone'),
    logoUpload: $('logoUpload'),
    browseLogoBtn: $('browseLogoBtn'),
    replaceLogoBtn: $('replaceLogoBtn'),
    removeLogoBtn: $('removeLogoBtn'),
    logoPreview: $('logoPreview'),
    logoSize: $('logoSize'),
    logoInfo: $('logoInfo'),
    logoSafety: $('logoSafety'),
    scanQuality: $('scanQuality'),
    qrcode: $('qrcode'),
    emptyState: $('emptyState'),
    previewSize: $('previewSize'),
    previewLogoSafety: $('previewLogoSafety'),
    previewScanQuality: $('previewScanQuality'),
    previewMode: $('previewMode'),
    generateBtn: $('generateBtn'),
    copyTextBtn: $('copyTextBtn'),
    resetBtn: $('resetBtn'),
    downloadPngBtn: $('downloadPngBtn'),
    downloadSvgBtn: $('downloadSvgBtn'),
    downloadJpgBtn: $('downloadJpgBtn'),
    downloadPdfBtn: $('downloadPdfBtn'),
    copyImageBtn: $('copyImageBtn'),
    printBtn: $('printBtn'),
    message: $('message'),
    toastStack: $('toastStack'),
  };

  const STORAGE_THEME_KEY = 'quick-qr-theme-v5';
  const DEFAULT_COLOR = '#000000';

  const TYPE_HINTS = {
    url: 'Paste a website URL.',
    pdf: 'Paste a PDF link.',
    image: 'Paste an image link.',
    'multi-url': 'One URL per line.',
    contact: 'Create a vCard contact payload.',
    email: 'Build a mailto QR code.',
    sms: 'Build an SMS QR code.',
    wifi: 'Create a WiFi connection QR code.',
    store: 'Use an App Store or Play Store link.',
    text: 'Encode plain text as-is.',
  };

  const PRESETS = {
    premium: { moduleStyle: 'rounded', finderStyle: 'rounded', cornerDotStyle: 'rounded', gradientType: 'linear', gradientAngle: '135' },
    square: { moduleStyle: 'square', finderStyle: 'square', cornerDotStyle: 'square', gradientType: 'solid' },
    dot: { moduleStyle: 'dot', finderStyle: 'square', cornerDotStyle: 'dot', gradientType: 'radial' },
    instagram: { moduleStyle: 'rounded', finderStyle: 'rounded', cornerDotStyle: 'rounded', gradientType: 'linear', gradientAngle: '125' },
  };

  const state = {
    theme: localStorage.getItem(STORAGE_THEME_KEY) || 'dark',
    qr: null,
    signature: '',
    renderQueued: false,
    logoDataUrl: '',
    logoMeta: null,
    logoColors: null,
    manualColorLocked: false,
    forceRender: false,
  };

  const colorInputs = [els.solidColor, els.linearStart, els.linearEnd, els.radialStart, els.radialEnd].filter(Boolean);
  const liveInputs = [
    els.contentType, els.urlInput, els.pdfInput, els.imageInput, els.multiUrlInput,
    els.contactName, els.contactPhone, els.contactEmail, els.contactCompany, els.contactWebsite, els.contactAddress,
    els.emailTo, els.emailSubject, els.emailBody, els.smsPhone, els.smsMessage,
    els.wifiSsid, els.wifiPassword, els.wifiSecurity, els.wifiHidden,
    els.storePlatform, els.storeUrl, els.textInput, els.qrSize, els.qrMargin, els.errorCorrection,
    els.moduleStyle, els.finderStyle, els.cornerDotStyle, els.gradientType,
    els.solidColor, els.linearStart, els.linearEnd, els.gradientAngle, els.radialStart, els.radialEnd,
    els.bgColor, els.autoThemeMatch, els.stylePreset, els.logoMode, els.logoSize,
  ].filter(Boolean);

  function exists(el) {
    return !!el;
  }

  function setText(el, value) {
    if (el) el.textContent = value;
  }

  function setValue(el, value) {
    if (el) el.value = value;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function normalizeUrl(value) {
    const trimmed = String(value || '').trim();
    if (!trimmed) return '';
    return /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
  }

  function normalizePhone(value) {
    const trimmed = String(value || '').trim();
    if (!trimmed) return '';
    const normalized = trimmed.replace(/[^\d+]/g, '');
    return normalized.startsWith('00') ? `+${normalized.slice(2)}` : normalized;
  }

  function escapeVCard(value) {
    return String(value || '')
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  function degreesToRadians(degrees) {
    return (Number(degrees) || 0) * (Math.PI / 180);
  }

  function currentType() {
    return els.contentType?.value || 'text';
  }

  function currentPresetLabel() {
    return {
      premium: 'Premium Rounded',
      square: 'Clean Square',
      dot: 'Dot Grid',
      instagram: 'Instagram-style',
    }[els.stylePreset?.value || 'premium'] || 'Custom';
  }

  function applyTheme(theme) {
    state.theme = theme === 'light' ? 'light' : 'dark';
    document.documentElement.dataset.theme = state.theme;
    localStorage.setItem(STORAGE_THEME_KEY, state.theme);
    setText(els.themeToggle, state.theme === 'dark' ? 'Light Mode' : 'Dark Mode');
  }

  function setStatus(text, tone = 'neutral') {
    if (!els.statusBadge) return;
    els.statusBadge.textContent = text;
    els.statusBadge.dataset.tone = tone;
  }

  function setMessage(text, tone = '') {
    if (!els.message) return;
    els.message.className = ['message', tone].filter(Boolean).join(' ');
    els.message.textContent = text;
  }

  function showToast(title, text, tone = 'success') {
    if (!els.toastStack) return;
    const node = document.createElement('div');
    node.className = `toast ${tone}`;
    node.innerHTML = `<span class="toast-title">${escapeHtml(title)}</span><span class="toast-text">${escapeHtml(text)}</span>`;
    els.toastStack.appendChild(node);
    window.setTimeout(() => {
      node.style.opacity = '0';
      node.style.transform = 'translateY(10px)';
      node.style.transition = 'opacity 180ms ease, transform 180ms ease';
      window.setTimeout(() => node.remove(), 220);
    }, 2400);
  }

  function updateTypeHint() {
    setText(els.typeHint, TYPE_HINTS[currentType()] || '');
  }

  function updateVisibleSections() {
    qsa('[data-type-section]').forEach((section) => {
      section.hidden = section.dataset.typeSection !== currentType();
    });
    updateTypeHint();
  }

  function updateGradientVisibility() {
    const mode = els.gradientType?.value || 'solid';
    const sync = (el, show) => {
      if (!el) return;
      el.hidden = !show;
      el.classList.toggle('hidden', !show);
      el.setAttribute('aria-hidden', String(!show));
      el.style.display = show ? '' : 'none';
    };

    sync(els.solidGroup, mode === 'solid');
    sync(els.linearGroup, mode === 'linear');
    sync(els.radialGroup, mode === 'radial');
  }

  function updateLogoControls() {
    if (!els.logoControls || !els.logoMode) return;
    els.logoControls.classList.toggle('hidden', els.logoMode.value !== 'center');
  }

  function updateIndicators() {
    const size = Number(els.logoSize?.value || 18);
    const margin = Number(els.qrMargin?.value || 16);
    const correction = els.errorCorrection?.value || 'H';
    const risky = size > 24 || margin < 8 || correction === 'L';
    const balanced = size > 20 || correction === 'M';
    const label = risky ? 'Caution' : balanced ? 'Balanced' : 'Protected';
    const scan = risky ? 'Low' : balanced ? 'Balanced' : 'High';
    const tone = risky ? 'warning' : balanced ? 'warning' : 'safe';

    setText(els.logoSafety, label);
    setText(els.previewLogoSafety, label);
    setText(els.scanQuality, scan);
    setText(els.previewScanQuality, scan);
    if (els.logoSafety) els.logoSafety.className = `pill-indicator ${tone}`;
    if (els.previewLogoSafety) els.previewLogoSafety.className = `pill-indicator ${tone}`;
  }

  function setPreviewMeta() {
    setText(els.previewSize, `${Number(els.qrSize?.value || 480)}px`);
    setText(els.previewMode, currentPresetLabel());
  }

  function syncGradientDefaults() {
    setValue(els.solidColor, DEFAULT_COLOR);
    setValue(els.linearStart, DEFAULT_COLOR);
    setValue(els.linearEnd, DEFAULT_COLOR);
    setValue(els.radialStart, DEFAULT_COLOR);
    setValue(els.radialEnd, DEFAULT_COLOR);
  }

  function markManualColorChange() {
    if (els.autoThemeMatch?.checked) {
      state.manualColorLocked = true;
    }
  }

  function applyColors(colors, fromLogo = false) {
    if (!colors || !els.autoThemeMatch?.checked) return false;
    if (fromLogo && state.manualColorLocked) return false;

    setValue(els.solidColor, colors.primary);
    setValue(els.linearStart, colors.primary);
    setValue(els.linearEnd, colors.secondary);
    setValue(els.radialStart, colors.primary);
    setValue(els.radialEnd, colors.secondary);
    return true;
  }

  function maybeApplyLogoTheme() {
    if (!els.autoThemeMatch?.checked || !state.logoColors) return false;
    return applyColors(state.logoColors, true);
  }

  function getGradient() {
    const mode = els.gradientType?.value || 'solid';
    if (mode === 'solid') return null;
    if (mode === 'radial') {
      return {
        type: 'radial',
        colorStops: [
          { offset: 0, color: els.radialStart?.value || DEFAULT_COLOR },
          { offset: 1, color: els.radialEnd?.value || DEFAULT_COLOR },
        ],
      };
    }
    return {
      type: 'linear',
      rotation: degreesToRadians(els.gradientAngle?.value || 0),
      colorStops: [
        { offset: 0, color: els.linearStart?.value || DEFAULT_COLOR },
        { offset: 1, color: els.linearEnd?.value || DEFAULT_COLOR },
      ],
    };
  }

  function moduleType() {
    return {
      rounded: 'rounded',
      square: 'square',
      dot: 'dots',
      instagram: 'classy-rounded',
    }[els.moduleStyle?.value || 'rounded'] || 'rounded';
  }

  function cornerSquareType() {
    return {
      rounded: 'extra-rounded',
      square: 'square',
      modern: 'extra-rounded',
    }[els.finderStyle?.value || 'rounded'] || 'extra-rounded';
  }

  function cornerDotType() {
    return {
      rounded: 'rounded',
      square: 'square',
      dot: 'dots',
    }[els.cornerDotStyle?.value || 'rounded'] || 'rounded';
  }

  function hasInputForType() {
    const type = currentType();
    const map = {
      url: () => !!els.urlInput?.value.trim(),
      pdf: () => !!els.pdfInput?.value.trim(),
      image: () => !!els.imageInput?.value.trim(),
      'multi-url': () => !!els.multiUrlInput?.value.trim(),
      contact: () => !![
        els.contactName?.value.trim(),
        els.contactPhone?.value.trim(),
        els.contactEmail?.value.trim(),
        els.contactCompany?.value.trim(),
        els.contactWebsite?.value.trim(),
        els.contactAddress?.value.trim(),
      ].some(Boolean),
      email: () => !!els.emailTo?.value.trim(),
      sms: () => !!els.smsPhone?.value.trim(),
      wifi: () => !!els.wifiSsid?.value.trim(),
      store: () => !!els.storeUrl?.value.trim(),
      text: () => !!els.textInput?.value.trim(),
    };
    return (map[type] || map.text)();
  }

  function buildPayload() {
    const type = currentType();

    if (type === 'url') {
      const value = normalizeUrl(els.urlInput.value);
      if (!value) throw new Error('Enter a website URL.');
      return value;
    }

    if (type === 'pdf') {
      const value = normalizeUrl(els.pdfInput.value);
      if (!value) throw new Error('Enter a PDF link.');
      return value;
    }

    if (type === 'image') {
      const value = normalizeUrl(els.imageInput.value);
      if (!value) throw new Error('Enter an image link.');
      return value;
    }

    if (type === 'multi-url') {
      const urls = String(els.multiUrlInput.value || '')
        .split(/\r?\n/)
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map(normalizeUrl)
        .filter(Boolean);
      if (!urls.length) throw new Error('Add at least one URL.');
      return urls.join('\n');
    }

    if (type === 'contact') {
      const name = els.contactName.value.trim();
      const phone = normalizePhone(els.contactPhone.value);
      const email = els.contactEmail.value.trim();
      const company = els.contactCompany.value.trim();
      const website = normalizeUrl(els.contactWebsite.value);
      const address = els.contactAddress.value.trim();
      if (!name && !phone && !email && !company && !website && !address) {
        throw new Error('Enter at least one contact detail.');
      }

      const [firstName, ...rest] = name.split(/\s+/).filter(Boolean);
      const lastName = rest.join(' ');

      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${escapeVCard(lastName)};${escapeVCard(firstName || '')};;;`,
        `FN:${escapeVCard(name || company || phone || email)}`,
        company ? `ORG:${escapeVCard(company)}` : '',
        phone ? `TEL;TYPE=CELL:${escapeVCard(phone)}` : '',
        email ? `EMAIL:${escapeVCard(email)}` : '',
        website ? `URL:${escapeVCard(website)}` : '',
        address ? `ADR:;;${escapeVCard(address)};;;;` : '',
        'END:VCARD',
      ].filter(Boolean).join('\n');
    }

    if (type === 'email') {
      const to = els.emailTo.value.trim();
      if (!to) throw new Error('Enter an email address.');
      const params = new URLSearchParams();
      if (els.emailSubject.value.trim()) params.set('subject', els.emailSubject.value.trim());
      if (els.emailBody.value.trim()) params.set('body', els.emailBody.value.trim());
      const qs = params.toString();
      return `mailto:${to}${qs ? `?${qs}` : ''}`;
    }

    if (type === 'sms') {
      const phone = normalizePhone(els.smsPhone.value);
      if (!phone) throw new Error('Enter a phone number.');
      const message = encodeURIComponent(els.smsMessage.value.trim());
      return `SMSTO:${phone}:${decodeURIComponent(message)}`;
    }

    if (type === 'wifi') {
      const ssid = els.wifiSsid.value.trim();
      if (!ssid) throw new Error('Enter the WiFi network name.');
      const security = els.wifiSecurity.value || 'WPA';
      const hidden = els.wifiHidden.value || 'false';
      return `WIFI:T:${security};S:${escapeVCard(ssid)};P:${escapeVCard(els.wifiPassword.value.trim())};H:${hidden};;`;
    }

    if (type === 'store') {
      const value = normalizeUrl(els.storeUrl.value);
      if (!value) throw new Error('Enter a store link.');
      return value;
    }

    const text = els.textInput.value.trim();
    if (!text) throw new Error('Enter some text.');
    return text;
  }

  function getSignature() {
    return [
      currentType(),
      els.urlInput?.value, els.pdfInput?.value, els.imageInput?.value, els.multiUrlInput?.value,
      els.contactName?.value, els.contactPhone?.value, els.contactEmail?.value, els.contactCompany?.value,
      els.contactWebsite?.value, els.contactAddress?.value,
      els.emailTo?.value, els.emailSubject?.value, els.emailBody?.value,
      els.smsPhone?.value, els.smsMessage?.value,
      els.wifiSsid?.value, els.wifiPassword?.value, els.wifiSecurity?.value, els.wifiHidden?.value,
      els.storePlatform?.value, els.storeUrl?.value, els.textInput?.value,
      els.qrSize?.value, els.qrMargin?.value, els.errorCorrection?.value,
      els.moduleStyle?.value, els.finderStyle?.value, els.cornerDotStyle?.value,
      els.gradientType?.value, els.solidColor?.value, els.linearStart?.value, els.linearEnd?.value, els.gradientAngle?.value, els.radialStart?.value, els.radialEnd?.value,
      els.bgColor?.value, els.autoThemeMatch?.checked, els.stylePreset?.value, els.logoMode?.value, els.logoSize?.value,
      state.logoDataUrl ? 'logo' : 'nologo',
    ].join('|');
  }

  function getQrOptions(data, exportSize) {
    const size = exportSize || Number(els.qrSize?.value || 480);
    const useLogo = els.logoMode?.value === 'center' && !!state.logoDataUrl;
    const gradient = getGradient();
    const color = els.gradientType?.value === 'linear'
      ? (els.linearStart?.value || DEFAULT_COLOR)
      : els.gradientType?.value === 'radial'
        ? (els.radialStart?.value || DEFAULT_COLOR)
        : (els.solidColor?.value || DEFAULT_COLOR);
    const logoSizePercent = Math.min(0.24, Math.max(0.08, Number(els.logoSize?.value || 18) / 100));

    return {
      width: size,
      height: size,
      type: 'svg',
      data,
      margin: Number(els.qrMargin?.value || 16),
      qrOptions: {
        errorCorrectionLevel: els.errorCorrection?.value || 'H',
      },
      image: useLogo ? state.logoDataUrl : undefined,
      imageOptions: {
        imageSize: useLogo ? logoSizePercent : 0,
        margin: useLogo ? Math.max(4, Math.round(size * 0.02)) : 0,
        hideBackgroundDots: true,
        crossOrigin: 'anonymous',
      },
      dotsOptions: {
        type: moduleType(),
        color,
        gradient: gradient || undefined,
      },
      cornersSquareOptions: {
        type: cornerSquareType(),
        color,
        gradient: gradient || undefined,
      },
      cornersDotOptions: {
        type: cornerDotType(),
        color,
        gradient: gradient || undefined,
      },
      backgroundOptions: {
        color: els.bgColor?.value || '#ffffff',
      },
    };
  }

  function clearPreview() {
    if (els.qrcode) els.qrcode.innerHTML = '';
    if (els.emptyState) els.emptyState.classList.remove('hidden');
    state.qr = null;
  }

  function attachQr(instance) {
    state.qr = instance;
    if (els.qrcode) {
      els.qrcode.innerHTML = '';
      instance.append(els.qrcode);
    }
    if (els.emptyState) els.emptyState.classList.add('hidden');
  }

  function setLoading(isLoading) {
    if (!els.generateBtn) return;
    els.generateBtn.classList.toggle('is-loading', isLoading);
    els.generateBtn.textContent = isLoading ? 'Generating...' : 'Generate QR';
  }

  function renderNow() {
    if (!window.QRCodeStyling) {
      setStatus('Error', 'danger');
      setMessage('QR styling library failed to load.', 'error');
      return;
    }

    try {
      const payload = buildPayload();
      setLoading(true);
      const options = getQrOptions(payload);

      if (!state.qr) {
        attachQr(new QRCodeStyling(options));
      } else {
        state.qr.update(options);
        if (els.emptyState) els.emptyState.classList.add('hidden');
      }

      state.signature = getSignature();
      setStatus('Ready', 'success');
      setMessage('QR updated instantly.', 'success');
    } catch (error) {
      setStatus('Error', 'danger');
      setMessage(error?.message || 'Unable to generate the QR code.', 'error');
    } finally {
      setLoading(false);
    }
  }

  function scheduleRender() {
    if (state.renderQueued) return;
    state.renderQueued = true;
    requestAnimationFrame(() => {
      state.renderQueued = false;

      updateVisibleSections();
      updateGradientVisibility();
      updateLogoControls();
      updateIndicators();
      setPreviewMeta();

      if (!hasInputForType()) {
        clearPreview();
        state.signature = '';
        setStatus('Ready', 'neutral');
        return;
      }

      if (!state.forceRender) {
        const signature = getSignature();
        if (signature === state.signature && state.qr) return;
      }

      state.forceRender = false;
      renderNow();
    });
  }

  function escapeFilename(name) {
    return String(name || 'quick-qr')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48) || 'quick-qr';
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function waitForPaint() {
    return new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  }

  function blobToDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ''));
      reader.onerror = () => reject(reader.error || new Error('Unable to read blob.'));
      reader.readAsDataURL(blob);
    });
  }

  function blobToText(blob) {
    if (typeof blob === 'string') return Promise.resolve(blob);
    if (blob && typeof blob.text === 'function') return blob.text();
    return Promise.resolve('');
  }

  function dataUrlToImage(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Unable to load exported image.'));
      img.src = dataUrl;
    });
  }

  async function createExportInstance(scale = 4) {
    const payload = buildPayload();
    const size = Math.min(2400, Math.max(1024, Number(els.qrSize?.value || 480) * scale));
    const host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:-99999px;top:0;width:1px;height:1px;overflow:hidden;';
    document.body.appendChild(host);
    const instance = new QRCodeStyling(getQrOptions(payload, size));
    instance.append(host);
    await waitForPaint();
    return { instance, host };
  }

  async function exportQr(format) {
    const { instance, host } = await createExportInstance(4);
    try {
      return await instance.getRawData(format);
    } finally {
      host.remove();
    }
  }

  function hexToRgb(hex) {
    const value = String(hex || '#ffffff').replace('#', '');
    return [
      parseInt(value.slice(0, 2), 16) || 255,
      parseInt(value.slice(2, 4), 16) || 255,
      parseInt(value.slice(4, 6), 16) || 255,
    ];
  }

  async function downloadPng() {
    const blob = await exportQr('png');
    downloadBlob(blob, `${escapeFilename(currentType())}.png`);
    showToast('PNG downloaded', 'Your QR image is ready.', 'success');
  }

  async function downloadSvg() {
    const blob = await exportQr('svg');
    downloadBlob(blob, `${escapeFilename(currentType())}.svg`);
    showToast('SVG downloaded', 'Your vector QR is ready.', 'success');
  }

  async function downloadJpg() {
    const pngBlob = await exportQr('png');
    const dataUrl = await blobToDataUrl(pngBlob);
    const image = await dataUrlToImage(dataUrl);
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported.');
    ctx.fillStyle = els.bgColor?.value || '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('JPG export failed.'));
          return;
        }
        downloadBlob(blob, `${escapeFilename(currentType())}.jpg`);
        showToast('JPG downloaded', 'Your printable QR image is ready.', 'success');
        resolve();
      }, 'image/jpeg', 0.98);
    });
  }

  async function downloadPdf() {
    const jsPDF = window.jspdf?.jsPDF;
    if (!jsPDF) throw new Error('PDF export library failed to load.');
    const pngBlob = await exportQr('png');
    const dataUrl = await blobToDataUrl(pngBlob);
    const image = await dataUrlToImage(dataUrl);
    const pageSize = image.naturalWidth + 80;
    const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: [pageSize, pageSize], compress: true });
    pdf.setFillColor(...hexToRgb(els.bgColor?.value || '#ffffff'));
    pdf.rect(0, 0, pageSize, pageSize, 'F');
    pdf.addImage(dataUrl, 'PNG', 40, 40, image.naturalWidth, image.naturalHeight);
    pdf.save(`${escapeFilename(currentType())}.pdf`);
    showToast('PDF downloaded', 'Your QR PDF is ready.', 'success');
  }

  async function copyImageToClipboard() {
    const pngBlob = await exportQr('png');
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error('Image clipboard is not supported in this browser.');
    }
    await navigator.clipboard.write([new ClipboardItem({ [pngBlob.type || 'image/png']: pngBlob })]);
    setMessage('QR image copied to clipboard.', 'success');
    showToast('Copied', 'QR image copied to clipboard.', 'success');
  }

  async function copyPayloadToClipboard() {
    const payload = buildPayload();
    await navigator.clipboard.writeText(payload);
    setMessage('Payload copied to clipboard.', 'success');
    showToast('Copied', 'QR payload copied to clipboard.', 'success');
  }

  async function printQr() {
    const svgBlob = await exportQr('svg');
    const svgText = await blobToText(svgBlob);
    const win = window.open('', '_blank', 'width=820,height=900');
    if (!win) throw new Error('Pop-up blocked. Allow pop-ups to print the QR.');

    win.document.open();
    win.document.write(`<!doctype html><html><head><meta charset="utf-8" /><title>Print QR</title><style>
      html,body{margin:0;height:100%;display:grid;place-items:center;background:${els.bgColor?.value || '#ffffff'};}
      .frame{width:min(88vw,720px);padding:24px;background:white;border-radius:24px;box-shadow:0 20px 40px rgba(0,0,0,.12);display:grid;place-items:center;}
      svg{width:100%;height:auto;display:block;}
    </style></head><body><div class="frame">${svgText}</div><script>
      window.onload=function(){window.focus();window.print();window.onafterprint=function(){window.close();};};
    <\/script></body></html>`);
    win.document.close();
    showToast('Print ready', 'A print window has been opened.', 'success');
  }

  function prettyBytes(bytes) {
    if (!Number.isFinite(bytes)) return '';
    if (bytes < 1024) return `${bytes} B`;
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(kb >= 10 ? 0 : 1)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  }

  function analyzeLogoColors(dataUrl) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 64;
          canvas.height = 64;
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (!ctx) {
            resolve({ primary: DEFAULT_COLOR, secondary: DEFAULT_COLOR });
            return;
          }

          ctx.drawImage(img, 0, 0, 64, 64);
          const { data } = ctx.getImageData(0, 0, 64, 64);
          const samples = [];

          for (let i = 0; i < data.length; i += 16) {
            if (data[i + 3] < 48) continue;
            samples.push([data[i], data[i + 1], data[i + 2]]);
          }

          if (!samples.length) {
            resolve({ primary: DEFAULT_COLOR, secondary: DEFAULT_COLOR });
            return;
          }

          const toHex = (rgb) => `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
          const quantize = (rgb) => rgb.map((v) => Math.max(0, Math.min(255, Math.round(v / 32) * 32)));
          const distance = (a, b) => Math.sqrt(((a[0] - b[0]) ** 2) + ((a[1] - b[1]) ** 2) + ((a[2] - b[2]) ** 2));
          const palette = new Map();

          samples.forEach((rgb) => {
            const key = quantize(rgb).join(',');
            palette.set(key, (palette.get(key) || 0) + 1);
          });

          const ranked = [...palette.entries()]
            .sort((a, b) => b[1] - a[1])
            .map(([key]) => key.split(',').map(Number));

          const primary = ranked[0] || [0, 0, 0];
          const secondary = ranked.find((rgb) => distance(rgb, primary) > 32) || primary;
          resolve({ primary: toHex(primary), secondary: toHex(secondary) });
        } catch {
          resolve({ primary: DEFAULT_COLOR, secondary: DEFAULT_COLOR });
        }
      };
      img.onerror = () => resolve({ primary: DEFAULT_COLOR, secondary: DEFAULT_COLOR });
      img.src = dataUrl;
    });
  }

  async function handleLogoFile(file) {
    if (!file) return;
    const allowed = new Set(['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']);
    if (!allowed.has(file.type)) {
      setMessage('Please upload a PNG, JPG, or SVG logo.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      state.logoDataUrl = String(reader.result || '');
      state.logoMeta = { name: file.name, type: file.type, size: file.size };
      state.logoColors = await analyzeLogoColors(state.logoDataUrl);

      if (els.logoPreview) {
        els.logoPreview.src = state.logoDataUrl;
        els.logoPreview.alt = file.name;
        els.logoPreview.classList.remove('hidden');
      }

      setValue(els.logoInfo, `${file.name} - ${prettyBytes(file.size)}`);
      if (els.autoThemeMatch?.checked) {
        state.manualColorLocked = false;
        maybeApplyLogoTheme();
      }
      state.forceRender = true;
      scheduleRender();
      setMessage('Logo uploaded.', 'success');
      showToast('Logo uploaded', 'The center logo is ready.', 'success');
    };
    reader.onerror = () => setMessage('Failed to read the logo file.', 'error');
    reader.readAsDataURL(file);
  }

  function removeLogo(silent = false) {
    state.logoDataUrl = '';
    state.logoMeta = null;
    state.logoColors = null;
    setValue(els.logoUpload, '');
    if (els.logoPreview) {
      els.logoPreview.src = '';
      els.logoPreview.classList.add('hidden');
    }
    setValue(els.logoInfo, '');
    if (!silent) {
      setMessage('Logo removed.', 'success');
      showToast('Logo removed', 'The preview no longer includes a center logo.', 'success');
    }
    state.forceRender = true;
    scheduleRender();
  }

  function applyPreset(name) {
    const preset = PRESETS[name];
    if (!preset) return;
    Object.entries(preset).forEach(([key, value]) => {
      if (els[key]) els[key].value = value;
    });
    updateGradientVisibility();
  }

  function resetAll() {
    setValue(els.contentType, 'url');
    [
      els.urlInput, els.pdfInput, els.imageInput, els.multiUrlInput, els.contactName, els.contactPhone,
      els.contactEmail, els.contactCompany, els.contactWebsite, els.contactAddress, els.emailTo,
      els.emailSubject, els.emailBody, els.smsPhone, els.smsMessage, els.wifiSsid, els.wifiPassword,
      els.storeUrl, els.textInput,
    ].forEach((el) => setValue(el, ''));
    setValue(els.wifiSecurity, 'WPA');
    setValue(els.wifiHidden, 'false');
    setValue(els.storePlatform, 'app-store');
    setValue(els.qrSize, '480');
    setValue(els.qrMargin, '16');
    setValue(els.errorCorrection, 'H');
    setValue(els.moduleStyle, 'rounded');
    setValue(els.finderStyle, 'rounded');
    setValue(els.cornerDotStyle, 'rounded');
    setValue(els.gradientType, 'solid');
    setValue(els.gradientAngle, '135');
    syncGradientDefaults();
    setValue(els.bgColor, '#ffffff');
    if (els.autoThemeMatch) els.autoThemeMatch.checked = true;
    setValue(els.stylePreset, 'premium');
    setValue(els.logoMode, 'none');
    setValue(els.logoSize, '18');
    state.manualColorLocked = false;
    state.forceRender = true;
    removeLogo(true);
    updateVisibleSections();
    updateGradientVisibility();
    updateLogoControls();
    updateIndicators();
    setPreviewMeta();
    setStatus('Ready', 'neutral');
    setMessage('All fields reset.', 'success');
    showToast('Reset complete', 'Your QR workspace is back to defaults.', 'success');
    scheduleRender();
  }

  function bindLiveUpdates() {
    liveInputs.forEach((input) => {
      input.addEventListener('input', () => {
        if (colorInputs.includes(input)) markManualColorChange();
        if (input === els.stylePreset) applyPreset(els.stylePreset.value);
        if (input === els.autoThemeMatch && els.autoThemeMatch.checked) {
          state.manualColorLocked = false;
          maybeApplyLogoTheme();
        }
        if (input === els.logoMode) updateLogoControls();
        if (input === els.gradientType) updateGradientVisibility();
        if (input === els.contentType) updateVisibleSections();
        state.forceRender = true;
        scheduleRender();
      });

      input.addEventListener('change', () => {
        if (input === els.stylePreset) applyPreset(els.stylePreset.value);
        if (input === els.autoThemeMatch && els.autoThemeMatch.checked) {
          state.manualColorLocked = false;
          maybeApplyLogoTheme();
        }
        if (input === els.logoMode) updateLogoControls();
        if (input === els.gradientType) updateGradientVisibility();
        if (input === els.contentType) updateVisibleSections();
        state.forceRender = true;
        scheduleRender();
      });
    });
  }

  function bindLogoDropzone() {
    const openPicker = () => {
      if (els.logoUpload) els.logoUpload.click();
    };

    if (els.browseLogoBtn) els.browseLogoBtn.addEventListener('click', openPicker);
    if (els.replaceLogoBtn) {
      els.replaceLogoBtn.addEventListener('click', () => {
        if (els.logoUpload) els.logoUpload.value = '';
        openPicker();
      });
    }
    if (els.removeLogoBtn) els.removeLogoBtn.addEventListener('click', () => removeLogo(false));
    if (els.logoUpload) els.logoUpload.addEventListener('change', (event) => handleLogoFile(event.target.files?.[0]));
    if (!els.logoDropzone) return;

    els.logoDropzone.addEventListener('click', openPicker);
    els.logoDropzone.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPicker();
      }
    });

    ['dragenter', 'dragover'].forEach((eventName) => {
      els.logoDropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        event.stopPropagation();
        els.logoDropzone.classList.add('drag-over');
      });
    });

    ['dragleave', 'drop'].forEach((eventName) => {
      els.logoDropzone.addEventListener(eventName, (event) => {
        event.preventDefault();
        event.stopPropagation();
        els.logoDropzone.classList.remove('drag-over');
      });
    });

    els.logoDropzone.addEventListener('drop', (event) => {
      const file = event.dataTransfer?.files?.[0];
      if (file) handleLogoFile(file);
    });
  }

  function bindActions() {
    if (els.themeToggle) {
      els.themeToggle.addEventListener('click', () => {
        const next = state.theme === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        showToast('Theme updated', `${next === 'dark' ? 'Dark' : 'Light'} mode is active.`, 'success');
      });
    }

    if (els.generateBtn) {
      els.generateBtn.addEventListener('click', () => {
        state.forceRender = true;
        renderNow();
      });
    }

    if (els.copyTextBtn) els.copyTextBtn.addEventListener('click', () => copyPayloadToClipboard().catch((err) => setMessage(err?.message || 'Unable to copy payload.', 'error')));
    if (els.resetBtn) els.resetBtn.addEventListener('click', resetAll);
    if (els.downloadPngBtn) els.downloadPngBtn.addEventListener('click', () => downloadPng().catch((err) => setMessage(err?.message || 'Unable to export PNG.', 'error')));
    if (els.downloadSvgBtn) els.downloadSvgBtn.addEventListener('click', () => downloadSvg().catch((err) => setMessage(err?.message || 'Unable to export SVG.', 'error')));
    if (els.downloadJpgBtn) els.downloadJpgBtn.addEventListener('click', () => downloadJpg().catch((err) => setMessage(err?.message || 'Unable to export JPG.', 'error')));
    if (els.downloadPdfBtn) els.downloadPdfBtn.addEventListener('click', () => downloadPdf().catch((err) => setMessage(err?.message || 'Unable to export PDF.', 'error')));
    if (els.copyImageBtn) els.copyImageBtn.addEventListener('click', () => copyImageToClipboard().catch((err) => setMessage(err?.message || 'Unable to copy QR image.', 'error')));
    if (els.printBtn) els.printBtn.addEventListener('click', () => printQr().catch((err) => setMessage(err?.message || 'Unable to print QR.', 'error')));
  }

  function bootstrap() {
    applyTheme(state.theme);
    syncGradientDefaults();
    updateVisibleSections();
    updateGradientVisibility();
    updateLogoControls();
    updateIndicators();
    setPreviewMeta();
    setMessage('Start typing to generate a QR instantly.', 'success');
    bindLiveUpdates();
    bindLogoDropzone();
    bindActions();
    scheduleRender();
  }

  bootstrap();
})();
