// Physics Overview Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializePhysicsOverview();
});

function initializePhysicsOverview() {
    addCardInteractions();
    addLearningPathInteractions();
    trackUserProgress();
}

function addCardInteractions() {
    const physicsCards = document.querySelectorAll('.physics-card');
    
    physicsCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
        });

        // Add click tracking for analytics
        const readButton = card.querySelector('.btn-primary');
        const quizButton = card.querySelector('.btn-secondary');
        
        if (readButton) {
            readButton.addEventListener('click', function(e) {
                const section = card.dataset.section;
                console.log(`Article clicked: ${section}`);
                // Track article visits
                trackEvent('article_view', section);
            });
        }

        if (quizButton) {
            quizButton.addEventListener('click', function(e) {
                const section = card.dataset.section;
                console.log(`Quiz clicked: ${section}`);
                // Track quiz attempts
                trackEvent('quiz_start', section);
            });
        }
    });
}

function addLearningPathInteractions() {
    const pathSteps = document.querySelectorAll('.path-step');
    
    pathSteps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = this.dataset.step;
            highlightLearningPath(stepNumber);
        });
    });
}

function highlightLearningPath(stepNumber) {
    const allSteps = document.querySelectorAll('.path-step');
    
    allSteps.forEach(step => {
        step.classList.remove('active');
        if (step.dataset.step <= stepNumber) {
            step.classList.add('completed');
        }
    });
    
    const currentStep = document.querySelector(`[data-step="${stepNumber}"]`);
    if (currentStep) {
        currentStep.classList.add('active');
    }
}

function trackUserProgress() {
    // Check if user has completed any quizzes
    const completedQuizzes = getCompletedQuizzes();
    
    // Update progress indicators
    completedQuizzes.forEach(quiz => {
        const section = quiz.replace('-physics-quiz', '');
        const card = document.querySelector(`[data-section="${section}"]`);
        if (card) {
            card.classList.add('completed');
            // Add completion badge
            const badge = document.createElement('div');
            badge.className = 'completion-badge';
            badge.innerHTML = '<i class="fas fa-check-circle"></i>';
            card.querySelector('.physics-card-header').appendChild(badge);
        }
    });
}

function getCompletedQuizzes() {
    // This would normally fetch from localStorage or a server
    // For now, return empty array
    const completed = localStorage.getItem('completedPhysicsQuizzes');
    return completed ? JSON.parse(completed) : [];
}

function trackEvent(eventType, section) {
    // Analytics tracking
    const timestamp = new Date().toISOString();
    const event = {
        type: eventType,
        section: section,
        timestamp: timestamp
    };
    
    // Store in localStorage for now
    const events = getStoredEvents();
    events.push(event);
    localStorage.setItem('physicsEvents', JSON.stringify(events));
}

function getStoredEvents() {
    const events = localStorage.getItem('physicsEvents');
    return events ? JSON.parse(events) : [];
}

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all physics cards
    document.querySelectorAll('.physics-card').forEach(card => {
        observer.observe(card);
    });

    // Observe learning path steps
    document.querySelectorAll('.path-step').forEach(step => {
        observer.observe(step);
    });
}

// Initialize scroll animations when DOM is loaded
document.addEventListener('DOMContentLoaded', addScrollAnimations);

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        trackEvent,
        getCompletedQuizzes,
        highlightLearningPath
    };
}
