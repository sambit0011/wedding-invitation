/* 
================================================================
   PREMIUM MOBILE WEDDING INVITATION LOGIC
================================================================
*/

document.addEventListener('DOMContentLoaded', () => {

    // --- State & DOM References ---
    const envelopeScreen = document.getElementById('envelope-screen');
    const envelope = document.getElementById('interactive-envelope');
    const waxSeal = document.getElementById('wax-seal');
    const mainInvitation = document.getElementById('main-invitation');
    const bodyElement = document.body;
    
    // Audio Player
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    let isMusicPlaying = false;

    // Countdown target date: November 21, 2026 at 10:00 AM (Engagement starts)
    const weddingDate = new Date('November 21, 2026 10:00:00').getTime();

    // Event Itinerary Tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    const itineraryPanels = document.querySelectorAll('.itinerary-panel');

    // RSVP Form Elements
    const rsvpForm = document.getElementById('rsvp-form');
    const rsvpSuccess = document.getElementById('rsvp-success');
    const successMsg = document.getElementById('success-msg');
    const btnResetRsvp = document.getElementById('btn-reset-rsvp');


    // ================================================================
    // 1. ENVELOPE OPENING ANIMATION SEQUENCE
    // ================================================================
    
    // Tapping the Wax Seal starts the beautiful unfolding sequence
    waxSeal.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent nested bubble events
        openInvitation();
    });

    // Also support tapping the envelope body to open
    envelope.addEventListener('click', () => {
        if (!envelope.classList.contains('open-flap')) {
            openInvitation();
        }
    });

    function openInvitation() {
        // Step A: Trigger flap fold
        envelope.classList.add('open-flap');
        
        // Try playing background music immediately (user interaction gesture allows this now)
        playMusic();

        // Step B: Slide the invitation card upwards from inside the envelope
        setTimeout(() => {
            envelope.classList.add('slide-card');
        }, 600);

        // Step C: Fade out the entire envelope screen overlay and fade in the main site
        setTimeout(() => {
            envelopeScreen.classList.add('fade-out');
            mainInvitation.classList.add('fade-in');
            
            // Unlock scrolling on the body
            bodyElement.classList.add('scrollable');
            
            // Initialize animations inside the hero view
            document.querySelector('.hero-content').classList.add('animate-fade-in');
        }, 1500);
    }


    // ================================================================
    // 2. ROYAL BACKGROUND MUSIC PLAYER CONTROLS
    // ================================================================
    
    // Toggle music playback manually
    musicToggle.addEventListener('click', () => {
        if (isMusicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    function playMusic() {
        bgMusic.play()
            .then(() => {
                isMusicPlaying = true;
                musicToggle.classList.add('playing');
                musicToggle.classList.remove('paused');
            })
            .catch((error) => {
                console.log("Audio autoplay prevented by browser safety policy.", error);
            });
    }

    function pauseMusic() {
        bgMusic.pause();
        isMusicPlaying = false;
        musicToggle.classList.remove('playing');
        musicToggle.classList.add('paused');
    }


    // ================================================================
    // 3. REAL-TIME COUNTDOWN TIMER
    // ================================================================
    
    function updateCountdown() {
        const now = new Date().getTime();
        const difference = weddingDate - now;

        // If the date has passed
        if (difference < 0) {
            document.getElementById('countdown-timer').innerHTML = `
                <div style="grid-column: span 4; font-size: 1.2rem; color: #5D3F9B; font-weight:600;">
                    The Celebration has Begun!
                </div>
            `;
            return;
        }

        // Time calculations for days, hours, minutes and seconds
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Render to DOM (with leading zeros)
        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    }

    // Run timer immediately and update every second
    updateCountdown();
    setInterval(updateCountdown, 1000);


    // ================================================================
    // 4. DAY-BY-DAY TIMELINE TABS SELECTOR
    // ================================================================
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetDay = button.getAttribute('data-day');

            // Remove active classes from all tab buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to current button
            button.classList.add('active');

            // Toggle panels
            itineraryPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.getAttribute('id') === targetDay) {
                    panel.classList.add('active');
                    
                    // Add entry animations to children inside the newly opened panel
                    const cards = panel.querySelectorAll('.event-card');
                    cards.forEach((card, idx) => {
                        card.classList.remove('animate-fade-in', 'delay-100');
                        void card.offsetWidth; // Force CSS reflow to re-trigger transition
                        if (idx === 0) {
                            card.classList.add('animate-fade-in');
                        } else {
                            card.classList.add('animate-fade-in', 'delay-100');
                        }
                    });
                }
            });
        });
    });


    // ================================================================
    // 5. TACTILE RSVP SUBMISSION & PERSISTENCE
    // ================================================================
    
    // Check if user has already RSVP'd before in this browser
    const existingRsvp = localStorage.getItem('wedding_rsvp');
    if (existingRsvp) {
        try {
            const savedData = JSON.parse(existingRsvp);
            prefillAndShowRsvp(savedData);
        } catch(e) {
            console.error("Could not parse saved RSVP data.", e);
        }
    }

    // Form Submission Handler
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Extract form values
        const name = document.getElementById('guest-name').value.trim();
        const phone = document.getElementById('guest-phone').value.trim();
        const count = document.getElementById('guest-count').value;
        const attendance = document.getElementById('guest-attendance').value;
        const wishes = document.getElementById('guest-wishes').value.trim();

        // Build Response Object
        const rsvpData = { name, phone, count, attendance, wishes, date: new Date().toISOString() };

        // Save locally to simulate remote database storage
        localStorage.setItem('wedding_rsvp', JSON.stringify(rsvpData));

        // Format success banner response message
        if (attendance === 'attending') {
            successMsg.innerHTML = `Thank you so much, <strong>${name}</strong>! We are absolutely thrilled to celebrate with you and your ${count > 1 ? (count - 1) + ' guest(s)' : 'company'} in Udaipur!`;
        } else {
            successMsg.innerHTML = `Thank you for letting us know, <strong>${name}</strong>. We will miss you dearly, but we deeply appreciate your warm wishes!`;
        }

        // Animate overlay slide-up
        rsvpSuccess.classList.add('active');
    });

    // Prefill form and show success screen if already submitted
    function prefillAndShowRsvp(data) {
        document.getElementById('guest-name').value = data.name;
        document.getElementById('guest-phone').value = data.phone;
        document.getElementById('guest-count').value = data.count;
        document.getElementById('guest-attendance').value = data.attendance;
        document.getElementById('guest-wishes').value = data.wishes || '';

        if (data.attendance === 'attending') {
            successMsg.innerHTML = `Welcome back! You are registered as <strong>attending</strong>. We can't wait to see you and your ${data.count > 1 ? (data.count - 1) + ' guest(s)' : 'company'} in Udaipur!`;
        } else {
            successMsg.innerHTML = `You previously RSVP'd as <strong>unable to attend</strong>. We will miss you, but thank you for your blessings!`;
        }

        rsvpSuccess.classList.add('active');
    }

    // Reset RSVP / Edit Response Button handler
    btnResetRsvp.addEventListener('click', () => {
        // Slide down the overlay
        rsvpSuccess.classList.remove('active');
    });


    // ================================================================
    // 6. EXTRA MOBILE OPTIMIZATIONS (TOUCH ANCHORS)
    // ================================================================
    
    // Smooth scrolling anchors for buttons inside scroll containers
    const scrollButtons = document.querySelectorAll('.scroll-to-btn');
    scrollButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = btn.getAttribute('href');
            const targetSec = document.querySelector(targetId);
            if (targetSec) {
                targetSec.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
