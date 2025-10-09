// Main JavaScript for SEVORSE Website
// Premium interactions and utilities

// Utility Functions - Defined at top level for immediate availability
// Debounce function for performance
window.debounce = function(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

// Throttle function for scroll events
window.throttle = function(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Cache for DOM elements to avoid repeated queries
const DOMCache = {
    elements: new Map(),
    get(id) {
        if (!this.elements.has(id)) {
            this.elements.set(id, document.getElementById(id));
        }
        return this.elements.get(id);
    },
    clear() {
        this.elements.clear();
    }
};

// Smooth scrolling for anchor links with safety checks
function initSmoothScrolling() {
    try {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                // Ignore just '#' or empty
                if (!href || href === '#') return;
                const targetId = href.slice(1);
                const target = document.getElementById(targetId);
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });
    } catch (_) {}
}

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionality
    initUtilityFunctions();
    initSmoothScrolling();
    // Ensure pricing robot is visible on load
    const _robot = document.getElementById('pricing-robot');
    if (_robot) { _robot.style.visibility = ''; _robot.style.display = ''; }

    // Initialize mobile menu (portal-based)
    initMobileMenu();
    // Initialize pricing robot/modal
    initPricingRobot();
    // Initialize scroll effects and Vanta background (safe no-ops on mobile)
    initScrollStacking();
    initVantaRings();
    // Lightweight extras
    initPerformanceOptimizations();
    initMagneticElements();

    function initMobileMenu() {
        console.log('🔧 Mobile Menu Init - Starting...');

        const btn = document.getElementById('mobile-menu-btn');
        const source = document.getElementById('mobile-menu');

        if (!btn || !source) {
            console.error('❌ Menu elements missing!', { btn: !!btn, menu: !!source });
            return;
        }

        // Create a body-level portal copy to avoid stacking/overflow issues
        let menu = document.getElementById('mobile-menu-portal');
        if (!menu) {
            menu = document.createElement('div');
            menu.id = 'mobile-menu-portal';
            menu.className = 'nav-menu hidden';
            menu.innerHTML = source.innerHTML;
            document.body.appendChild(menu);
            // Keep original hidden
            source.classList.add('hidden');
        }

        let isOpen = false;

        function enforceMenuOverlayStyles(open) {
            if (!menu) return;
            if (open) {
                menu.style.position = 'fixed';
                menu.style.top = '0';
                menu.style.left = '0';
                menu.style.right = '0';
                menu.style.bottom = '0';
                menu.style.width = '100vw';
                menu.style.height = '100vh';
                menu.style.display = 'flex';
                menu.style.flexDirection = 'column';
                menu.style.background = 'rgba(0,0,0,0.98)';
                menu.style.backdropFilter = 'blur(12px)';
                menu.style.webkitBackdropFilter = 'blur(12px)';
                menu.style.zIndex = '2147483647';
                menu.style.padding = '90px 16px 32px 16px';
                menu.style.overflowY = 'auto';
                menu.style.pointerEvents = 'auto';
            } else {
                menu.removeAttribute('style');
            }
        }

        function toggle() {
            isOpen = !isOpen;
            console.log(isOpen ? '📂 Opening menu' : '📁 Closing menu');

            if (isOpen) {
                menu.classList.remove('hidden');
                menu.classList.add('active');
                enforceMenuOverlayStyles(true);
                btn.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>';
                document.body.style.overflow = 'hidden';
                btn.setAttribute('aria-expanded', 'true');
                menu.setAttribute('aria-hidden', 'false');
                const robot = document.getElementById('pricing-robot');
                if (robot) robot.style.visibility = 'hidden';
            } else {
                menu.classList.add('hidden');
                menu.classList.remove('active');
                enforceMenuOverlayStyles(false);
                btn.querySelector('svg').innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
                document.body.style.overflow = '';
                btn.setAttribute('aria-expanded', 'false');
                menu.setAttribute('aria-hidden', 'true');
                const robot = document.getElementById('pricing-robot');
                if (robot) robot.style.visibility = '';
            }
        }

        btn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggle();
        };

        const links = menu.querySelectorAll('a');
        links.forEach((link, i) => {
            link.onclick = function() {
                if (isOpen) setTimeout(() => toggle(), 50);
            };
        });

        menu.addEventListener('click', (e) => {
            if (e.target === menu && isOpen) toggle();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isOpen) toggle();
        });

        console.log('✅ Mobile menu ready -', links.length, 'links');
    }
});

function closeModal(modal) {
    // Choose a reasonable content element for animation
    const contentEl = modal.querySelector('.pricing-modal-content, .bg-black, .bg-white, .rounded-2xl, .modal-content') 
        || modal.firstElementChild 
        || modal;
    
    if (typeof gsap !== 'undefined') {
        gsap.to(contentEl, {
            scale: 0.95,
            opacity: 0,
            y: 20,
            duration: 0.2,
            ease: 'power2.in',
            onComplete: () => {
                modal.classList.add('hidden');
                document.body.style.overflow = 'auto';
                // Reset styles for next open
                gsap.set(contentEl, { clearProps: 'all' });
            }
        });
    } else {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

// Consultation Form Management
function initConsultationForm() {
    const form = document.getElementById('consultation-form');
    const successDiv = document.getElementById('consultation-success');
    const closeSuccess = document.getElementById('close-success');
    const consultationModal = document.getElementById('consultation-modal');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const name = formData.get('name');
            const email = formData.get('email');
            const message = formData.get('message') || 'No specific message provided.';
            
            // Show loading state
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Send email using EmailJS or mailto (simplified version)
                await sendConsultationEmail(name, email, message);
                
                // Hide form and show success message
                form.style.display = 'none';
                successDiv.classList.remove('hidden');
                
                // Reset form
                form.reset();
                
            } catch (error) {
                console.error('Error sending consultation request:', error);
                showNotification('Sorry, there was an error sending your request. Please try again or contact us directly.', 'error');
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    if (closeSuccess && consultationModal) {
        closeSuccess.addEventListener('click', () => {
            // Reset modal state
            form.style.display = 'block';
            successDiv.classList.add('hidden');
            closeModal(consultationModal);
        });
    }
}

// Email Sending Function
async function sendConsultationEmail(name, email, message) {
    // Create mailto link as fallback
    const subject = `Consultation Request from ${name}`;
    const body = `
New consultation request from SEVORSE website:

Name: ${name}
Email: ${email}
Message: ${message}

Sent from: www.sevorse.com
Time: ${new Date().toLocaleString()}
    `;
    
    // For now, we'll use a simple mailto approach
    // In production, you would integrate with EmailJS, Formspree, or your backend
    const mailtoLink = `mailto:contact@sevorse.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Simulate async operation
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                // Open default email client
                window.location.href = mailtoLink;
                resolve();
            } catch (error) {
                console.error('Failed to open email client:', error);
                reject(new Error('Failed to open email client. Please contact us directly at contact@sevorse.com'));
            }
        }, 1000);
    });
}

// Pricing Robot Functionality (Optimized)
function initPricingRobot() {
    const robot = DOMCache.get('pricing-robot');
    const pricingModal = DOMCache.get('pricing-modal');
    const closeBtn = DOMCache.get('close-pricing-modal');
    
    if (!robot || !pricingModal) return;
    
    // Robot click handler
    robot.addEventListener('click', (e) => {
        e.preventDefault();
        pricingModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        // Hide floating button while modal is open to avoid overlap
        robot.style.display = 'none';
        
        // Optimized animations
        if (typeof gsap !== 'undefined') {
            gsap.to(robot, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
            
            const content = pricingModal.querySelector('.pricing-modal-content');
            if (content) {
                gsap.fromTo(content,
                    { scale: 0.8, opacity: 0, y: 50 },
                    { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)' }
                );
            }
        }
    });
    
    // Close handlers
    const closePricingModal = () => {
        if (typeof gsap !== 'undefined') {
            const content = pricingModal.querySelector('.pricing-modal-content');
            if (content) {
                gsap.to(content, {
                    scale: 0.8, opacity: 0, y: 50, duration: 0.3,
                    onComplete: () => {
                        pricingModal.classList.add('hidden');
                        document.body.style.overflow = 'auto';
                        // Restore floating button
                        robot.style.display = '';
                        const mobileStack = document.getElementById('mobile-pricing-stack');
                        if (mobileStack) mobileStack.setAttribute('aria-hidden', 'true');
                    }
                });
            } else {
                closeModal(pricingModal);
                robot.style.display = '';
            }
        } else {
            closeModal(pricingModal);
            robot.style.display = '';
        }
    };
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closePricingModal);
    }
    
    pricingModal.addEventListener('click', (e) => {
        if (e.target === pricingModal) closePricingModal();
    });
    
    // Initialize package toggle functionality
    initPackageToggle();

    // Show mobile pricing stack when modal opens
    const observer = new MutationObserver(() => {
        const mobileStack = document.getElementById('mobile-pricing-stack');
        if (!mobileStack) return;
        const isOpen = !pricingModal.classList.contains('hidden');
        if (window.innerWidth < 768) {
            mobileStack.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
            mobileStack.style.display = isOpen ? 'block' : 'none';
        } else {
            mobileStack.setAttribute('aria-hidden', 'true');
            mobileStack.style.display = 'none';
        }
    });
    observer.observe(pricingModal, { attributes: true, attributeFilter: ['class'] });
}

// Package Toggle Functionality
function initPackageToggle() {
    const toggle = document.getElementById('unlock-packages-toggle');
    const packageCards = document.querySelectorAll('.package-card');
    
    if (!toggle || packageCards.length === 0) return;
    
    // Set initial state - packages are BLURRED by default
    packageCards.forEach(card => card.classList.add('blurred'));
    
    toggle.addEventListener('change', () => {
        const isUnblurred = toggle.checked;
        
        packageCards.forEach((card, index) => {
            if (isUnblurred) {
                // Un-blur animation with staggered delay
                setTimeout(() => {
                    card.classList.remove('blurred');
                    
                    // GSAP animation if available
                    if (typeof gsap !== 'undefined') {
                        gsap.to(card, {
                            opacity: 1,
                            scale: 1,
                            duration: 0.5,
                            ease: 'power2.out'
                        });
                    }
                }, index * 100); // Stagger by 100ms
            } else {
                // Blur animation
                setTimeout(() => {
                    card.classList.add('blurred');
                    
                    // GSAP animation if available
                    if (typeof gsap !== 'undefined') {
                        gsap.to(card, {
                            opacity: 0.5,
                            scale: 0.98,
                            duration: 0.4,
                            ease: 'power2.in'
                        });
                    }
                }, index * 100); // Stagger by 100ms
            }
        });
    });

    // On small screens, force unblur for readability
    const forceMobileReadable = () => {
        if (window.innerWidth < 768) {
            packageCards.forEach(card => card.classList.remove('blurred'));
        }
    };

    // Ensure readability on small screens and keep updated on resize
    forceMobileReadable();
    window.addEventListener('resize', debounce(forceMobileReadable, 150));
}

// Magnetic Elements Effect (Optimized)
function initMagneticElements() {
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-item');
    
    magneticElements.forEach(element => {
        let rafId = null;
        
        element.addEventListener('mousemove', function(e) {
            if (rafId) return; // Throttle using RAF
            
            rafId = requestAnimationFrame(() => {
                const rect = this.getBoundingClientRect();
                const x = (e.clientX - rect.left - rect.width / 2) * 0.1;
                const y = (e.clientY - rect.top - rect.height / 2) * 0.1;
                this.style.transform = `translate(${x}px, ${y}px)`;
                rafId = null;
            });
        });
        
        element.addEventListener('mouseleave', function() {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
            this.style.transform = 'translate(0, 0)';
        });
    });
}

// Performance Optimizations
function initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Optimize scroll performance
    let ticking = false;
    function updateOnScroll() {
        // Scroll-based optimizations
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
        }
    }, { passive: true });
    
    // Preload critical resources
    const preloadLinks = [
        'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

function initUtilityFunctions() {
    // Note: debounce and throttle are now defined at top level
    // This function kept for other utility initializations
    
    // Check if element is in viewport
    window.isInViewport = function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };
    
    // Get scroll percentage
    window.getScrollPercentage = function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        return (scrollTop / scrollHeight) * 100;
    };
    
    // Copy text to clipboard
    window.copyToClipboard = function(text) {
        if (navigator.clipboard) {
            return navigator.clipboard.writeText(text);
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            return Promise.resolve();
        }
    };
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 16px 24px;
        border-radius: 12px;
        color: var(--text-primary);
        font-weight: 500;
        z-index: 10000;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
    `;
    
    switch(type) {
        case 'success':
            notification.style.background = 'rgba(16, 185, 129, 0.9)';
            notification.style.border = '1px solid rgba(16, 185, 129, 0.3)';
            break;
        case 'error':
            notification.style.background = 'rgba(239, 68, 68, 0.9)';
            notification.style.border = '1px solid rgba(239, 68, 68, 0.3)';
            break;
        default:
            notification.style.background = 'rgba(212, 175, 55, 0.9)';
            notification.style.border = '1px solid rgba(212, 175, 55, 0.3)';
    }
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Interactive CTA Section with Color Changing (Optimized)
function initInteractiveCTASection() {
    const ctaSection = DOMCache.get('cta-section');
    const bookCard = DOMCache.get('book-card');
    const aboutCard = DOMCache.get('about-card');
    
    if (!ctaSection || !bookCard || !aboutCard) return;
    
    let currentBg = 'default';
    const originalClasses = ctaSection.className;
    const originalBookCardClasses = bookCard.className;
    const originalAboutCardClasses = aboutCard.className;
    let transitionTimer = null;
    
    const setBg = (type, sectionClasses) => {
        if (currentBg === type) return;
        currentBg = type;
        ctaSection.className = sectionClasses;
        // Just change background colors, keep layout classes
        bookCard.classList.remove('bg-sevorse-blue', 'bg-sevorse-charcoal', 'bg-white', 'text-white', 'text-gray-900');
        bookCard.classList.add('bg-white', 'text-gray-900', 'shadow-2xl');
        aboutCard.classList.remove('bg-sevorse-blue', 'bg-sevorse-charcoal', 'bg-white', 'text-white', 'text-gray-900');
        aboutCard.classList.add('bg-white', 'text-gray-900', 'shadow-2xl');
    };
    
    bookCard.addEventListener('mouseenter', () => {
        if (window.innerWidth < 768) return; // simplify on mobile
        clearTimeout(transitionTimer);
        setBg('blue', 'relative overflow-hidden transition-all duration-1000 ease-out bg-blue-400 min-h-screen');
    });
    
    aboutCard.addEventListener('mouseenter', () => {
        if (window.innerWidth < 768) return; // simplify on mobile
        clearTimeout(transitionTimer);
        setBg('charcoal', 'relative overflow-hidden transition-all duration-1000 ease-out bg-gray-600 min-h-screen');
    });
    
    ctaSection.addEventListener('mouseleave', () => {
        clearTimeout(transitionTimer);
        transitionTimer = setTimeout(() => {
            currentBg = 'default';
            ctaSection.className = originalClasses;
            bookCard.className = originalBookCardClasses;
            aboutCard.className = originalAboutCardClasses;
        }, 300);
    });
    
    // Optimized click handlers
    bookCard.addEventListener('click', () => {
        bookCard.style.transform = 'scale(0.95)';
        ctaSection.style.background = 'linear-gradient(135deg, #018EEF, #004799)';
        
        setTimeout(() => {
            bookCard.style.transform = '';
            if (window.SEV_ORSE && window.SEV_ORSE.showNotification) {
                window.SEV_ORSE.showNotification('🚀 Consultation booking opened!', 'success');
            }
        }, 150);
    });
    
    aboutCard.addEventListener('click', () => {
        aboutCard.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            aboutCard.style.transform = '';
            const aboutSection = DOMCache.get('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 150);
    });
}

// Window resize handler
window.addEventListener('resize', debounce(function() {
    // Handle responsive adjustments
    if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
    }
    // Resize Lottie canvases/containers if present
    try {
        const lotties = document.querySelectorAll('dotlottie-wc');
        lotties.forEach(el => {
            // Force reflow by toggling width; ensures proper resize in some browsers
            const prev = el.style.width;
            el.style.width = '99.9%';
            requestAnimationFrame(() => { el.style.width = prev || '100%'; });
        });
    } catch(_) {}
    // Reduce animation intensity on narrow screens
    if (window.innerWidth < 768) {
        document.body.classList.add('mobile-perf-mode');
    } else {
        document.body.classList.remove('mobile-perf-mode');
    }
}, 250));

// Initialize interactive CTA section when DOM is ready
// Initialize Interactive CTA Section
setTimeout(() => {
    initInteractiveCTASection();
}, 2000); // Delay to ensure other animations are loaded

// Scroll-triggered stacking effect (Optimized)
function initScrollStacking() {
    // Disable ALL ScrollTrigger animations on mobile for performance
    if (window.innerWidth < 768) {
        console.log('📱 Mobile detected - ScrollTrigger animations DISABLED for performance');
        
        // Simply show all elements immediately on mobile
        const sections = document.querySelectorAll('.stackable-section');
        sections.forEach((section) => {
            const keyElements = section.querySelectorAll('h1, h2, .framer-card:not(.testimonial-card)');
            keyElements.forEach(el => {
                el.style.opacity = '1';
                el.style.transform = 'none';
            });
        });
        
        // Run counter animations immediately on mobile
        const counters = document.querySelectorAll('.counter[data-target]');
        if (counters.length) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const el = entry.target;
                    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
                    
                    let startTime = null;
                    const duration = 1200;
                    
                    const animate = (timestamp) => {
                        if (!startTime) startTime = timestamp;
                        const progress = Math.min((timestamp - startTime) / duration, 1);
                        el.textContent = Math.floor(progress * target).toString();
                        
                        if (progress < 1) {
                            requestAnimationFrame(animate);
                        }
                    };
                    
                    requestAnimationFrame(animate);
                    observer.unobserve(el);
                });
            }, { threshold: 0.3 });
            
            counters.forEach(counter => observer.observe(counter));
        }
        
        return; // Exit early - no GSAP/ScrollTrigger on mobile
    }
    
    // Desktop: Full ScrollTrigger animations
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.log('⚠️ GSAP or ScrollTrigger not loaded');
        return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const sections = document.querySelectorAll('.stackable-section');

    sections.forEach((section) => {
        // Only animate key elements to reduce lag
        const keyElements = section.querySelectorAll('h1, h2, .framer-card:not(.testimonial-card)');
        
        if (keyElements.length > 0) {
            gsap.fromTo(keyElements,
                { opacity: 0, y: 20 },
                {
                    scrollTrigger: {
                        trigger: section,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                        once: true
                    },
                    opacity: 1,
                    y: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: 'power1.out',
                    clearProps: 'transform,opacity'
                }
            );
        }
    });

    // Optimized counter animation
    const counters = document.querySelectorAll('.counter[data-target]');
    if (counters.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10) || 0;
                
                let startTime = null;
                const duration = 1200;
                
                const animate = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = Math.min((timestamp - startTime) / duration, 1);
                    el.textContent = Math.floor(progress * target).toString();
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                };
                
                requestAnimationFrame(animate);
                observer.unobserve(el);
            });
        }, { threshold: 0.3 });
        
        counters.forEach(counter => observer.observe(counter));
    }

    console.log('✅ Scroll animations initialized');
}
// Fallback reveal if ScrollTrigger effects are not applied
function initIORevealFallback() {
    try {
        const ioEls = document.querySelectorAll('.io-reveal');
        if (!ioEls.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('in-view');
                    io.unobserve(e.target);
                }
            })
        }, { threshold: 0.2 });
        ioEls.forEach(el => io.observe(el));
    } catch (e) {
        console.warn('IO reveal fallback error', e);
    }
}

// Gallery functionality - now links to separate page
function initGallery() {
    const galleryBtn = document.getElementById('gallery-btn');
    
    if (!galleryBtn) {
        console.log('⚠️ Gallery button not found');
        return;
    }
    
    console.log('🖼️ Gallery button initialized - links to separate page');
}

// Export main functions for external use
window.SEV_ORSE = {
    showNotification,
    copyToClipboard: window.copyToClipboard,
    isInViewport: window.isInViewport,
    getScrollPercentage: window.getScrollPercentage,
    debounce: window.debounce,
    throttle: window.throttle,
    initScrollStacking
};

// Hero badge removed - flash animation no longer needed

// ===============================
// Vanta.js RINGS Background - Lazy Loading with Performance Optimization
// ===============================
function initVantaRings() {
    let vantaEffect = null;
    let isInitialized = false;
    let scriptsLoaded = false;
    
    const aboutSection = document.getElementById('about');
    const vantaContainer = document.getElementById('vanta-rings-bg');
    const weRandomizer = document.getElementById('we-randomizer');
    
    // Function to load scripts dynamically
    const loadVantaScripts = () => {
        if (scriptsLoaded) return Promise.resolve();
        
        return new Promise((resolve) => {
            // Load Three.js first
            const threeScript = document.createElement('script');
            threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js';
            threeScript.onload = () => {
                // Then load Vanta
                const vantaScript = document.createElement('script');
                vantaScript.src = 'https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.net.min.js';
                vantaScript.onload = () => {
                    scriptsLoaded = true;
                    resolve();
                };
                document.head.appendChild(vantaScript);
            };
            document.head.appendChild(threeScript);
        });
    };
    
    if (!aboutSection || !vantaContainer) {
        console.error('❌ Vanta RINGS: Required elements not found', {
            aboutSection: !!aboutSection,
            vantaContainer: !!vantaContainer
        });
        return;
    }
    
    console.log('✅ Vanta RINGS: Elements found, setting up...');
    
    // Sevorse brand color palette - White, Black, and Blue shades only
    const brandColors = [
        0x3b82f6,  // Sevorse primary blue
        0x1976D2,  // Sevorse brand blue
        0x1565C0,  // Sevorse dark blue
        0x4AA8F0,  // Sevorse light blue
        0x60a5fa,  // Bright blue (blue-400)
        0x93c5fd,  // Light blue (blue-300)
        0x0284c7,  // Sky blue (sky-600)
        0xbfdbfe,  // Pale blue (blue-200)
        0xffffff,  // Pure white
        0xe0e7ff   // Very light blue (indigo-100)
    ];
    
    let currentColorIndex = 0;
    
    // Initialize Vanta with specific color - mobile optimized - BLUE/WHITE ONLY
    const createVantaEffect = (colorHex = 0x3b82f6) => {
        if (typeof VANTA !== 'undefined' && typeof THREE !== 'undefined') {
            if (vantaEffect) vantaEffect.destroy();
            
            // Detect mobile for performance optimization
            const isMobile = window.innerWidth < 768;
            
            vantaEffect = VANTA.NET({
                el: vantaContainer,
                mouseControls: !isMobile,
                touchControls: true,
                gyroControls: false,
                minHeight: 200.00,
                minWidth: 200.00,
                scale: 1.00,
                scaleMobile: 1.00,
                backgroundColor: 0x0A0F1F, // Dark blue-black background
                color: colorHex, // Network color (cycles through blues)
                points: isMobile ? 6.00 : 12.00,
                maxDistance: isMobile ? 14.00 : 22.00,
                spacing: isMobile ? 18.00 : 15.00,
                showDots: true
            });
            // Attach safe resize handler
            window.addEventListener('resize', debounce(() => {
                try {
                    if (vantaEffect && typeof vantaEffect.resize === 'function') vantaEffect.resize();
                } catch(_) {}
            }, 200));
        } else {
            setTimeout(() => createVantaEffect(colorHex), 100);
        }
    };
    
    // Randomize color handler - attached to "WE" text
    if (weRandomizer) {
        weRandomizer.addEventListener('click', () => {
            currentColorIndex = (currentColorIndex + 1) % brandColors.length;
            const newColor = brandColors[currentColorIndex];
            createVantaEffect(newColor);
            
            // Add a quick pulse effect to WE text
            weRandomizer.style.transform = 'scale(1.1)';
            setTimeout(() => {
                weRandomizer.style.transform = 'scale(1)';
            }, 150);
        });
        
        // Add transition for smooth scale effect
        weRandomizer.style.transition = 'transform 0.15s ease';
    }
    
    // Intersection Observer - Load once and keep loaded (no aggressive destroy)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Initialize when section is visible
            if (entry.isIntersecting && !isInitialized) {
                isInitialized = true;
                loadVantaScripts().then(() => {
                    createVantaEffect(brandColors[0]);
                });
            }
            // Keep Vanta loaded - don't destroy on scroll for smooth experience
        });
    }, {
        threshold: 0.1,
        rootMargin: '100px'
    });
    
    observer.observe(aboutSection);
    
    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (vantaEffect) {
            vantaEffect.destroy();
        }
    });
}

// (Vanta is initialized inside the main DOMContentLoaded init below)