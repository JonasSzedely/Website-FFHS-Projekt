// Globale Variablen zur Verwaltung des Feedbacks
let feedbackList = [];
let currentIndex = 0;
let autoScrollInterval = null;

// Funktion zum Abrufen von Feedbacks
async function fetchFeedbacks() {
    const url = 'https://web-modules.dev/api/v1/feedback';
    const token = '600|pHk6AjiSXcey22Lg5nd1uFIGKqYW7Gjw7BKD65JU04cca9bf';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const responseData = await response.json();
            feedbackList = responseData.feedbacks || [];
            if (feedbackList.length > 0) {
                currentIndex = 0;
                displayFeedback(currentIndex);

            } else {
                document.getElementById('feedback-text').textContent = 'Keine Feedbacks verfügbar.';
            }
        } else {
            console.error('Fehler beim Abrufen der Feedbacks:', await response.json());
            document.getElementById('feedback-text').textContent = 'Fehler beim Abrufen der Feedbacks.';
        }
    } catch (error) {
        console.error('Ein Fehler ist aufgetreten:', error);
        document.getElementById('feedback-text').textContent = 'Ein Fehler ist aufgetreten: ' + error.message;
    }
}

// Funktion zur Anzeige eines einzelnen Feedbacks
function displayFeedback(index) {
    if (feedbackList.length === 0) return;

    const feedback = feedbackList[index];
    const feedbackName = `
        ${feedback.name}
    `;
    const feedbackMail = `
        ${feedback.email}
    `;
    const feedbackDesign = `
        ${feedback.rating_design}/10
    `;
    const feedbackKomponenten = `
        ${feedback.rating_components}/10
    `;
    const feedbackKommentar = `
        ${feedback.comment || 'Kein Kommentar'}
    `;

    document.getElementById('feedback-name').textContent = feedbackName;
    document.getElementById('feedback-mail').textContent = feedbackMail;
    document.getElementById('feedback-design').textContent = feedbackDesign;
    document.getElementById('feedback-komponenten').textContent = feedbackKomponenten;
    document.getElementById('feedback-kommentar').textContent = feedbackKommentar;
}

// Event-Listener für Navigationsbuttons
document.getElementById('prev-feedback').addEventListener('click', function () {
    if (currentIndex > 0) {
        currentIndex--;
    } else {
        // Wenn der aktuelle Index 0 ist, springe zum letzten Eintrag
        currentIndex = feedbackList.length - 1;
    }
    displayFeedback(currentIndex);
});

document.getElementById('next-feedback').addEventListener('click', function () {
    if (currentIndex < feedbackList.length - 1) {
        currentIndex++;
    } else {
        // Wenn der aktuelle Index der letzte Eintrag ist, springe zum ersten Eintrag
        currentIndex = 0;
    }
    displayFeedback(currentIndex);
});



function startAutoScroll() {
    autoScrollInterval = setInterval(function () {
        if (currentIndex < feedbackList.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0; // Zurück zum Anfang, wenn das Ende erreicht ist
        }
        displayFeedback(currentIndex);
        }, 5000); // Alle 20 Sekunden
}


// Feedbacks beim Laden der Seite abrufen
document.addEventListener('DOMContentLoaded', fetchFeedbacks);
