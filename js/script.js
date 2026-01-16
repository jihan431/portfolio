// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const skillBars = document.querySelectorAll('.skill-progress');
const statNumbers = document.querySelectorAll('.stat-number');

// ===== Intro Overlay Logic with Cinematic Sequence =====
function initIntro() {
    const introOverlay = document.getElementById('intro-overlay');
    const introBtn = document.getElementById('intro-btn');
    const introMain = document.getElementById('intro-main');
    const introGrid = document.querySelector('.intro-grid');
    const cinematicSequence = document.getElementById('cinematic-sequence');
    const cinematicTexts = document.querySelectorAll('.cinematic-text');
    const introParticles = document.getElementById('intro-particles');
    
    // Create physics-based particles that bounce away from cursor
    if (introParticles) {
        const particleCount = 60;
        const particles = [];
        const repelRadius = 80;
        const repelForce = 8;
        const friction = 0.95;
        const returnSpeed = 0.02;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = 2 + Math.random() * 4;
            const originalX = Math.random() * 100;
            const originalY = Math.random() * 100;
            
            particle.style.position = 'absolute';
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = 'rgba(255, 255, 255, ' + (0.15 + Math.random() * 0.25) + ')';
            particle.style.borderRadius = '50%';
            particle.style.left = originalX + '%';
            particle.style.top = originalY + '%';
            particle.style.pointerEvents = 'none';
            
            introParticles.appendChild(particle);
            
            particles.push({
                element: particle,
                originalX: originalX,
                originalY: originalY,
                x: 0,
                y: 0,
                vx: 0,
                vy: 0
            });
        }
        
        let mouseX = -1000;
        let mouseY = -1000;
        
        // Track mouse position
        introOverlay.addEventListener('mousemove', (e) => {
            const rect = introOverlay.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });
        
        introOverlay.addEventListener('mouseleave', () => {
            mouseX = -1000;
            mouseY = -1000;
        });
        
        // Animation loop
        function animate() {
            const rect = introOverlay.getBoundingClientRect();
            
            particles.forEach(p => {
                const particleX = (p.originalX / 100) * rect.width + p.x;
                const particleY = (p.originalY / 100) * rect.height + p.y;
                
                const dx = particleX - mouseX;
                const dy = particleY - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Apply repel force if cursor is close
                if (distance < repelRadius && distance > 0) {
                    const force = (repelRadius - distance) / repelRadius * repelForce;
                    const angle = Math.atan2(dy, dx);
                    p.vx += Math.cos(angle) * force;
                    p.vy += Math.sin(angle) * force;
                }
                
                // Apply friction
                p.vx *= friction;
                p.vy *= friction;
                
                // Slowly return to original position
                p.x += p.vx;
                p.y += p.vy;
                p.x *= (1 - returnSpeed);
                p.y *= (1 - returnSpeed);
                
                // Calculate velocity magnitude for color
                const velocity = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
                const displacement = Math.sqrt(p.x * p.x + p.y * p.y);
                
                // Color transition: blue when moving, white when still
                const intensity = Math.min(1, displacement / 50);
                const r = Math.round(100 + (255 - 100) * (1 - intensity));
                const g = Math.round(150 + (255 - 150) * (1 - intensity));
                const b = 255;
                
                p.element.style.background = `rgba(${r}, ${g}, ${b}, ${0.2 + intensity * 0.3})`;
                
                // Update position
                p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
            });
            
            requestAnimationFrame(animate);
        }
        
        animate();
    }

    if (introBtn && introOverlay && cinematicSequence) {
        introBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Get all elements to fade out
            const introBgGradient = document.querySelector('.intro-bg-gradient');
            const introOrbs = document.querySelectorAll('.intro-orb');
            
            // STEP 1: Fade everything to black
            introMain.classList.add('hidden');
            
            if (introGrid) {
                introGrid.classList.add('hidden');
            }
            
            if (introBgGradient) {
                introBgGradient.classList.add('hidden');
            }
            
            // Hide particles
            if (introParticles) {
                introParticles.classList.add('hidden');
            }
            
            introOrbs.forEach(orb => orb.classList.add('hidden'));
            
            // STEP 2: Wait for fade to complete (1.5s), then show cinematic sequence
            setTimeout(() => {
                cinematicSequence.classList.add('active');
                
                // Play cinematic text sequence
                let currentIndex = 0;
                const textDuration = 2000; // How long each text is shown (2 seconds)
                const transitionDelay = 800; // Delay between texts (0.8 seconds)
            
                function showNextText() {
                    if (currentIndex < cinematicTexts.length) {
                        const currentText = cinematicTexts[currentIndex];
                        
                        // Show current text
                        currentText.classList.add('show');
                        
                        // Hide after duration
                        setTimeout(() => {
                            currentText.classList.remove('show');
                            currentText.classList.add('hide');
                            
                            // Move to next text after fade out
                            setTimeout(() => {
                                currentText.classList.remove('hide');
                                currentIndex++;
                                showNextText();
                            }, transitionDelay);
                            
                        }, textDuration);
                        
                    } else {
                        // All texts shown, do smooth final transition
                        introOverlay.classList.add('final-transition');
                        
                        // Wait for transition to complete, then start typing animation
                        setTimeout(() => {
                            introOverlay.classList.add('hidden');
                            document.body.classList.remove('no-scroll');
                            // Start typing animation after intro is hidden
                            initTypingAnimation();
                        }, 2000);
                    }
                }
                
                // Start the first text after a longer pause (screen is black)
                setTimeout(showNextText, 1000);
                
            }, 2500); // Wait 2.5s for fade to black to complete
        });
    }
}

// Call intro init
document.addEventListener('DOMContentLoaded', initIntro);


// ===== Navbar Scroll Effect =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add scrolled class
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== Mobile Navigation Toggle =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile nav when clicking a link
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Active Navigation Link on Scroll =====
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

function updateActiveNav() {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    // Update desktop nav
    navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    // Update mobile nav
    mobileNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// ===== Smooth Scroll for Anchor Links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Intersection Observer for Animations =====
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

// Animate skill bars
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.getAttribute('data-progress');
            entry.target.style.width = `${progress}%`;
            skillObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

skillBars.forEach(bar => skillObserver.observe(bar));

// Animate stat numbers
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateNumber(entry.target);
            statObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

statNumbers.forEach(stat => statObserver.observe(stat));

function animateNumber(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===== Fade In/Out Animation on Scroll =====
// Select main content blocks in each section
const contentBlocks = document.querySelectorAll(
    '.hero-content, .hero-visual, .about-content, .about-text, .profile-image, .skill-card, .projects-grid, .project-card, .contact-content, .contact-item, .section-header, .stat-item, .social-links a'
);

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Fix for "glitch": Only toggle if significantly intersecting
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            // Only remove "visible" if the element is truly out of view
            // to prevent flickering when resting at the scroll boundary.
            entry.target.classList.remove('visible');
        }
    });
}, {
    threshold: 0.15, // Content must be 15% visible to trigger
    rootMargin: "0px 0px -50px 0px" // Trigger slightly before bottom of screen
});

contentBlocks.forEach(el => {
    el.classList.add('animate-content');
    // Remove inline styles from previous implementation if any
    el.style.opacity = '';
    el.style.transform = '';
    el.style.transition = '';
    
    fadeObserver.observe(el);
});


// ===== Rotating Code Snippets =====
function initCodeRotation() {
    const codeElement = document.querySelector('.code-body code');
    const codeTitleElement = document.querySelector('.code-title');
    if (!codeElement) return;

    const codeSnippets = [
        {
            title: 'developer.js',
            code: `<span class="keyword">const</span> <span class="variable">developer</span> = {
  <span class="property">name</span>: <span class="string">"Jihan Nugraha"</span>,
  <span class="property">role</span>: <span class="string">"Developer"</span>,
  <span class="property">passion</span>: <span class="string">"Building things"</span>,
  <span class="property">coffee</span>: <span class="boolean">true</span>,
  <span class="function">code</span>() {
    <span class="keyword">return</span> <span class="string">"Clean & Efficient"</span>;
  }
};`
        },
        {
            title: 'skills.py',
            code: `<span class="keyword">class</span> <span class="variable">Skills</span>:
  <span class="keyword">def</span> <span class="function">__init__</span>(<span class="variable">self</span>):
    <span class="variable">self</span>.<span class="property">languages</span> = [
      <span class="string">"JavaScript"</span>,
      <span class="string">"Python"</span>,
      <span class="string">"Node.js"</span>
    ]
    <span class="variable">self</span>.<span class="property">learning</span> = <span class="boolean">True</span>
    <span class="variable">self</span>.<span class="property">focus</span> = <span class="string">"Web Dev"</span>`
        },
        {
            title: 'goals.json',
            code: `{
  <span class="property">"name"</span>: <span class="string">"Jihan Nugraha"</span>,
  <span class="property">"mission"</span>: <span class="string">"Build apps"</span>,
  <span class="property">"values"</span>: [
    <span class="string">"Clean Code"</span>,
    <span class="string">"User Experience"</span>,
    <span class="string">"Continuous Learning"</span>
  ],
  <span class="property">"open_to_work"</span>: <span class="boolean">true</span>
}`
        },
        {
            title: 'connect.sh',
            code: `<span class="comment"># Let's collaborate!</span>
<span class="comment"># Contact Information</span>

<span class="keyword">echo</span> <span class="string">"Open to opportunities"</span>

<span class="variable">GITHUB</span>=<span class="string">"github.com/jihan431"</span>
<span class="variable">EMAIL</span>=<span class="string">"cracked655@gmail.com"</span>
<span class="variable">TELEGRAM</span>=<span class="string">"@Myflexxd"</span>
<span class="keyword">curl</span> -X POST $GITHUB/connect`
        }
    ];

    let currentIndex = 0;

    function rotateCode() {
        // Fade out
        codeElement.style.opacity = '0';
        codeElement.style.transform = 'translateY(10px)';

        setTimeout(() => {
            // Change content
            currentIndex = (currentIndex + 1) % codeSnippets.length;
            codeElement.innerHTML = codeSnippets[currentIndex].code;
            if (codeTitleElement) {
                codeTitleElement.textContent = codeSnippets[currentIndex].title;
            }

            // Fade in
            codeElement.style.opacity = '1';
            codeElement.style.transform = 'translateY(0)';
        }, 400);
    }

    // Add transition styles
    codeElement.style.transition = 'opacity 0.4s ease, transform 0.4s ease';

    // Rotate every 4 seconds
    setInterval(rotateCode, 4000);
}

// Initialize
// ===== Typing Effect for Hero Title =====
function initTypingAnimation() {
    const textToType = "Hi, I'm Jihan Nugraha";
    const typingElement = document.querySelector('.typing-text');
    
    if (!typingElement) return;

    // Reset cursor and text
    typingElement.textContent = "";
    
    let charIndex = 0;
    
    function type() {
        if (charIndex < textToType.length) {
            typingElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            // Add highlight class to name after typing finishes
            typingElement.innerHTML = textToType.replace("Jihan Nugraha", '<span class="highlight">Jihan Nugraha</span>');
        }
    }
    
    // Start typing after small delay
    setTimeout(type, 500);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Don't start typing here - it will start after intro ends
    
    try {
        initCodeRotation();
        updateActiveNav();
    } catch (e) {
        console.error("Error in other inits:", e);
    }
});

// Parallax effect removed for better mobile experience

// ===== Mouse Move Effects (Spotlight & 3D Tilt) =====
const heroVisual = document.querySelector('.hero-visual');
const codeWindow = document.querySelector('.code-window');
const spotlight = document.querySelector('.cursor-spotlight');

document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    
    // 1. Move Spotlight
    if (spotlight) {
        spotlight.style.opacity = '1';
        spotlight.style.left = `${clientX}px`;
        spotlight.style.top = `${clientY}px`;
    }

    // 2. 3D Tilt Effect for Code Window (Desktop Only)
    if (window.innerWidth > 968 && codeWindow) {
        const { innerWidth, innerHeight } = window;
        const rect = codeWindow.getBoundingClientRect();
        
        // Calculate center of code window
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        // Calculate distance from center
        const percentX = (clientX - centerX) / (innerWidth / 2);
        const percentY = (clientY - centerY) / (innerHeight / 2);
        
        // Apply rotation (max 10 degrees)
        const rotateY = percentX * 10;
        const rotateX = percentY * -10;
        
        codeWindow.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }
    
    // 3. Parallax for Hero Visual Container
    if (heroVisual && window.innerWidth > 968) {
        const xPos = (clientX - window.innerWidth / 2) / window.innerWidth * 20;
        const yPos = (clientY - window.innerHeight / 2) / window.innerHeight * 20;
        heroVisual.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }
});

// Reset tilt when mouse leaves
document.addEventListener('mouseleave', () => {
    if (spotlight) spotlight.style.opacity = '0';
    if (codeWindow) {
        codeWindow.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
});

// ===== Background Rotation on Scroll (Desktop Only) =====
const bgGrid = document.querySelector('.bg-grid');

if (bgGrid) {
    let isScrolling;
    let totalRotation = 0;
    let lastScrollPos = window.pageYOffset;

    function rotateBackground() {
        // Add brightness effect on scroll
        bgGrid.classList.add('scrolling');
        
        clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            bgGrid.classList.remove('scrolling');
        }, 500);

        // Only apply on 'PC' / larger screens
        if (window.innerWidth > 968) { 
            const currentScrollPos = window.pageYOffset;
            const maxHeight = document.body.scrollHeight - window.innerHeight;
            
            if (maxHeight > 0) {
                // Calculate movement delta to add rotation
                // Moving the full page height adds 5.5 degrees
                const scrollDelta = Math.abs(currentScrollPos - lastScrollPos);
                const rotationChange = (scrollDelta / maxHeight) * 5.5;
                
                totalRotation += rotationChange;
                
                
                requestAnimationFrame(() => {
                    bgGrid.style.transform = `rotate(${totalRotation}deg)`;
                });
            }
            
            lastScrollPos = currentScrollPos;
        } else {
            bgGrid.style.transform = 'none';
        }
    }

    window.addEventListener('scroll', rotateBackground);
    window.addEventListener('resize', rotateBackground);
}
