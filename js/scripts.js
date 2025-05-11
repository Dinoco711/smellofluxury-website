// Smell of Luxury - Premium Perfume E-commerce
// Main JavaScript file

// DOM Elements
const header = document.querySelector('.header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
const sliderTrack = document.querySelector('.slider-track');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const cartCount = document.querySelector('.cart-count');
const randomGrid = document.querySelector('.random-grid');
const newsletterForm = document.querySelector('.newsletter-form');
const hero = document.querySelector('.hero');
const productImages = document.querySelectorAll('.product-image');
const brandElements = document.querySelectorAll('.brand');
const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
const userIcon = document.querySelector('.user-icon');

// Product Data (simulated data for Random Picks)
const products = [
    {
        id: 1,
        name: 'Eternal Sands',
        price: '₹9,999',
        image: 'assets/images/random1.jpg'
    },
    {
        id: 2,
        name: 'Mystic Elixir',
        price: '₹7,899',
        image: 'assets/images/random2.jpg'
    },
    {
        id: 3,
        name: 'Serene Delight',
        price: '₹11,499',
        image: 'assets/images/random3.jpg'
    },
    {
        id: 4,
        name: 'Royal Essence',
        price: '₹14,299',
        image: 'assets/images/random4.jpg'
    },
    {
        id: 5,
        name: 'Midnight Opulence',
        price: '₹12,799',
        image: 'assets/images/random5.jpg'
    },
    {
        id: 6,
        name: 'Golden Harmony',
        price: '₹8,599',
        image: 'assets/images/random6.jpg'
    },
    {
        id: 7,
        name: 'Velvet Whisper',
        price: '₹10,299',
        image: 'assets/images/random7.jpg'
    },
    {
        id: 8,
        name: 'Exotic Dreams',
        price: '₹13,999',
        image: 'assets/images/random8.jpg'
    }
];

// Brand names for fallback
const brandNames = [
    'Chanel',
    'Dior',
    'Tom Ford',
    'Jo Malone',
    'Yves Saint Laurent'
];

// Initialization
let cartItems = 0;
let currentSlide = 0;
let slideWidth = 0;
let maxSlide = 0;
let lastScrollTop = 0;
let isMobile = window.innerWidth <= 768;

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize functionality
    checkHeroImage();
    handleMissingProductImages();
    handleMissingBrandImages();
    initSlider();
    loadRandomProducts();
    initScrollHeader();
    setupMobileMenus();
    initMobileDropdownStyles();
    
    // Event listeners
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => slideSlider('prev'));
        nextBtn.addEventListener('click', () => slideSlider('next'));
    }
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // User icon click handler (simulated login/profile functionality)
    if (userIcon) {
        userIcon.addEventListener('click', function() {
            alert('User profile/login functionality would appear here.');
        });
    }
    
    // Add event listeners to quick view buttons
    const quickViewBtns = document.querySelectorAll('.btn-quick-view');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.closest('.product-card').querySelector('h3').textContent;
            alert(`Quick view for ${productName} would open here.`);
        });
    });
    
    // Handle window resize for responsive menu behavior
    window.addEventListener('resize', handleResize);

    // Close mobile menu button
    const closeMobileMenuBtn = document.querySelector('.close-mobile-menu');
    if (closeMobileMenuBtn) {
        closeMobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
});

// Setup mobile menus and dropdowns based on device
function setupMobileMenus() {
    isMobile = window.innerWidth <= 768;
    
    // Remove any existing event listeners to prevent duplicates
    dropdownItems.forEach(item => {
        const link = item.querySelector('a');
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
    });
    
    // Set up dropdowns based on device type
    dropdownItems.forEach((item, index) => {
        const link = item.querySelector('a');
        const dropdown = item.querySelector('.dropdown');
        
        if (isMobile) {
            // For mobile: prevent navigation and toggle dropdown on click
            link.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                // Close other open dropdowns
                dropdownItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        const otherDropdown = otherItem.querySelector('.dropdown');
                        otherDropdown.style.maxHeight = '0';
                        setTimeout(() => {
                            otherItem.classList.remove('active');
                        }, 300);
                    }
                });
                
                // Toggle current dropdown with animation
                if (item.classList.contains('active')) {
                    dropdown.style.maxHeight = '0';
                    setTimeout(() => {
                        item.classList.remove('active');
                    }, 300);
                } else {
                    item.classList.add('active');
                    dropdown.style.maxHeight = dropdown.scrollHeight + 'px';
                }
            });
            
            // Add touch support for mobile
            link.addEventListener('touchstart', function(e) {
                if (!item.classList.contains('active')) {
                    e.preventDefault();
                }
            });
        } else {
            // For desktop: allow navigation on click, show dropdown on hover
            item.classList.remove('active');
            if (dropdown) {
                dropdown.style.maxHeight = '';
                
                // Add animation delay to dropdown items
                const dropdownItems = dropdown.querySelectorAll('li');
                dropdownItems.forEach((li, i) => {
                    li.style.setProperty('--item-index', i + 1);
                });
            }
            
            link.addEventListener('click', function(e) {
                // Only prevent default if it's a # link
                if (this.getAttribute('href') === '#' || 
                    this.getAttribute('href') === '#brands' || 
                    this.getAttribute('href') === '#catalog') {
                    e.preventDefault();
                }
            });
        }
    });
    
    // Initialize dropdown styles for mobile
    if (isMobile) {
        initMobileDropdownStyles();
    }
}

// Handle window resize events
function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    
    // If device type changed, update menu behavior
    if (wasMobile !== isMobile) {
        setupMobileMenus();
        
        // Close mobile menu when switching to desktop
        if (!isMobile && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    }
}

// Advanced header scroll effect
function initScrollHeader() {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class when scrolled down
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header when scrolling down, show when scrolling up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down & past hero section
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// Mobile menu toggle with improved handling
function toggleMobileMenu() {
    mobileMenuBtn.classList.toggle('active');
    
    // Animate menu opening/closing
    if (navMenu.classList.contains('active')) {
        // Closing animation
        navMenu.style.right = '-100%';
        document.body.classList.remove('no-scroll');
        
        // Reset all dropdown menus when closing mobile menu
        dropdownItems.forEach(item => {
            if (item.classList.contains('active')) {
                const dropdown = item.querySelector('.dropdown');
                dropdown.style.maxHeight = '0';
                setTimeout(() => {
                    item.classList.remove('active');
                }, 300);
            }
        });
        
        setTimeout(() => {
            navMenu.classList.remove('active');
        }, 500); // Match transition duration
    } else {
        // Opening animation
        navMenu.classList.add('active');
        navMenu.style.right = '0';
        document.body.classList.add('no-scroll');
    }
}

// Check if hero image exists and apply appropriate class
function checkHeroImage() {
    if (!hero) return;
    
    // First check if the banner image loads
    const bannerImg = new Image();
    bannerImg.src = 'https://smellofluxury.in/wp-content/uploads/2025/04/SOL-Banner-3.jpg';
    
    bannerImg.onload = function() {
        // Banner image loaded successfully, no need for fallback
        console.log('Banner image loaded successfully');
    };
    
    bannerImg.onerror = function() {
        console.log('Banner image failed to load, applying fallback');
        hero.classList.add('fallback');
        
        // Try the local hero image as second fallback
        const localImg = new Image();
        localImg.src = 'assets/images/hero.jpg';
        
        localImg.onload = function() {
            hero.classList.remove('fallback');
            hero.classList.add('with-image');
        };
        
        localImg.onerror = function() {
            console.log('No hero images available, using gradient fallback only.');
        };
    };
}

// Handle missing product images
function handleMissingProductImages() {
    if (!productImages.length) return;
    
    productImages.forEach(container => {
        const img = container.querySelector('img');
        if (!img) return;
        
        const productName = img.alt || container.closest('.product-card').querySelector('h3')?.textContent || 'Luxury Perfume';
        
        img.onerror = function() {
            // Remove the broken image
            img.style.display = 'none';
            // Add the missing image class
            container.classList.add('missing-image');
            
            // Create text fallback if not already present
            if (!container.querySelector('.missing-image-text')) {
                const textElement = document.createElement('div');
                textElement.className = 'missing-image-text';
                textElement.textContent = productName;
                container.appendChild(textElement);
            }
        };
    });
}

// Handle missing brand images
function handleMissingBrandImages() {
    if (!brandElements.length) return;
    
    brandElements.forEach((brand, index) => {
        const img = brand.querySelector('img');
        if (!img) return;
        
        img.onerror = function() {
            // Remove the broken image
            img.style.display = 'none';
            
            // Add text fallback
            const brandName = brandNames[index % brandNames.length];
            const textElement = document.createElement('span');
            textElement.textContent = brandName;
            brand.appendChild(textElement);
        };
    });
}

// Initialize slider
function initSlider() {
    if (!sliderTrack) return;
    
    const slides = sliderTrack.querySelectorAll('.product-card');
    if (slides.length === 0) return;
    
    // Calculate slide width and max slide position
    slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
    maxSlide = slides.length - getVisibleSlides();
    
    // Reset slider position
    updateSliderPosition();
    
    // Update on window resize
    window.addEventListener('resize', () => {
        slideWidth = slides[0].offsetWidth + parseInt(getComputedStyle(slides[0]).marginRight);
        maxSlide = slides.length - getVisibleSlides();
        updateSliderPosition();
    });
}

// Determine visible slides based on viewport width
function getVisibleSlides() {
    if (window.innerWidth >= 1200) {
        return 4; // 4 slides visible on large screens
    } else if (window.innerWidth >= 768) {
        return 3; // 3 slides visible on medium screens
    } else if (window.innerWidth >= 576) {
        return 2; // 2 slides visible on small screens
    } else {
        return 1; // 1 slide visible on extra small screens
    }
}

// Slide the slider left or right
function slideSlider(direction) {
    if (direction === 'next' && currentSlide < maxSlide) {
        currentSlide++;
    } else if (direction === 'prev' && currentSlide > 0) {
        currentSlide--;
    }
    
    updateSliderPosition();
}

// Update slider position based on current slide
function updateSliderPosition() {
    if (!sliderTrack) return;
    
    sliderTrack.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
    
    // Update button states
    if (prevBtn && nextBtn) {
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide >= maxSlide;
        
        prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentSlide >= maxSlide ? '0.5' : '1';
    }
}

// Load random products
function loadRandomProducts() {
    if (!randomGrid) return;
    
    // Shuffle products array
    const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
    
    // Take first 4 products
    const selectedProducts = shuffledProducts.slice(0, 4);
    
    // Brand names for each product
    const brandNames = ['CHANEL', 'DIOR', 'TOM FORD', 'JO MALONE', 'YVES SAINT LAURENT'];
    
    // Generate HTML
    let html = '';
    selectedProducts.forEach((product, index) => {
        const brand = brandNames[index % brandNames.length];
        html += `
            <div class="product-card">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.parentNode.classList.add('missing-image');">
                    <div class="product-overlay">
                        <button class="btn-quick-view">Quick View</button>
                    </div>
                    <div class="missing-image-text" style="display: none;">${product.name}</div>
                </div>
                <div class="product-info">
                    <div class="product-brand">${brand}</div>
                    <h3>${product.name}</h3>
                    <p class="product-desc">Eau de Parfum, 100ml</p>
                    <p class="price">${product.price}</p>
                    <button class="btn btn-secondary add-to-cart">Add to Cart</button>
                </div>
            </div>
        `;
    });
    
    // Insert into DOM
    randomGrid.innerHTML = html;
    
    // Show fallback text if image fails to load
    const newImages = randomGrid.querySelectorAll('.product-image img');
    newImages.forEach(img => {
        img.addEventListener('error', function() {
            this.style.display = 'none';
            this.parentNode.classList.add('missing-image');
            this.parentNode.querySelector('.missing-image-text').style.display = 'block';
        });
    });
    
    // Add event listeners to new buttons
    const newAddToCartBtns = randomGrid.querySelectorAll('.add-to-cart');
    newAddToCartBtns.forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
    
    // Add event listeners to quick view buttons
    const quickViewBtns = randomGrid.querySelectorAll('.btn-quick-view');
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const productName = this.closest('.product-card').querySelector('h3').textContent;
            alert(`Quick view for ${productName} would open here.`);
        });
    });
}

// Add to cart functionality
function addToCart(e) {
    // Increment cart counter
    cartItems++;
    cartCount.textContent = cartItems;
    
    // Animate button
    const btn = e.currentTarget;
    btn.textContent = 'Added!';
    btn.style.backgroundColor = 'var(--color-primary)';
    btn.style.color = 'var(--color-white)';
    
    // Reset button after delay
    setTimeout(() => {
        btn.textContent = 'Add to Cart';
        btn.style.backgroundColor = '';
        btn.style.color = '';
    }, 1500);
}

// Handle newsletter form submission
function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const emailInput = e.target.querySelector('input[type="email"]');
    const email = emailInput.value.trim();
    
    if (!email || !isValidEmail(email)) {
        showMessage('Please enter a valid email address', 'error');
        return;
    }
    
    // Simulate form submission
    emailInput.value = '';
    showMessage('Thank you for subscribing to our newsletter!', 'success');
}

// Validate email format
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Show message (for form feedback)
function showMessage(message, type) {
    // Check if message element already exists
    let messageElement = document.querySelector('.message');
    
    if (!messageElement) {
        // Create new message element
        messageElement = document.createElement('div');
        messageElement.className = 'message';
        newsletterForm.appendChild(messageElement);
    }
    
    // Update message content and style
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    
    // Auto-hide after delay
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            messageElement.remove();
        }, 500);
    }, 3000);
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
    if (!isMobile && !e.target.closest('.nav-item.has-dropdown')) {
        dropdownItems.forEach(item => {
            item.classList.remove('active');
        });
    }
});

// Close mobile menu when clicking outside
document.addEventListener('click', function(e) {
    if (navMenu.classList.contains('active') && 
        !e.target.closest('.nav-menu') && 
        !e.target.closest('.mobile-menu-btn')) {
        toggleMobileMenu();
    }
});

// Add keyboard accessibility for dropdowns
document.addEventListener('keydown', function(e) {
    // Close dropdown menus with Escape key
    if (e.key === 'Escape') {
        if (isMobile && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        } else {
            dropdownItems.forEach(item => {
                item.classList.remove('active');
            });
        }
    }
});

// Initialize mobile dropdown styles
function initMobileDropdownStyles() {
    // Check if the style element already exists
    if (!document.getElementById('mobile-dropdown-styles')) {
        // Create a style element for mobile dropdown animations
        const styleEl = document.createElement('style');
        styleEl.id = 'mobile-dropdown-styles';
        styleEl.textContent = `
            @media (max-width: 768px) {
                .dropdown {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease-out, opacity 0.2s ease;
                }
                .nav-item.has-dropdown.active .dropdown {
                    max-height: 500px; /* Large enough to fit all items */
                    transition: max-height 0.5s ease-in, opacity 0.3s ease;
                }
                .nav-item.has-dropdown > a i {
                    transition: transform 0.3s ease;
                }
                .nav-item.has-dropdown.active > a i {
                    transform: rotate(180deg);
                }
            }
        `;
        document.head.appendChild(styleEl);
    }
}