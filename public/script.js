import translations from './translations.js';

const API_BASE_URL = "https://api.pokemontcg.io/v2";
const API_KEY = "ce5a3fd3-f53d-4f27-b929-2184b66a34d7";

const cardContainer = document.getElementById("cardContainer");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("searchButton");

// Fonction pour traduire les mots-clés français en anglais
function translateQuery(query) {
  const lowerCaseQuery = query.toLowerCase();
  return translations[lowerCaseQuery] || query;
}

// Fonction pour charger les cartes depuis l'API
async function fetchCards(query = "") {
  cardContainer.innerHTML = `<p>Chargement...</p>`;

  try {
    const response = await fetch(`${API_BASE_URL}/cards?q=name:${query}`, {
      headers: {
        "X-Api-Key": API_KEY,
      },
    });

    if (!response.ok) throw new Error("Erreur lors de la récupération des cartes");

    const data = await response.json();
    displayCards(data.data);
  } catch (error) {
    console.error("Erreur :", error);
    cardContainer.innerHTML = `<p>Erreur : Impossible de charger les cartes.</p>`;
  }
}

// Fonction pour afficher les cartes sur la page
function displayCards(cards) {
  cardContainer.innerHTML = "";

  if (cards.length === 0) {
    cardContainer.innerHTML = `<p>Aucune carte trouvée.</p>`;
    return;
  }

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    cardElement.innerHTML = `
      <img src="${card.images.small}" alt="${card.name}">
      <h3>${card.name}</h3>
      <p>Type : ${card.types ? card.types.join(", ") : "Inconnu"}</p>
      <p>Rare : ${card.rarity || "Non spécifiée"}</p>
    `;

    cardContainer.appendChild(cardElement);
  });
}

// Écouteur pour la recherche
searchButton.addEventListener("click", () => {
  const query = searchInput.value.trim();
  const translatedQuery = translateQuery(query); // Traduire avant d'envoyer
  fetchCards(translatedQuery);
});

// Zoom sur la carte
cardContainer.addEventListener("click", (event) => {
  if (event.target.closest(".card")) {
    const card = event.target.closest(".card");
    const cardName = card.querySelector("h3")?.textContent?.trim();
    const cardImage = card.querySelector("img")?.src;
    const cardType = card.querySelector("p:nth-child(2)")?.textContent?.trim();
    const cardRarity = card.querySelector("p:nth-child(3)")?.textContent?.trim();

    if (!cardName || !cardImage || !cardType || !cardRarity) {
      const errorElement = document.createElement("div");
      errorElement.classList.add("error-message");
      errorElement.textContent = "Erreur : Impossible de récupérer les informations de la carte.";
      const zoomedCardContainer = document.getElementById("zoomedCardContainer");
      if (zoomedCardContainer) {
        zoomedCardContainer.innerHTML = "";
        zoomedCardContainer.appendChild(errorElement);
      } else {
        console.error("Erreur : Élément zoomedCardContainer non trouvé.");
      }
      return;
    }

    const zoomedCard = document.createElement("div");
    zoomedCard.classList.add("zoomed-card");

    zoomedCard.innerHTML = `
      <img src="${cardImage}" alt="${cardName}">
      <h2>${cardName}</h2>
      <p>Type : ${cardType}</p>
      <p>Rareté : ${cardRarity}</p>
    `;

    const zoomedCardContainer = document.getElementById("zoomedCardContainer");
    if (zoomedCardContainer) {
      zoomedCardContainer.innerHTML = "";
      zoomedCardContainer.appendChild(zoomedCard);
    } else {
      console.error("Erreur : Élément zoomedCardContainer non trouvé.");
    }
  } else {
    console.error("Erreur : Élément cliqué non reconnu.");
  }
});

// Charger les cartes par défaut
fetchCards();