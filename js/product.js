// product.js

document.addEventListener('DOMContentLoaded', () => {
    const cartCountElement = document.querySelector('.bx-cart .d-flex');
    const addToCartIcons = document.querySelectorAll('.bx-cart');

    // Load cart from localStorage
    function loadCart() {
        const storedCart = localStorage.getItem('cartItems');
        return storedCart ? JSON.parse(storedCart) : [];
    }

    // Save cart to localStorage
    function saveCart(cartItems) {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

    // Function to update the product count in the cart icon
    function updateCartCount() {
        const cartItems = loadCart();
        const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.innerText = totalCount;
    }

    // Function to add a product to the cart
    function addToCart(product) {
        const cartItems = loadCart();
        // Use both name and image as a unique identifier for the product
        const existingItem = cartItems.find(item => item.name === product.name && item.image === product.image);

        if (existingItem) {
            existingItem.quantity += product.quantity; // Increase quantity if product already exists
        } else {
            cartItems.push(product); // Add new product if it doesn't exist in the cart
        }

        saveCart(cartItems);
        updateCartCount();
    }

    // Event listener for adding product to cart
    addToCartIcons.forEach((icon) => {
        icon.addEventListener('click', () => {
            const productItem = icon.closest('.product-item');
            const productName = productItem.querySelector('.product-info a').innerText;
            const productPrice = parseFloat(productItem.querySelector('h4').innerText.replace('$', ''));
            const productImage = productItem.querySelector('img').src;

            const product = {
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1 // Start with quantity 1 when adding to cart
            };

            addToCart(product);
        });
    });

    // Initial cart count update on page load
    updateCartCount();
});
