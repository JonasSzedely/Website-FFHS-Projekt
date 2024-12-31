// Funktion, um die Produkte von der API abzurufen
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

        // Produkte sortieren
        const sortedProducts = sortProducts(data.products);

        // Produkte im HTML darstellen
        productToHtml(sortedProducts);
    } catch (error) {
        console.error("Fehler beim Abrufen der Daten:", error);
    }
}

// Funktion, um Produkte zu sortieren
function sortProducts(products) {
    return products.sort((a, b) => {
        // Sortiere zuerst nach Kategorie
        if (a.category.name < b.category.name) return -1;
        if (a.category.name > b.category.name) return 1;

        // Wenn Kategorien gleich sind, sortiere nach Name
        if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
        if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;

        return 0;
    });
}

// Funktion, um Produkte in HTML umzuwandeln und anzuzeigen
function productToHtml(data) {
    const container = document.getElementById('shop-container');

    if (!container) {
        console.error('Container mit ID "shop-container" wurde nicht gefunden.');
        return;
    }

    container.innerHTML = ""; // Vorherige Inhalte entfernen

    data.forEach(product => {
        const formattedPrice = product.price.toLocaleString('de-CH', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        const productElement = document.createElement('div');
        productElement.className = 'product';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="category">${product.category.name}</div>
             <div class="price">${formattedPrice} CHF</div>
            <h2>${product.name}</h2>
            <p>${product.description}</p>
            <div class="skuNumber">Sku-Nummer: ${product.sku}</div>
            <div class="likes">
                Gefällt <span class="like-count">${product.likes_count}</span> Kunden 
                <span class="like-icon" data-id="${product.id}" style="cursor: pointer; font-size: 18px; color: blue;">👍</span>
            </div>
        `;

        container.appendChild(productElement);
    });

    // Event-Listener für alle Like-Icons hinzufügen
    document.querySelectorAll('.like-icon').forEach(icon => {
        icon.addEventListener('click', async (event) => {
            const productId = event.target.dataset.id;
            await likeProduct(productId, event.target);
        });
    });
}

// Funktion, um ein Produkt zu liken
async function likeProduct(productId, icon) {
    const url = `https://web-modules.dev/api/v1/like`;
    const token = "600|pHk6AjiSXcey22Lg5nd1uFIGKqYW7Gjw7BKD65JU04cca9bf";

    // Formulardaten für den Request
    const formData = new URLSearchParams();
    formData.append("type", "product");
    formData.append("id", productId);

    try {
        const response = await fetch(url, {  // Hier wird 'await' hinzugefügt
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
    } catch (error) {
        console.error(`Fehler beim Liken des Produkts ${productId}:`, error);
    }
}

// Funktion ausführen
fetchProducts();
