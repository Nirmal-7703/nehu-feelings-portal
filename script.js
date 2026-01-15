// ===========================
// GLOBAL VARIABLES & UTILITIES
// ===========================

// ⚠️ Formspree endpoint for email integration
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xbddlkjd';

// Email integration function using Formspree
async function sendEmail(emotion, message) {
    const timestamp = new Date().toLocaleString();
    
    const formData = {
        emotion: emotion,
        message: message,
        timestamp: timestamp,
        subject: `💕 ${emotion.charAt(0).toUpperCase() + emotion.slice(1)} feelings from Nehu`,
        _replyto: 'nehu@feelings.com',
        _subject: `💕 ${emotion.charAt(0).toUpperCase() + emotion.slice(1)} feelings from Nehu`
    };
    
    try {
        const response = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            console.log('✅ Email sent successfully via Formspree');
            return true;
        } else {
            console.error('❌ Formspree error:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Network error:', error);
        return false;
    }
}

// Utility function to add multiple event listeners
function addEventListeners(element, events, handler) {
    events.split(' ').forEach(event => {
        element.addEventListener(event, handler);
    });
}

// Utility function to create and show animations
function showMessage(messageElement, additionalAnimations = null) {
    messageElement.classList.remove('hidden');
    messageElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
    });
    
    // Execute additional animations if provided
    if (additionalAnimations) {
        additionalAnimations();
    }
}

// ===========================
// PAGE TRANSITION EFFECTS
// ===========================

// Add page transition effects
document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in effect to body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    
    // Fade in the page
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add page transition when clicking links
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && link.href && !link.href.includes('#')) {
        e.preventDefault();
        
        // Fade out effect
        document.body.style.transition = 'opacity 0.3s ease-in-out';
        document.body.style.opacity = '0';
        
        // Navigate to new page after fade out
        setTimeout(() => {
            window.location.href = link.href;
        }, 300);
    }
});

// ===========================
// HOMEPAGE INTERACTIONS
// ===========================

// Enhanced mood card interactions
if (document.querySelector('.homepage')) {
    const moodCards = document.querySelectorAll('.mood-card');
    
    moodCards.forEach(card => {
        // Add magnetic effect
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-15px) scale(1.05)';
            
            // Add gentle pulse to the icon
            const icon = this.querySelector('.card-icon');
            icon.style.animation = 'bounce 0.6s ease-in-out';
        });
        
        card.addEventListener('mouseleave', function(e) {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click ripple effect
        card.addEventListener('click', function(e) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: rippleEffect 0.6s linear;
                pointer-events: none;
            `;
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rippleEffect {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .mood-card {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);
}

// ===========================
// FORM HANDLING & ANIMATIONS
// ===========================

// Sad page functionality
if (document.getElementById('sadForm')) {
    const form = document.getElementById('sadForm');
    const textarea = document.getElementById('sadMessage');
    const submitButton = form.querySelector('.submit-button');
    const responseMessage = document.getElementById('responseMessage');
    
    // Add typing animation to placeholder
    let placeholderText = "Pour your heart out here... I'm listening with love 💙";
    let currentText = "";
    let isTyping = false;
    
    textarea.addEventListener('focus', function() {
        if (!isTyping && this.value === "") {
            isTyping = true;
            this.placeholder = "";
            typeText();
        }
    });
    
    function typeText() {
        if (currentText.length < placeholderText.length) {
            currentText += placeholderText[currentText.length];
            textarea.placeholder = currentText;
            setTimeout(typeText, 50);
        } else {
            isTyping = false;
        }
    }
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (textarea.value.trim()) {
            // Button loading animation
            submitButton.innerHTML = '<span class="button-text">Sending hug...</span> <span class="button-icon">🫂</span>';
            submitButton.disabled = true;
            
            // Add gentle rain effect
            const rainContainer = document.querySelector('.rain');
            rainContainer.style.opacity = '0.8';
            
            // Send email via Formspree
            const success = await sendEmail('sad', textarea.value);
            
            setTimeout(() => {
                showMessage(responseMessage, () => {
                    // Reset form
                    textarea.value = '';
                    submitButton.innerHTML = '<span class="button-text">Send for Hug</span> <span class="button-icon">🫂</span>';
                    submitButton.disabled = false;
                    rainContainer.style.opacity = '0.3';
                });
            }, 2000);
        }
    });
}

// Angry page functionality
if (document.getElementById('angryForm')) {
    const form = document.getElementById('angryForm');
    const textarea = document.getElementById('angryMessage');
    const submitButton = form.querySelector('.submit-button');
    const responseMessage = document.getElementById('responseMessage');
    const body = document.body;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (textarea.value.trim()) {
            // Button loading animation
            submitButton.innerHTML = '<span class="button-text">Releasing...</span> <span class="button-icon">🔥</span>';
            submitButton.disabled = true;
            
            // Add screen shake effect
            body.classList.add('shake');
            
            // Intensify flame particles
            const flames = document.querySelectorAll('.flame');
            flames.forEach(flame => {
                flame.style.animationDuration = '1s';
                flame.style.opacity = '1';
            });
            
            // Send email via Formspree
            const success = await sendEmail('angry', textarea.value);
            
            setTimeout(() => {
                body.classList.remove('shake');
                
                showMessage(responseMessage, () => {
                    // Reset form and effects
                    textarea.value = '';
                    submitButton.innerHTML = '<span class="button-text">Release Anger</span> <span class="button-icon">🔥</span>';
                    submitButton.disabled = false;
                    
                    // Reset flame particles
                    flames.forEach(flame => {
                        flame.style.animationDuration = '3s';
                        flame.style.opacity = '0.8';
                    });
                });
            }, 1500);
        }
    });
}

// Overthinking page functionality
if (document.getElementById('overthinkingForm')) {
    const form = document.getElementById('overthinkingForm');
    const textarea = document.getElementById('overthinkingMessage');
    const submitButton = form.querySelector('.submit-button');
    const responseMessage = document.getElementById('responseMessage');
    const container = document.querySelector('.container');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (textarea.value.trim()) {
            // Button loading animation
            submitButton.innerHTML = '<span class="button-text">Unloading...</span> <span class="button-icon">✨</span>';
            submitButton.disabled = true;
            
            // Add calming fade effect
            container.classList.add('calm-fade');
            
            // Make stars twinkle faster
            const stars = document.querySelectorAll('.star');
            stars.forEach(star => {
                star.style.animationDuration = '1s';
            });
            
            // Add more thought bubbles
            const bubbleContainer = document.querySelector('.thought-bubbles');
            for (let i = 0; i < 5; i++) {
                const bubble = document.createElement('div');
                bubble.className = 'bubble';
                bubble.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 30 + 20}px;
                    height: ${Math.random() * 30 + 20}px;
                    left: ${Math.random() * 100}%;
                    top: 100%;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 50%;
                    animation: bubbleFloat 3s ease-out forwards;
                `;
                bubbleContainer.appendChild(bubble);
                
                setTimeout(() => bubble.remove(), 3000);
            }
            
            // Send email via Formspree
            const success = await sendEmail('overthinking', textarea.value);
            
            setTimeout(() => {
                container.classList.remove('calm-fade');
                
                showMessage(responseMessage, () => {
                    // Reset form and effects
                    textarea.value = '';
                    submitButton.innerHTML = '<span class="button-text">Unload Thoughts</span> <span class="button-icon">✨</span>';
                    submitButton.disabled = false;
                    
                    // Reset star animation
                    stars.forEach(star => {
                        star.style.animationDuration = '3s';
                    });
                });
            }, 2000);
        }
    });
}

// Love page functionality
if (document.getElementById('loveForm')) {
    const form = document.getElementById('loveForm');
    const textarea = document.getElementById('loveMessage');
    const submitButton = form.querySelector('.submit-button');
    const responseMessage = document.getElementById('responseMessage');
    const heartBurst = document.querySelector('.heart-burst');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (textarea.value.trim()) {
            // Button loading animation
            submitButton.innerHTML = '<span class="button-text">Saving...</span> <span class="button-icon">💗</span>';
            submitButton.disabled = true;
            
            // Create heart burst animation
            createHeartBurst();
            
            // Intensify floating hearts
            const hearts = document.querySelectorAll('.love-heart');
            hearts.forEach(heart => {
                heart.style.animationDuration = '3s';
                heart.style.fontSize = '35px';
            });
            
            // Enhance glow effect
            const glow = document.querySelector('.love-glow');
            glow.style.opacity = '0.8';
            glow.style.transform = 'translate(-50%, -50%) scale(2)';
            
            // Send email via Formspree
            const success = await sendEmail('love', textarea.value);
            
            setTimeout(() => {
                showMessage(responseMessage, () => {
                    // Reset form and effects
                    textarea.value = '';
                    submitButton.innerHTML = '<span class="button-text">Save This Feeling</span> <span class="button-icon">💗</span>';
                    submitButton.disabled = false;
                    
                    // Reset hearts and glow
                    hearts.forEach(heart => {
                        heart.style.animationDuration = '6s';
                        heart.style.fontSize = '25px';
                    });
                    
                    glow.style.opacity = '0.3';
                    glow.style.transform = 'translate(-50%, -50%) scale(1)';
                });
            }, 2500);
        }
    });
    
    // Heart burst creation function
    function createHeartBurst() {
        heartBurst.classList.remove('hidden');
        heartBurst.classList.add('active');
        
        // Create multiple heart bursts at random positions
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const burst = document.createElement('div');
                burst.innerHTML = '💗';
                burst.style.cssText = `
                    position: fixed;
                    font-size: 40px;
                    pointer-events: none;
                    z-index: 1000;
                    left: ${Math.random() * window.innerWidth}px;
                    top: ${Math.random() * window.innerHeight}px;
                    animation: heartPop 2s ease-out forwards;
                `;
                document.body.appendChild(burst);
                
                setTimeout(() => burst.remove(), 2000);
            }, i * 200);
        }
        
        setTimeout(() => {
            heartBurst.classList.remove('active');
            heartBurst.classList.add('hidden');
        }, 2000);
    }
    
    // Add heart pop animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes heartPop {
            0% {
                transform: scale(0) rotate(0deg);
                opacity: 1;
            }
            50% {
                transform: scale(1.5) rotate(180deg);
                opacity: 1;
            }
            100% {
                transform: scale(0) rotate(360deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===========================
// ENHANCED INTERACTIVE FEATURES
// ===========================

// Add floating particle interaction on mouse move
document.addEventListener('mousemove', function(e) {
    const particles = document.querySelectorAll('.heart, .flame, .star, .love-heart');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    particles.forEach((particle, index) => {
        const delay = index * 50;
        setTimeout(() => {
            const currentTransform = particle.style.transform || '';
            const mouseInfluence = 10;
            const offsetX = (mouseX - 0.5) * mouseInfluence;
            const offsetY = (mouseY - 0.5) * mouseInfluence;
            
            particle.style.transform = `${currentTransform} translate(${offsetX}px, ${offsetY}px)`;
        }, delay);
    });
});

// Add keyboard accessibility
document.addEventListener('keydown', function(e) {
    // Allow Enter + Ctrl to submit forms
    if (e.ctrlKey && e.key === 'Enter') {
        const activeForm = document.querySelector('form');
        if (activeForm) {
            activeForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // ESC to clear forms
    if (e.key === 'Escape') {
        const activeTextarea = document.querySelector('textarea:focus');
        if (activeTextarea) {
            activeTextarea.value = '';
            activeTextarea.blur();
        }
    }
});

// Add form validation with gentle feedback
document.addEventListener('DOMContentLoaded', function() {
    const textareas = document.querySelectorAll('textarea');
    
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            const submitButton = this.closest('form').querySelector('.submit-button');
            
            if (this.value.trim().length > 0) {
                submitButton.style.opacity = '1';
                submitButton.style.transform = 'scale(1)';
            } else {
                submitButton.style.opacity = '0.7';
                submitButton.style.transform = 'scale(0.98)';
            }
        });
        
        // Auto-resize textarea
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    });
});

// Add gentle background music control (optional)
document.addEventListener('DOMContentLoaded', function() {
    // Create a subtle ambient sound toggle (optional feature)
    const soundToggle = document.createElement('button');
    soundToggle.innerHTML = '🎵';
    soundToggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 255, 255, 0.8);
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 20px;
        cursor: pointer;
        z-index: 1000;
        transition: all 0.3s ease;
        backdrop-filter: blur(10px);
        opacity: 0.7;
    `;
    
    soundToggle.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.opacity = '1';
    });
    
    soundToggle.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.opacity = '0.7';
    });
    
    // Add click functionality for ambient sounds
    let soundEnabled = false;
    soundToggle.addEventListener('click', function() {
        soundEnabled = !soundEnabled;
        this.innerHTML = soundEnabled ? '🔇' : '🎵';
        
        if (soundEnabled) {
            // Here you could add ambient sound functionality
            console.log('Ambient sounds enabled');
        } else {
            console.log('Ambient sounds disabled');
        }
    });
    
    document.body.appendChild(soundToggle);
});

// ===========================
// PERFORMANCE OPTIMIZATIONS
// ===========================

// Throttle scroll and resize events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Optimize animations for better performance
document.addEventListener('DOMContentLoaded', function() {
    const preferredReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    if (preferredReducedMotion.matches) {
        // Reduce animations for users who prefer reduced motion
        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
                scroll-behavior: auto !important;
            }
        `;
        document.head.appendChild(style);
    }
});

console.log('🌸 Nehu Feelings of the Day loaded successfully! 🌸');
