// Particle Background Effect
function createParticles() {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 2 - 1;
            this.speedY = Math.random() * 2 - 1;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    // Create particles
    const particles = Array.from({ length: 50 }, () => new Particle());
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// Initialize particles
createParticles();

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Scroll animations for sections
const sections = document.querySelectorAll('section');
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Active class for navigation links based on scroll position
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - sectionHeight / 3) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Copy address functionality with animation
function copyAddress() {
    const address = document.getElementById('contract-address');
    const text = address.textContent;
    
    if (text === 'Coming Soon') {
        return;
    }
    
    navigator.clipboard.writeText(text).then(() => {
        const button = document.querySelector('.copy-button');
        button.classList.add('success');
        setTimeout(() => {
            button.classList.remove('success');
        }, 2000);
    });
}

// Hover effect for meme images
document.querySelectorAll('.meme-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.05)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
    });
});

// Add counter animation to tokenomics numbers
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        element.innerHTML = Math.floor(progress * (end - start) + start).toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Animate tokenomics numbers when they come into view
const tokenomicsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const number = entry.target.querySelector('p');
            const text = number.textContent.trim();
            
            // Only animate if the text is a pure number (no letters)
            if (/^[\d,]+$/.test(text)) {
                // Remove commas for parsing
                const cleanText = text.replace(/,/g, '');
                const value = parseInt(cleanText);
                
                // Only animate if we have a valid number
                if (!isNaN(value)) {
                    animateValue(number, 0, value, 2000);
                }
            }
            // Special case for percentage values
            else if (/^\d+%$/.test(text)) {
                const percentValue = parseInt(text.replace(/%/g, ''));
                if (!isNaN(percentValue)) {
                    // For percentages, we'll just show the final value
                    // No animation needed for small numbers
                    number.innerHTML = percentValue + '%';
                }
            }
            
            tokenomicsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

// Only observe tokenomics items that have a paragraph element
document.querySelectorAll('.tokenomics-item').forEach(item => {
    if (item.querySelector('p')) {
        tokenomicsObserver.observe(item);
    }
});

// Infinite scroll animation for hashtags
const hashtagContainer = document.querySelector('.hashtag-container');
if (hashtagContainer) {
    const hashtags = hashtagContainer.innerHTML;
    hashtagContainer.innerHTML = hashtags + hashtags; // Duplicate hashtags for seamless scrolling
} 