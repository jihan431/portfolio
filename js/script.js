// ===== DOM Elements =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');
const navLinkItems = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');
const skillBars = document.querySelectorAll('.skill-progress');

// ===== Intro Overlay Logic =====
function initIntro() {
    const introOverlay = document.getElementById('intro-overlay');
    const introBtn = document.getElementById('intro-btn');
    const introMain = document.getElementById('intro-main');
    const cinematicTexts = document.querySelectorAll('.cinematic-text');
    const cinematicSequence = document.getElementById('cinematic-sequence');


    if (introBtn && introOverlay && cinematicSequence) {
        introBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            introMain.classList.add('hidden');

            
            setTimeout(() => {
                cinematicSequence.classList.add('active');
                
                let currentIndex = 0;
                const textDuration = 2000;
                const transitionDelay = 800;
            
                function showNextText() {
                    if (currentIndex < cinematicTexts.length) {
                        const currentText = cinematicTexts[currentIndex];
                        currentText.classList.add('show');
                        
                        setTimeout(() => {
                            currentText.classList.remove('show');
                            currentText.classList.add('hide');
                            
                            setTimeout(() => {
                                currentText.classList.remove('hide');
                                currentIndex++;
                                showNextText();
                            }, transitionDelay);
                        }, textDuration);
                    } else {
                        introOverlay.classList.add('final-transition');
                        setTimeout(() => {
                            introOverlay.classList.add('hidden');
                            document.body.classList.remove('no-scroll');
                            initTypingAnimation();
                        }, 2000);
                    }
                }
                
                setTimeout(showNextText, 1000);
            }, 2500);
        });
    }
}

document.addEventListener('DOMContentLoaded', initIntro);

// ===== Navbar Scroll Effect =====
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}, { passive: true });

// ===== Scroll Progress Bar =====
const scrollProgress = document.querySelector('.scroll-progress');

window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.pageYOffset / totalHeight) * 100;
    if (scrollProgress) {
        scrollProgress.style.width = `${progress}%`;
    }
}, { passive: true });

// ===== Mobile Navigation Toggle =====
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ===== Active Navigation =====
const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

function updateActiveNav() {
    let current = '';
    const scrollPos = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Check if at bottom of page - activate last section (contact)
    if (scrollPos + windowHeight >= documentHeight - 50) {
        const allSections = Array.from(sections);
        current = allSections[allSections.length - 1].getAttribute('id');
    } else {
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
    }
    
    navLinkItems.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    mobileNavItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === `#${current}`) {
            item.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== Skill Bars Animation =====
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.getAttribute('data-progress');
            entry.target.style.width = `${progress}%`;
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ===== SCROLL ANIMATION - LEFT TO RIGHT, ROW BY ROW =====
function initScrollAnimations() {
    // Get grid items separately for proper row-based animation
    const galleryItems = document.querySelectorAll('.gallery-item');
    const projectCards = document.querySelectorAll('.project-card');
    const skillCards = document.querySelectorAll('.skill-card');
    const otherElements = document.querySelectorAll('.section-header, .about-content, .contact-content');
    
    // Helper to setup element with delay
    function setupElement(el, delay) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px) scale(0.95)';
        el.style.transition = `opacity 0.5s ease ${delay}s, transform 0.5s ease ${delay}s`;
    }
    
    // Gallery: 4 columns, delay increases left-to-right then next row
    galleryItems.forEach((el, i) => {
        const delay = i * 0.05; // 50ms between each item
        setupElement(el, delay);
    });
    
    // Projects: delay each card
    projectCards.forEach((el, i) => {
        const delay = i * 0.15; // 150ms between each card
        setupElement(el, delay);
    });
    
    // Skills: 2-3 columns, delay left-to-right
    skillCards.forEach((el, i) => {
        const delay = i * 0.1; // 100ms between each card
        setupElement(el, delay);
    });
    
    // Other elements: no delay needed
    otherElements.forEach(el => {
        setupElement(el, 0);
    });
    
    // Combine all for observer
    const allElements = [...galleryItems, ...projectCards, ...skillCards, ...otherElements];
    
    // Create observer - ONLY hide when COMPLETELY out of view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
            } else if (entry.intersectionRatio === 0) {
                // ONLY reset when completely invisible
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(40px) scale(0.95)';
            }
        });
    }, {
        threshold: [0, 0.1], // Multiple thresholds to detect fully out of view
        rootMargin: '0px 0px -50px 0px'
    });
    
    allElements.forEach(el => observer.observe(el));
}

// ===== TYPING ANIMATION - ONLY SECTION TITLES =====
function initTypingEffects() {
    // Only section titles - NOT cards
    const typingTargets = document.querySelectorAll('.section-title');
    
    // Queue for sequential typing
    let typingQueue = [];
    let isTyping = false;
    
    // Store original text and START EMPTY
    typingTargets.forEach(el => {
        el.dataset.originalText = el.textContent;
        el.dataset.typed = 'false';
        el.textContent = ''; // Start empty - no disappearing effect
    });
    
    // Process queue - type one element at a time
    function processQueue() {
        if (isTyping || typingQueue.length === 0) return;
        
        const element = typingQueue.shift();
        if (element.dataset.typed !== 'false') {
            processQueue(); // Skip if already typed
            return;
        }
        
        isTyping = true;
        element.dataset.typed = 'typing';
        
        const text = element.dataset.originalText;
        element.textContent = '';
        
        let i = 0;
        const speed = 40; // Faster - 40ms per character
        
        function type() {
            if (element.dataset.typed === 'false') {
                isTyping = false;
                processQueue();
                return;
            }
            
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                element.dataset.typed = 'true';
                isTyping = false;
                processQueue(); // Start next in queue
            }
        }
        
        type();
    }
    
    // Add to queue
    function queueTyping(element) {
        if (!typingQueue.includes(element) && element.dataset.typed === 'false') {
            typingQueue.push(element);
            processQueue();
        }
    }
    
    function resetText(element) {
        element.textContent = ''; // Clear text, don't restore
        element.dataset.typed = 'false';
        // Remove from queue if present
        typingQueue = typingQueue.filter(el => el !== element);
    }
    
    const typingObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.target.dataset.typed === 'false') {
                queueTyping(entry.target);
            } else if (entry.intersectionRatio === 0) {
                resetText(entry.target);
            }
        });
    }, {
        threshold: [0, 0.5],
        rootMargin: '0px'
    });
    
    typingTargets.forEach(el => typingObserver.observe(el));
}

// Initialize after DOM ready
document.addEventListener('DOMContentLoaded', initScrollAnimations);
document.addEventListener('DOMContentLoaded', initTypingEffects);

// ===== Code Rotation =====
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
    <span class="variable">self</span>.<span class="property">learning</span> = <span class="boolean">True</span>`
        },
        {
            title: 'goals.json',
            code: `{
  <span class="property">"name"</span>: <span class="string">"Jihan Nugraha"</span>,
  <span class="property">"mission"</span>: <span class="string">"Build apps"</span>,
  <span class="property">"values"</span>: [
    <span class="string">"Clean Code"</span>,
    <span class="string">"User Experience"</span>
  ],
  <span class="property">"open_to_work"</span>: <span class="boolean">true</span>
}`
        }
    ];

    let currentIndex = 0;

    function rotateCode() {
        codeElement.style.opacity = '0';
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % codeSnippets.length;
            codeElement.innerHTML = codeSnippets[currentIndex].code;
            if (codeTitleElement) codeTitleElement.textContent = codeSnippets[currentIndex].title;
            codeElement.style.opacity = '1';
        }, 300);
    }

    codeElement.style.transition = 'opacity 0.3s ease';
    setInterval(rotateCode, 4000);
}

// ===== Typing Animation =====
function initTypingAnimation() {
    const textToType = "Hi, I'm Jihan Nugraha";
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    typingElement.textContent = "";
    let charIndex = 0;
    
    function type() {
        if (charIndex < textToType.length) {
            typingElement.textContent += textToType.charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            typingElement.innerHTML = textToType.replace("Jihan Nugraha", '<span class="highlight">Jihan Nugraha</span>');
        }
    }
    
    // Delay start for 2.5 seconds (after intro / page load)
    setTimeout(type, 1);
}

// Initialize code rotation
document.addEventListener('DOMContentLoaded', () => {
    initCodeRotation();
    updateActiveNav();
});

// ===== Mouse Effects (Desktop Only) =====
const spotlight = document.querySelector('.cursor-spotlight');
const codeWindow = document.querySelector('.code-window');

if (window.innerWidth > 968) {
    document.addEventListener('mousemove', (e) => {
        if (spotlight) {
            spotlight.style.opacity = '1';
            spotlight.style.left = e.clientX + 'px';
            spotlight.style.top = e.clientY + 'px';
        }
        
        if (codeWindow) {
            const rect = codeWindow.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            let rotateY = (e.clientX - centerX) / 50;
            let rotateX = (centerY - e.clientY) / 50;
            
            // Limit rotation to max 15 degrees
            const maxRotation = 15;
            rotateX = Math.max(-maxRotation, Math.min(maxRotation, rotateX));
            rotateY = Math.max(-maxRotation, Math.min(maxRotation, rotateY));
            
            codeWindow.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        if (spotlight) spotlight.style.opacity = '0';
        if (codeWindow) codeWindow.style.transform = 'none';
    });
}

// ===== Background Grid Rotation =====
const bgGrid = document.querySelector('.bg-grid');
if (bgGrid && window.innerWidth > 968) {
    let rotation = 0;
    
    window.addEventListener('scroll', () => {
        rotation += 0.1;
        bgGrid.style.transform = `rotate(${rotation}deg)`;
        bgGrid.classList.add('scrolling');
        clearTimeout(window.scrollTimer);
        window.scrollTimer = setTimeout(() => bgGrid.classList.remove('scrolling'), 200);
    }, { passive: true });
}
