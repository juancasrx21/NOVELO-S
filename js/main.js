document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });
    
    // Mobile Dropdown Toggle
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    
    mobileDropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            this.classList.toggle('active');
            const dropdownContent = this.nextElementSibling;
            if (dropdownContent) {
                dropdownContent.classList.toggle('active');
            }
        });
    });
    
    // Search Toggle
    const searchToggle = document.querySelector('.search-toggle');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearch = document.querySelector('.close-search');
    
    searchToggle.addEventListener('click', function(e) {
        e.preventDefault();
        searchOverlay.classList.add('active');
    });
    
    closeSearch.addEventListener('click', function() {
        searchOverlay.classList.remove('active');
    });
    
    // Add to Cart Functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    
    // Load cart from localStorage or initialize
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count on page load
    function updateCartCount() {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalCount;
    }
    updateCartCount();
    
    // Save cart to localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    
    // Add product to cart
    function addProductToCart(product) {
        const existingProduct = cart.find(item => item.id === product.id);
        if (existingProduct) {
            existingProduct.quantity += product.quantity;
        } else {
            cart.push(product);
        }
        saveCart();
        updateCartCount();
    }
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get product details from data attributes
            const productId = this.getAttribute('data-id');
            const productName = this.getAttribute('data-name');
            const productPrice = parseFloat(this.getAttribute('data-price'));
            const productImage = this.getAttribute('data-image');
            const productQuantity = 1;
            
            const product = {
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: productQuantity
            };
            
            addProductToCart(product);
            
            // Show added notification
            const notification = document.createElement('div');
            notification.className = 'cart-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <img src="${productImage}" alt="${productName}">
                    <div>
                        <p>Added to cart</p>
                        <h4>${productName}</h4>
                    </div>
                </div>
                <a href="pages/checkout/cart.html" class="btn btn-primary">View Cart</a>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        });
    });
    
    // Product Quick View
    const quickViewButtons = document.querySelectorAll('.quick-view');
    
    quickViewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // In a real implementation, this would open a modal with product details
            console.log('Quick view clicked');
        });
    });
    
    // Wishlist
    const wishlistButtons = document.querySelectorAll('.add-to-wishlist');
    
    wishlistButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                this.innerHTML = '<i class="fas fa-heart"></i>';
                console.log('Added to wishlist');
            } else {
                this.innerHTML = '<i class="far fa-heart"></i>';
                console.log('Removed from wishlist');
            }
        });
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Cart page functionality
if (document.querySelector('.cart-content')) {
    document.addEventListener('DOMContentLoaded', function() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const cartSummary = document.querySelector('.cart-summary');
        
        // Load cart from localStorage or initialize
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // Render cart items dynamically
        function renderCartItems() {
            cartItemsContainer.innerHTML = '';
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
                cartSummary.style.display = 'none';
                return;
            }
            cartSummary.style.display = 'block';
            cart.forEach(item => {
                const itemTotal = (item.price * item.quantity).toFixed(2);
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3>${item.name}</h3>
                        <p>Price: $${item.price.toFixed(2)}</p>
                        <div class="item-actions">
                            <div class="item-quantity">
                                <button class="quantity-btn" data-action="decrease">-</button>
                                <span>${item.quantity}</span>
                                <button class="quantity-btn" data-action="increase">+</button>
                            </div>
                            <button class="remove-item">Remove</button>
                        </div>
                    </div>
                    <div class="item-price">
                        $${itemTotal}
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
            attachCartItemListeners();
            updateCartTotal();
        }
        
        // Attach event listeners to quantity buttons and remove buttons
        function attachCartItemListeners() {
            const quantityBtns = cartItemsContainer.querySelectorAll('.quantity-btn');
            const removeBtns = cartItemsContainer.querySelectorAll('.remove-item');
            
            quantityBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = Array.from(cartItemsContainer.children).indexOf(this.closest('.cart-item'));
                    if (this.getAttribute('data-action') === 'increase') {
                        if (cart[index].quantity < 10) {
                            cart[index].quantity++;
                        }
                    } else if (this.getAttribute('data-action') === 'decrease') {
                        if (cart[index].quantity > 1) {
                            cart[index].quantity--;
                        }
                    }
                    saveCart();
                    renderCartItems();
                });
            });
            
            removeBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = Array.from(cartItemsContainer.children).indexOf(this.closest('.cart-item'));
                    cart.splice(index, 1);
                    saveCart();
                    renderCartItems();
                });
            });
        }
        
        // Update cart total in summary
        function updateCartTotal() {
            const subtotalElem = cartSummary.querySelector('.summary-row:nth-child(1) span:last-child');
            const totalElem = cartSummary.querySelector('.summary-row.total span:last-child');
            const shippingElem = cartSummary.querySelector('.summary-row:nth-child(2) span:last-child');
            const taxElem = cartSummary.querySelector('.summary-row:nth-child(3) span:last-child');
            
            const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const shipping = subtotal > 500 ? 0 : 25; // Example shipping rule
            const tax = subtotal * 0.09; // Example tax rate 9%
            const total = subtotal + shipping + tax;
            
            subtotalElem.textContent = `$${subtotal.toFixed(2)}`;
            shippingElem.textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
            taxElem.textContent = `$${tax.toFixed(2)}`;
            totalElem.textContent = `$${total.toFixed(2)}`;
        }
        
        renderCartItems();
    });
}
