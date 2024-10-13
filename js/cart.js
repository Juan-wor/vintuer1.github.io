document.addEventListener('DOMContentLoaded', () => {
    const cartTable = document.querySelector('table');
    const cartContainer = document.querySelector('.cart');
    const totalPriceElement = document.querySelector('.total-price table tr:last-child td:last-child');
    const cartCountElement = document.querySelector('.bx-cart .d-flex');
    
    // Elementos para el subtotal y el impuesto
    const subtotalElement = document.querySelector('.total-price table tr:nth-child(1) td:last-child');
    const taxElement = document.querySelector('.total-price table tr:nth-child(2) td:last-child');
    
    function loadCart() {
        const storedCart = localStorage.getItem('cartItems');
        return storedCart ? JSON.parse(storedCart) : [];
    }

    function saveCart(cartItems) {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    function renderCart() {
        const cartItems = loadCart();
        cartTable.innerHTML = ''; 

        if (cartItems.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <p><i class="bx bx-sad"></i> El carrito está vacío</p>
                    <a href="product.html" class="btn add-products-btn">Agregar productos</a>
                </div>
            `;
        } else {
            cartItems.forEach(item => {
                const row = document.createElement('tr');
                row.classList.add('cart-row');
                row.innerHTML = `
                    <td>
                        <div class="cart-item">
                            <img src="${item.image}" alt="${item.name}" class="cart-item-image"/>
                            <div class="product-info">
                                <h4>${item.name}</h4>
                                <span>Price: $${parseFloat(item.price).toFixed(2)}</span> <br />
                                <button class="remove-btn">Remove</button>
                            </div>
                        </div>
                    </td>
                    <td><input type="number" value="${item.quantity}" min="1" class="quantity-input"/></td>
                    <td class="item-subtotal">$${(item.price * item.quantity).toFixed(2)}</td>
                `;
                cartTable.appendChild(row);
            });
        }

        updateTotal();
        updateCartCount();
    }

    function updateTotal() {
        const cartItems = loadCart();
        let subtotal = 0;

        // Calcular el subtotal
        cartItems.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        const tax = subtotal * 0.25; // Asumimos un impuesto del 25%
        const grandTotal = subtotal + tax;

        // Actualizar elementos de la tabla de resumen
        subtotalElement.innerText = `$${subtotal.toFixed(2)}`;
        taxElement.innerText = `$${tax.toFixed(2)}`;
        totalPriceElement.innerText = `$${grandTotal.toFixed(2)}`;
    }

    function updateCartCount() {
        const cartItems = loadCart();
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.innerText = totalCount;
    }

    function updateCartItems() {
        const rows = cartTable.querySelectorAll('tr');
        const updatedCart = [];
        
        rows.forEach(row => {
            const productName = row.querySelector('h4').innerText;
            const productPrice = parseFloat(row.querySelector('span').innerText.replace('Price: $', ''));
            const productQuantity = parseInt(row.querySelector('input').value);
            const productImage = row.querySelector('img').src;

            updatedCart.push({
                name: productName,
                price: productPrice,
                quantity: productQuantity,
                image: productImage
            });
        });

        saveCart(updatedCart);
    }

    cartTable.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-btn')) {
            const row = e.target.closest('tr');
            row.remove();
            updateCartItems();
            updateTotal();
            updateCartCount();

            if (loadCart().length === 0) {
                renderCart();
            }
        }
    });

    cartTable.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            updateTotal();
            updateCartItems();
            updateCartCount();
        }
    });

    // Evento para agregar productos desde la página de productos
    document.querySelectorAll('.bx-cart').forEach(cartIcon => {
        cartIcon.addEventListener('click', (e) => {
            const productData = JSON.parse(e.target.getAttribute('data-product'));
            const cartItems = loadCart();

            // Verificar si el producto ya está en el carrito
            const existingItemIndex = cartItems.findIndex(item => item.name === productData.name);
            if (existingItemIndex > -1) {
                // Si ya está en el carrito, simplemente incrementar la cantidad
                cartItems[existingItemIndex].quantity += 1;
            } else {
                // Si no está en el carrito, agregarlo con cantidad 1
                productData.quantity = 1;
                cartItems.push(productData);
            }

            saveCart(cartItems);
            updateCartCount();
            updateTotal();
        });
    });

    renderCart();
});
