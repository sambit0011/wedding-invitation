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

    // Scratch Card Elements
    const scratchCanvas = document.getElementById('scratch-canvas');
    const scratchCtx = scratchCanvas.getContext('2d');
    const successBtnContainer = document.querySelector('.scratch-success-btn-container');
    const instructionLabel = document.getElementById('instruction-label');
    let isScratchingDone = false;
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

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
            instructionLabel.innerText = "Scratch the card to reveal the couple!";
        }, 600);
    }


    // ================================================================
    // 2. HTML5 CANVAS SCRATCH CARD LOGIC
    // ================================================================
    
    // Initialize the Scratch Card Overlay Cover with a sparkling gold metallic texture
    function initScratchCard() {
        const w = scratchCanvas.width;
        const h = scratchCanvas.height;

        // Draw Gold linear gradient background
        const goldGrad = scratchCtx.createLinearGradient(0, 0, w, h);
        goldGrad.addColorStop(0, '#fce990');
        goldGrad.addColorStop(0.3, '#d4af37');
        goldGrad.addColorStop(0.7, '#aa7c11');
        goldGrad.addColorStop(1, '#8c6408');
        
        scratchCtx.fillStyle = goldGrad;
        scratchCtx.fillRect(0, 0, w, h);

        // Add subtle gold dust noise particles for physical metallic texture
        scratchCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        for (let i = 0; i < 500; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const size = Math.random() * 1.5;
            scratchCtx.fillRect(x, y, size, size);
        }

        // Draw elegant circular border ring inside the scratch overlay
        scratchCtx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        scratchCtx.lineWidth = 1;
        scratchCtx.strokeRect(10, 10, w - 20, h - 20);

        // Add call-to-action text on top of the scratch coat
        scratchCtx.fillStyle = '#2C1E43'; // deep purple/plum for readability
        scratchCtx.font = "bold 15px 'Cormorant Garamond', serif";
        scratchCtx.textAlign = 'center';
        scratchCtx.textBaseline = 'middle';
        scratchCtx.fillText('SCRATCH WITH YOUR COIN', w / 2, h / 2 - 12);
        
        scratchCtx.fillStyle = '#aa7c11';
        scratchCtx.font = "italic 12px 'Cormorant Garamond', serif";
        scratchCtx.fillText('to reveal the couple!', w / 2, h / 2 + 10);
    }

    initScratchCard();

    // Event handlers for Scratch Card drawing/scratching (Support Desktop & Mobile Touch)
    scratchCanvas.addEventListener('mousedown', startScratch);
    scratchCanvas.addEventListener('mousemove', scratch);
    scratchCanvas.addEventListener('mouseup', endScratch);
    scratchCanvas.addEventListener('mouseleave', endScratch);

    scratchCanvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        scratchCanvas.dispatchEvent(mouseEvent);
        e.preventDefault();
    }, { passive: false });

    scratchCanvas.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        scratchCanvas.dispatchEvent(mouseEvent);
        e.preventDefault();
    }, { passive: false });

    scratchCanvas.addEventListener('touchend', () => {
        const mouseEvent = new MouseEvent('mouseup', {});
        scratchCanvas.dispatchEvent(mouseEvent);
    });

    function getCanvasCoordinates(e) {
        const rect = scratchCanvas.getBoundingClientRect();
        const scaleX = scratchCanvas.width / rect.width;
        const scaleY = scratchCanvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    }

    function startScratch(e) {
        if (isScratchingDone || !envelope.classList.contains('slide-card')) return;
        isDrawing = true;
        const coords = getCanvasCoordinates(e);
        lastX = coords.x;
        lastY = coords.y;
    }

    function scratch(e) {
        if (!isDrawing || isScratchingDone) return;
        
        const coords = getCanvasCoordinates(e);
        const currentX = coords.x;
        const currentY = coords.y;

        // Draw transparent circles to erase the canvas
        scratchCtx.globalCompositeOperation = 'destination-out';
        scratchCtx.beginPath();
        
        // Draw a thick line from the last coordinate to make erasing feel fluid and smooth
        scratchCtx.lineWidth = 75; // increased thickness for easy 2-stroke scratch!
        scratchCtx.lineCap = 'round';
        scratchCtx.moveTo(lastX, lastY);
        scratchCtx.lineTo(currentX, currentY);
        scratchCtx.stroke();

        lastX = currentX;
        lastY = currentY;

        // Perform threshold check to see if enough is cleared
        checkScratchPercentage();
    }

    function endScratch() {
        isDrawing = false;
    }

    // Measure cleared pixel ratio
    function checkScratchPercentage() {
        if (isScratchingDone) return;

        const w = scratchCanvas.width;
        const h = scratchCanvas.height;
        const imgData = scratchCtx.getImageData(0, 0, w, h);
        const data = imgData.data;
        let transparentPixels = 0;
        const totalPixels = data.length / 4;

        // Check alpha channels (data[i + 3] holds transparency)
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] === 0) {
                transparentPixels++;
            }
        }

        const percentage = (transparentPixels / totalPixels) * 100;

        // Once 18% of the gold scratch card is cleared (easy 2-stroke trigger!), complete the reveal!
        if (percentage >= 18) {
            isScratchingDone = true;
            revealDatesAndRainFlowers();
        }
    }

    function revealDatesAndRainFlowers() {
        // Fade out canvas completely
        scratchCanvas.style.opacity = '0';
        scratchCanvas.style.pointerEvents = 'none';
        
        // Show "Enter Invitation" button
        successBtnContainer.classList.add('visible');
        instructionLabel.innerText = "We're Getting Married! Welcome.";

        // Trigger gorgeous flower rain particles
        triggerFlowerRain();
    }


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
