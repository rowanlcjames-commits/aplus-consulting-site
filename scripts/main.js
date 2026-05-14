/* ============================================
   APlus Consulting — main.js
   - sticky header state
   - mobile nav
   - reveal on scroll
   - hero stat counters
   - interactive Africa map (pins + legend + tooltip)
   - footer year
   ============================================ */

(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // ----- footer year -----
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ----- sticky header state -----
  const header = $('#site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ----- mobile nav -----
  const navToggle = $('.nav-toggle');
  const nav = $('.primary-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ----- reveal on scroll -----
  // tag candidate elements automatically so we don't have to mark every node in HTML
  const revealCandidates = $$([
    '.section-head',
    '.section-body',
    '.service-card',
    '.exp-item',
    '.approach-card',
    '.map-stage',
    '.contact-copy',
    '.contact-details',
    '.hero-title',
    '.hero-lede',
    '.hero-cta',
    '.hero-stats',
    '.about-illustration',
  ].join(','));

  revealCandidates.forEach((el, i) => {
    el.classList.add('reveal');
    // staggered delays for cards
    if (el.matches('.service-card, .exp-item, .approach-card')) {
      el.classList.add(`delay-${(i % 4) + 1}`);
    }
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -10% 0px' });
    revealCandidates.forEach((el) => io.observe(el));
  } else {
    revealCandidates.forEach((el) => el.classList.add('is-in'));
  }

  // ----- stat counters -----
  const stats = $$('.stat-num');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();
    const ease = (t) => 1 - Math.pow(1 - t, 3);
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const v = Math.round(target * ease(t));
      el.textContent = v + (t === 1 ? suffix : '');
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && stats.length) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          io2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach((el) => io2.observe(el));
  } else {
    stats.forEach(animateCount);
  }

  // ----- Project map (Leaflet, teardrop pins) -----
  // Country-level coordinates — approx national centroid or representative
  // mining region. Lesotho and South Africa nudged apart so their pins read
  // as distinct at low zoom.
  const PINS = [
    { lat:  54.00, lng:   -2.50, country: 'United Kingdom' },
    { lat:  56.00, lng: -106.00, country: 'Canada' },
    { lat:   9.95, lng:  -10.00, country: 'Guinea' },
    { lat:  17.57, lng:   -3.99, country: 'Mali' },
    { lat:  -4.04, lng:   21.76, country: 'Democratic Republic of the Congo' },
    { lat:  -6.37, lng:   34.89, country: 'Tanzania' },
    { lat: -22.96, lng:   17.07, country: 'Namibia' },
    { lat: -22.33, lng:   24.68, country: 'Botswana' },
    { lat: -28.00, lng:   23.50, country: 'South Africa' },
    { lat: -29.61, lng:   28.23, country: 'Lesotho' },
    { lat: -18.77, lng:   46.87, country: 'Madagascar' },
    { lat: -25.27, lng:  133.78, country: 'Australia' },
  ];

  const mapEl = document.getElementById('map');

  if (mapEl && typeof L !== 'undefined') {
    const map = L.map(mapEl, {
      scrollWheelZoom: false,
      zoomControl: true,
      attributionControl: true,
      worldCopyJump: true,
    });

    // CartoDB Voyager — warmer, professional basemap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors · ' +
        '&copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 11,
      minZoom: 2,
    }).addTo(map);

    // teardrop pin (SVG inline in a divIcon). The anchor point is the bottom
    // tip of the teardrop, so the pin "stands on" the geo coordinate.
    const pinHtml =
      '<svg width="24" height="32" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg">' +
      '<path d="M12 0 C 5.37 0 0 5.37 0 12 C 0 21 12 32 12 32 C 12 32 24 21 24 12 C 24 5.37 18.63 0 12 0 Z" fill="#ff6600" stroke="#ffffff" stroke-width="2"/>' +
      '<circle cx="12" cy="12" r="4" fill="#ffffff"/>' +
      '</svg>';

    const pinIcon = L.divIcon({
      className: 'aplus-pin',
      html: pinHtml,
      iconSize:    [24, 32],
      iconAnchor:  [12, 32],   // bottom tip
      tooltipAnchor: [0, -28], // tooltip above the pin
    });

    PINS.forEach((p) => {
      L.marker([p.lat, p.lng], { icon: pinIcon, title: p.country })
        .bindTooltip(p.country, {
          direction: 'top',
          offset: [0, -4],
          opacity: 1,
          className: 'aplus-tip',
        })
        .addTo(map);
    });

    // fit map to all markers, with generous padding
    const bounds = L.latLngBounds(PINS.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [50, 50] });

    // re-fit on first reveal (handles 0×0 render before section is in view)
    if ('IntersectionObserver' in window) {
      const reachIO = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => {
              map.invalidateSize();
              map.fitBounds(bounds, { padding: [50, 50] });
            }, 200);
            reachIO.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      reachIO.observe(mapEl);
    }
  }

})();
