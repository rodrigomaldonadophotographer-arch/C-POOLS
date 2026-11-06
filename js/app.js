const DEFAULT_SERVICES = [
  { name: 'Construcción de albercas', description: 'Planeación y construcción de espacios acuáticos para vivirlos a tu manera.', icon: '◈' },
  { name: 'Mantenimiento', description: 'Limpieza, aspirado, cepillado y tratamiento del agua para el cuidado de la alberca.', icon: '≋' },
  { name: 'Reparación y rehabilitación', description: 'Detección de fugas, reparación de grietas, cambio de azulejos y renovación de acabados.', icon: '⌁' },
  { name: 'Equipamiento', description: 'Filtros, bombas, sistemas de filtración y componentes para alberca.', icon: '◉' },
  { name: 'Bombas y calentadores', description: 'Orientación para instalación, reparación o renovación de equipo.', icon: '◌' },
  { name: 'Accesorios', description: 'Escaleras, iluminación LED, cubiertas y productos para el cuidado del agua.', icon: '✦' }
];

const DEFAULT_PRODUCTS = [
  {
    slug: 'pentair-filtracion', category: 'Filtración', categoryKey: 'filtracion',
    name: 'Sistemas de filtración Pentair',
    description: 'Línea mostrada en el material de referencia. Configuración y disponibilidad por confirmar.',
    image: 'images/muestra/equipos-pentair.jpg',
    detail: 'Referencia visual basada en el material compartido. Modelos, características, compatibilidad y disponibilidad se definirán con la empresa.'
  },
  {
    slug: 'pentair-control', category: 'Control inteligente', categoryKey: 'control',
    name: 'Control inteligente Pentair',
    description: 'Sistema de control presentado en una publicación de la empresa. Configuración por confirmar.',
    image: 'images/muestra/sistema-pentair.jpg',
    detail: 'La publicación de referencia muestra un sistema con control desde celular. Modelo, compatibilidad, funciones y disponibilidad se confirmarán antes de publicar la ficha final.'
  },
  {
    slug: 'aqua-pak-silver-h', category: 'Bombas', categoryKey: 'bombas',
    name: 'Aqua Pak Silver H',
    description: 'Motobomba para recirculación de agua en piscinas; ficha comercial pendiente de validar.',
    image: 'images/muestra/bomba-aqua-pak-silver-h.jpg',
    detail: 'La imagen compartida identifica la serie Silver H de Aqua Pak. Los modelos específicos, datos técnicos, garantía, precio y existencia se agregan al confirmar la selección.'
  },
  {
    slug: 'aqua-pak-supra-f', category: 'Bombas', categoryKey: 'bombas',
    name: 'Aqua Pak Supra F',
    description: 'Serie de motobombas para recirculación de agua en piscinas; selección por confirmar.',
    image: 'images/muestra/bomba-aqua-pak-supra-f.jpg',
    detail: 'La imagen compartida identifica la serie Supra F de Aqua Pak. Los modelos específicos, datos técnicos, garantía, precio y existencia se agregan al confirmar la selección.'
  }
];

const config = window.CC_CONFIG || {};
const supabaseClient = window.supabase && config.url && config.publishableKey
  ? window.supabase.createClient(config.url, config.publishableKey)
  : null;
const escapeHTML = value => String(value == null ? '' : value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const serviceGrid = document.getElementById('serviceGrid');
const productGrid = document.getElementById('productGrid');
const filterList = document.getElementById('productFilters');
const infoDialog = document.getElementById('infoDialog');
let displayedProducts = DEFAULT_PRODUCTS.slice();

function renderServices(items) {
  if (!serviceGrid) return;
  serviceGrid.innerHTML = items.map((item, index) => {
    const icon = item.icon || '✦';
    return '<article class="service-card">' +
      '<div class="service-top"><span class="service-number">0' + (index + 1) + ' / SOLUCIÓN</span><span class="service-icon" aria-hidden="true">' + escapeHTML(icon) + '</span></div>' +
      '<h3>' + escapeHTML(item.name) + '</h3><p>' + escapeHTML(item.description || '') + '</p>' +
      '<button class="service-link open-contact" type="button">Consultar servicio&nbsp; ↗</button></article>';
  }).join('');
}

function renderFilters() {
  if (!filterList) return;
  const categories = ['Todos'].concat(Array.from(new Set(displayedProducts.map(item => item.category || 'Equipo'))));
  filterList.innerHTML = categories.map((category, index) => '<button class="filter-chip' + (index === 0 ? ' is-active' : '') + '" type="button" data-filter="' + escapeHTML(category) + '" aria-pressed="' + String(index === 0) + '">' + escapeHTML(category) + '</button>').join('');
  filterList.querySelectorAll('.filter-chip').forEach(button => button.addEventListener('click', () => applyFilter(button.dataset.filter, button)));
}

function renderProducts(items) {
  if (!productGrid) return;
  displayedProducts = items;
  renderFilters();
  productGrid.innerHTML = items.map((item, index) => {
    const imagePath = item.image_path && supabaseClient
      ? supabaseClient.storage.from(config.bucket).getPublicUrl(item.image_path).data.publicUrl
      : item.image;
    const category = item.category || 'Equipo para alberca';
    const detail = item.detail || 'La información técnica, el precio y la disponibilidad de este producto se confirmarán al personalizar el catálogo.';
    const mobileStackStyle = '--card-top:' + (12 + index * 10) + 'px; --card-layer:' + (index + 1) + ';';
    return '<article class="product-card" style="' + mobileStackStyle + '" data-category="' + escapeHTML(category) + '">' +
      '<div class="product-photo-wrap"><img src="' + escapeHTML(imagePath || 'images/logo-cc.png') + '" alt="' + escapeHTML(item.name) + '" loading="lazy"><span class="product-index">0' + (index + 1) + ' / REFERENCIA</span></div>' +
      '<div class="product-info"><span class="product-category">' + escapeHTML(category) + '</span><h3>' + escapeHTML(item.name) + '</h3><p>' + escapeHTML(item.description || '') + '</p>' +
      '<div class="product-bottom"><span>Datos por confirmar</span><button type="button" data-product="' + escapeHTML(item.slug || item.name) + '" data-detail="' + escapeHTML(detail) + '">Ver ficha <span>↗</span></button></div></div></article>';
  }).join('');
  productGrid.querySelectorAll('[data-product]').forEach(button => button.addEventListener('click', () => {
    const item = displayedProducts.find(product => (product.slug || product.name) === button.dataset.product);
    openDialog('FICHA DE REFERENCIA', item ? item.name : 'Equipo de alberca', button.dataset.detail || '', 'Modelos, precio y disponibilidad por confirmar');
  }));
  applyFilter('Todos');
}

function applyFilter(category, selectedButton) {
  if (selectedButton) {
    filterList.querySelectorAll('.filter-chip').forEach(button => {
      const active = button === selectedButton;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  productGrid.querySelectorAll('.product-card').forEach(card => {
    card.hidden = category !== 'Todos' && card.dataset.category !== category;
  });
}

function openDialog(eyebrow, title, description, meta) {
  document.getElementById('dialogEyebrow').textContent = eyebrow;
  document.getElementById('dialogTitle').textContent = title;
  document.getElementById('dialogDescription').textContent = description || 'La información final se agregará al personalizar el catálogo.';
  document.getElementById('dialogMeta').textContent = meta || 'Contenido de muestra';
  if (typeof infoDialog.showModal === 'function') infoDialog.showModal();
  else infoDialog.setAttribute('open', '');
  document.body.classList.add('dialog-open');
}

function closeDialog() {
  if (!infoDialog) return;
  if (typeof infoDialog.close === 'function') infoDialog.close();
  else infoDialog.removeAttribute('open');
  document.body.classList.remove('dialog-open');
}

document.addEventListener('click', event => {
  if (!event.target.closest('.open-contact')) return;
  openDialog('CONTACTO DE MUESTRA', 'Hablemos de tu proyecto', 'Aquí se configurarán los botones de contacto y cotización cuando la empresa apruebe el diseño.', 'Los datos de contacto se agregan en la versión final');
});
document.querySelector('.dialog-close')?.addEventListener('click', closeDialog);
document.querySelector('.dialog-action')?.addEventListener('click', closeDialog);
infoDialog?.addEventListener('click', event => { if (event.target === infoDialog) closeDialog(); });
infoDialog?.addEventListener('close', () => document.body.classList.remove('dialog-open'));

const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
});
mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('is-open');
  navToggle?.setAttribute('aria-expanded', 'false');
}));

async function loadCatalog() {
  renderServices(DEFAULT_SERVICES);
  renderProducts(DEFAULT_PRODUCTS);
  if (!supabaseClient) return;
  try {
    const [services, products] = await Promise.all([
      supabaseClient.from('services').select('*').eq('active', true).order('created_at'),
      supabaseClient.from('products').select('*').eq('active', true).order('created_at')
    ]);
    if (!services.error && services.data && services.data.length) renderServices(services.data);
    if (!products.error && products.data && products.data.length) renderProducts(products.data);
  } catch (error) {
    console.warn('El catálogo continúa con contenido de muestra.', error);
  }
}

loadCatalog();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}
