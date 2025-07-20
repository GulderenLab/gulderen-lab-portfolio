// Modern Floating Cards - Enhanced Interactions
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    const cardButtons = document.querySelectorAll('.card-button');
    
    // Enhanced card interactions
    cards.forEach((card, index) => {
        // Mouse move effect for 3D tilt
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                translateY(-20px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                scale(1.05)
            `;
        });
        
        // Reset transform on mouse leave
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
        });
        
        // Click effect for mobile devices
        card.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                card.classList.toggle('flipped');
            }
        });
        
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationPlayState = 'running';
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        observer.observe(card);
    });
    
    // Button interactions
    cardButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Ripple effect
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                pointer-events: none;
                animation: ripple 0.6s ease-out;
            `;
            
            button.style.position = 'relative';
            button.appendChild(ripple);
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 600);
            
            // Button action feedback
            button.style.transform = 'scale(0.95)';
            setTimeout(() => {
                button.style.transform = '';
            }, 150);
            
            // Simulate button action
            console.log(`Button clicked: ${button.textContent}`);
        });
    });
    
    // Parallax effect for background
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = document.querySelector('body');
        const speed = scrolled * 0.5;
        
        parallax.style.backgroundPosition = `center ${speed}px`;
    });
    
    // Dynamic color themes
    const colorThemes = [
        { primary: '#667eea', secondary: '#764ba2' },
        { primary: '#f093fb', secondary: '#f5576c' },
        { primary: '#4facfe', secondary: '#00f2fe' },
        { primary: '#43e97b', secondary: '#38f9d7' },
        { primary: '#fa709a', secondary: '#fee140' },
        { primary: '#a8edea', secondary: '#fed6e3' }
    ];
    
    // Apply theme to each card
    cards.forEach((card, index) => {
        const theme = colorThemes[index % colorThemes.length];
        const icon = card.querySelector('.card-icon');
        const button = card.querySelector('.card-button');
        
        if (icon) {
            icon.style.background = `linear-gradient(145deg, ${theme.primary}, ${theme.secondary})`;
            icon.style.boxShadow = `0 8px 16px ${theme.primary}33`;
        }
        
        if (button) {
            button.style.background = `linear-gradient(145deg, ${theme.primary}, ${theme.secondary})`;
            button.style.boxShadow = `0 4px 15px ${theme.primary}66`;
            
            button.addEventListener('mouseenter', function() {
                this.style.background = `linear-gradient(145deg, ${theme.secondary}, ${theme.primary})`;
                this.style.boxShadow = `0 6px 20px ${theme.primary}99`;
            });
            
            button.addEventListener('mouseleave', function() {
                this.style.background = `linear-gradient(145deg, ${theme.primary}, ${theme.secondary})`;
                this.style.boxShadow = `0 4px 15px ${theme.primary}66`;
            });
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            // Enhanced focus styles for accessibility
            const focusedCard = document.activeElement.closest('.card');
            if (focusedCard) {
                focusedCard.style.outline = '3px solid #667eea';
                focusedCard.style.outlineOffset = '5px';
            }
        }
    });
    
    // Performance optimization - Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Reset any transforms on resize
            cards.forEach(card => {
                card.style.transform = '';
            });
        }, 250);
    });
    
    // Preload hover states for better performance
    const style = document.createElement('style');
    style.textContent = `
        .card-preload {
            transition: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Remove preload class after initial load
    setTimeout(() => {
        cards.forEach(card => {
            card.classList.remove('card-preload');
        });
    }, 100);
});

// Add ripple animation keyframes
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        from {
            transform: scale(0);
            opacity: 1;
        }
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .card.flipped .card-inner {
        transform: rotateY(180deg);
    }
    
    .card:focus {
        outline: 3px solid #667eea;
        outline-offset: 5px;
    }
`;
document.head.appendChild(rippleStyles);
