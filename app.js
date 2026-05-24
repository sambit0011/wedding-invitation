/* ================================================================
   WEDDING INVITATION — app.js
   Envelope Open → Photo Gallery (Full Image Scroll)
================================================================ */
'use strict';

// ── Elements ────────────────────────────────────────────────────
const envelopeScreen = document.getElementById('envelope-screen');
const galleryScreen  = document.getElementById('gallery-screen');
const envelope       = document.getElementById('interactive-envelope');
const waxSeal        = document.getElementById('wax-seal');
const galleryScroll  = document.getElementById('gallery-scroll');
const scrollDots     = document.getElementById('scroll-dots');
const allDots        = scrollDots ? Array.from(scrollDots.querySelectorAll('.dot')) : [];
const allSlides      = galleryScroll ? Array.from(galleryScroll.querySelectorAll('.gallery-slide')) : [];

let isOpened = false;

// ── Open Invitation ─────────────────────────────────────────────
function openInvitation() {
    if (isOpened) return;
    isOpened = true;

    // Step 1: flip the flap open
    envelope.classList.add('open-flap');

    // Step 2: slide inner card up
    setTimeout(() => envelope.classList.add('slide-card'), 400);

    // Step 3: crossfade to gallery
    setTimeout(() => {
        envelopeScreen.classList.add('fade-out');
        galleryScreen.classList.add('visible');
        scrollDots.classList.add('visible');
    }, 1200);

    // Step 4: remove envelope from layout
    setTimeout(() => {
        envelopeScreen.style.display = 'none';
    }, 2600);
}

if (waxSeal) {
    waxSeal.addEventListener('click', openInvitation);
    waxSeal.addEventListener('touchend', e => { e.preventDefault(); openInvitation(); });
}

// ── Dot progress tracking via IntersectionObserver ──────────────
// We watch each slide — when it's ≥50% visible, mark that dot active.
// This works even when images have varying heights.

if (allSlides.length > 0 && allDots.length > 0) {
    const dotObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const idx = parseInt(entry.target.dataset.index ?? '0', 10);
                    allDots.forEach((d, i) => d.classList.toggle('active', i === idx));
                }
            });
        },
        {
            root: galleryScroll,
            threshold: 0.4   // trigger when 40% of slide is visible
        }
    );
    allSlides.forEach(slide => dotObserver.observe(slide));
}

// ── Dot click → scroll to that slide ───────────────────────────
allDots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
        const target = allSlides[idx];
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Preload remaining images after brief delay ──────────────────
const toPreload = [
    'assets/slide2_engagement_haldi.jpg',
    'assets/slide3_mehendi_sangeet.jpg',
    'assets/slide4_wedding.jpg',
    'assets/slide5_reception.jpg',
    'assets/slide6_thankyou.jpg'
];

setTimeout(() => {
    toPreload.forEach(src => { const i = new Image(); i.src = src; });
}, 600);
