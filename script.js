document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('product-modal');
    const cartModal = document.getElementById('cart-modal');
    const modalImage = document.getElementById('modal-image');
    const modalName = document.getElementById('modal-name');
    const modalShortDesc = document.getElementById('modal-short-desc');
    const modalLongDesc = document.getElementById('modal-long-desc');
    const modalActions = document.querySelector('.modal-actions');
    const closeBtn = document.querySelector('#product-modal .close');
    const cartCloseBtn = document.querySelector('#cart-modal .close');
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    const cartIcon = document.getElementById('cart-icon');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    let cart = []; // Global cart for testing without localStorage

    function openModal(button) {
        const proDiv = button.closest('.pro');
        const isProduct = !!proDiv;
        const imgSrc = isProduct ? proDiv.querySelector('img').src : '';
        modalImage.src = imgSrc;
        modalImage.style.display = imgSrc ? 'block' : 'none';
        if (isProduct) {
            modalName.textContent = proDiv.querySelector('h5').textContent;
            modalShortDesc.textContent = proDiv.querySelector('span').textContent;
            modalLongDesc.textContent = proDiv.dataset.longDesc || 'No additional description available.';
        } else {
            modalName.textContent = button.dataset.name;
            modalShortDesc.textContent = button.dataset.shortDesc;
            modalLongDesc.textContent = button.dataset.longDesc;
        }
        modalActions.style.display = isProduct ? 'flex' : 'none';
        document.getElementById('modal-quantity').value = 1;
        modal.classList.add('show');
    }

    function getCart() {
        return cart;
    }

    function saveCart(newCart) {
        cart = newCart;
    }

    function addToCart(name, image, quantity, price) {
        const currentCart = getCart();
        const existing = currentCart.find(item => item.name === name);
        if (existing) {
            existing.quantity += quantity;
        } else {
            currentCart.push({ name, image, quantity, price: parseInt(price) || 0 });
        }
        saveCart(currentCart);
    }

    function removeFromCart(index) {
        const currentCart = getCart();
        currentCart.splice(index, 1);
        saveCart(currentCart);
        displayCart();
    }

    function displayCart() {
        const currentCart = getCart();
        cartItems.innerHTML = '';
        let total = 0;
        if (currentCart.length === 0) {
            cartItems.innerHTML = '<p>Giỏ hàng trống.</p>';
        } else {
            currentCart.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'cart-item';
                itemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Số lượng: ${item.quantity}</p>
                        <p>Giá: ${item.price.toLocaleString('vi-VN')} VND</p>
                    </div>
                    <button class="remove-btn" data-index="${index}">Xóa</button>
                `;
                cartItems.appendChild(itemDiv);
                total += item.price * item.quantity;
            });
        }
        cartTotal.textContent = `Tổng: ${total.toLocaleString('vi-VN')} VND`;

        // Add event listeners for remove buttons
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = this.dataset.index;
                removeFromCart(index);
            });
        });
    }

    // Cart icon click
    cartIcon.addEventListener('click', function(e) {
        e.preventDefault();
        displayCart();
        cartModal.classList.add('show');
    });

    // Product cart icons
    document.querySelectorAll('.cart').forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(this);
        });
    });

    // Other buttons
    document.querySelectorAll('button[data-name]').forEach(btn => {
        btn.addEventListener('click', function() {
            openModal(this);
        });
    });

    // Close modals
    closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    cartCloseBtn.addEventListener('click', () => cartModal.classList.remove('show'));
    window.addEventListener('click', e => {
        if (e.target === modal) modal.classList.remove('show');
        if (e.target === cartModal) cartModal.classList.remove('show');
    });

    // Add to cart
    addToCartBtn.addEventListener('click', () => {
        const qty = parseInt(document.getElementById('modal-quantity').value);
        const name = modalName.textContent;
        const image = modalImage.src;
        const priceText = modalShortDesc.textContent;
        const price = priceText.replace(/[^\d]/g, ''); // Extract numbers
        addToCart(name, image, qty, price);

        modal.classList.remove('show');
    });

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        alert('Chức năng thanh toán chưa được triển khai.');
    });

    // Newsletter
    const newsletterBtn = document.querySelector('#newsletter button');
    newsletterBtn.addEventListener('click', () => {
        const emailInput = document.querySelector('#newsletter input');
        const email = emailInput.value.trim();
        if (email) {
            alert('Cảm ơn bạn đã đăng ký!');
            emailInput.value = '';
        } else {
            alert('Vui lòng nhập địa chỉ email!');
        }
    });
});