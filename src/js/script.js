// Referenz auf das Burger-Menü und die Navigation
const burgerMenu = document.getElementById('burger-menu');
const navContainer = document.querySelector('.nav-container');

if (burgerMenu && navContainer) {
    // Event Listener für das Burger-Menü
    burgerMenu.addEventListener('click', () => {
        navContainer.classList.toggle('active'); // Navigation ein-/ausblenden
    });
} else {
    console.error('Burger-Menü oder Navigation konnte nicht gefunden werden.');
}
