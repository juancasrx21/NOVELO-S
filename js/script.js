document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll');
        });
    }

    // Mobile Dropdown Toggle
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    
    mobileDropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const dropdown = this.nextElementSibling;
            dropdown.classList.toggle('active');
            this.classList.toggle('active');
        });
    });

    // Search Toggle
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearch = document.querySelector('.close-search');
    
    if (searchToggle) {
        searchToggle.addEventListener('click', function(e) {
            e.preventDefault();
            searchOverlay.classList.add('active');
            document.body.classList.add('no-scroll');
            setTimeout(() => {
                searchOverlay.querySelector('input').focus();
            }, 300);
        });
    }
    
    if (closeSearch) {
        closeSearch.addEventListener('click', function() {
            searchOverlay.classList.remove('active');
            document.body.classList.remove('no-scroll');
        });
    }

    // Hero Slider
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    const heroPrev = document.querySelector('.hero-prev');
    const heroNext = document.querySelector('.hero-next');
    let currentHeroSlide = 0;
    
    function showHeroSlide(index) {
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroDots.forEach(dot => dot.classList.remove('active'));
        
        heroSlides[index].classList.add('active');
        heroDots[index].classList.add('active');
        currentHeroSlide = index;
    }
    
    if (heroDots.length > 0) {
        heroDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showHeroSlide(index);
            });
        });
    }
    
    if (heroPrev) {
        heroPrev.addEventListener('click', () => {
            currentHeroSlide = (currentHeroSlide - 1 + heroSlides.length) % heroSlides.length;
            showHeroSlide(currentHeroSlide);
        });
    }
    
    if (heroNext) {
        heroNext.addEventListener('click', () => {
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            showHeroSlide(currentHeroSlide);
        });
    }
    
    // Auto rotate hero slides
    if (heroSlides.length > 1) {
        setInterval(() => {
            currentHeroSlide = (currentHeroSlide + 1) % heroSlides.length;
            showHeroSlide(currentHeroSlide);
        }, 5000);
    }

    // Product Tabs
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Testimonial Slider
    const testimonialDots = document.querySelectorAll('.testimonial-dot');
    const testimonialPrev = document.querySelector('.testimonial-prev');
    const testimonialNext = document.querySelector('.testimonial-next');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    function showTestimonial(index) {
        if (window.innerWidth <= 992) {
            testimonialCards.forEach(card => card.style.display = 'none');
            testimonialCards[index].style.display = 'block';
            
            testimonialDots.forEach(dot => dot.classList.remove('active'));
            testimonialDots[index].classList.add('active');
            currentTestimonial = index;
        }
    }
    
    if (testimonialDots.length > 0) {
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showTestimonial(index);
            });
        });
    }
    
    if (testimonialPrev) {
        testimonialPrev.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
            showTestimonial(currentTestimonial);
        });
    }
    
    if (testimonialNext) {
        testimonialNext.addEventListener('click', () => {
            currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
            showTestimonial(currentTestimonial);
        });
    }
    
    function checkTestimonialSlider() {
        if (window.innerWidth <= 992) {
            showTestimonial(currentTestimonial);
        } else {
            testimonialCards.forEach(card => card.style.display = '');
        }
    }
    
    checkTestimonialSlider();
    window.addEventListener('resize', checkTestimonialSlider);

    // Cart Management System
    const CART_KEY = 'noveloCart';

    function getCart() {
        const cart = localStorage.getItem(CART_KEY);
        return cart ? JSON.parse(cart) : [];
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function updateCartCount() {
        const cart = getCart();
        const cartCountElements = document.querySelectorAll('.cart-count');
        if (cartCountElements.length > 0) {
            const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountElements.forEach(element => {
                element.textContent = totalQuantity;
            });
        }
    }

    function renderCartPage() {
        let cart = getCart();

        // Filter out invalid items with missing or invalid name, image, or price
        cart = cart.filter(item => {
            return item && item.name && item.image && !isNaN(parseFloat(item.price));
        });

        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCartElement = document.getElementById('emptyCart');
        const cartWithItemsElement = document.getElementById('cartWithItems');

        if (!cartItemsContainer || !emptyCartElement || !cartWithItemsElement) return;

        if (cart.length === 0) {
            emptyCartElement.style.display = 'block';
            cartWithItemsElement.style.display = 'none';
            cartItemsContainer.classList.remove('has-items');
            return;
        } else {
            emptyCartElement.style.display = 'none';
            cartWithItemsElement.style.display = 'grid';
            cartItemsContainer.classList.add('has-items');
        }

        cartItemsContainer.innerHTML = '';

        let subtotal = 0;

        cart.forEach(item => {
            // Ensure price is a number
            const price = typeof item.price === 'number' ? item.price : parseFloat(item.price);
            subtotal += price * item.quantity;

            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';

            itemDiv.innerHTML = `
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p class="price">$${price.toFixed(2)}</p>
                    <div class="cart-item-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn minus" data-name="${item.name}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-name="${item.name}">+</button>
                        </div>
                        <button class="remove-item" data-name="${item.name}">Remove</button>
                    </div>
                </div>
            `;

            cartItemsContainer.appendChild(itemDiv);
        });

        // Add event listeners for quantity buttons
        document.querySelectorAll('.quantity-btn').forEach(button => {
            button.addEventListener('click', function() {
                const name = this.getAttribute('data-name');
                const cart = getCart();
                const index = cart.findIndex(item => item.name === name);
                if (index === -1) return;

                if (this.classList.contains('plus')) {

    function updateOrderSummary() {
        const cart = getCart();
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = subtotal >= 500 ? 0 : 0; // Free shipping over $500
        const taxRate = 0.09; // 9% tax
        const tax = subtotal * taxRate;
        const total = subtotal + shipping + tax;
        
        if (document.getElementById('cartSubtotal')) {
            document.getElementById('cartSubtotal').textContent = `$${subtotal.toFixed(2)}`;
        }
        if (document.getElementById('cartShipping')) {
            document.getElementById('cartShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
        }
        if (document.getElementById('cartTax')) {
            document.getElementById('cartTax').textContent = `$${tax.toFixed(2)}`;
        }
        if (document.getElementById('cartTotal')) {
            document.getElementById('cartTotal').textContent = `$${total.toFixed(2)}`;
        }
    }

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            // Parse price as float to ensure number
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');
            
            let cart = getCart();
            const existingItemIndex = cart.findIndex(item => item.id === productId);
            
            if (existingItemIndex !== -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    image: productImage,
                    quantity: 1
                });
            }
            
            saveCart(cart);
            updateCartCount();
            
            // Show notification
            showNotification(`${productName} added to cart`);
            
            // Add animation to cart icon
            animateCartIcon();
        });
    });

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'cart-notification';
        notification.innerHTML = `<p>${message}</p>`;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    function animateCartIcon() {
        const cartIcon = document.querySelector('.cart-icon');
        if (cartIcon) {
            cartIcon.classList.add('animate');
            setTimeout(() => {
                cartIcon.classList.remove('animate');
            }, 500);
        }
    }

    // Quick view functionality
    const quickViewButtons = document.querySelectorAll('.quick-view');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const product = this.closest('.product-card');
            const productName = product.querySelector('h3').textContent;
            const productPriceText = product.querySelector('.product-price').textContent;
            const productPrice = parseFloat(productPriceText.replace(/[^0-9.-]+/g,""));
            const productImage = product.querySelector('img').src;
            
            // Create quick view modal
            const modal = document.createElement('div');
            modal.className = 'quick-view-modal';
            modal.innerHTML = `
                <div class="quick-view-content">
                    <button class="close-quick-view"><i class="fas fa-times"></i></button>
                    <div class="quick-view-image">
                        <img src="${productImage}" alt="${productName}">
                    </div>
                    <div class="quick-view-details">
                        <h2>${productName}</h2>
                        <p class="quick-view-price">${productPriceText}</p>
                        <div class="quick-view-description">
                            <p>This premium product exemplifies the exceptional craftsmanship and attention to detail that defines Novelo Luxe. Made from the finest materials and designed for the discerning customer.</p>
                        </div>
                        <div class="quick-view-actions">
                            <div class="quantity-selector">
                                <button class="quantity-decrease">-</button>
                                <input type="number" value="1" min="1" max="10">
                                <button class="quantity-increase">+</button>
                            </div>
                            <button class="btn btn-primary add-to-cart-quick-view">Add to Cart</button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            document.body.classList.add('no-scroll');
            
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
            
            // Close quick view
            modal.querySelector('.close-quick-view').addEventListener('click', () => {
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                    document.body.classList.remove('no-scroll');
                }, 300);
            });
            
            // Quantity selector
            const quantityInput = modal.querySelector('.quantity-selector input');
            const decreaseBtn = modal.querySelector('.quantity-decrease');
            const increaseBtn = modal.querySelector('.quantity-increase');
            
            decreaseBtn.addEventListener('click', () => {
                let value = parseInt(quantityInput.value);
                if (value > 1) {
                    quantityInput.value = value - 1;
                }
            });
            
            increaseBtn.addEventListener('click', () => {
                let value = parseInt(quantityInput.value);
                if (value < 10) {
                    quantityInput.value = value + 1;
                }
            });
            
            // Add to cart from quick view
            modal.querySelector('.add-to-cart-quick-view').addEventListener('click', () => {
                const quantity = parseInt(quantityInput.value);
                const productId = modal.querySelector('.add-to-cart-quick-view').getAttribute('data-id') || Date.now().toString();
                
                let cart = getCart();
                const existingItemIndex = cart.findIndex(item => item.name === productName);
                
                if (existingItemIndex !== -1) {
                    cart[existingItemIndex].quantity += quantity;
                } else {
                    cart.push({
                        id: productId,
                        name: productName,
                        price: productPrice,
                        image: productImage,
                        quantity: quantity
                    });
                }
                
                saveCart(cart);
                updateCartCount();
                animateCartIcon();
                showNotification(`${productName} (${quantity}) added to cart`);
                
                // Close modal
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                    document.body.classList.remove('no-scroll');
                }, 300);
            });
        });
    });

    // Add to wishlist functionality
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const icon = this.querySelector('i');
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            
            if (icon.classList.contains('fas')) {
                const product = this.closest('.product-card');
                const productName = product.querySelector('h3').textContent;
                showNotification(`${productName} added to wishlist`, 'wishlist');
            }
        });
    });

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Show success message
            const formGroup = this.querySelector('.form-group');
            formGroup.innerHTML = `<div class="success-message"><i class="fas fa-check-circle"></i> Thank you for subscribing!</div>`;
        });
    }

    // Initialize cart count and render cart page if on cart page
    updateCartCount();
    
    if (window.location.pathname.includes('cart.html')) {
        renderCartPage();
        
        // Handle checkout button
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', function(e) {
                const cart = getCart();
                if (cart.length === 0) {
                    e.preventDefault();
                    showNotification('Your cart is empty. Add items to proceed to checkout.');
                } else {
                    // Redirect to checkout page or show alert for demo
                    alert('Proceeding to checkout...');
                    // window.location.href = 'checkout.html'; // Uncomment and set correct path if checkout page exists
                }
            });
        }
    }

    // Add CSS for dynamic elements
    const style = document.createElement('style');
    style.textContent = `
        .cart-notification, .wishlist-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateY(100px);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .cart-notification.show, .wishlist-notification.show {
            transform: translateY(0);
            opacity: 1;
        }
        
        .wishlist-notification {
            background-color: var(--secondary-color);
        }
        
        .quick-view-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .quick-view-modal.active {
            opacity: 1;
            visibility: visible;
        }
        
        .quick-view-content {
            background-color: white;
            width: 90%;
            max-width: 1000px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            position: relative;
            transform: translateY(50px);
            transition: all 0.3s ease;
        }
        
        .quick-view-modal.active .quick-view-content {
            transform: translateY(0);
        }
        
        .close-quick-view {
            position: absolute;
            top: 15px;
            right: 15px;
            background: transparent;
            border: none;
            font-size: 20px;
            cursor: pointer;
            z-index: 10;
        }
        
        .quick-view-image {
            padding: 30px;
        }
        
        .quick-view-details {
            padding: 30px;
            border-left: 1px solid var(--border-color);
        }
        
        .quick-view-details h2 {
            font-size: 24px;
            margin-bottom: 15px;
        }
        
        .quick-view-price {
            font-size: 20px;
            font-weight: 600;
            color: var(--primary-color);
            margin-bottom: 20px;
        }
        
        .quick-view-description {
            margin-bottom: 30px;
        }
        
        .quantity-selector {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .quantity-selector button {
            width: 30px;
            height: 30px;
            background-color: #f5f5f5;
            border: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        
        .quantity-selector input {
            width: 50px;
            height: 30px;
            border: 1px solid var(--border-color);
            text-align: center;
            margin: 0 5px;
        }
        
        .success-message {
            color: green;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 15px;
        }
        
        .success-message i {
            margin-right: 10px;
        }
        
        .cart-icon.animate {
            animation: bounce 0.5s;
        }
        
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        @media (max-width: 768px) {
            .quick-view-content {
                grid-template-columns: 1fr;
            }
            
            .quick-view-details {
                border-left: none;
                border-top: 1px solid var(--border-color);
            }
        }
        
        /* Cart page specific styles */
        .empty-cart {
            text-align: center;
            padding: 60px 0;
        }
        
        .empty-cart-icon {
            font-size: 60px;
            color: #ddd;
            margin-bottom: 20px;
        }
        
        .empty-cart h2 {
            margin-bottom: 15px;
            font-weight: 300;
        }
        
        .empty-cart p {
            color: #666;
            margin-bottom: 30px;
            max-width: 500px;
            margin-left: auto;
            margin-right: auto;
        }
        
        .cart-item {
            display: flex;
            padding: 20px 0;
            border-bottom: 1px solid #eee;
        }
        
        .cart-item-image {
            width: 120px;
            margin-right: 20px;
        }
        
        .cart-item-image img {
            width: 100%;
            height: auto;
        }
        
        .cart-item-details {
            flex: 1;
        }
        
        .cart-item-actions {
            margin-top: 15px;
            display: flex;
            align-items: center;
        }
        
        .quantity-selector {
            display: flex;
            align-items: center;
            margin-right: 20px;
        }
        
        .quantity-btn {
            width: 30px;
            height: 30px;
            background: #f5f5f5;
            border: 1px solid #ddd;
            cursor: pointer;
        }
        
        .quantity {
            margin: 0 10px;
            min-width: 20px;
            text-align: center;
        }
        
        .remove-item {
            background: none;
            border: none;
            color: #666;
            text-decoration: underline;
            cursor: pointer;
        }
        
        .remove-item:hover {
            color: #333;
        }
    `;
    
    document.head.appendChild(style);

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
});