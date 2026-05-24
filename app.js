/* ================================================================
   WEDDING INVITATION — app.js
   Envelope open → Portrait snap-scroll gallery
================================================================ */
'use strict';

const envScreen    = document.getElementById('env-screen');
const galScreen    = document.getElementById('gallery-screen');
const envelope     = document.getElementById('envelope');
const waxSeal      = document.getElementById('wax-seal');
const gScroll      = document.getElementById('g-scroll');
const gDots        = document.getElementById('g-dots');
const swipeHint    = document.getElementById('swipe-hint');

const dots  = gDots  ? Array.from(gDots.querySelectorAll('.g-dot'))    : [];
const slides = gScroll ? Array.from(gScroll.querySelectorAll('.g-slide')) : [];

let opened = false;

/* ── Open invitation ───────────────────────────────────────── */
function open() {
    if (opened) return;
    opened = true;

    // 1. Flip top flap
    envelope.classList.add('open');

    // 2. Crossfade to gallery
    setTimeout(() => {
        envScreen.classList.add('fade-out');
        galScreen.classList.add('visible');
        gDots.classList.add('show');

        // Show swipe hint briefly
        setTimeout(() => {
            swipeHint.classList.add('show');
            setTimeout(() => swipeHint.classList.remove('show'), 2600);
        }, 600);
    }, 1100);

    // 3. Remove envelope node
    setTimeout(() => { envScreen.style.display = 'none'; }, 2500);
}

if (waxSeal) {
    waxSeal.addEventListener('click', open);
    waxSeal.addEventListener('touchend', e => { e.preventDefault(); open(); });
}

/* ── Dot sync via IntersectionObserver ────────────────────── */
if (slides.length && dots.length) {
    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const idx = parseInt(entry.target.dataset.idx ?? '0', 10);
                dots.forEach((d, i) => d.classList.toggle('on', i === idx));
            }
        });
    }, { root: gScroll, threshold: 0.5 });

    slides.forEach(s => obs.observe(s));
}

/* ── Dot tap → jump to slide ──────────────────────────────── */
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        if (slides[i]) {
            slides[i].scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ── Preload images lazily after open ─────────────────────── */
const lazy = [
    'assets/slide2_engagement_haldi.jpg',
    'assets/slide3_mehendi_sangeet.jpg',
    'assets/slide4_wedding.jpg',
    'assets/slide5_reception.jpg',
    'assets/slide6_thankyou.jpg'
];
setTimeout(() => lazy.forEach(s => { const i = new Image(); i.src = s; }), 700);
