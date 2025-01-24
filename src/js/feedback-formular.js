// Formular-Submit-Event
const feedbackForm = document.getElementById('feedback-form');
feedbackForm.addEventListener('submit', async function (event) {
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
        const feedbackData = {
            name: nameField.value.trim(),
            email: emailField.value.trim(),
            rating_design: parseInt(designRatingField.value.trim(), 10),
            rating_components: parseInt(componentsRatingField.value.trim(), 10),
        };

        // Kommentar nur hinzufügen, wenn vorhanden
        if (commentField.value.trim()) {
            feedbackData.comment = commentField.value.trim();
        }

        // Feedback senden
        await sendFeedback(feedbackData);
    }

});

// Asynchrone Funktion für das Senden des Feedbacks
async function sendFeedback(feedbackData) {
    const url = 'https://web-modules.dev/api/v1/feedback';
    const token = '600|pHk6AjiSXcey22Lg5nd1uFIGKqYW7Gjw7BKD65JU04cca9bf';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        });

        if (response.ok) {
            // Absende-Button aktualisieren
            const submitButton = document.querySelector('#feedback-form button[type="submit"]');
            submitButton.style.backgroundColor = 'green'; // Button grün färben
            submitButton.style.color = 'white';          // Textfarbe weiß für bessere Lesbarkeit
            submitButton.textContent = 'Erfolgreich versendet'; // Text ändern


            // Formular zurücksetzen
            document.getElementById('feedback-form').reset();
            resetFormState();

            // Button nach 5 Sekunden zurücksetzen (optional)
            setTimeout(() => {
                submitButton.style.backgroundColor = ''; // Standardfarbe wiederherstellen
                submitButton.style.color = '';          // Standardfarbe wiederherstellen
                submitButton.textContent = 'Absenden';  // Standardtext wiederherstellen
            }, 5000);

            await fetchFeedbacks(); // Feedback-Liste neu laden
            generateFeedbackSummary(); // Feedback-Zusammenfassung neu generieren
        } else {
            const errorData = await response.json();
            console.error('Fehler beim Senden des Feedbacks:', errorData);
            alert('Es gab ein Problem beim Senden des Feedbacks. Bitte versuchen Sie es erneut.');
        }
    } catch (error) {
        console.error('Ein Fehler ist aufgetreten:', error);
        alert('Ein Fehler ist aufgetreten: ' + error.message);
    }
}


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

function resetFormState() {
    document.querySelectorAll('.form-control').forEach(control => {
        control.className = 'form-control';
        const errorMessage = control.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
    });
}

