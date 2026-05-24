/* ================================================================
   WEDDING INVITATION APP.JS
   Envelope → Photo Gallery Flow
================================================================ */

'use strict';

// ── DOM References ──────────────────────────────────────────────
const envelopeScreen  = document.getElementById('envelope-screen');
const galleryScreen   = document.getElementById('gallery-screen');
const interactiveEnv  = document.getElementById('interactive-envelope');
const waxSeal         = document.getElementById('wax-seal');
const galleryScroll   = document.getElementById('gallery-scroll');
const scrollDots      = document.getElementById('scroll-dots');
const dots            = scrollDots ? scrollDots.querySelectorAll('.dot') : [];

const rsvpForm            = document.getElementById('rsvp-form');
const rsvpSuccess         = document.getElementById('rsvp-success');
const successMsg          = document.getElementById('success-msg');
const btnResetRsvp        = document.getElementById('btn-reset-rsvp');

let isOpened = false;

// ── Wax Seal Click → Open Envelope → Show Gallery ───────────────
if (waxSeal) {
    waxSeal.addEventListener('click', openInvitation);
    waxSeal.addEventListener('touchend', function(e) {
        e.preventDefault();
        openInvitation();
    });
}

function openInvitation() {
    if (isOpened) return;
    isOpened = true;

    // Step 1: Open the flap
    interactiveEnv.classList.add('open-flap');

    // Step 2: Slide card up after a short delay
    setTimeout(() => {
        interactiveEnv.classList.add('slide-card');
    }, 400);

    // Step 3: Fade out envelope, fade in gallery
    setTimeout(() => {
        envelopeScreen.classList.add('fade-out');
        galleryScreen.classList.add('visible');
        scrollDots.classList.add('visible');
    }, 1200);

    // Step 4: Remove envelope from DOM after transition
    setTimeout(() => {
        envelopeScreen.style.display = 'none';
    }, 2500);
}

// ── Scroll Progress Dots ─────────────────────────────────────────
function updateDots() {
    if (!galleryScroll || dots.length === 0) return;

    const slideHeight = galleryScroll.clientHeight;
    const scrollTop   = galleryScroll.scrollTop;
    const slideIndex  = Math.round(scrollTop / slideHeight);

    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === slideIndex);
    });
}

if (galleryScroll) {
    galleryScroll.addEventListener('scroll', updateDots, { passive: true });
}

// Dot click → scroll to that slide
dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
        const slideHeight = galleryScroll.clientHeight;
        galleryScroll.scrollTo({
            top: i * slideHeight,
            behavior: 'smooth'
        });
    });
});

// ── RSVP Form ───────────────────────────────────────────────────
if (rsvpForm) {
    rsvpForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name       = document.getElementById('guest-name').value.trim();
        const attendance = document.getElementById('guest-attendance').value;

        // Save to localStorage
        const rsvpData = {
            name:       name,
            phone:      document.getElementById('guest-phone').value.trim(),
            count:      document.getElementById('guest-count').value,
            attendance: attendance,
            wishes:     document.getElementById('guest-wishes').value.trim(),
            timestamp:  new Date().toISOString()
        };

        try {
            localStorage.setItem('wedding_rsvp_' + name.replace(/\s/g,'_'), JSON.stringify(rsvpData));
        } catch(err) { /* storage full or private mode */ }

        // Show success message
        const isAttending = attendance === 'attending';
        if (successMsg) {
            successMsg.textContent = isAttending
                ? `Thank you, ${name || 'dear guest'}! We're so thrilled you'll be joining us. See you at the celebrations! 🎉`
                : `We'll miss you, ${name || 'dear guest'}. Thank you for letting us know. We hope to celebrate with you soon! 💐`;
        }

        if (rsvpSuccess) {
            rsvpSuccess.classList.add('active');
        }
    });
}

if (btnResetRsvp) {
    btnResetRsvp.addEventListener('click', function() {
        rsvpForm.reset();
        rsvpSuccess.classList.remove('active');
    });
}

// ── Preload images for smooth scroll ────────────────────────────
const imageSlides = [
    'assets/slide2_engagement_haldi.jpg',
    'assets/slide3_mehendi_sangeet.jpg',
    'assets/slide4_wedding.jpg',
    'assets/slide5_reception.jpg'
];

function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Preload after a small delay to not block initial render
setTimeout(() => preloadImages(imageSlides), 500);
