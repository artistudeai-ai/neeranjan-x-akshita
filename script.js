/* Invitation content lives here so another event can reuse the experience. */
const invitation = {
  couple: { bride: 'Akshita', groom: 'Neeranjan' },
  event: {
    date: '13 December 2026',
    target: '2026-12-13T00:00:00+05:30',
    venue: 'Hilton Inn',
    address: 'Statue Junction, Trivandrum',
    map: 'https://share.google/NF0jy2M64BPro01TI',
    steps: [
      { number: '13', month: '', year: '', kind: '', venue: '', address: '' },
      { number: '13', month: 'December', year: '', kind: '', venue: '', address: '' },
      { number: '13', month: 'December', year: '2026', kind: '', venue: '', address: '' },
      { number: '13', month: 'December', year: '2026', kind: 'Engagement', venue: '', address: '' },
      { number: '13', month: 'December', year: '2026', kind: 'Engagement', venue: 'Hilton Inn', address: '' },
      { number: '13', month: 'December', year: '2026', kind: 'Engagement', venue: 'Hilton Inn', address: 'Statue Junction, Trivandrum' }
    ]
  },
  gallery: {
    images: ['assets/dsc06899.webp', 'assets/img_3051.webp', 'assets/dsc09437.webp', 'assets/img_4896.webp', 'assets/dsc09969.webp']
  },
  music: { src: 'assets/the-rose-instrumental.mp3' }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const fullNames = `${invitation.couple.groom} & ${invitation.couple.bride}`;

// Bind all repeated invitation copy back to the single event configuration.
function letterReveal(name) { return `<span>${Array.from(name.toUpperCase()).map((letter, i) => `<b class="letter" style="--letter:${i}">${letter}</b>`).join('')}</span>`; }
$('.cover-names').innerHTML = `${letterReveal(invitation.couple.groom)}<i>&amp;</i>${letterReveal(invitation.couple.bride)}`;
$('.cover-names').setAttribute('aria-label', fullNames);
$('.cover-date').textContent = invitation.event.date;
$('.hero-copy h2').innerHTML = `${invitation.couple.groom} <em>&amp;</em><br />${invitation.couple.bride}`;
$('.hero-date').innerHTML = `<span></span>${invitation.event.date}<span></span>`;
$('.story-copy>p:not(.eyebrow):last-of-type').textContent = `Join us as we celebrate the beginning of ${invitation.couple.groom} & ${invitation.couple.bride}’s journey together.`;
$('.detail-value').textContent = invitation.event.date;
$('.details-grid>div:nth-child(2) .detail-value').innerHTML = `${invitation.event.venue}<br /><small>${invitation.event.address}</small>`;
$$('.venue-name').forEach(el => { el.textContent = invitation.event.venue; });
$$('.venue-address').forEach(el => { el.innerHTML = invitation.event.address.replace(', ', '<br />'); });
$('.venue-date').textContent = `Sunday, ${invitation.event.date}`;
$('.final-date').textContent = invitation.event.date;
$('.countdown-date').textContent = invitation.event.date.toUpperCase().replaceAll(' ', ' · ');
$('.final-names').innerHTML = `${invitation.couple.groom} <i>&amp;</i> ${invitation.couple.bride}`;
$('.footer-note').textContent = `Made with love for ${fullNames}`;
$$('a[href="https://share.google/NF0jy2M64BPro01TI"]').forEach(link => { link.href = invitation.event.map; });
$$('.gallery-photo').forEach((photo, index) => { photo.dataset.photo = invitation.gallery.images[index]; $('img', photo).src = invitation.gallery.images[index]; });

const cover = $('#cover');
$('#openInvite').addEventListener('click', () => {
  startMusic();
  cover.classList.add('is-open');
  document.body.classList.remove('locked');
  window.setTimeout(() => { cover.setAttribute('aria-hidden', 'true'); $('#home').scrollIntoView({ behavior: 'smooth' }); }, 180);
});

const topbar = $('#topbar'), nav = $('#nav'), menuToggle = $('#menuToggle');
const syncTopbar = () => topbar.classList.toggle('scrolled', window.scrollY > innerHeight * .7);
window.addEventListener('scroll', syncTopbar, { passive: true }); syncTopbar();
menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen)); menuToggle.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu'); nav.classList.toggle('open', !isOpen);
});
$$('.nav a').forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); }));

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reducedMotion) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => observer.observe(el));
} else $$('.reveal').forEach(el => el.classList.add('visible'));

const dateNumber = $('#dateNumber'), dateMonth = $('#dateMonth'), dateYear = $('#dateYear');
const dateLabel = $('#dateLabel'), dateVenue = $('#dateVenue'), dateAddress = $('#dateAddress');
const dateKeyline = $('.date-keyline'), progressBar = $('#progressBar');
function renderDateStep(progress) {
  const steps = invitation.event.steps;
  const index = Math.min(steps.length - 1, Math.floor(Math.max(0, progress) * steps.length));
  const step = steps[index];
  dateNumber.textContent = step.number; dateMonth.textContent = step.month; dateYear.textContent = step.year;
  dateLabel.textContent = step.kind; dateVenue.textContent = step.venue; dateAddress.textContent = step.address;
  dateLabel.classList.toggle('show', Boolean(step.kind)); dateVenue.classList.toggle('show', Boolean(step.venue));
  dateAddress.classList.toggle('show', Boolean(step.address)); dateKeyline.classList.toggle('drawn', index >= 3);
  progressBar.style.width = `${Math.min(100, Math.max(0, progress) * 100)}%`;
  [dateNumber, dateMonth, dateYear].forEach(el => { el.style.filter = 'blur(3px)'; el.style.transform = 'translateY(5px)'; });
  requestAnimationFrame(() => { [dateNumber, dateMonth, dateYear].forEach(el => { el.style.filter = ''; el.style.transform = ''; }); });
}
function updateDateReveal() {
  const section = $('#beginning'), maxScroll = section.offsetHeight - innerHeight;
  if (maxScroll <= 0) return;
  const progress = Math.min(0.999, Math.max(0, -section.getBoundingClientRect().top / maxScroll));
  renderDateStep(progress);
}
window.addEventListener('scroll', updateDateReveal, { passive: true }); window.addEventListener('resize', updateDateReveal); updateDateReveal();

function updateCountdown() {
  const remaining = new Date(invitation.event.target).getTime() - Date.now();
  const values = remaining <= 0 ? [0, 0, 0, 0] : [Math.floor(remaining / 86400000), Math.floor(remaining / 3600000) % 24, Math.floor(remaining / 60000) % 60, Math.floor(remaining / 1000) % 60];
  ['#days', '#hours', '#minutes', '#seconds'].forEach((id, i) => { const el = $(id); el.textContent = String(values[i]).padStart(2, '0'); });
}
updateCountdown(); window.setInterval(updateCountdown, 1000);

// Start the supplied instrumental from the invitation-opening tap, which is a user gesture.
const musicToggle = $('#musicToggle');
const invitationMusic = $('#invitationMusic');
invitationMusic.src = invitation.music.src;
function startMusic() {
  if (!invitationMusic.paused) return;
  const playback = invitationMusic.play();
  playback.then(() => {
    musicToggle.classList.add('playing'); $('#musicLabel').textContent = 'Music on'; musicToggle.setAttribute('aria-label', 'Turn music off');
  }).catch(() => {
    $('#musicLabel').textContent = 'Music unavailable';
  });
}
musicToggle.addEventListener('click', () => {
  if (invitationMusic.paused) startMusic();
  else {
    invitationMusic.pause();
    musicToggle.classList.remove('playing'); $('#musicLabel').textContent = 'Music off'; musicToggle.setAttribute('aria-label', 'Turn music on');
  }
});

const lightbox = $('#lightbox'), lightboxImage = $('#lightboxImage');
$$('.gallery-photo').forEach(button => button.addEventListener('click', () => { lightboxImage.src = button.dataset.photo; lightbox.showModal(); }));
$('#closeLightbox').addEventListener('click', () => lightbox.close());
lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

