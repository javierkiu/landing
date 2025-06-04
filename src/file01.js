"use strict";

// Función flecha que muestra la notificación si existe el elemento
const showToast = () => {
    const toast = document.getElementById("toast-interactive");
    if (toast) {
        setTimeout(() => {toast.classList.add("md:block");}, 2000); // Espera 1 segundo antes de mostrar la notificación
    }
};

// Función flecha que agrega evento click al elemento con ID demo para abrir un video de YouTube
const showVideo = () => {
    const demo = document.getElementById("demo");
    if (demo) {
        demo.addEventListener("click", () => {
            window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ", "_blank");
        });
    }
};

// Función autoejecutable que llama a showToast y showVideo
(() => {
    showToast();
    showVideo();
})();
