console.log("hola")
// main.js

// Dark mode toggle
        const toggleDarkButton = document.getElementById('toggle-dark');
        const htmlElement = document.documentElement;

        // Check for saved theme preference or use system preference
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