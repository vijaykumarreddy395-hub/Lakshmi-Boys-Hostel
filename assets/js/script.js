/* Lakshmi Boys Hostel: accessible gallery and lightweight page interactions. */
document.addEventListener('DOMContentLoaded', () => {
  const photos = [
    ['ChatGPT Image Jul 31, 2026, 10_51_21 PM.png', 'Lakshmi Boys Hostel exterior in Tirupati'],
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
  document.querySelector('#year').textContent = new Date().getFullYear();
  window.addEventListener('load', () => document.querySelector('.page-loader').classList.add('done'));
});
