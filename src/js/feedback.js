document.getElementById('feedback-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Verhindert das Absenden des Formulars

    // Felder abrufen
    const nameField = document.getElementById('name');
    const emailField = document.getElementById('email');
    const designRatingField = document.getElementById('design-rating');
    const componentsRatingField = document.getElementById('components-rating');
    const commentField = document.getElementById('comment');

    // Validierung
    let isValid = true;

    // Name Validierung
    if (!nameField.value.trim()) {
        setError(nameField, 'Name ist erforderlich');
        isValid = false;
    } else if (nameField.value.length < 3 || nameField.value.length > 100) {
        setError(nameField, 'Name muss zwischen 3 und 100 Zeichen enthalten');
        isValid = false;
    } else {
        setSuccess(nameField);
    }

    // E-Mail Validierung
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailField.value.trim()) {
        setError(emailField, 'E-Mail ist erforderlich');
        isValid = false;
    } else if (!emailRegex.test(emailField.value) || emailField.value.length > 200) {
        setError(emailField, 'Bitte geben Sie eine gültige E-Mail-Adresse ein (max. 200 Zeichen)');
        isValid = false;
    } else {
        setSuccess(emailField);
    }

    // Bewertung Design Validierung
    if (!designRatingField.value.trim()) {
        setError(designRatingField, 'Bewertung Design ist erforderlich');
        isValid = false;
    } else if (!isIntegerInRange(designRatingField.value, 1, 10)) {
        setError(designRatingField, 'Bitte geben Sie eine Ganzzahl zwischen 1 und 10 ein');
        isValid = false;
    } else {
        setSuccess(designRatingField);
    }

    // Bewertung Komponenten Validierung
    if (!componentsRatingField.value.trim()) {
        setError(componentsRatingField, 'Bewertung Komponenten ist erforderlich');
        isValid = false;
    } else if (!isIntegerInRange(componentsRatingField.value, 1, 10)) {
        setError(componentsRatingField, 'Bitte geben Sie eine Ganzzahl zwischen 1 und 10 ein');
        isValid = false;
    } else {
        setSuccess(componentsRatingField);
    }

    // Kommentar: Keine Validierung erforderlich, da freiwillig
    setSuccess(commentField);

    // Wenn alles gültig ist
    if (isValid) {
        alert('Formular erfolgreich abgesendet!');
        //Server?
    }
});

// Hilfsfunktionen
function setError(input, message) {
    const control = input.parentElement;
    control.className = 'form-control error';
    const errorMessage = control.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = message;
    }
}

function setSuccess(input) {
    const control = input.parentElement;
    control.className = 'form-control success';
    const errorMessage = control.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.textContent = '';
    }
}

function isIntegerInRange(value, min, max) {
    const num = parseInt(value, 10);
    return Number.isInteger(num) && num >= min && num <= max;
}
