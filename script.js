// Swit Hub - Premium 3D Website JavaScript
// Ultra-minimalist dark theme with Three.js 3D elements

import * as THREE from 'three';

document.addEventListener('DOMContentLoaded', () => {
initHero3D();
initHeroParticles();
initFloatingElements();
initMobileMenu();
initCustomCursor();
initSmoothScroll();
initStatsCounter();
initContactForm();
initScrollAnimations();
initWorkSection3D();
initMouseTrail();
});

// =====================================================
// Hero 3D Scene with Interactive Torus
// =====================================================

// Global mouse tracking for 3D interactions
let globalMouseX = 0;
let globalMouseY = 0;

document.addEventListener('mousemove', (e) => {
globalMouseX = (e.clientX / window.innerWidth) * 2 - 1;
globalMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
}, { passive: true });

function initHero3D() {
    const container = document.getElementById('hero-canvas');
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Main torus geometry - ultra-minimalist design
    const torusGeometry = new THREE.TorusKnotGeometry(1.5, 0.4, 150, 20, 2, 3);
    const torusMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00d4ff,
        metalness: 0.9,
        roughness: 0.1,
        emissive: 0x0044aa,
        emissiveIntensity: 0.2,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
        transparent: true,
        opacity: 0.9
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    scene.add(torus);

    // Wireframe overlay for tech aesthetic
    const wireframeGeometry = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 20, 2, 3);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
    wireframe.scale.set(1.01, 1.01, 1.01);
    scene.add(wireframe);

    // Floating particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 150;
    const positions = new Float32Array(particlesCount * 3);
    const velocities = [];

    for (let i = 0; i < particlesCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 15;
        positions[i3 + 1] = (Math.random() - 0.5) * 15;
        positions[i3 + 2] = (Math.random() - 0.5) * 15;
        
        velocities.push({
            x: (Math.random() - 0.5) * 0.01,
            y: (Math.random() - 0.5) * 0.01,
            z: (Math.random() - 0.5) * 0.01
        });
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        color: 0x00d4ff,
        size: 0.02,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00d4ff, 2, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x7c3aed, 1, 100);
    pointLight2.position.set(-5, -5, 5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0xffffff, 0.5, 100);
    pointLight3.position.set(0, 0, 10);
    scene.add(pointLight3);

    camera.position.z = 6;

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (!isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        }, { passive: true });
    }

    // Scroll-based animation
    let scrollProgress = 0;
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero').offsetHeight;
        scrollProgress = Math.min(scrollY / heroHeight, 1);
    }, { passive: true });

    // Animation loop
    let animationId;
    const clock = new THREE.Clock();

    function animate() {
        animationId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth rotation based on mouse
        targetRotationX = mouseY * 0.5;
        targetRotationY = mouseX * 0.5;
        
        torus.rotation.x += (targetRotationX - torus.rotation.x) * 0.05;
        torus.rotation.y += (targetRotationY - torus.rotation.y) * 0.05;
        wireframe.rotation.x = torus.rotation.x;
        wireframe.rotation.y = torus.rotation.y;

        // Continuous gentle rotation
        torus.rotation.z += 0.002;
        wireframe.rotation.z += 0.002;

        // Particle animation
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;
            positions[i3] += velocities[i].x;
            positions[i3 + 1] += velocities[i].y;
            positions[i3 + 2] += velocities[i].z;

            // Boundary check - wrap around
            if (Math.abs(positions[i3]) > 7.5) velocities[i].x *= -1;
            if (Math.abs(positions[i3 + 1]) > 7.5) velocities[i].y *= -1;
            if (Math.abs(positions[i3 + 2]) > 7.5) velocities[i].z *= -1;
        }
        particles.geometry.attributes.position.needsUpdate = true;

        // Subtle floating animation
        torus.position.y = Math.sin(elapsedTime * 0.5) * 0.2;
        wireframe.position.y = torus.position.y;

        // Scroll-based effects
        const scrollRotation = scrollProgress * Math.PI * 0.5;
        torus.rotation.x += scrollRotation * 0.01;

        // Dynamic lighting based on time
        pointLight1.intensity = 2 + Math.sin(elapsedTime * 0.5) * 0.5;
        pointLight2.intensity = 1 + Math.cos(elapsedTime * 0.3) * 0.3;

        renderer.render(scene, camera);
    }

    animate();

    // Resize handler
    function handleResize() {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup on visibility change
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

// =====================================================
// Mobile Menu
// =====================================================
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    const body = document.body;

    if (!menuToggle || !mobileMenu) return;

    function toggleMenu() {
        menuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    }

    menuToggle.addEventListener('click', toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            toggleMenu();
            
            // Update active state
            mobileLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            toggleMenu();
        }
    });
}

// =====================================================
// Custom Cursor
// =====================================================
function initCustomCursor() {
    const cursor = document.getElementById('cursor');
    if (!cursor) return;

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const cursorDot = cursor.querySelector('.cursor-dot');
    const cursorCircle = cursor.querySelector('.cursor-circle');

    let mouseX = 0;
    let mouseY = 0;
    let circleX = 0;
    let circleY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
    }, { passive: true });

    function animateCursor() {
        circleX += (mouseX - circleX) * 0.15;
        circleY += (mouseY - circleY) * 0.15;
        
        cursorCircle.style.left = circleX + 'px';
        cursorCircle.style.top = circleY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover effects
    const hoverElements = document.querySelectorAll('a, button, .work-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorCircle.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorCircle.style.opacity = '0.5';
        });
        
        el.addEventListener('mouseleave', () => {
            cursorCircle.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorCircle.style.opacity = '1';
        });
    });
}

// =====================================================
// Smooth Scroll
// =====================================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });

                // Update active nav link
                document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                if (this.classList.contains('nav-link')) {
                    this.classList.add('active');
                }
            }
        });
    });
}

// =====================================================
// Stats Counter Animation
// =====================================================
function initStatsCounter() {
    const stats = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
                observer.unobserve(stat);
            }
        });
    }, observerOptions);

    stats.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        current = Math.floor(target * easeOutQuart);
        
        element.textContent = current + '+';
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target + '+';
        }
    }

    requestAnimationFrame(update);
}

// =====================================================
// Contact Form
// =====================================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<span>Sending...</span>';
        submitBtn.disabled = true;

        // Simulate form submission
        setTimeout(() => {
            submitBtn.innerHTML = '<span>Message Sent!</span>';
            submitBtn.style.background = '#22c55e';
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.disabled = false;
                form.reset();
            }, 2000);
        }, 1500);
    });
}

// =====================================================
// Scroll Animations
// =====================================================
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.section-header, .about-card, .work-item, .stat-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach((el, index) => {
el.style.opacity = '0';
el.style.transform = 'translateY(30px)';
el.style.transition = `opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.1}s`;
observer.observe(el);
});
}

// =====================================================
// Hero Particles - Floating Energy Orbs
// =====================================================
function initHeroParticles() {
const container = document.getElementById('hero-particles');
if (!container) return;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Create floating energy orbs
const orbs = [];
const orbGeometry = new THREE.SphereGeometry(0.08, 16, 16);
const orbColors = [0x00d4ff, 0x7c3aed, 0xffffff];

for (let i = 0; i < 25; i++) {
const color = orbColors[Math.floor(Math.random() * orbColors.length)];
const orbMaterial = new THREE.MeshBasicMaterial({
color: color,
transparent: true,
opacity: 0.3 + Math.random() * 0.3,
blending: THREE.AdditiveBlending
});

const orb = new THREE.Mesh(orbGeometry, orbMaterial);

// Random position in 3D space
orb.position.x = (Math.random() - 0.5) * 12;
orb.position.y = (Math.random() - 0.5) * 8;
orb.position.z = (Math.random() - 0.5) * 6;

// Store initial position and velocity
orb.userData = {
initialX: orb.position.x,
initialY: orb.position.y,
initialZ: orb.position.z,
speed: 0.2 + Math.random() * 0.3,
phase: Math.random() * Math.PI * 2,
ampX: 0.5 + Math.random() * 1,
ampY: 0.3 + Math.random() * 0.5
};

scene.add(orb);
orbs.push(orb);
}

// Add subtle glow light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

camera.position.z = 5;

// Animation loop
let animationId;
const clock = new THREE.Clock();

function animate() {
animationId = requestAnimationFrame(animate);
const elapsedTime = clock.getElapsedTime();

orbs.forEach((orb) => {
const data = orb.userData;

// Floating motion
orb.position.x = data.initialX + Math.sin(elapsedTime * data.speed + data.phase) * data.ampX;
orb.position.y = data.initialY + Math.cos(elapsedTime * data.speed * 0.7 + data.phase) * data.ampY;

// Mouse interaction - orbs move away from cursor
const distToMouse = Math.sqrt(
Math.pow(orb.position.x - globalMouseX * 5, 2) +
Math.pow(orb.position.y - globalMouseY * 3, 2)
);

if (distToMouse < 2) {
orb.material.opacity = Math.min(orb.material.opacity + 0.02, 0.8);
orb.scale.setScalar(1.5);
} else {
orb.material.opacity = Math.max(orb.material.opacity - 0.01, 0.3);
orb.scale.setScalar(1);
}

// Slow rotation
orb.rotation.x += 0.01;
orb.rotation.y += 0.01;
});

renderer.render(scene, camera);
}

animate();

// Resize handler
window.addEventListener('resize', () => {
camera.aspect = container.clientWidth / container.clientHeight;
camera.updateProjectionMatrix();
renderer.setSize(container.clientWidth, container.clientHeight);
}, { passive: true });
}

// =====================================================
// Floating Elements - 3D Cards that float
// =====================================================
function initFloatingElements() {
const cards = document.querySelectorAll('.about-card, .service-card');

cards.forEach((card, index) => {
card.style.opacity = '0';
card.style.transform = 'translateY(50px) rotateX(10deg)';
card.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
card.style.transitionDelay = `${index * 0.1}s`;

card.addEventListener('mouseenter', () => {
card.style.transform = 'translateY(-10px) rotateX(0deg) scale(1.02)';
card.style.boxShadow = '0 30px 60px rgba(0, 212, 255, 0.15)';
});

card.addEventListener('mouseleave', () => {
card.style.transform = 'translateY(0) rotateX(0deg) scale(1)';
card.style.boxShadow = '';
});
});

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.style.opacity = '1';
entry.target.style.transform = 'translateY(0) rotateX(0deg)';
observer.unobserve(entry.target);
}
});
}, { threshold: 0.1 });

cards.forEach(card => observer.observe(card));
}

// =====================================================
// Work Section 3D - Project preview spheres
// =====================================================
function initWorkSection3D() {
const workItems = document.querySelectorAll('.work-item');

workItems.forEach((item) => {
const placeholder = item.querySelector('.work-placeholder');
if (!placeholder) return;

// Add 3D tilt effect
item.addEventListener('mousemove', (e) => {
const rect = item.getBoundingClientRect();
const x = (e.clientX - rect.left) / rect.width - 0.5;
const y = (e.clientY - rect.top) / rect.height - 0.5;

item.style.transform = `perspective(1000px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateZ(20px)`;
});

item.addEventListener('mouseleave', () => {
item.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) translateZ(0)';
});

// Add glow effect on hover
item.addEventListener('mouseenter', () => {
placeholder.style.filter = 'brightness(1.2) saturate(1.2)';
});

item.addEventListener('mouseleave', () => {
placeholder.style.filter = '';
});
});
}

// =====================================================
// Mouse Trail - Glowing trail following cursor
// =====================================================
function initMouseTrail() {
if (window.matchMedia('(pointer: coarse)').matches) return;

const trail = [];
const maxTrail = 20;
const colors = ['#00d4ff', '#7c3aed', '#ffffff'];

// Create trail elements
for (let i = 0; i < maxTrail; i++) {
const dot = document.createElement('div');
dot.style.position = 'fixed';
dot.style.width = '6px';
dot.style.height = '6px';
dot.style.borderRadius = '50%';
dot.style.pointerEvents = 'none';
dot.style.zIndex = '9998';
dot.style.opacity = '0';
dot.style.transition = 'opacity 0.3s';
dot.style.background = colors[i % colors.length];
dot.style.boxShadow = `0 0 10px ${colors[i % colors.length]}`;
document.body.appendChild(dot);

trail.push({
element: dot,
x: 0,
y: 0
});
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
mouseX = e.clientX;
mouseY = e.clientY;

// Show trail
if (trail[0].element.style.opacity === '0') {
trail.forEach(t => t.element.style.opacity = '0.6');
}
}, { passive: true });

// Animation loop for trail
function animateTrail() {
for (let i = trail.length - 1; i > 0; i--) {
trail[i].x += (trail[i - 1].x - trail[i].x) * 0.3;
trail[i].y += (trail[i - 1].y - trail[i].y) * 0.3;
trail[i].element.style.left = trail[i].x + 'px';
trail[i].element.style.top = trail[i].y + 'px';
trail[i].element.style.opacity = (1 - i / maxTrail) * 0.6;
}

trail[0].x = mouseX;
trail[0].y = mouseY;
trail[0].element.style.left = mouseX + 'px';
trail[0].element.style.top = mouseY + 'px';

requestAnimationFrame(animateTrail);
}

animateTrail();

// Hide trail when mouse leaves window
document.addEventListener('mouseleave', () => {
trail.forEach(t => t.element.style.opacity = '0');
});
}
