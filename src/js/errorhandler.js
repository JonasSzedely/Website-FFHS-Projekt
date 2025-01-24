function showErrorMessage(message) {
    const errorMessageDiv = document.getElementById('error-message');
    if (!errorMessageDiv) {
        console.error('Fehler-Container mit der ID "error-message" nicht gefunden.');
        return;
    }
    errorMessageDiv.style.display = 'flex';
    errorMessageDiv.textContent = message;
}

function hideErrorMessage() {
    const errorMessageDiv = document.getElementById('error-message');
    if (!errorMessageDiv) {
        console.error('Fehler-Container mit der ID "error-message" nicht gefunden.');
        return;
    }
    errorMessageDiv.style.display = 'none';
}

// Funktionen global verfügbar machen
window.showErrorMessage = showErrorMessage;
window.hideErrorMessage = hideErrorMessage;
