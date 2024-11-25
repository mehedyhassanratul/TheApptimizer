document.addEventListener('DOMContentLoaded', () => {
    // Theme Picker functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const themeOptions = document.querySelector('.theme-options');
    const storedTheme = localStorage.getItem('selectedTheme') || 'purple';
    
    // Set initial theme
    document.documentElement.setAttribute('data-theme', storedTheme);
    
    themeToggle.addEventListener('click', () => {
        themeOptions.classList.toggle('show');
    });
    
    document.querySelectorAll('.theme-option').forEach(option => {
        option.addEventListener('click', () => {
            const theme = option.getAttribute('data-theme');
            setTheme(theme);
            themeOptions.classList.remove('show');
        });
    });
    
    // Close theme picker when clicking outside
    document.addEventListener('click', (e) => {
        if (!themeToggle.contains(e.target) && !themeOptions.contains(e.target)) {
            themeOptions.classList.remove('show');
        }
    });

    // Background Music Setup
    const musicPlayer = document.createElement('div');
    musicPlayer.className = 'music-player';
    musicPlayer.innerHTML = `
        <div class="music-info">
            <span class="song-title">Ambient Melody</span>
            <span class="artist-name">Background Music</span>
        </div>
        <div class="music-controls">
            <button class="play-pause">
                <i class="fas fa-play"></i>
            </button>
        </div>
    `;
    document.body.appendChild(musicPlayer);

    const audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3');
    audio.loop = true;
    const playPauseBtn = musicPlayer.querySelector('.play-pause');
    let isPlaying = false;

    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        } else {
            audio.play().catch(error => {
                console.log('Audio playback failed:', error);
            });
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }
        isPlaying = !isPlaying;
    });

    // Save audio state in localStorage
    const storedAudioState = localStorage.getItem('audioPlaying');
    if (storedAudioState === 'true') {
        audio.play().then(() => {
            isPlaying = true;
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        }).catch(error => {
            console.log('Audio autoplay failed:', error);
        });
    }

    // Update localStorage when audio state changes
    audio.addEventListener('play', () => {
        localStorage.setItem('audioPlaying', 'true');
    });

    audio.addEventListener('pause', () => {
        localStorage.setItem('audioPlaying', 'false');
    });

    // Advanced mouse tracking for link cards
    document.querySelectorAll('.link-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
            const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
            
            // 3D tilt effect
            const tiltX = (y - 50) / 10;
            const tiltY = -(x - 50) / 10;
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // Smooth scroll with enhanced easing
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1000;
                let start = null;

                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const progress = Math.min(timeElapsed / duration, 1);
                    
                    // Enhanced easing function
                    const ease = t => t < 0.5 
                        ? 4 * t * t * t 
                        : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
                    
                    window.scrollTo(0, startPosition + distance * ease(progress));
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
                
                requestAnimationFrame(animation);
            }
        });
    });

    // Enhanced theme transition
    function setTheme(themeName) {
        const root = document.documentElement;
        const oldTheme = root.getAttribute('data-theme');
        
        // Save theme preference
        localStorage.setItem('selectedTheme', themeName);
        
        // Add transition class
        root.classList.add('theme-transition');
        
        // Apply new theme
        root.setAttribute('data-theme', themeName);
        
        // Trigger reflow for smooth transition
        void root.offsetWidth;
        
        // Remove transition class after animation
        setTimeout(() => {
            root.classList.remove('theme-transition');
        }, 400);
        
        // Animate background shift
        document.body.style.animation = 'none';
        void document.body.offsetWidth;
        document.body.style.animation = '';
    }

    // Parallax effect for background elements
    window.addEventListener('mousemove', e => {
        const moveX = (e.clientX - window.innerWidth / 2) / 50;
        const moveY = (e.clientY - window.innerHeight / 2) / 50;
        
        document.body.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
    });

    // Enhanced card entrance animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('card-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.link-card').forEach((card, index) => {
        card.style.setProperty('--card-delay', `${index * 100}ms`);
        observer.observe(card);
    });

    // Profile Image Effects
    const profileImage = document.querySelector('.profile-image-container');
    if (profileImage) {
        profileImage.addEventListener('mousemove', e => {
            const rect = profileImage.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / profileImage.clientWidth) * 100;
            const y = ((e.clientY - rect.top) / profileImage.clientHeight) * 100;
            
            profileImage.style.setProperty('--mouse-x', `${x}%`);
            profileImage.style.setProperty('--mouse-y', `${y}%`);
            
            // 3D rotation effect
            const rotateX = (y - 50) / 4;
            const rotateY = -(x - 50) / 4;
            profileImage.querySelector('.profile-image-wrapper').style.transform = 
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        profileImage.addEventListener('mouseleave', () => {
            profileImage.querySelector('.profile-image-wrapper').style.transform = '';
        });

        // Rotating border animation
        let rotation = 0;
        function animateBorder() {
            rotation = (rotation + 1) % 360;
            profileImage.style.setProperty('--rotation', `${rotation}deg`);
            requestAnimationFrame(animateBorder);
        }
        animateBorder();
    }
});