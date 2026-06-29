const els = {
  themeToggle: document.getElementById('themeToggle'),
  statusBadge: document.getElementById('statusBadge'),
  typeHint: document.getElementById('typeHint'),
  contentType: document.getElementById('contentType'),
  urlInput: document.getElementById('urlInput'),
  pdfInput: document.getElementById('pdfInput'),
  imageInput: document.getElementById('imageInput'),
  multiUrlInput: document.getElementById('multiUrlInput'),
  contactFirstName: document.getElementById('contactFirstName'),
  contactLastName: document.getElementById('contactLastName'),
  contactOrg: document.getElementById('contactOrg'),
  contactTitle: document.getElementById('contactTitle'),
  contactPhone: document.getElementById('contactPhone'),
  contactEmail: document.getElementById('contactEmail'),
  contactWebsite: document.getElementById('contactWebsite'),
  contactAddress: document.getElementById('contactAddress'),
  emailTo: document.getElementById('emailTo'),
  emailSubject: document.getElementById('emailSubject'),
  emailBody: document.getElementById('emailBody'),
  smsPhone: document.getElementById('smsPhone'),
  smsMessage: document.getElementById('smsMessage'),
  wifiSsid: document.getElementById('wifiSsid'),
  wifiPassword: document.getElementById('wifiPassword'),
  wifiSecurity: document.getElementById('wifiSecurity'),
  wifiHidden: document.getElementById('wifiHidden'),
  storePlatform: document.getElementById('storePlatform'),
  storeUrl: document.getElementById('storeUrl'),
  textInput: document.getElementById('textInput'),
  qrSize: document.getElementById('qrSize'),
  qrMargin: document.getElementById('qrMargin'),
  errorCorrection: document.getElementById('errorCorrection'),
  moduleStyle: document.getElementById('moduleStyle'),
  finderStyle: document.getElementById('finderStyle'),
  cornerDotStyle: document.getElementById('cornerDotStyle'),
  gradientMode: document.getElementById('gradientMode'),
  solidGroup: document.getElementById('solidGroup'),
  linearGroup: document.getElementById('linearGroup'),
  radialGroup: document.getElementById('radialGroup'),
  fgColor: document.getElementById('fgColor'),
  gradientStart: document.getElementById('gradientStart'),
  gradientEnd: document.getElementById('gradientEnd'),
  gradientAngle: document.getElementById('gradientAngle'),
  gradientCenter: document.getElementById('gradientCenter'),
  gradientOuter: document.getElementById('gradientOuter'),
  bgColor: document.getElementById('bgColor'),
  autoThemeMatch: document.getElementById('autoThemeMatch'),
  stylePreset: document.getElementById('stylePreset'),
  logoMode: document.getElementById('logoMode'),
  logoControls: document.getElementById('logoControls'),
  logoDropzone: document.getElementById('logoDropzone'),
  logoUpload: document.getElementById('logoUpload'),
  browseLogoBtn: document.getElementById('browseLogoBtn'),
  replaceLogoBtn: document.getElementById('replaceLogoBtn'),
  removeLogoBtn: document.getElementById('removeLogoBtn'),
  createLogoQrBtn: document.getElementById('createLogoQrBtn'),
  logoPreview: document.getElementById('logoPreview'),
  logoSize: document.getElementById('logoSize'),
  logoInfo: document.getElementById('logoInfo'),
  logoSafety: document.getElementById('logoSafety'),
  scanQuality: document.getElementById('scanQuality'),
  qrcode: document.getElementById('qrcode'),
  emptyState: document.getElementById('emptyState'),
  previewSize: document.getElementById('previewSize'),
  previewLogoSafety: document.getElementById('previewLogoSafety'),
  previewScanQuality: document.getElementById('previewScanQuality'),
  previewMode: document.getElementById('previewMode'),
  generateBtn: document.getElementById('generateBtn'),
  copyTextBtn: document.getElementById('copyTextBtn'),
  resetBtn: document.getElementById('resetBtn'),
  downloadPngBtn: document.getElementById('downloadPngBtn'),
  downloadSvgBtn: document.getElementById('downloadSvgBtn'),
  downloadJpgBtn: document.getElementById('downloadJpgBtn'),
  downloadPdfBtn: document.getElementById('downloadPdfBtn'),
  copyImageBtn: document.getElementById('copyImageBtn'),
  printBtn: document.getElementById('printBtn'),
  message: document.getElementById('message'),
  toastStack: document.getElementById('toastStack'),
};

const THEME_KEY = 'quick-qr-theme-v3';
const TYPE_HINTS = {
  url: 'URLs are normalized automatically.',
  pdf: 'Paste a PDF link. We generate a QR for the file URL.',
  image: 'Paste an image link. The QR will point to the image URL.',
  'multi-url': 'One URL per line, each normalized for you.',
  contact: 'This creates a vCard contact payload.',
  email: 'We format a mailto link with subject and body.',
  sms: 'We format an SMS payload from the phone and message.',
  wifi: 'This creates a standard WIFI payload.',
  store: 'Use an App Store or Play Store link.',
  text: 'Plain text is encoded as-is.',
};

const PRESETS = {
  premium: {
    moduleStyle: 'rounded',
    finderStyle: 'rounded',
    cornerDotStyle: 'rounded',
    gradientMode: 'linear',
    fgColor: '#0f172a',
    bgColor: '#ffffff',
    gradientStart: '#0f172a',
    gradientEnd: '#7c3aed',
    gradientAngle: '135',
    gradientCenter: '#0f172a',
    gradientOuter: '#7c3aed',
  },
  square: {
    moduleStyle: 'square',
    finderStyle: 'square',
    cornerDotStyle: 'square',
    gradientMode: 'solid',
    fgColor: '#0f172a',
    bgColor: '#f8fafc',
  },
  dot: {
    moduleStyle: 'dot',
    finderStyle: 'modern',
    cornerDotStyle: 'dot',
    gradientMode: 'radial',
    fgColor: '#0f172a',
    bgColor: '#ffffff',
    gradientStart: '#0f172a',
    gradientEnd: '#7c3aed',
    gradientCenter: '#0f172a',
    gradientOuter: '#7c3aed',
  },
  instagram: {
    moduleStyle: 'instagram',
    finderStyle: 'rounded',
    cornerDotStyle: 'rounded',
    gradientMode: 'linear',
    fgColor: '#f58529',
    bgColor: '#ffffff',
    gradientStart: '#f58529',
    gradientEnd: '#dd2a7b',
    gradientAngle: '125',
    gradientCenter: '#f58529',
    gradientOuter: '#dd2a7b',
  },
};

const state = {
  theme: localStorage.getItem(THEME_KEY) || 'dark',
  qr: null,
  signature: '',
  renderQueued: false,
  isRendering: false,
  logoDataUrl: '',
  logoMeta: null,
  logoColors: null,
  logoMode: 'none',
  colorTouched: false,
};

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function setMessage(text, tone = '') {
  els.message.textContent = text;
  els.message.className = ['message', tone].filter(Boolean).join(' ');
}

function showToast(title, text, tone = 'success') {
  const node = document.createElement('div');
  node.className = `toast ${tone}`;
  node.innerHTML = `<span class="toast-title">${escapeHtml(title)}</span><span class="toast-text">${escapeHtml(text)}</span>`;
  els.toastStack.appendChild(node);
  setTimeout(() => {
    node.style.opacity = '0';
    node.style.transform = 'translateY(10px)';
    node.style.transition = 'opacity 180ms ease, transform 180ms ease';
    setTimeout(() => node.remove(), 220);
  }, 2400);
}

function setStatus(text, tone = 'neutral') {
  els.statusBadge.textContent = text;
  els.statusBadge.dataset.tone = tone;
}

function applyTheme(theme) {
  state.theme = theme;
  document.documentElement.dataset.theme = theme;
  localStorage.setItem(THEME_KEY, theme);
  els.themeToggle.textContent = theme === 'dark' ? 'Light Mode' : 'Dark Mode';
}

function normalizeUrl(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return '';
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

function normalizePhone(value) {
  return String(value || '').trim().replace(/[^\d+]/g, '').replace(/^00/, '+');
}

function escapeVCard(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function currentType() {
  return els.contentType.value;
}

function updateTypeHint() {
  els.typeHint.textContent = TYPE_HINTS[currentType()] || '';
}

function updateVisibleSections() {
  document.querySelectorAll('[data-type-section]').forEach(section => {
    section.hidden = section.dataset.typeSection !== currentType();
  });
  updateTypeHint();
}

function updateGradientVisibility() {
  const mode = els.gradientMode.value;
  els.solidGroup.hidden = mode !== 'solid';
  els.linearGroup.hidden = mode !== 'linear';
  els.radialGroup.hidden = mode !== 'radial';
}

function updateLogoControls() {
  els.logoControls.classList.toggle('hidden', els.logoMode.value !== 'center');
}

function isCurrentColorDefault() {
  return (
    els.fgColor.value === '#0f172a' &&
    els.bgColor.value === '#ffffff' &&
    els.gradientStart.value === '#0f172a' &&
    els.gradientEnd.value === '#7c3aed' &&
    els.gradientCenter.value === '#0f172a' &&
    els.gradientOuter.value === '#7c3aed'
  );
}

function applyLogoTheme(colors) {
  if (!els.autoThemeMatch.checked || !colors || state.colorTouched) return;
  if (isCurrentColorDefault()) {
    els.fgColor.value = colors.primary;
    els.gradientStart.value = colors.primary;
    els.gradientEnd.value = colors.secondary;
    els.gradientCenter.value = colors.primary;
    els.gradientOuter.value = colors.secondary;
  }
}

function markColorTouched() {
  state.colorTouched = true;
}

function detectLogoSafety() {
  const size = Number(els.logoSize.value || 18);
  const margin = Number(els.qrMargin.value || 16);
  const correction = els.errorCorrection.value;

  if (size > 24 || margin < 8 || correction === 'L') {
    return { tone: 'warning', label: 'Caution', scan: 'Low' };
  }
  if (size > 20 || correction === 'M') {
    return { tone: 'warning', label: 'Balanced', scan: 'Balanced' };
  }
  return { tone: 'safe', label: 'Protected', scan: 'High' };
}

function updateIndicators() {
  const safety = detectLogoSafety();
  els.logoSafety.textContent = safety.label;
  els.previewLogoSafety.textContent = safety.label;
  els.scanQuality.textContent = safety.scan;
  els.previewScanQuality.textContent = safety.scan;
  els.logoSafety.className = `pill-indicator ${safety.tone}`;
  els.previewLogoSafety.className = `pill-indicator ${safety.tone}`;
}

function setPreviewSize() {
  els.previewSize.textContent = `${Number(els.qrSize.value || 480)}px`;
  els.previewMode.textContent = {
    premium: 'Premium Rounded',
    square: 'Clean Square',
    dot: 'Dot Grid',
    instagram: 'Instagram-style',
  }[els.stylePreset.value] || 'Custom';
}

function getForegroundColor() {
  return els.fgColor.value;
}

function getGradient() {
  const mode = els.gradientMode.value;
  if (mode === 'solid') return null;
  if (mode === 'radial') {
    return {
      type: 'radial',
      colorStops: [
        { offset: 0, color: els.gradientCenter.value },
        { offset: 1, color: els.gradientOuter.value },
      ],
    };
  }
  return {
    type: 'linear',
    rotation: Number(els.gradientAngle.value || 0),
    colorStops: [
      { offset: 0, color: els.gradientStart.value },
      { offset: 1, color: els.gradientEnd.value },
    ],
  };
}

function moduleType() {
  return {
    rounded: 'rounded',
    square: 'square',
    dot: 'dots',
    instagram: 'classy-rounded',
  }[els.moduleStyle.value] || 'rounded';
}

function cornerSquareType() {
  return {
    rounded: 'extra-rounded',
    square: 'square',
    modern: 'extra-rounded',
  }[els.finderStyle.value] || 'extra-rounded';
}

function cornerDotType() {
  return {
    rounded: 'rounded',
    square: 'square',
    dot: 'dots',
  }[els.cornerDotStyle.value] || 'rounded';
}

function hasInputForType() {
  const t = currentType();
  if (t === 'url') return !!els.urlInput.value.trim();
  if (t === 'pdf') return !!els.pdfInput.value.trim();
  if (t === 'image') return !!els.imageInput.value.trim();
  if (t === 'multi-url') return !!els.multiUrlInput.value.trim();
  if (t === 'contact') {
    return !!(
      els.contactFirstName.value.trim() ||
      els.contactLastName.value.trim() ||
      els.contactOrg.value.trim() ||
      els.contactEmail.value.trim() ||
      els.contactPhone.value.trim()
    );
  }
  if (t === 'email') return !!els.emailTo.value.trim();
  if (t === 'sms') return !!els.smsPhone.value.trim();
  if (t === 'wifi') return !!els.wifiSsid.value.trim();
  if (t === 'store') return !!els.storeUrl.value.trim();
  return !!els.textInput.value.trim();
}

function allInputsEmpty() {
  return [
    els.urlInput.value,
    els.pdfInput.value,
    els.imageInput.value,
    els.multiUrlInput.value,
    els.contactFirstName.value,
    els.contactLastName.value,
    els.contactOrg.value,
    els.contactTitle.value,
    els.contactPhone.value,
    els.contactEmail.value,
    els.contactWebsite.value,
    els.contactAddress.value,
    els.emailTo.value,
    els.emailSubject.value,
    els.emailBody.value,
    els.smsPhone.value,
    els.smsMessage.value,
    els.wifiSsid.value,
    els.wifiPassword.value,
    els.storeUrl.value,
    els.textInput.value,
    state.logoDataUrl,
  ].every(v => !String(v || '').trim());
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
    const urls = els.multiUrlInput.value.split(/\r?\n/).map(v => v.trim()).filter(Boolean);
    if (!urls.length) throw new Error('Add at least one URL.');
    return urls.map(normalizeUrl).join('\n');
  }

  if (type === 'contact') {
    const firstName = els.contactFirstName.value.trim();
    const lastName = els.contactLastName.value.trim();
    const org = els.contactOrg.value.trim();
    const fullName = `${firstName} ${lastName}`.trim() || org;
    if (!fullName) throw new Error('Enter at least a name or organization.');
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`,
      `FN:${escapeVCard(fullName)}`,
      org ? `ORG:${escapeVCard(org)}` : '',
      els.contactTitle.value.trim() ? `TITLE:${escapeVCard(els.contactTitle.value)}` : '',
      els.contactPhone.value.trim() ? `TEL;TYPE=CELL:${escapeVCard(normalizePhone(els.contactPhone.value))}` : '',
      els.contactEmail.value.trim() ? `EMAIL:${escapeVCard(els.contactEmail.value.trim())}` : '',
      els.contactWebsite.value.trim() ? `URL:${escapeVCard(normalizeUrl(els.contactWebsite.value))}` : '',
      els.contactAddress.value.trim() ? `ADR:;;${escapeVCard(els.contactAddress.value)};;;;` : '',
      'END:VCARD',
    ].filter(Boolean).join('\n');
  }

  if (type === 'email') {
    const to = els.emailTo.value.trim();
    if (!to) throw new Error('Enter an email address.');
    const params = new URLSearchParams();
    if (els.emailSubject.value.trim()) params.set('subject', els.emailSubject.value.trim());
    if (els.emailBody.value.trim()) params.set('body', els.emailBody.value.trim());
    const query = params.toString();
    return `mailto:${to}${query ? `?${query}` : ''}`;
  }

  if (type === 'sms') {
    const phone = normalizePhone(els.smsPhone.value);
    if (!phone) throw new Error('Enter a phone number.');
    return `SMSTO:${phone}:${els.smsMessage.value.trim()}`;
  }

  if (type === 'wifi') {
    const ssid = els.wifiSsid.value.trim();
    if (!ssid) throw new Error('Enter the WiFi network name.');
    return `WIFI:T:${els.wifiSecurity.value};S:${escapeVCard(ssid)};P:${escapeVCard(els.wifiPassword.value.trim())};H:${els.wifiHidden.value};;`;
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

function getPayloadSignature() {
  return [
    currentType(),
    els.urlInput.value,
    els.pdfInput.value,
    els.imageInput.value,
    els.multiUrlInput.value,
    els.contactFirstName.value,
    els.contactLastName.value,
    els.contactOrg.value,
    els.contactTitle.value,
    els.contactPhone.value,
    els.contactEmail.value,
    els.contactWebsite.value,
    els.contactAddress.value,
    els.emailTo.value,
    els.emailSubject.value,
    els.emailBody.value,
    els.smsPhone.value,
    els.smsMessage.value,
    els.wifiSsid.value,
    els.wifiPassword.value,
    els.wifiSecurity.value,
    els.wifiHidden.value,
    els.storePlatform.value,
    els.storeUrl.value,
    els.textInput.value,
    els.qrSize.value,
    els.qrMargin.value,
    els.errorCorrection.value,
    els.moduleStyle.value,
    els.finderStyle.value,
    els.cornerDotStyle.value,
    els.gradientMode.value,
    els.fgColor.value,
    els.gradientStart.value,
    els.gradientEnd.value,
    els.gradientAngle.value,
    els.gradientCenter.value,
    els.gradientOuter.value,
    els.bgColor.value,
    els.autoThemeMatch.checked,
    els.stylePreset.value,
    els.logoMode.value,
    els.logoSize.value,
    state.logoDataUrl ? 'logo' : 'nologo',
    state.logoMode,
  ].join('|');
}

function getQrOptions(data, exportSize) {
  const size = exportSize || Number(els.qrSize.value || 480);
  const logoSizePercent = Math.min(0.24, Math.max(0.08, Number(els.logoSize.value || 18) / 100));
  const useLogo = els.logoMode.value === 'center' && !!state.logoDataUrl;

  return {
    width: size,
    height: size,
    type: 'svg',
    data,
    margin: Number(els.qrMargin.value || 16),
    qrOptions: {
      errorCorrectionLevel: els.errorCorrection.value,
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
      color: els.gradientMode.value === 'solid' ? getForegroundColor() : undefined,
      gradient: getGradient() || undefined,
    },
    cornersSquareOptions: {
      type: cornerSquareType(),
      color: getForegroundColor(),
    },
    cornersDotOptions: {
      type: cornerDotType(),
      color: getForegroundColor(),
    },
    backgroundOptions: {
      color: els.bgColor.value,
    },
  };
}

function setLoading(loading) {
  state.isRendering = loading;
  els.generateBtn.classList.toggle('is-loading', loading);
  els.generateBtn.textContent = loading ? 'Generating...' : 'Generate QR';
}

function clearPreview() {
  els.qrcode.innerHTML = '';
  state.qr = null;
  els.emptyState.classList.remove('hidden');
}

function attachQrInstance(instance) {
  state.qr = instance;
  els.qrcode.innerHTML = '';
  instance.append(els.qrcode);
  els.emptyState.classList.add('hidden');
}

function renderQr() {
  const payload = buildPayload();
  const options = getQrOptions(payload);
  setLoading(true);
  setStatus('Rendering', 'neutral');
  try {
    if (!state.qr) {
      attachQrInstance(new QRCodeStyling(options));
    } else {
      state.qr.update(options);
    }
    state.signature = getPayloadSignature();
    setStatus('Ready', 'success');
    setMessage('QR updated instantly.', 'success');
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
    setPreviewSize();

    try {
      if (!hasInputForType()) {
        clearPreview();
        state.signature = '';
        setStatus('Ready', 'neutral');
        return;
      }

      const payload = buildPayload();
      const sig = getPayloadSignature();
      if (sig === state.signature && state.qr && !state.isRendering) return;

      const options = getQrOptions(payload);
      if (!state.qr) {
        attachQrInstance(new QRCodeStyling(options));
      } else {
        state.qr.update(options);
        els.emptyState.classList.add('hidden');
      }
      state.signature = sig;
      setStatus('Ready', 'success');
      setMessage('QR updated instantly.', 'success');
    } catch (error) {
      if (!hasInputForType()) clearPreview();
      setStatus('Error', 'danger');
      setMessage(error?.message || 'Unable to generate the QR code.', 'error');
    }
  });
}

function openFilePicker() {
  els.logoUpload.click();
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
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function dataUrlToImage(dataUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

async function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function blobToText(blob) {
  if (typeof blob === 'string') return blob;
  if (blob && typeof blob.text === 'function') return blob.text();
  return '';
}

async function waitForPaint() {
  await new Promise(resolve => requestAnimationFrame(resolve));
  await new Promise(resolve => requestAnimationFrame(resolve));
}

async function createExportInstance(scale = 3) {
  const data = buildPayload();
  const size = Math.min(2400, Math.max(1024, Number(els.qrSize.value || 480) * scale));
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:-99999px;top:0;width:1px;height:1px;overflow:hidden;';
  document.body.appendChild(host);
  const instance = new QRCodeStyling(getQrOptions(data, size));
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

async function downloadPng() {
  try {
    const blob = await exportQr('png');
    downloadBlob(blob, `${escapeFilename(currentType())}.png`);
    showToast('PNG downloaded', 'Your QR image is ready.', 'success');
  } catch (error) {
    setMessage(error?.message || 'Unable to export PNG.', 'error');
    showToast('Export failed', 'PNG export could not be completed.', 'error');
  }
}

async function downloadSvg() {
  try {
    const blob = await exportQr('svg');
    downloadBlob(blob, `${escapeFilename(currentType())}.svg`);
    showToast('SVG downloaded', 'Your vector QR is ready.', 'success');
  } catch (error) {
    setMessage(error?.message || 'Unable to export SVG.', 'error');
  }
}

async function downloadJpg() {
  try {
    const pngBlob = await exportQr('png');
    const dataUrl = await blobToDataUrl(pngBlob);
    const image = await dataUrlToImage(dataUrl);
    const canvas = document.createElement('canvas');
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = els.bgColor.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return setMessage('JPG export failed.', 'error');
      downloadBlob(blob, `${escapeFilename(currentType())}.jpg`);
      showToast('JPG downloaded', 'Your printable QR image is ready.', 'success');
    }, 'image/jpeg', 0.98);
  } catch (error) {
    setMessage(error?.message || 'Unable to export JPG.', 'error');
  }
}

async function downloadPdf() {
  try {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) throw new Error('PDF export library failed to load.');
    const pngBlob = await exportQr('png');
    const dataUrl = await blobToDataUrl(pngBlob);
    const image = await dataUrlToImage(dataUrl);
    const pageSize = image.naturalWidth + 80;
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'px',
      format: [pageSize, pageSize],
      compress: true,
    });
    pdf.setFillColor(...hexToRgb(els.bgColor.value));
    pdf.rect(0, 0, pageSize, pageSize, 'F');
    pdf.addImage(dataUrl, 'PNG', 40, 40, image.naturalWidth, image.naturalHeight);
    pdf.save(`${escapeFilename(currentType())}.pdf`);
    showToast('PDF downloaded', 'Your QR PDF is ready.', 'success');
  } catch (error) {
    setMessage(error?.message || 'Unable to export PDF.', 'error');
    showToast('Export failed', 'PDF export could not be completed.', 'error');
  }
}

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return [
    parseInt(value.slice(0, 2), 16) || 255,
    parseInt(value.slice(2, 4), 16) || 255,
    parseInt(value.slice(4, 6), 16) || 255,
  ];
}

async function copyImageToClipboard() {
  try {
    const pngBlob = await exportQr('png');
    if (!navigator.clipboard || !window.ClipboardItem) throw new Error('Image clipboard is not supported in this browser.');
    await navigator.clipboard.write([new ClipboardItem({ [pngBlob.type || 'image/png']: pngBlob })]);
    setMessage('QR image copied to clipboard.', 'success');
    showToast('Copied', 'QR image copied to clipboard.', 'success');
  } catch (error) {
    setMessage(error?.message || 'Unable to copy QR image.', 'error');
    showToast('Copy failed', 'Could not copy the QR image.', 'error');
  }
}

async function copyPayloadToClipboard() {
  try {
    const payload = buildPayload();
    await navigator.clipboard.writeText(payload);
    setMessage('Payload copied to clipboard.', 'success');
    showToast('Copied', 'QR payload copied to clipboard.', 'success');
  } catch (error) {
    setMessage(error?.message || 'Unable to copy payload.', 'error');
  }
}

async function printQr() {
  try {
    const svgBlob = await exportQr('svg');
    const svgText = await blobToText(svgBlob);
    const win = window.open('', '_blank', 'width=820,height=900');
    if (!win) throw new Error('Pop-up blocked. Allow pop-ups to print the QR.');
    win.document.open();
    win.document.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Print QR</title>
  <style>
    html, body { margin: 0; height: 100%; display: grid; place-items: center; background: ${els.bgColor.value}; }
    .frame { width: min(88vw, 720px); padding: 24px; background: white; border-radius: 24px; box-shadow: 0 20px 40px rgba(0,0,0,.12); display: grid; place-items: center; }
    svg { width: 100%; height: auto; display: block; }
  </style>
</head>
<body>
  <div class="frame">${svgText}</div>
  <script>window.onload = function(){ window.focus(); window.print(); window.onafterprint = function(){ window.close(); }; };</script>
</body>
</html>`);
    win.document.close();
    showToast('Print ready', 'A print window has been opened.', 'success');
  } catch (error) {
    setMessage(error?.message || 'Unable to print QR.', 'error');
  }
}

function prettyBytes(bytes) {
  if (!Number.isFinite(bytes)) return '';
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(kb >= 10 ? 0 : 1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function analyzeLogoColors(dataUrl) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, 64, 64);
        const { data } = ctx.getImageData(0, 0, 64, 64);
        const samples = [];
        for (let i = 0; i < data.length; i += 16) {
          if (data[i + 3] < 48) continue;
          samples.push([data[i], data[i + 1], data[i + 2]]);
        }
        if (!samples.length) return resolve({ primary: '#0f172a', secondary: '#7c3aed' });
        const avg = samples.reduce((acc, rgb) => {
          acc[0] += rgb[0];
          acc[1] += rgb[1];
          acc[2] += rgb[2];
          return acc;
        }, [0, 0, 0]).map(v => Math.round(v / samples.length));
        const darkest = samples.reduce((best, rgb) => {
          const lum = rgb[0] * 0.299 + rgb[1] * 0.587 + rgb[2] * 0.114;
          return lum < best.lum ? { rgb, lum } : best;
        }, { rgb: avg, lum: Infinity }).rgb;
        const shift = rgb => rgb.map(v => Math.max(0, Math.min(255, Math.round(v * 1.18 + 10))));
        const toHex = rgb => `#${rgb.map(v => v.toString(16).padStart(2, '0')).join('')}`;
        resolve({ primary: toHex(darkest), secondary: toHex(shift(avg)) });
      } catch {
        resolve({ primary: '#0f172a', secondary: '#7c3aed' });
      }
    };
    img.onerror = () => resolve({ primary: '#0f172a', secondary: '#7c3aed' });
    img.src = dataUrl;
  });
}

async function handleLogoFile(file) {
  if (!file) return;
  const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
  if (!allowed.includes(file.type)) {
    setMessage('Please upload a PNG, JPG, or SVG logo.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = async () => {
    state.logoDataUrl = String(reader.result || '');
    state.logoMeta = { name: file.name, type: file.type, size: file.size };
    els.logoPreview.src = state.logoDataUrl;
    els.logoPreview.alt = file.name;
    els.logoPreview.classList.remove('hidden');
    els.logoInfo.value = `${file.name} - ${prettyBytes(file.size)}`;
    if (file.type !== 'image/svg+xml') {
      state.logoColors = await analyzeLogoColors(state.logoDataUrl);
      applyLogoTheme(state.logoColors);
    } else {
      state.logoColors = null;
    }
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
  state.logoMode = 'none';
  els.logoUpload.value = '';
  els.logoPreview.src = '';
  els.logoPreview.classList.add('hidden');
  els.logoInfo.value = '';
  if (!silent) {
    scheduleRender();
    setMessage('Logo removed.', 'success');
  }
}

function createLogoQr() {
  if (!state.logoDataUrl) {
    setMessage('Upload a logo first.', 'warning');
    return;
  }
  els.logoMode.value = 'center';
  state.logoMode = 'center';
  els.errorCorrection.value = 'H';
  els.logoSize.value = '16';
  els.qrMargin.value = '16';
  els.moduleStyle.value = 'rounded';
  els.finderStyle.value = 'rounded';
  els.cornerDotStyle.value = 'rounded';
  scheduleRender();
  setMessage('Logo QR preset applied.', 'success');
}

function resetAll() {
  els.contentType.value = 'url';
  els.urlInput.value = '';
  els.pdfInput.value = '';
  els.imageInput.value = '';
  els.multiUrlInput.value = '';
  els.contactFirstName.value = '';
  els.contactLastName.value = '';
  els.contactOrg.value = '';
  els.contactTitle.value = '';
  els.contactPhone.value = '';
  els.contactEmail.value = '';
  els.contactWebsite.value = '';
  els.contactAddress.value = '';
  els.emailTo.value = '';
  els.emailSubject.value = '';
  els.emailBody.value = '';
  els.smsPhone.value = '';
  els.smsMessage.value = '';
  els.wifiSsid.value = '';
  els.wifiPassword.value = '';
  els.wifiSecurity.value = 'WPA';
  els.wifiHidden.value = 'false';
  els.storePlatform.value = 'app-store';
  els.storeUrl.value = '';
  els.textInput.value = '';
  els.qrSize.value = '480';
  els.qrMargin.value = '16';
  els.errorCorrection.value = 'H';
  els.moduleStyle.value = 'rounded';
  els.finderStyle.value = 'rounded';
  els.cornerDotStyle.value = 'rounded';
  els.gradientMode.value = 'linear';
  els.fgColor.value = '#0f172a';
  els.gradientStart.value = '#0f172a';
  els.gradientEnd.value = '#7c3aed';
  els.gradientAngle.value = '135';
  els.gradientCenter.value = '#0f172a';
  els.gradientOuter.value = '#7c3aed';
  els.bgColor.value = '#ffffff';
  els.autoThemeMatch.checked = true;
  els.stylePreset.value = 'premium';
  els.logoMode.value = 'none';
  els.logoSize.value = '18';
  state.colorTouched = false;
  removeLogo(true);
  updateVisibleSections();
  updateGradientVisibility();
  updateLogoControls();
  updateIndicators();
  setPreviewSize();
  clearPreview();
  setStatus('Ready', 'neutral');
  setMessage('All fields reset.', 'success');
  showToast('Reset complete', 'Your QR workspace is back to defaults.', 'success');
  scheduleRender();
}

function bindLiveUpdates() {
  const inputs = [
    els.contentType,
    els.urlInput,
    els.pdfInput,
    els.imageInput,
    els.multiUrlInput,
    els.contactFirstName,
    els.contactLastName,
    els.contactOrg,
    els.contactTitle,
    els.contactPhone,
    els.contactEmail,
    els.contactWebsite,
    els.contactAddress,
    els.emailTo,
    els.emailSubject,
    els.emailBody,
    els.smsPhone,
    els.smsMessage,
    els.wifiSsid,
    els.wifiPassword,
    els.wifiSecurity,
    els.wifiHidden,
    els.storePlatform,
    els.storeUrl,
    els.textInput,
    els.qrSize,
    els.qrMargin,
    els.errorCorrection,
    els.moduleStyle,
    els.finderStyle,
    els.cornerDotStyle,
    els.gradientMode,
    els.fgColor,
    els.gradientStart,
    els.gradientEnd,
    els.gradientAngle,
    els.gradientCenter,
    els.gradientOuter,
    els.bgColor,
    els.autoThemeMatch,
    els.stylePreset,
    els.logoMode,
    els.logoSize,
  ];

  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if ([els.fgColor, els.gradientStart, els.gradientEnd, els.gradientCenter, els.gradientOuter].includes(input)) {
        markColorTouched();
      }
      if (input === els.stylePreset) {
        const preset = PRESETS[els.stylePreset.value];
        if (preset) {
          Object.entries(preset).forEach(([key, value]) => {
            if (els[key] && key !== 'fgColor' && key !== 'bgColor') els[key].value = value;
          });
          if (preset.fgColor) els.fgColor.value = preset.fgColor;
          if (preset.bgColor) els.bgColor.value = preset.bgColor;
          if (preset.gradientStart) els.gradientStart.value = preset.gradientStart;
          if (preset.gradientEnd) els.gradientEnd.value = preset.gradientEnd;
          if (preset.gradientCenter) els.gradientCenter.value = preset.gradientCenter;
          if (preset.gradientOuter) els.gradientOuter.value = preset.gradientOuter;
        }
      }
      updateVisibleSections();
      updateGradientVisibility();
      updateLogoControls();
      updateIndicators();
      setPreviewSize();
      scheduleRender();
    });
    input.addEventListener('change', () => {
      updateVisibleSections();
      updateGradientVisibility();
      updateLogoControls();
      updateIndicators();
      setPreviewSize();
      scheduleRender();
    });
  });
}

function bindLogoDropzone() {
  const openPicker = () => els.logoUpload.click();

  els.browseLogoBtn.addEventListener('click', openPicker);
  els.replaceLogoBtn.addEventListener('click', () => {
    els.logoUpload.value = '';
    openPicker();
  });
  els.removeLogoBtn.addEventListener('click', () => removeLogo(false));
  els.createLogoQrBtn.addEventListener('click', createLogoQr);

  els.logoUpload.addEventListener('change', e => handleLogoFile(e.target.files?.[0]));

  els.logoDropzone.addEventListener('click', openPicker);
  els.logoDropzone.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPicker();
    }
  });
  ['dragenter', 'dragover'].forEach(evt => {
    els.logoDropzone.addEventListener(evt, e => {
      e.preventDefault();
      e.stopPropagation();
      els.logoDropzone.classList.add('drag-over');
    });
  });
  ['dragleave', 'drop'].forEach(evt => {
    els.logoDropzone.addEventListener(evt, e => {
      e.preventDefault();
      e.stopPropagation();
      els.logoDropzone.classList.remove('drag-over');
    });
  });
  els.logoDropzone.addEventListener('drop', e => {
    const file = e.dataTransfer?.files?.[0];
    if (file) handleLogoFile(file);
  });
}

function bindActions() {
  els.themeToggle.addEventListener('click', () => {
    const next = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    showToast('Theme updated', `${next === 'dark' ? 'Dark' : 'Light'} mode is active.`, 'success');
  });
  els.generateBtn.addEventListener('click', () => renderQr());
  els.copyTextBtn.addEventListener('click', copyPayloadToClipboard);
  els.resetBtn.addEventListener('click', resetAll);
  els.downloadPngBtn.addEventListener('click', downloadPng);
  els.downloadSvgBtn.addEventListener('click', downloadSvg);
  els.downloadJpgBtn.addEventListener('click', downloadJpg);
  els.downloadPdfBtn.addEventListener('click', downloadPdf);
  els.copyImageBtn.addEventListener('click', copyImageToClipboard);
  els.printBtn.addEventListener('click', printQr);
}

function bootstrap() {
  applyTheme(state.theme);
  updateVisibleSections();
  updateGradientVisibility();
  updateLogoControls();
  setPreviewSize();
  updateIndicators();
  setMessage('Start typing to generate a QR instantly.', 'success');
  bindLiveUpdates();
  bindLogoDropzone();
  bindActions();
  scheduleRender();
}

bootstrap();
