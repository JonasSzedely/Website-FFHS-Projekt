// Funktion zur Auswertung der Feedbacks
function generateFeedbackSummary() {
    if (feedbackList.length === 0) {
        document.getElementById('feedback-summary').innerHTML = 'Keine Feedbacks zur Auswertung verfügbar.';
        return;
    }

    // Initialisierung der Zählvariablen
    let designRatings = Array(10).fill(0);
    let componentsRatings = Array(10).fill(0);

    // Feedbacks zählen
    feedbackList.forEach(feedback => {
        if (feedback.rating_design >= 1 && feedback.rating_design <= 10) {
            designRatings[feedback.rating_design - 1]++;
        }
        if (feedback.rating_components >= 1 && feedback.rating_components <= 10) {
            componentsRatings[feedback.rating_components - 1]++;
        }
    });

    // Tabellarische Übersicht generieren
    let tableHTML = `
        <table ="1">
            <thead>
                <tr>
                    <th>Bewertung</th>
                    <th>Design (Anzahl)</th>
                    <th>Komponenten (Anzahl)</th>
                </tr>
            </thead>
            <tbody>
    `;
    for (let i = 0; i < 10; i++) {
        tableHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${designRatings[i]}</td>
                <td>${componentsRatings[i]}</td>
            </tr>
        `;
    }
    tableHTML += `
            </tbody>
        </table>
    `;

    // Tabelle in das HTML einfügen
    document.getElementById('feedback-summary').innerHTML = tableHTML;
}

// Feedbacks beim Laden der Seite abrufen und nach Absenden auswerten
fetchFeedbacks().then(() => generateFeedbackSummary());


