// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// DOM Elements
const cartIcon = document.getElementById('cartIcon');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.getElementById('cartCount');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const newsletterForm = document.getElementById('newsletterForm');
const contactForm = document.getElementById('contactForm');

// Slider Variables
let currentSlide = 0;
let autoSlideInterval;
const slideDuration = 5000; // 5 seconds per slide

// Initialize the site
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    initSlider();
    initEventListeners();
    initFAQ();
});

// Initialize Cart Functions
function initCart() {
    updateCartCount();
    renderCartItems();
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.dataset.id;
            const name = this.dataset.name;
            const price = parseFloat(this.dataset.price);
            addToCart(id, name, price);
        });
    });
}

// Cart Functions
function addToCart(id, name, price) {
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${name} added to cart!`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

function updateCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    renderCartItems();
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
}

function renderCartItems() {
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart" style="text-align: center; padding: 40px 20px; color: var(--deep-brown);">Your cart is empty</p>';
        if (cartTotal) cartTotal.textContent = '$0.00';
        return;
    }
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">$${item.price.toFixed(2)} × ${item.quantity}</p>
                <p class="cart-item-subtotal">$${itemTotal.toFixed(2)}</p>
            </div>
            <button class="remove-item" onclick="removeFromCart('${item.id}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    if (cartTotal) cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Initialize Slider
function initSlider() {
    const sliderTrack = document.getElementById('sliderTrack');
    const sliderDots = document.getElementById('sliderDots');
    
    if (!sliderTrack || !sliderDots) return;
    
    // Create dots based on number of slides
    const slides = document.querySelectorAll('.slider-slide');
    slides.forEach((slide, index) => {
        const dot = document.createElement('div');
        dot.className = `slider-dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });
    
    // Start auto-slide
    startAutoSlide();
}

// Start auto-slide
function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    
    autoSlideInterval = setInterval(() => {
        nextSlide();
    }, slideDuration);
}

// Stop auto-slide
function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// Go to specific slide
function goToSlide(slideIndex) {
    const sliderTrack = document.getElementById('sliderTrack');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!sliderTrack) return;
    
    // Update current slide
    currentSlide = slideIndex;
    
    // Update slider position
    sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
    
    // Restart auto-slide
    startAutoSlide();
}

// Next slide
function nextSlide() {
    const slides = document.querySelectorAll('.slider-slide');
    currentSlide = (currentSlide + 1) % slides.length;
    goToSlide(currentSlide);
}

// Previous slide
function prevSlide() {
    const slides = document.querySelectorAll('.slider-slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    goToSlide(currentSlide);
}

// Initialize Event Listeners
function initEventListeners() {
    // Cart toggle
    if (cartIcon) {
        cartIcon.addEventListener('click', toggleCart);
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', toggleCart);
    }
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close cart when clicking outside
    document.addEventListener('click', function(event) {
        if (cartSidebar && !cartSidebar.contains(event.target) && cartIcon && !cartIcon.contains(event.target)) {
            cartSidebar.classList.remove('active');
        }
    });
    
    // Newsletter form submission
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            showNotification(`Thank you for subscribing! You'll receive exclusive updates at ${email}`);
            this.reset();
        });
    }
    
    // Contact form submission
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('Thank you for your message! We will get back to you within 24 hours.');
            this.reset();
        });
    }
    
    // Slider navigation
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 3000);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            setTimeout(startAutoSlide, 3000);
        });
    }
    
    // Pause auto-slide on hover
    const sliderWrapper = document.querySelector('.slider-wrapper');
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', stopAutoSlide);
        sliderWrapper.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Get Yours Now button smooth scroll
    const getYoursBtn = document.querySelector('.slider-cta .btn-large');
    if (getYoursBtn) {
        getYoursBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const featuredSection = document.getElementById('featured');
            if (featuredSection) {
                window.scrollTo({
                    top: featuredSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#!') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu) mobileMenu.classList.remove('active');
            }
        });
    });
}

// Initialize FAQ accordion
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            answer.classList.toggle('active');
        });
    });
}

// Toggle Functions
function toggleCart() {
    if (cartSidebar) cartSidebar.classList.toggle('active');
}

function toggleMobileMenu() {
    if (mobileMenu) mobileMenu.classList.toggle('active');
}

// Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--rose-gold);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 1002;
        animation: slideIn 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(183, 110, 121, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation styles for notification
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);