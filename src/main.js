import { databaseURL } from '/firebase.js';

// DOM elements
document.addEventListener('DOMContentLoaded', () => {
    const toggleDarkButton = document.getElementById('toggle-dark');
    const htmlElement = document.documentElement;
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const productModal = document.getElementById('product-modal');
    const closeModalButton = document.getElementById('close-modal');
    const modalName = document.getElementById('modal-name');
    const modalPrice = document.getElementById('modal-price');
    const modalImage = document.getElementById('modal-image');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartEmptyMessage = document.getElementById('cart-empty');
    const cartTotalElement = document.getElementById('cart-total');
    const finalizePurchaseButton = document.getElementById('finalize-purchase');

    // Verificar que todos los elementos necesarios existan
    if (!cartItemsContainer || !cartEmptyMessage || !cartTotalElement || !finalizePurchaseButton) {
        console.error('Critical DOM elements are missing:', {
            cartItemsContainer,
            cartEmptyMessage,
            cartTotalElement,
            finalizePurchaseButton
        });
        return;
    }

    // Debugging DOM elements
    console.log('DOM elements:', {
        toggleDarkButton,
        mobileMenuToggle,
        productModal,
        cartItemsContainer,
        cartEmptyMessage,
        cartTotalElement,
        finalizePurchaseButton
    });

    // Dark mode toggle
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemDark)) {
        htmlElement.classList.add('dark');
    }

    toggleDarkButton.addEventListener('click', () => {
        htmlElement.classList.toggle('dark');
        const isDark = htmlElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
    });

    // Heart icon toggle
    document.querySelectorAll('.fa-heart').forEach(heart => {
        heart.addEventListener('click', () => {
            heart.classList.toggle('fas');
            heart.classList.toggle('far');
            if (heart.classList.contains('fas')) {
                heart.classList.add('text-primary');
            } else {
                heart.classList.remove('text-primary');
            }
            heart.classList.add('animate-pulse');
            setTimeout(() => heart.classList.remove('animate-pulse'), 300);
        });
    });

    // Modal handling
    document.querySelectorAll('[data-modal-target]').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const name = trigger.getAttribute('data-name');
            const price = trigger.getAttribute('data-price');
            const image = trigger.getAttribute('data-image');

            modalName.textContent = name;
            modalPrice.textContent = price;
            modalImage.src = image;

            productModal.classList.remove('hidden');
        });
    });

    closeModalButton.addEventListener('click', () => {
        productModal.classList.add('hidden');
    });

    productModal.addEventListener('click', (e) => {
        if (e.target === productModal) {
            productModal.classList.add('hidden');
        }
    });

    // Add to cart
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            const image = button.getAttribute('data-image');

            console.log('Adding to cart:', { name, price, image });

            const cartURL = `${databaseURL}/cart.json`;

            fetch(cartURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name,
                    price,
                    image,
                    quantity: 1
                })
            })
                .then(response => {
                    console.log('POST response status:', response.status);
                    if (!response.ok) {
                        throw new Error(`Error adding to cart: ${response.statusText}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Item added to cart:', data);
                    setTimeout(fetchCart, 100); // Retraso mínimo para propagación
                })
                .catch(error => {
                    console.error('Error adding item to cart:', error);
                });
        });
    });

    // Setup remove buttons
    function setupRemoveButtons() {
        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.removeEventListener('click', handleRemove); // Prevent duplicate listeners
            button.addEventListener('click', handleRemove);
            console.log('Remove button initialized with ID:', button.getAttribute('data-id'));
        });
    }

    function handleRemove(event) {
        const id = event.currentTarget.getAttribute('data-id');
        console.log('Remove button clicked, ID:', id);
        const itemURL = `${databaseURL}/cart/${id}.json`;

        fetch(itemURL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error removing item: ${response.statusText}`);
                }
                console.log('Item removed from cart');
                fetchCart();
            })
            .catch(error => {
                console.error('Error removing item from cart:', error);
            });
    }

    // Render cart
    function renderCart(items) {
        console.log('Rendering cart with items:', items);
        if (!cartItemsContainer || !cartEmptyMessage || !finalizePurchaseButton || !cartTotalElement) {
            console.error('One or more DOM elements are missing:', {
                cartItemsContainer,
                cartEmptyMessage,
                finalizePurchaseButton,
                cartTotalElement
            });
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (!items || Object.keys(items).length === 0) {
            console.log('Cart is empty, showing empty message');
            cartEmptyMessage.classList.remove('hidden');
            finalizePurchaseButton.classList.add('hidden');
            cartTotalElement.textContent = '$0.00';
            return;
        }

        console.log('Cart has items, rendering items');
        cartEmptyMessage.classList.add('hidden');
        finalizePurchaseButton.classList.remove('hidden');

        Object.entries(items).forEach(([id, item]) => {
            console.log('Rendering item:', { id, item });
            if (!item.name || !item.price || !item.image || !item.quantity) {
                console.warn(`Item with ID ${id} is missing required properties:`, item);
                return;
            }

            const itemElement = document.createElement('div');
            itemElement.className = 'flex items-center gap-4 border-b border-gray-300 dark:border-gray-700 pb-4';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover rounded">
                <div class="flex-1">
                    <h4 class="font-semibold">${item.name}</h4>
                    <p class="text-gray-600 dark:text-gray-400">${item.price} x ${item.quantity}</p>
                </div>
                <button class="remove-from-cart text-red-500 hover:text-red-600" data-id="${id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(itemElement);

            const priceValue = parseFloat(item.price.replace('$', '')) * item.quantity;
            total += priceValue;
        });

        cartTotalElement.textContent = `$${total.toFixed(2)}`;
        setupRemoveButtons();
    }

    // Fetch cart data
    function fetchCart() {
        const cartURL = `${databaseURL}/cart.json`;

        console.log('Fetching cart from:', cartURL);
        fetch(cartURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                console.log('Fetch response status:', response.status);
                if (!response.ok) {
                    throw new Error(`Error fetching cart: ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Raw cart data:', data);
                renderCart(data ? data : {});
            })
            .catch(error => {
                console.error('Error fetching cart:', error);
                renderCart({}); // Renderizar carrito vacío en caso de error
            });
    }

    // Finalize purchase
    finalizePurchaseButton.addEventListener('click', () => {
        console.log('Finalizing purchase');

        const cartURL = `${databaseURL}/cart.json`;
        const ordersURL = `${databaseURL}/orders.json`;

        fetch(cartURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching cart: ${response.statusText}`);
                }
                return response.json();
            })
            .then(cartData => {
                if (!cartData || Object.keys(cartData).length === 0) {
                    console.log('El carrito está vacío');
                    return;
                }

                const order = {
                    items: cartData,
                    total: parseFloat(cartTotalElement.textContent.replace('$', '')),
                    timestamp: new Date().toISOString()
                };

                return fetch(ordersURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(order)
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Error sending order: ${response.statusText}`);
                        }
                        console.log('Order sent to Firebase');
                        return fetch(cartURL, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    })
                    .then(() => {
                        console.log('Cart cleared in Firebase');
                        fetchCart();
                    });
            })
            .catch(error => {
                console.error('Error finalizing purchase:', error);
            });
    });

    // Initial fetch
    fetchCart();
});