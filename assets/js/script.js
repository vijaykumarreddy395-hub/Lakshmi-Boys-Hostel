/* Lakshmi Boys Hostel: accessible gallery and lightweight page interactions. */
document.addEventListener('DOMContentLoaded', () => {
  const reviewsTemplate = document.querySelector('#reviewsTemplate');
  const visitSection = document.querySelector('#visit');
  if (reviewsTemplate && visitSection) visitSection.before(reviewsTemplate.content.cloneNode(true));
  const reviewDialog = document.querySelector('#reviewDialog');
  const reviewForm = document.querySelector('#reviewForm');
  const reviewGrid = document.querySelector('.review-grid');
  const reviewAction = document.querySelector('.review-action');
  const reviewKey = 'lakshmi-boys-hostel-reviews';
  const settings = window.LBHData?.getSettings();
  const visitCopy = document.querySelector('.visit-copy');
  if (settings && visitCopy) {
    const info = document.createElement('section');
    info.className = 'stay-info';
    info.innerHTML = `<span class="stay-info-title">Stay information</span><div class="stay-info-grid"><div class="stay-info-item"><span>Monthly rent</span><b>₹${Number(settings.rent).toLocaleString('en-IN')}</b></div><div class="stay-info-item"><span>Available beds</span><b>${settings.availableBeds} / ${settings.totalBeds}</b></div></div>`;
    visitCopy.querySelector('.button').before(info);
  }
  if (settings) {
    const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
    const today = settings.menu[todayIndex];
    const foodMenu = document.createElement('section');
    foodMenu.className = 'food-menu'; foodMenu.id = 'food-menu';
    foodMenu.innerHTML = `<div class="wrap"><div class="food-menu-heading"><p class="kicker">Weekly food menu</p><h2>Today’s menu</h2></div><div class="today-meals"><article class="meal-card"><span>Breakfast</span><b>${today[1]}</b></article><article class="meal-card"><span>Lunch</span><b>${today[2]}</b></article><article class="meal-card"><span>Dinner</span><b>${today[3]}</b></article></div><h3 class="weekly-menu-title">Full weekly menu</h3><table class="public-menu-table"><thead><tr><th>Day</th><th>Breakfast</th><th>Lunch</th><th>Dinner</th></tr></thead><tbody>${settings.menu.map(row => `<tr><td>${row[0]}</td><td>${row[1]}</td><td>${row[2]}</td><td>${row[3]}</td></tr>`).join('')}</tbody></table></div>`;
    document.querySelector('.reviews')?.before(foodMenu);
  }
  const makeReviewCard = review => {
    const card = document.createElement('article');
    card.className = 'review-card';
    card.innerHTML = `<div class="review-stars" aria-label="${review.rating} out of 5 stars">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div><blockquote></blockquote><cite></cite>`;
    card.querySelector('blockquote').textContent = `“${review.text}”`;
    card.querySelector('cite').textContent = review.name;
    return card;
  };
  try { (window.LBHData?.getReviews() || JSON.parse(localStorage.getItem(reviewKey) || '[]')).filter(review => review.approved).forEach(review => reviewGrid.append(makeReviewCard(review))); } catch { /* Ignore unavailable local browser storage. */ }
  const pageSize = 5;
  let currentPage = 0;
  const reviewsMore = document.createElement('button');
  reviewsMore.type = 'button'; reviewsMore.className = 'reviews-more';
  reviewsMore.setAttribute('aria-expanded', 'false');
  reviewsMore.innerHTML = 'Show more reviews <span aria-hidden="true">↓</span>';
  const reviewsUp = document.createElement('button');
  reviewsUp.type = 'button'; reviewsUp.className = 'reviews-up';
  reviewsUp.setAttribute('aria-label', 'Go to first reviews');
  reviewsUp.innerHTML = '⬆';
  const paginationWrap = document.createElement('div');
  paginationWrap.className = 'reviews-pagination';
  paginationWrap.append(reviewsMore, reviewsUp);
  reviewGrid.insertAdjacentElement('afterend', paginationWrap);
  const updateReviewVisibility = () => {
    const cards = [...reviewGrid.querySelectorAll('.review-card')];
    const total = cards.length;
    const totalPages = Math.ceil(total / pageSize);
    cards.forEach((card, index) => {
      const pageIndex = Math.floor(index / pageSize);
      card.hidden = pageIndex !== currentPage;
    });
    reviewsMore.hidden = total <= pageSize || currentPage >= totalPages - 1;
    reviewsMore.setAttribute('aria-expanded', currentPage > 0 ? 'true' : 'false');
    reviewsUp.disabled = currentPage === 0;
    reviewsUp.hidden = total <= pageSize;
  };
  reviewsMore.addEventListener('click', () => {
    const total = reviewGrid.querySelectorAll('.review-card').length;
    const totalPages = Math.ceil(total / pageSize);
    if (currentPage < totalPages - 1) {
      currentPage += 1;
      updateReviewVisibility();
    }
  });
  reviewsUp.addEventListener('click', () => {
    currentPage = 0;
    updateReviewVisibility();
    document.querySelector('.reviews')?.scrollIntoView({ behavior: 'smooth' });
  });
  updateReviewVisibility();
  if (reviewAction && reviewDialog) {
    reviewAction.addEventListener('click', event => {
      event.preventDefault();
      reviewDialog.showModal();
    });
    reviewDialog.querySelector('.review-close').addEventListener('click', () => reviewDialog.close());
    reviewDialog.addEventListener('click', event => { if (event.target === reviewDialog) reviewDialog.close(); });
  }
  reviewForm?.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(reviewForm);
    const review = { name: data.get('name').trim(), rating: Number(data.get('rating')), text: data.get('review').trim() };
    if (!review.name || !review.text) return;
    review.approved = false;
    try { const saved = window.LBHData?.getReviews() || JSON.parse(localStorage.getItem(reviewKey) || '[]'); saved.push(review); window.LBHData ? window.LBHData.saveReviews(saved) : localStorage.setItem(reviewKey, JSON.stringify(saved)); } catch { /* The submitted review remains available for this visit only. */ }
    reviewForm.reset();
    const thanks = reviewDialog.querySelector('.thank-you');
    thanks.querySelector('p').textContent = 'Your review has been submitted for approval.';
    thanks.classList.add('show');
    setTimeout(() => { thanks.classList.remove('show'); reviewDialog.close(); }, 1900);
  });
  const locationLink = document.querySelector('.location-line');
  if (locationLink) {
    const mapsButton = document.createElement('a');
    mapsButton.className = 'maps-button';
    mapsButton.href = 'https://maps.app.goo.gl/xP8VvCCwxHC89f6A7?g_st=aw';
    mapsButton.target = '_blank'; mapsButton.rel = 'noopener';
    mapsButton.innerHTML = 'Open in Google Maps <b aria-hidden="true">↗</b>';
    locationLink.insertAdjacentElement('afterend', mapsButton);
  }
  const photos = [
    ['lakshmi-boys-hostel-hero-corrected.png', 'Lakshmi Boys Hostel exterior in Tirupati'],
    ['ChatGPT Image Jul 31, 2026, 10_51_54 PM.png', 'Lakshmi Boys Hostel building entrance'],
    ['ChatGPT Image Jul 31, 2026, 10_53_41 PM.png', 'Lakshmi Boys Hostel location sign'],
    ['ChatGPT Image Jul 31, 2026, 10_53_56 PM.png', 'Covered resident common area'],
    ['ChatGPT Image Jul 31, 2026, 10_54_08 PM.png', 'Shared lounge and seating area'],
    ['ChatGPT Image Jul 31, 2026, 10_54_18 PM.png', 'Hostel entrance space'],
    ['ChatGPT Image Jul 31, 2026, 10_54_28 PM.png', 'Hostel interior lobby'],
    ['ChatGPT Image Jul 31, 2026, 10_54_49 PM.png', 'Comfortable room with bed'],
    ['ChatGPT Image Jul 31, 2026, 10_54_58 PM.png', 'Room storage and sleeping area'],
    ['ChatGPT Image Jul 31, 2026, 10_55_06 PM.png', 'Tirupati skyline view'],
    ['ChatGPT Image Jul 31, 2026, 10_55_16 PM.png', 'Lakshmi Boys Hostel side exterior'],
    ['ChatGPT Image Jul 31, 2026, 10_55_23 PM.png', 'Room cupboard storage'],
    ['ChatGPT Image Jul 31, 2026, 10_55_32 PM.png', 'Neat bedroom with storage'],
    ['ChatGPT Image Jul 31, 2026, 10_55_50 PM.png', 'Spacious multi-sharing room'],
    ['ChatGPT Image Jul 31, 2026, 10_57_28 PM.png', 'Large multi-sharing hostel room'],
    ['ChatGPT Image Jul 31, 2026, 11_05_55 PM.png', 'RO drinking water facility'],
    ['ChatGPT Image Jul 31, 2026, 11_08_28 PM.png', 'On-site two wheeler parking'],
    ['ChatGPT Image Jul 31, 2026, 11_10_16 PM.png', 'Shared kitchen'],
    ['ChatGPT Image Jul 31, 2026, 11_12_26 PM.png', 'Hostel kitchen space'],
    ['ChatGPT Image Jul 31, 2026, 11_13_32 PM.png', 'Building exterior and parking'],
    ['ChatGPT Image Jul 31, 2026, 11_14_26 PM.png', 'Room entry and bedroom'],
    ['ChatGPT Image Jul 31, 2026, 11_15_36 PM.png', 'Bright hostel room'],
    ['ChatGPT Image Jul 31, 2026, 11_17_03 PM.png', 'Clean bathroom facility'],
    ['ChatGPT Image Jul 31, 2026, 11_18_34 PM.png', 'Bathroom at Lakshmi Boys Hostel'],
    ['ChatGPT Image Jul 31, 2026, 11_20_53 PM.png', 'Shared sleeping area'],
    ['ChatGPT Image Jul 31, 2026, 11_22_19 PM.png', 'Room storage unit'],
    ['ChatGPT Image Jul 31, 2026, 11_23_41 PM.png', 'Hostel interior entrance']
  ];
  const imagePath = file => `assets/images/${encodeURIComponent(file)}`;
  const grid = document.querySelector('#galleryGrid');
  const dialog = document.querySelector('.lightbox');
  const display = dialog.querySelector('img');
  const caption = dialog.querySelector('figcaption');
  let selected = 0;

  photos.forEach(([file, alt], index) => {
    const item = document.createElement('button');
    item.type = 'button'; item.className = 'gallery-item'; item.setAttribute('aria-label', `View ${alt}`);
    item.innerHTML = `<img src="${imagePath(file)}" alt="${alt}" loading="lazy">`;
    item.addEventListener('click', () => openPhoto(index));
    grid.append(item);
  });
  const showPhoto = index => {
    selected = (index + photos.length) % photos.length;
    const [file, alt] = photos[selected];
    display.src = imagePath(file); display.alt = alt;
    caption.textContent = `${String(selected + 1).padStart(2, '0')} / ${String(photos.length).padStart(2, '0')} — ${alt}`;
  };
  const openPhoto = index => { showPhoto(index); dialog.showModal(); };
  dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.lightbox-prev').addEventListener('click', () => showPhoto(selected - 1));
  dialog.querySelector('.lightbox-next').addEventListener('click', () => showPhoto(selected + 1));
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  document.addEventListener('keydown', event => {
    if (!dialog.open) return;
    if (event.key === 'ArrowLeft') showPhoto(selected - 1);
    if (event.key === 'ArrowRight') showPhoto(selected + 1);
  });
  let touchStart = 0;
  dialog.addEventListener('touchstart', event => { touchStart = event.changedTouches[0].screenX; }, { passive: true });
  dialog.addEventListener('touchend', event => { const movement = event.changedTouches[0].screenX - touchStart; if (Math.abs(movement) > 45) showPhoto(selected + (movement < 0 ? 1 : -1)); }, { passive: true });

  const header = document.querySelector('.header');
  const toTop = document.querySelector('.to-top');
  const menuButton = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');
  const onScroll = () => { header.classList.toggle('scrolled', window.scrollY > 35); toTop.classList.toggle('visible', window.scrollY > 650); };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  menuButton.addEventListener('click', () => { const open = menu.classList.toggle('open'); menuButton.setAttribute('aria-expanded', String(open)); });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => { menu.classList.remove('open'); menuButton.setAttribute('aria-expanded', 'false'); }));
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('shown'); observer.unobserve(entry.target); } }), { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(item => observer.observe(item));
  window.addEventListener('storage', event => { if (event.key === window.LBHData?.settingsKey || event.key === window.LBHData?.reviewsKey) window.location.reload(); });
  document.querySelector('#year').textContent = new Date().getFullYear();
  window.addEventListener('load', () => document.querySelector('.page-loader').classList.add('done'));
});
