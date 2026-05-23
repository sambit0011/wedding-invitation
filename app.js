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

    // Event Itinerary Elements (Full-Screen Swiper)
    const btnEnterInvite = document.getElementById('btn-enter-invite');

    // Reveal Box Elements
    const revealDateBox = document.getElementById('reveal-date-box');
    const cardOverlay = document.getElementById('card-overlay');
    const revealedDatesContainer = document.getElementById('revealed-dates-container');
    const instructionLabel = document.getElementById('instruction-label');

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
        e.stopPropagation();
        openEnvelope();
    });

    envelope.addEventListener('click', () => {
        if (!envelope.classList.contains('open-flap')) {
            openEnvelope();
        }
    });

    function openEnvelope() {
        // Step A: Trigger flap fold
        envelope.classList.add('open-flap');
        
        // Start background music context softly upon user gesture
        playMusic();

        // Step B: Slide the invitation card upwards from inside the envelope
        setTimeout(() => {
            envelope.classList.add('slide-card');
            // Change instruction text to prompt scratching
            instructionLabel.innerText = "Tap the square box to reveal our dates!";
        }, 600);
    }


    // ================================================================
    // 2. CLICK-TO-REVEAL SQUARE BOX LOGIC
    // ================================================================
    revealDateBox.addEventListener('click', () => {
        // Step A: Hide the gift box smoothly
        revealDateBox.style.opacity = '0';
        revealDateBox.style.pointerEvents = 'none';
        
        // Step B: Darken the image overlay to make the dates pop
        cardOverlay.classList.add('darkened');
        
        // Step C: Fade in the wedding dates and proceeding button
        revealedDatesContainer.classList.add('active');
        
        // Step D: Trigger the gorgeous animated flower rain!
        triggerFlowerRain();
        
        // Step E: Update the instruction text
        instructionLabel.innerText = "We're Getting Married! Welcome.";
    });


    // ================================================================
    // 3. 3D FLOWER CONFETTI RAIN ENGINE
    // ================================================================
    const rainContainer = document.getElementById('flower-rain-container');
    const petalColors = [
        'rgba(243, 222, 244, 0.85)', // soft lavender
        'rgba(255, 230, 240, 0.85)', // light pink
        'rgba(254, 249, 218, 0.85)', // cream yellow
        'rgba(212, 175, 55, 0.75)'   // gold leaves
    ];

    function triggerFlowerRain() {
        // Spawn 45 unique falling flower petals
        for (let i = 0; i < 45; i++) {
            createPetal();
        }
    }

    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('petal');

        // Randomized aesthetics for natural organic feel
        const size = Math.random() * 16 + 10; // 10px to 26px
        const left = Math.random() * 100; // 0vw to 100vw
        const delay = Math.random() * 3; // 0s to 3s
        const duration = Math.random() * 3 + 3; // 3s to 6s
        const color = petalColors[Math.floor(Math.random() * petalColors.length)];

        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        petal.style.left = `${left}vw`;
        petal.style.backgroundColor = color;
        petal.style.animationDelay = `${delay}s`;
        petal.style.animationDuration = `${duration}s`;

        // Varying petal rotation shapes
        const rStyle = Math.random();
        if (rStyle < 0.25) {
            petal.style.borderRadius = '50% 0 50% 50%'; // rose shape
        } else if (rStyle < 0.5) {
            petal.style.borderRadius = '50% 50% 0 50%';
        } else if (rStyle < 0.75) {
            petal.style.borderRadius = '20px'; // blossom petal
        } else {
            petal.style.borderRadius = '50%'; // soft dot confetti
        }

        rainContainer.appendChild(petal);

        // Remove element once animation completes
        petal.addEventListener('animationend', () => {
            petal.remove();
        });
    }


    // ================================================================
    // 4. TRANSITION TO SCROLL SNAP EVENT SLIDES
    // ================================================================
    
    btnEnterInvite.addEventListener('click', () => {
        // Step A: Fade out screen 1
        envelopeScreen.classList.add('fade-out');
        
        // Step B: Set main swiper active
        mainInvitation.classList.add('active');
        
        // Ensure background music is unmuted and playing
        playMusic();

        // Step C: Trigger a short secondary flower rain in the swiper to celebrate!
        setTimeout(() => {
            triggerFlowerRain();
        }, 400);
    });


    // ================================================================
    // 5. ROYAL BACKGROUND MUSIC CONTROLLER
    // ================================================================
    
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
                console.log("Autoplay context safety prevent.", error);
            });
    }

    function pauseMusic() {
        bgMusic.pause();
        isMusicPlaying = false;
        musicToggle.classList.remove('playing');
        musicToggle.classList.add('paused');
    }


    // ================================================================
    // 6. TACTILE RSVP SUBMISSION & LOCAL PERSISTENCE
    // ================================================================
    
    const existingRsvp = localStorage.getItem('wedding_rsvp');
    if (existingRsvp) {
        try {
            const savedData = JSON.parse(existingRsvp);
            prefillAndShowRsvp(savedData);
        } catch(e) {
            console.error("Could not parse saved RSVP data.", e);
        }
    }

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('guest-name').value.trim();
        const phone = document.getElementById('guest-phone').value.trim();
        const count = document.getElementById('guest-count').value;
        const attendance = document.getElementById('guest-attendance').value;
        const wishes = document.getElementById('guest-wishes').value.trim();

        const rsvpData = { name, phone, count, attendance, wishes, date: new Date().toISOString() };

        localStorage.setItem('wedding_rsvp', JSON.stringify(rsvpData));

        if (attendance === 'attending') {
            successMsg.innerHTML = `Thank you, <strong>${name}</strong>! We are absolutely thrilled to celebrate with you and your ${count > 1 ? (count - 1) + ' guest(s)' : 'company'} in Udaipur!`;
            // Trigger extra mini flower rain on successful attendance!
            triggerFlowerRain();
        } else {
            successMsg.innerHTML = `Thank you for letting us know, <strong>${name}</strong>. We will miss you dearly, but we deeply appreciate your blessings!`;
        }

        rsvpSuccess.classList.add('active');
    });

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

    btnResetRsvp.addEventListener('click', () => {
        rsvpSuccess.classList.remove('active');
    });

});
