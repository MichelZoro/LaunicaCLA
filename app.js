if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('PWA Lista y Service Worker registrado'))
            .catch(err => console.log('Error al registrar PWA:', err));
    });
}
