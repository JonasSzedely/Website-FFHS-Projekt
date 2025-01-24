let activeCategories = { Gaming: true, Möbel: true, Transport: true };
let sortOrder = "alphabet"; // Standard: Alphabetische Sortierung

async function fetchProducts() {
    const url = "https://web-modules.dev/api/v1/products/50";
    const token = "600|pHk6AjiSXcey22Lg5nd1uFIGKqYW7Gjw7BKD65JU04cca9bf";

    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }

        const data = await response.json();
        const sortedProducts = sortProducts(data.products);
        productToHtml(sortedProducts);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
        showErrorMessage("Fehler beim Abrufen der Produkte. Bitte versuchen Sie es später erneut.");
    }
}

function sortProducts(products) {
    return products.sort((a, b) => {
        switch (sortOrder) {
            case "alphabet":
                return a.name.localeCompare(b.name);
            case "mostLikes":
                return b.likes_count - a.likes_count; // Sortiere nach Likes absteigend
            case "priceDescending":
                return b.price - a.price; // Sortiere nach Preis absteigend
            case "priceAscending":
                return a.price - b.price; // Sortiere nach Preis aufsteigend
            case "gamingFirst":
                if (a.category.name === "Gaming") return -1; // Sortiere mit Gaming zuerst
                if (b.category.name === "Gaming") return 1;
                return a.name.localeCompare(b.name);
            case "moebelFirst":
                if (a.category.name === "Möbel") return -1; //Sortiere mit Möbel zuerst
                if (b.category.name === "Möbel") return 1;
                return a.name.localeCompare(b.name);
            case "transportFirst":
                if (a.category.name === "Transport") return -1; //Sortiere mit Transport zuerst
                if (b.category.name === "Transport") return 1;
                return a.name.localeCompare(b.name);
        }
    });
}

function productToHtml(data) {
    const container = document.getElementById("shop-container");
    if (!container) return;

    container.innerHTML = "";
    data
        .filter(product => activeCategories[product.category.name])
        .forEach(product => {
            const formattedPrice = product.price.toLocaleString("de-CH", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });

            const productElement = document.createElement("div");
            productElement.className = "product";
            productElement.innerHTML = `
                <img src="${product.image}" alt="${product.name}" onclick="openImage(this)">
                <div class="category">${product.category.name}</div>
                <div class="price">${formattedPrice} CHF</div>
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <div class="skuNumber">Sku-Nummer: ${product.sku}</div>
                <div class="likes">
                    Gefällt <span class="like-count">${product.likes_count}</span> Kunden 
                    <span class="like-icon" data-id="${product.id}" role="button" aria-label="Like">&#10084;</span>
                </div>
            `;

            container.appendChild(productElement);
        });

    attachLikeEventListeners(); // Like-Icons aktualisieren
}

function attachLikeEventListeners() {
    const likeIcons = document.querySelectorAll(".like-icon");
    likeIcons.forEach(icon => {
        icon.addEventListener("click", (event) => {
            const productId = event.target.dataset.id;
            likeProduct(productId, event.target); // Funktion zum Liken aufrufen
        });
    });
}

function openImage(image) {
    const isSmallScreen = window.matchMedia("(max-width: 550px)").matches;

    if (isSmallScreen) {
        console.log("Funktion deaktiviert unter 550px Bildschirmbreite.");
        return;
    }

    const contentBig = document.getElementById("contentBig");
    const bigImage = document.getElementById("bigImage");
    contentBig.style.display = "flex";
    bigImage.src = image.src;
}

function closeImage() {
    const contentBig = document.getElementById("contentBig");
    contentBig.style.display = "none";
}
// Überwachen der Bildschirmgröße
const mediaQuery = window.matchMedia("(max-width: 550px)");

function handleScreenChange(e) {
    if (e.matches) {
        console.log("Bildschirmgröße unter 550px, closeImage wird aufgerufen.");
        closeImage();
    }
}

// Event-Listener hinzufügen
mediaQuery.addEventListener("change", handleScreenChange);
// Neue Funktion für das Liken eines Produkts
async function likeProduct(productId, icon) {
    const url = `https://web-modules.dev/api/v1/like`;
    const token = "600|pHk6AjiSXcey22Lg5nd1uFIGKqYW7Gjw7BKD65JU04cca9bf";

    // Formulardaten für den Request
    const formData = new URLSearchParams();
    formData.append("type", "product");
    formData.append("id", productId);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: formData.toString()
        });

        if (!response.ok) {
            throw new Error(`HTTP-Fehler: ${response.status}`);
        }

        const data = await response.json();

        // Anzahl der Likes aktualisieren
        const likeCountElement = icon.previousElementSibling;
        if (likeCountElement) {
            likeCountElement.textContent = data.amount;
        }
        if (sortOrder === "mostLikes") {
            fetchProducts();
        }
    } catch (error) {
        console.error(`Fehler beim Liken des Produkts ${productId}:`, error);
    }
}

function showErrorMessage(message) {
    const errorMessageElement = document.getElementById("error-message");
    if (!errorMessageElement) return;

    errorMessageElement.textContent = message;
    errorMessageElement.style.display = "block";

    setTimeout(() => {
        errorMessageElement.style.display = "none";
    }, 5000);
}

function handleSortChange(event) {
    sortOrder = event.target.value;
    fetchProducts(); // Aktualisiere die Ansicht mit der neuen Sortierung
}

document.addEventListener("DOMContentLoaded", () => {
    const sortDropdown = document.getElementById("sort-dropdown");
    sortDropdown.value = sortOrder;

    sortDropdown.addEventListener("change", handleSortChange);

    const categoryButtons = document.querySelectorAll(".category-toggle");
    categoryButtons.forEach(button => {
        const category = button.dataset.category;
        button.classList.toggle("active", activeCategories[category]);

        button.addEventListener("click", () => {
            activeCategories[category] = !activeCategories[category];
            button.classList.toggle("active", activeCategories[category]);
            fetchProducts();
        });
    });

    fetchProducts();
});
