// Scroll animations
document.addEventListener('DOMContentLoaded', function() {
    // Animate elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.animate__animated');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add(element.getAttribute('data-animate') || 'animate__fadeIn');
            }
        });
    };
    
    // Run on load and scroll
    animateOnScroll();
    window.addEventListener('scroll', animateOnScroll);
    
    // Floating animation for elements with .floating class
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach(element => {
        element.style.animation = 'floating 3s ease-in-out infinite';
    });
    
    // Particle background animation
    const particlesBackground = document.querySelector('.particles-background');
    if (particlesBackground) {
        // Create particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 5 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 10 + 10;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            
            particlesBackground.appendChild(particle);
        }
    }
});

// Add styles for particles
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    .particle {
        position: absolute;
        background-color: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        animation: floatParticle linear infinite;
    }
    
    @keyframes floatParticle {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 1;
        }
        50% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0.5;
        }
        100% {
            transform: translateY(-200px) translateX(0);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyles);