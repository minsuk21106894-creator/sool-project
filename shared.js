/* Sool - Shared JavaScript */

const DATA_BASE = './data';

// Data loading
async function loadJSON(path) {
  const resp = await fetch(`${DATA_BASE}/${path}`);
  if (!resp.ok) throw new Error(`Failed to load ${path}`);
  return resp.json();
}

let _soolsCache = null;
let _picksCache = null;
let _phrasesCache = null;
let _imagesCache = null;

async function getSools() {
  if (!_soolsCache) _soolsCache = await loadJSON('sools.json');
  return _soolsCache;
}

async function getPicks() {
  if (!_picksCache) _picksCache = await loadJSON('todays-picks.json');
  return _picksCache;
}

async function getPhrases() {
  if (!_phrasesCache) _phrasesCache = await loadJSON('order-phrases.json');
  return _phrasesCache;
}

async function getImages() {
  if (!_imagesCache) _imagesCache = await loadJSON('sool-images.json');
  return _imagesCache;
}

let _placesCache = null;
async function getPlaces() {
  if (!_placesCache) _placesCache = await loadJSON('places.json');
  return _placesCache;
}

let _videosCache = null;
async function getVideos() {
  if (!_videosCache) _videosCache = await loadJSON('videos.json');
  return _videosCache;
}

let _storiesCache = null;
async function getStories() {
  if (!_storiesCache) _storiesCache = await loadJSON('stories.json');
  return _storiesCache;
}

let _regionsCache = null;
async function getRegions() {
  if (!_regionsCache) _regionsCache = await loadJSON('regions.json');
  return _regionsCache;
}

// Category labels for places
const PLACE_CATEGORY_LABELS = {
  makgeolli_bar: 'Makgeolli Bar',
  craft_beer: 'Craft Beer',
  traditional_bar: 'Traditional Bar',
  cocktail_bar: 'Cocktail Bar',
  pojangmacha: 'Pojangmacha',
  brewery_class: 'Brewery',
  museum: 'Gallery',
  market: 'Market',
  guided_tour: 'Tour',
  premium_experience: 'Premium',
  bottle_shop: 'Bottle Shop',
  bar_street: 'Bar Street',
  local_bar: 'Local Bar',
  beer_alley: 'Beer Alley',
  cultural_bar: 'Cultural Bar',
  outdoor: 'Outdoor'
};

const PLACE_CATEGORY_EMOJI = {
  makgeolli_bar: '🍶',
  craft_beer: '🍺',
  traditional_bar: '🏮',
  cocktail_bar: '🍸',
  pojangmacha: '⛺',
  brewery_class: '🏭',
  museum: '🏛️',
  market: '🛒',
  guided_tour: '🗺️',
  premium_experience: '✨',
  bottle_shop: '🛍️',
  bar_street: '🌃',
  local_bar: '🏘️',
  beer_alley: '🍻',
  cultural_bar: '🎨',
  outdoor: '🌸'
};

// Get image URL for a sool (with fallback)
function getSoolImageUrl(imageData, soolId, category) {
  const entry = imageData.images[soolId];
  if (entry && entry.url) return entry.url;
  // Use category fallback
  const fb = entry && entry.fallback ? entry.fallback : category;
  return imageData.fallbacks && imageData.fallbacks[fb] ? imageData.fallbacks[fb] : null;
}

// Render a sool image (real image with gradient fallback on error)
function soolImageHTML(url, category, extraStyle) {
  const gradient = getPlaceholderGradient(category);
  const emoji = getCategoryEmoji(category);
  if (url) {
    return `<div style="background:${gradient};${extraStyle || ''}position:relative;">
      <img src="${url}" alt="" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0;" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
      <div style="display:none;align-items:center;justify-content:center;width:100%;height:100%;font-size:24px;opacity:0.3">${emoji}</div>
    </div>`;
  }
  return `<div style="background:${gradient};${extraStyle || ''}display:flex;align-items:center;justify-content:center;">
    <span style="font-size:24px;opacity:0.3">${emoji}</span>
  </div>`;
}

// URL params
function getParam(key) {
  return new URLSearchParams(window.location.search).get(key);
}

// Taste colors
const TASTE_COLORS = {
  sweet: '#E8A87C',
  dry: '#D4C5A9',
  fruity: '#C97B84',
  earthy: '#8B7355',
  acidic: '#6B8CAE'
};

// ABV badge helper
function abvBadgeClass(abv) {
  if (abv <= 7) return 'abv-light';
  if (abv <= 16) return 'abv-medium';
  if (abv <= 25) return 'abv-strong';
  return 'abv-very-strong';
}

function abvLabel(abv) {
  if (abv <= 7) return 'Light';
  if (abv <= 16) return 'Medium';
  if (abv <= 25) return 'Strong';
  return 'Very Strong';
}

// Category display names
const CATEGORY_NAMES = {
  makgeolli: 'Makgeolli',
  soju: 'Soju',
  cheongju: 'Cheongju',
  yakju: 'Yakju',
  fruitWine: 'Fruit Wine',
  distilledSpirit: 'Distilled Spirit',
  other: 'Other'
};

// Placeholder gradient for images
function getPlaceholderGradient(category) {
  const gradients = {
    makgeolli: 'linear-gradient(135deg, #F7F3EE 0%, #E8DFD3 50%, #D4C5A9 100%)',
    soju: 'linear-gradient(135deg, #E8F0F0 0%, #D0E0E0 50%, #B8D0D0 100%)',
    cheongju: 'linear-gradient(135deg, #F0EDE4 0%, #E0D8C8 50%, #D4C5A9 100%)',
    yakju: 'linear-gradient(135deg, #F0E8DC 0%, #E0D0B8 50%, #D4BC9C 100%)',
    fruitWine: 'linear-gradient(135deg, #F0E0E4 0%, #E0C0C8 50%, #D0A0B0 100%)',
    distilledSpirit: 'linear-gradient(135deg, #E8E4E0 0%, #D0CBC5 50%, #B8B0A8 100%)',
    other: 'linear-gradient(135deg, #F0ECE8 0%, #E0D8D0 50%, #D0C8BC 100%)'
  };
  return gradients[category] || gradients.other;
}

// Category emoji icons
function getCategoryEmoji(category) {
  const emojis = {
    makgeolli: String.fromCodePoint(0x1F35A),
    soju: String.fromCodePoint(0x1F376),
    cheongju: String.fromCodePoint(0x1F3F6, 0xFE0F),
    yakju: String.fromCodePoint(0x1F33F),
    fruitWine: String.fromCodePoint(0x1F347),
    distilledSpirit: String.fromCodePoint(0x1F525),
    other: String.fromCodePoint(0x2728)
  };
  return emojis[category] || emojis.other;
}

// Get top 2 taste attributes
function getTopTastes(tasteProfile) {
  const entries = Object.entries(tasteProfile)
    .filter(([k]) => k !== 'acidic')
    .sort((a, b) => b[1] - a[1]);
  return entries.slice(0, 2);
}

// Tab bar HTML
function renderTabBar(activeTab) {
  const tabs = [
    { id: 'home', label: 'Home', href: 'index.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/></svg>` },
    { id: 'list', label: 'List', href: 'sool-guide.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>` },
    { id: 'contents', label: 'Content', href: 'contents.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 010 1.972l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z"/></svg>` },
    { id: 'tips', label: 'Tips', href: 'korean-tips.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"/></svg>` }
  ];

  return `<nav class="tab-bar">${tabs.map(t =>
    `<a href="${t.href}" class="tab-item ${t.id === activeTab ? 'active' : ''}">${t.icon}<span>${t.label}</span></a>`
  ).join('')}</nav>`;
}

// Price display
function priceDisplay(priceRange) {
  const map = { '$': 'Under 5,000w', '$$': '5,000-15,000w', '$$$': '15,000w+' };
  return map[priceRange] || priceRange;
}

// Availability display
function availabilityDisplay(avail) {
  const map = {
    everywhere: 'Find at any convenience store',
    common: 'Available at most restaurants & marts',
    specialty: 'Look for this at specialty shops',
    rare: 'A rare find - worth the search'
  };
  return map[avail] || avail;
}

// Copy to clipboard
async function copyToClipboard(text, btn) {
  try {
    await navigator.clipboard.writeText(text);
    const original = btn.innerHTML;
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg> Copied!';
    setTimeout(() => { btn.innerHTML = original; }, 1500);
  } catch {
    // fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
}
