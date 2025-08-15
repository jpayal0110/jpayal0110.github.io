// Portfolio Website JavaScript

// Theme management
let currentTheme = localStorage.getItem('theme') || 'light';

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme
    initTheme();
    
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initCounterAnimations();
    initParallaxEffects();
    initNameTypingEffect();
    initCodeTypingEffect();
});

// Theme initialization and toggle functionality
function initTheme() {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    
    // Apply saved theme
    applyTheme(currentTheme);
    
    // Theme toggle event listener
    themeToggle.addEventListener('click', function() {
        currentTheme = currentTheme === 'light' ? 'dark' : 'light';
        applyTheme(currentTheme);
        localStorage.setItem('theme', currentTheme);
    });
}

function applyTheme(theme) {
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const navbar = document.querySelector('.navbar');
    
    if (theme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
        themeIcon.style.color = '#ffd700';
        
        // Update navbar immediately for dark theme
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 26, 26, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    } else {
        body.setAttribute('data-theme', 'light');
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeIcon.className = 'fas fa-moon';
        themeIcon.style.color = '';
        
        // Update navbar immediately for light theme
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const isDark = document.body.getAttribute('data-theme') === 'dark';
        
        if (window.scrollY > 100) {
            if (isDark) {
                navbar.style.background = 'rgba(26, 26, 26, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            }
        } else {
            if (isDark) {
                navbar.style.background = 'rgba(26, 26, 26, 0.95)';
                navbar.style.boxShadow = 'none';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        }
    });
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => observer.observe(item));

    // Observe project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => observer.observe(card));

    // Observe education cards
    const educationCards = document.querySelectorAll('.education-card');
    educationCards.forEach(card => observer.observe(card));

    // Observe stat items
    const statItems = document.querySelectorAll('.stat-item');
    statItems.forEach(item => observer.observe(item));
}

// Counter animations for statistics
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
                // Add % symbol for the 35% counter
                if (target === 35) {
                    counter.textContent = target + '%';
                }
                // Add K+ symbol for the 300K+ counter
                if (target === 300) {
                    counter.textContent = target + 'K+';
                }
            }
        };

        updateCounter();
    };

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
}





// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Enhanced scroll animations with fade-in effects
function initParallaxEffects() {
    // Add fade-in effect to all sections
    const sections = document.querySelectorAll('section');
    
    const sectionObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.classList.add('fade-in');
        sectionObserver.observe(section);
    });
}


// Typing effect for name only
function initNameTypingEffect() {
    // Typing effect for name
    const nameElement = document.querySelector('.name');
    if (nameElement) {
        const text = nameElement.textContent;
        nameElement.textContent = '';
        nameElement.style.borderRight = '3px solid #667eea';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                nameElement.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    nameElement.style.borderRight = 'none';
                }, 1000);
            }
        };
        
        // Start typing effect after a short delay
        setTimeout(typeWriter, 500);
    }
}



// Typing effect for code symbols
function initCodeTypingEffect() {
    const codeLines = document.querySelectorAll('.code-line');
    codeLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        
        // Add cursor to the line
        line.style.borderRight = '2px solid #667eea';
        
        let i = 0;
        const typeCode = () => {
            if (i < text.length) {
                line.textContent += text.charAt(i);
                i++;
                setTimeout(typeCode, 50); // Faster typing for code
            } else {
                // Remove cursor after typing is complete
                setTimeout(() => {
                    line.style.borderRight = 'none';
                }, 500);
            }
        };
        
        // Start typing each line with staggered delay
        setTimeout(typeCode, 500 + (index * 300)); // Start same time as name, then stagger each line
    });
}

// Smooth scrolling utility function
function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Copy email functionality
function copyEmail() {
    const email = 'jpayal0110@gmail.com';
    navigator.clipboard.writeText(email).then(function() {
        showNotification('Email copied to clipboard!', 'success');
    }).catch(function() {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Email copied to clipboard!', 'success');
    });
}

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.05)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effects to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// Add scroll progress indicator
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        z-index: 10001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Initialize scroll progress
document.addEventListener('DOMContentLoaded', initScrollProgress);

// Enhanced interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth hover effects to all interactive elements
    addSmoothHoverEffects();
    
    // Initialize floating elements
    initFloatingElements();
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Initialize scroll-triggered animations
    initScrollAnimations();
});

// Add smooth hover effects to interactive elements
function addSmoothHoverEffects() {
    // Add hover effects to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(102, 126, 234, 0.3)';
        });
    });
    
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add hover effects to education cards
    const educationCards = document.querySelectorAll('.education-card');
    educationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Create dynamic floating elements
function initFloatingElements() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create floating dots
    for (let i = 0; i < 8; i++) {
        createFloatingDot(hero);
    }
    
    // Create floating shapes
    createFloatingShape(hero, 'triangle');
    createFloatingShape(hero, 'square');
    createFloatingShape(hero, 'circle');
}

function createFloatingDot(container) {
    const dot = document.createElement('div');
    dot.className = 'floating-dot';
    dot.style.cssText = `
        position: absolute;
        width: ${Math.random() * 6 + 4}px;
        height: ${Math.random() * 6 + 4}px;
        background: ${getRandomColor()};
        border-radius: 50%;
        opacity: ${Math.random() * 0.4 + 0.2};
        top: ${Math.random() * 80 + 10}%;
        left: ${Math.random() * 80 + 10}%;
        animation: float ${Math.random() * 10 + 8}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
        pointer-events: none;
        z-index: 1;
    `;
    container.appendChild(dot);
}

function createFloatingShape(container, shapeType) {
    const shape = document.createElement('div');
    shape.className = `floating-shape ${shapeType}`;
    container.appendChild(shape);
}

function getRandomColor() {
    const colors = ['#8b7355', '#a67c52', '#daa520', '#b8860b'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Parallax scrolling effects
function initParallaxEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Enhanced scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Add staggered animation to child elements
                const children = entry.target.querySelectorAll('[data-animation-order]');
                children.forEach((child, index) => {
                    child.style.setProperty('--animation-order', index);
                    child.style.animationDelay = `${index * 0.1}s`;
                });
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    const elementsToObserve = document.querySelectorAll('.fade-in, .project-card, .education-card, .timeline-item, .skill-tag');
    elementsToObserve.forEach(el => observer.observe(el));
}

// Add typing effect to text elements
function initTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        element.innerHTML = '<span class="typing-cursor"></span>';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                element.innerHTML = text.substring(0, i + 1) + '<span class="typing-cursor"></span>';
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Start typing when element comes into view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(typeWriter, 500);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(element);
    });
}

// Initialize typing effects
document.addEventListener('DOMContentLoaded', initTypingEffect);
