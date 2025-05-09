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

    // Cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    const resetCartButton = document.querySelector('.reset-cart'); // Optional reset button
    let cart = JSON.parse(localStorage.getItem('cart')) || {};

    // Initialize cart count
    function updateCartCount() {
        const totalCount = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalCount > 0 ? `+${totalCount}` : '0';
            cartCount.style.display = totalCount > 0 ? 'flex' : 'none';
        }
    }

    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }

    // Reset cart
    function resetCart() {
        cart = {};
        saveCart();
        alert('Cart has been reset to zero.');
    }

    // Initialize cart count on page load
    updateCartCount();

    // Function to render cart items on cart.html
    function renderCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCartMessage = document.getElementById('emptyCart');
        const cartWithItems = document.getElementById('cartWithItems');
        const cartSubtotalElem = document.getElementById('cartSubtotal');
        const cartTaxElem = document.getElementById('cartTax');
        const cartTotalElem = document.getElementById('cartTotal');

        if (!cartItemsContainer || !emptyCartMessage || !cartWithItems || !cartSubtotalElem || !cartTaxElem || !cartTotalElem) {
            return;
        }

        // Clear current items
        cartItemsContainer.innerHTML = '';

        const cartKeys = Object.keys(cart);
        if (cartKeys.length === 0) {
            emptyCartMessage.style.display = 'block';
            cartWithItems.style.display = 'none';
            return;
        } else {
            emptyCartMessage.style.display = 'none';
            cartWithItems.style.display = 'grid';
        }

        let subtotal = 0;

        cartKeys.forEach(productName => {
            const item = cart[productName];
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            // Create cart item element
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';

            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="../../images/products/${productName.toLowerCase().replace(/\\s+/g, '-')}.jpg" alt="${productName}">
                </div>
                <div class="cart-item-details">
                    <h3>${productName}</h3>
                    <div class="price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn quantity-decrease">-</button>
                            <input type="number" class="quantity" value="${item.quantity}" min="1" max="10">
                            <button class="quantity-btn quantity-increase">+</button>
                        </div>
                        <button class="remove-item">Remove</button>
                    </div>
                </div>
            `;

            // Quantity decrease button
            cartItem.querySelector('.quantity-decrease').addEventListener('click', () => {
                if (cart[productName].quantity > 1) {
                    cart[productName].quantity -= 1;
                    saveCart();
                    renderCartItems();
                }
            });

            // Quantity increase button
            cartItem.querySelector('.quantity-increase').addEventListener('click', () => {
                if (cart[productName].quantity < 10) {
                    cart[productName].quantity += 1;
                    saveCart();
                    renderCartItems();
                }
            });

            // Quantity input change
            cartItem.querySelector('.quantity').addEventListener('change', (e) => {
                let val = parseInt(e.target.value);
                if (isNaN(val) || val < 1) val = 1;
                if (val > 10) val = 10;
                cart[productName].quantity = val;
                saveCart();
                renderCartItems();
            });

            // Remove item button
            cartItem.querySelector('.remove-item').addEventListener('click', () => {
                delete cart[productName];
                saveCart();
                renderCartItems();
            });

            cartItemsContainer.appendChild(cartItem);
        });

        // Calculate tax (assume 8% tax)
        const tax = subtotal * 0.08;
        const total = subtotal + tax;

        cartSubtotalElem.textContent = `$${subtotal.toFixed(2)}`;
        cartTaxElem.textContent = `$${tax.toFixed(2)}`;
        cartTotalElem.textContent = `$${total.toFixed(2)}`;
    }

    // Call renderCartItems on page load
    renderCartItems();

    // Add to cart button click handler
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const productName = this.getAttribute('data-name') || 'Unknown Product';
            const productPrice = parseFloat(this.getAttribute('data-price')) || 0;

            if (cart[productName]) {
                cart[productName].quantity += 1;
            } else {
                cart[productName] = {
                    price: productPrice,
                    quantity: 1
                };
            }
            saveCart();
            renderCartItems();

            // Add animation to cart icon
            const cartIcon = document.querySelector('.cart-icon');
            if (cartIcon) {
                cartIcon.classList.add('animate');
                setTimeout(() => {
                    cartIcon.classList.remove('animate');
                }, 500);
            }

            // Show notification
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.innerHTML = `<p>${productName} added to cart</p>`;
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
        });
    });

    // Optional: Reset cart button functionality
    if (resetCartButton) {
        resetCartButton.addEventListener('click', () => {
            resetCart();
            renderCartItems();
        });
    }

    // Initialize cart count to zero if no products are in the cart
    if (Object.keys(cart).length === 0) {
        cartCount.textContent = 0;
        cartCount.style.display = 'none';
    }

    // Quick view functionality
    const quickViewButtons = document.querySelectorAll('.quick-view');
    
    if (quickViewButtons.length > 0) {
        quickViewButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const product = this.closest('.product-card');
                const productName = product.querySelector('h3').textContent;
                const productPrice = product.querySelector('.product-price').textContent;
                const productImage = product.querySelector('img').src;
                
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
                            <p class="quick-view-price">${productPrice}</p>
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
                    
                    if (cart[productName]) {
                        cart[productName].quantity += quantity;
                    } else {
                        const productPriceValue = parseFloat(productPrice.replace(/[^0-9.-]+/g,"")) || 0;
                        cart[productName] = {
                            price: productPriceValue,
                            quantity: quantity
                        };
                    }
                    saveCart();
                    
                    // Add animation to cart icon
                    const cartIcon = document.querySelector('.cart-icon');
                    if (cartIcon) {
                        cartIcon.classList.add('animate');
                        setTimeout(() => {
                            cartIcon.classList.remove('animate');
                        }, 500);
                    }
                    
                    // Close modal
                    modal.classList.remove('active');
                    setTimeout(() => {
                        modal.remove();
                        document.body.classList.remove('no-scroll');
                    }, 300);
                    
                    // Show notification
                    const notification = document.createElement('div');
                    notification.className = 'cart-notification';
                    notification.innerHTML = `<p>${productName} (${quantity}) added to cart</p>`;
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
                });
            });
        });
    }

    // Add to wishlist functionality
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
    
    if (wishlistButtons.length > 0) {
        wishlistButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const icon = this.querySelector('i');
                icon.classList.toggle('far');
                icon.classList.toggle('fas');
                
                if (icon.classList.contains('fas')) {
                    const product = this.closest('.product-card');
                    const productName = product.querySelector('h3').textContent;
                    
                    const notification = document.createElement('div');
                    notification.className = 'wishlist-notification';
                    notification.innerHTML = `<p>${productName} added to wishlist</p>`;
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
            });
        });
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            const formGroup = this.querySelector('.form-group');
            formGroup.innerHTML = `<div class="success-message"><i class="fas fa-check-circle"></i> Thank you for subscribing!</div>`;
        });
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
        
        .cart-count {
            display: none;
        }
        
        .cart-count:not(:empty) {
            display: flex;
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