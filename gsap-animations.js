// Advanced GSAP Animations for SEVORSE - Optimized Implementation
// Premium micro-interactions with consistent performance

// Configuration
const GSAP_CONFIG = {
    defaultDuration: 0.8,
    defaultEase: 'power2.out',
    fastDuration: 0.3,
    slowDuration: 1.2
};

document.addEventListener('DOMContentLoaded', function() {
    // Check GSAP availability
    if (typeof gsap === 'undefined') {
        console.warn('GSAP not loaded. Please include GSAP library.');
        return;
    }
    
    // Register plugins
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    // Set GSAP defaults for consistency
    gsap.defaults({
        duration: GSAP_CONFIG.defaultDuration,
        ease: GSAP_CONFIG.defaultEase
    });
    
    // Initialize animations in optimal order
    requestAnimationFrame(() => {
        initFramerStyleAnimations();
        initNavigationAnimations();
        initSimpleHeroAnimation();
        initWobblyServiceCards();
        initMicroInteractions();
        initScrollAnimations();
    });
    
    // Defer Lottie initialization
    setTimeout(initLottieAnimations, 300);
    
    console.log('🎨 SEVORSE animations initialized');
});

// Framer-Style Core Animations (Optimized)
function initFramerStyleAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
    
    // Sequence animations efficiently
    tl.from('#home .absolute.top-0', { y: -50, opacity: 0, duration: 0.8 })
      .from('#hero-headline', { y: 50, opacity: 0, duration: 0.8 }, '-=0.2')
      .from('#hero-description', { y: 30, opacity: 0, duration: 0.6 }, '-=0.4')
      // .hero-cta removed as element doesn't exist in DOM
}

// Simple Hero Animation (Optimized)
function initSimpleHeroAnimation() {
    // Get badge element
    const futureBadge = document.querySelector('#future-badge');
    if (!futureBadge) return;
    
    // Badge interactions
    futureBadge.addEventListener('mouseenter', () => {
        gsap.to(futureBadge, { scale: 1.05, duration: GSAP_CONFIG.fastDuration });
    });
    
    futureBadge.addEventListener('mouseleave', () => {
        gsap.to(futureBadge, { scale: 1, duration: GSAP_CONFIG.fastDuration });
    });
    
    futureBadge.addEventListener('click', (e) => {
        e.preventDefault();
        gsap.to(futureBadge, {
            scale: 0.95,
            duration: 0.1,
            onComplete: () => {
                gsap.to(futureBadge, { scale: 1, duration: 0.2, ease: 'back.out(1.7)' });
            }
        });
    });
}

// Navigation Animations (Optimized with event delegation)
function initNavigationAnimations() {
    const navItems = document.querySelectorAll('.nav-item');
    if (!navItems.length) return;
    
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, { y: -2, duration: GSAP_CONFIG.fastDuration });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, { y: 0, duration: GSAP_CONFIG.fastDuration });
        });
        
        item.addEventListener('click', () => {
            gsap.to(item, {
                scale: 0.95,
                duration: 0.1,
                onComplete: () => {
                    gsap.to(item, { scale: 1, duration: 0.2, ease: 'back.out(1.7)' });
                }
            });
        });
    });
}

// Micro Interactions (Optimized)
function initMicroInteractions() {
    // Button hover effects
    const buttons = document.querySelectorAll('button, .btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            gsap.to(this, { scale: 1.05, duration: GSAP_CONFIG.fastDuration });
        });
        
        button.addEventListener('mouseleave', function() {
            gsap.to(this, { scale: 1, duration: GSAP_CONFIG.fastDuration });
        });
        
        button.addEventListener('click', function() {
            gsap.to(this, {
                scale: 0.95,
                duration: 0.1,
                onComplete: () => {
                    gsap.to(this, { scale: 1, duration: 0.2, ease: 'back.out(1.7)' });
                }
            });
        });
    });
    
    // Card hover effects
    const cards = document.querySelectorAll('.card, .service-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            gsap.to(this, {
                y: -5,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                duration: GSAP_CONFIG.fastDuration
            });
        });
        
        card.addEventListener('mouseleave', function() {
            gsap.to(this, {
                y: 0,
                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.05)',
                duration: GSAP_CONFIG.fastDuration
            });
        });
    });
}

// Scroll Animations (Optimized)
function initScrollAnimations() {
    if (typeof ScrollTrigger === 'undefined') return;
    
    // Fade in elements on scroll
    const fadeElements = gsap.utils.toArray('.fade-in');
    fadeElements.forEach(element => {
        gsap.fromTo(element,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: GSAP_CONFIG.defaultDuration,
                scrollTrigger: {
                    trigger: element,
                    start: 'top 85%',
                    toggleActions: 'play none none reverse',
                    once: true
                }
            }
        );
    });
    
    // Parallax effects (reduced scrub for smoother performance)
    const parallaxElements = gsap.utils.toArray('.parallax');
    parallaxElements.forEach(element => {
        gsap.to(element, {
            yPercent: -30,
            ease: 'none',
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 0.5
            }
        });
    });
}

// Wobbly Service Cards (Optimized)
function initWobblyServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    if (!serviceCards.length) return;
    
    serviceCards.forEach((card, index) => {
        let hoverTl = null;
        
        // Mouse enter - create reusable timeline
        card.addEventListener('mouseenter', () => {
            // Kill existing animation if running
            if (hoverTl) hoverTl.kill();
            
            hoverTl = gsap.timeline()
                .to(card, {
                    rotation: 2,
                    x: 5,
                    y: -8,
                    scale: 1.02,
                    duration: GSAP_CONFIG.fastDuration
                })
                .to(card, {
                    rotation: -1,
                    x: -2,
                    y: -5,
                    duration: 0.2
                })
                .to(card, {
                    rotation: 0.5,
                    x: 1,
                    y: -8,
                    duration: 0.2
                });
            
            // Glow effect
            gsap.to(card, {
                boxShadow: '0 25px 50px rgba(1, 142, 239, 0.15), 0 0 0 1px rgba(1, 142, 239, 0.1)',
                duration: GSAP_CONFIG.fastDuration
            });
            
            // Icon animation
            const icon = card.querySelector('.w-16');
            if (icon) {
                gsap.to(icon, {
                    scale: 1.15,
                    rotation: 10,
                    duration: 0.4,
                    ease: 'back.out(1.7)'
                });
            }
        });
        
        // Mouse leave - reset smoothly
        card.addEventListener('mouseleave', () => {
            if (hoverTl) hoverTl.kill();
            
            gsap.to(card, {
                rotation: 0,
                x: 0,
                y: 0,
                scale: 1,
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
                duration: 0.5,
                ease: 'back.out(1.7)'
            });
            
            const icon = card.querySelector('.w-16');
            if (icon) {
                gsap.to(icon, {
                    scale: 1,
                    rotation: 0,
                    duration: GSAP_CONFIG.fastDuration
                });
            }
        });
        
        // Click effect
        card.addEventListener('click', () => {
            gsap.to(card, {
                scale: 0.98,
                duration: 0.1,
                onComplete: () => {
                    gsap.to(card, {
                        scale: 1.02,
                        rotation: 3,
                        duration: GSAP_CONFIG.fastDuration,
                        ease: 'back.out(1.7)',
                        onComplete: () => {
                            gsap.to(card, {
                                scale: 1,
                                rotation: 0,
                                duration: 0.2
                            });
                        }
                    });
                }
            });
        });
        
        // Staggered entrance animation
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.fromTo(card,
                { opacity: 0, y: 50, rotation: -5 },
                {
                    opacity: 1,
                    y: 0,
                    rotation: 0,
                    duration: GSAP_CONFIG.defaultDuration,
                    delay: index * 0.1,
                    ease: 'back.out(1.7)',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        once: true
                    }
                }
            );
        }
    });
}

// DotLottie Animations Integration (Optimized)
function initLottieAnimations() {
    const rocketElements = document.querySelectorAll('.text-6xl, .text-8xl');
    const lottieUrl = 'https://lottie.host/dfc49b1b-bba0-4ee9-8b53-8fbdd5d67f55/YlX1WMRNwJ.lottie';
    
    rocketElements.forEach(element => {
        if (!element.textContent.includes('🚀')) return;
        if (element.tagName === 'SCRIPT') return;
        
        // Determine size based on classes
        const size = element.classList.contains('text-8xl') ? '150px' : '120px';
        
        // Create DotLottie element
        const dotLottieElement = document.createElement('dotlottie-wc');
        dotLottieElement.setAttribute('src', lottieUrl);
        dotLottieElement.setAttribute('autoplay', '');
        dotLottieElement.setAttribute('loop', '');
        dotLottieElement.style.cssText = `width:${size};height:${size};display:block;margin:0 auto;`;
        dotLottieElement.className = 'lottie-animation';
        
        // Replace content
        if (element.textContent.trim() === '🚀') {
            element.textContent = '';
            element.appendChild(dotLottieElement);
        } else {
            element.innerHTML = element.innerHTML.replace('🚀', dotLottieElement.outerHTML);
        }
        
        // Add hover effects to parent
        const parentCard = element.closest('.framer-card, .aspect-video, .group');
        if (parentCard && !parentCard.dataset.lottieInitialized) {
            parentCard.dataset.lottieInitialized = 'true';
            
            parentCard.addEventListener('mouseenter', () => {
                const lottie = parentCard.querySelector('.lottie-animation');
                if (lottie) {
                    gsap.to(lottie, {
                        scale: 1.1,
                        rotation: 5,
                        duration: GSAP_CONFIG.fastDuration
                    });
                }
            });
            
            parentCard.addEventListener('mouseleave', () => {
                const lottie = parentCard.querySelector('.lottie-animation');
                if (lottie) {
                    gsap.to(lottie, {
                        scale: 1,
                        rotation: 0,
                        duration: GSAP_CONFIG.fastDuration
                    });
                }
            });
        }
    });
    
    console.log('🎨 DotLottie animations initialized');
}