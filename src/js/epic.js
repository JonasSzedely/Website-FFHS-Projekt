document.addEventListener("DOMContentLoaded", () => {
    const apiKey = "JujyEcPJTeW8RkOruK8gg1qM5LdHnoEvjnw7p1BT";
    const apiUrl = "https://api.nasa.gov/EPIC/api/natural";
    const imageBaseUrl = "https://epic.gsfc.nasa.gov/archive/natural";

    const earthImage = document.getElementById("earth-image");
    const loadingMessage = document.getElementById("loading-message");
    const errorMessage = document.getElementById("error-message");
    const loadImageButton = document.getElementById("load-image");
    const timestampDisplay = document.getElementById("timestamp");
    const prevImageButton = document.getElementById("prev-image");
    const nextImageButton = document.getElementById("next-image");
    const prevImageSmallButton = document.getElementById("prev-image-small");
    const nextImageSmallButton = document.getElementById("next-image-small");
    const newestImageButton = document.getElementById("newest-image");
    const dateInput = document.getElementById("date");

    let images = [];
    let currentIndex = 0;

    const toggleElementVisibility = (element, visible) => {
        if (element) {
            element.style.display = visible ? "block" : "none";
        }
    };

    const loadImagesForDate = async (date, showLastImage = false) => {
        toggleElementVisibility(loadingMessage, true);
        toggleElementVisibility(errorMessage, false);
        toggleElementVisibility(earthImage, false);

        try {
            const response = await fetch(`${apiUrl}/date/${date}?api_key=${apiKey}`);
            images = await response.json();

            if (!images || images.length === 0) {
                throw new Error("Keine Bilder für dieses Datum verfügbar.");
            }

            currentIndex = showLastImage ? images.length - 1 : 0;
            displayImage();
        } catch (error) {
            toggleElementVisibility(errorMessage, true);
            if (errorMessage) errorMessage.textContent = error.message;
        } finally {
            toggleElementVisibility(loadingMessage, false);
        }
    };

    const displayImage = () => {
        if (!images || images.length === 0) return;

        const image = images[currentIndex];
        const dateParts = image.date.split(" ")[0].split("-");
        const timeParts = image.date.split(" ")[1];
        const imageUrl = `${imageBaseUrl}/${dateParts[0]}/${dateParts[1]}/${dateParts[2]}/png/${image.image}.png`;
        earthImage.src = imageUrl;
        toggleElementVisibility(earthImage, true);
        if (timestampDisplay) {
            timestampDisplay.innerHTML = `${timeParts} <span class="time-label">Uhr</span>`;
        }
    };

    const changeDate = async (offset, showLastImage = false) => {
        const currentDate = new Date(dateInput.value);
        currentDate.setDate(currentDate.getDate() + offset);
        const newDate = currentDate.toISOString().split("T")[0];
        dateInput.value = newDate;
        await loadImagesForDate(newDate, showLastImage);
    };

    // Event Listener für große Buttons
    if (prevImageButton) {
        prevImageButton.addEventListener("click", async () => {
            if (currentIndex > 0) {
                currentIndex -= 1;
                displayImage();
            } else {
                await changeDate(-1, true);
            }
        });
    }

    if (nextImageButton) {
        nextImageButton.addEventListener("click", async () => {
            if (currentIndex < images.length - 1) {
                currentIndex += 1;
                displayImage();
            } else {
                await changeDate(1, false);
            }
        });
    }

    // Event Listener für kleine Buttons
    if (prevImageSmallButton) {
        prevImageSmallButton.addEventListener("click", async () => {
            if (currentIndex > 0) {
                currentIndex -= 1;
                displayImage();
            } else {
                await changeDate(-1, true);
            }
        });
    }

    if (nextImageSmallButton) {
        nextImageSmallButton.addEventListener("click", async () => {
            if (currentIndex < images.length - 1) {
                currentIndex += 1;
                displayImage();
            } else {
                await changeDate(1, false);
            }
        });
    }

    if (dateInput) {
        dateInput.addEventListener("change", () => {
            const selectedDate = dateInput.value;

            if (!selectedDate) {
                toggleElementVisibility(errorMessage, true);
                if (errorMessage) errorMessage.textContent = "Bitte ein gültiges Datum auswählen.";
                return;
            }

            // Lade Bilder für das ausgewählte Datum
            loadImagesForDate(selectedDate);
        });
    }

    if (loadImageButton) {
        loadImageButton.addEventListener("click", () => {
            const date = dateInput.value;

            if (!date) {
                toggleElementVisibility(errorMessage, true);
                if (errorMessage) errorMessage.textContent = "Bitte ein Datum angeben.";
                return;
            }

            loadImagesForDate(date);
        });
    }

    if (newestImageButton) {
        newestImageButton.addEventListener("click", () => {
            loadLatestImages();
        });
    }

    const loadLatestImages = async () => {
        toggleElementVisibility(loadingMessage, true);
        try {
            const response = await fetch(`${apiUrl}?api_key=${apiKey}`);
            const data = await response.json();

            if (!data || data.length === 0) {
                throw new Error("Keine Bilder verfügbar.");
            }

            const latestDate = data[0].date.split(" ")[0];
            dateInput.value = latestDate;
            await loadImagesForDate(latestDate);
        } catch (error) {
            toggleElementVisibility(errorMessage, true);
            if (errorMessage) errorMessage.textContent = error.message;
        } finally {
            toggleElementVisibility(loadingMessage, false);
        }
    };

    // Automatically load the latest image on page load
    loadLatestImages();
});
