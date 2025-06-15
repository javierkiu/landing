const toggleDarkButton = document.getElementById('toggle-dark');
const htmlElement = document.documentElement;
const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
const productModal = document.getElementById('product-modal');
const closeModalButton = document.getElementById('close-modal');
const modalName = document.getElementById('modal-name');
const modalPrice = document.getElementById('modal-price');
const modalImage = document.getElementById('modal-image');

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

// Heart icon toggle animation
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