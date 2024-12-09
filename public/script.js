// Import de la fonction de traduction depuis translations.js
import { translatePokemonName } from './translations.js';

const API_BASE_URL = "https://api.pokemontcg.io/v2";
const API_KEY = "ce5a3fd3-f53d-4f27-b929-2184b66a34d7";

const cardContainer = document.getElementById("cardContainer");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("searchButton");

// Fonction pour récupérer les cartes en fonction de la recherche
async function searchCards(query) {
  const translatedQuery = translatePokemonName(query); // Traduire la requête
  cardContainer.innerHTML = `<p>Chargement...</p>`;
  console.log(`Requête API avec le nom : "${translatedQuery}"`);

  try {
    const response = await fetch(`${API_BASE_URL}/cards?q=name:${translatedQuery}`, {
      headers: {
        "X-Api-Key": API_KEY,
      },
    });

    if (!response.ok) throw new Error("Erreur lors de la récupération des cartes");

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      return data.data; // Retourne les cartes récupérées
    } else {
      console.log("Aucune carte trouvée pour le nom :", translatedQuery);
      cardContainer.innerHTML = `<p>Aucune carte trouvée.</p>`;
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des cartes :", error);
    cardContainer.innerHTML = `<p>Erreur : Impossible de charger les cartes.</p>`;
    return [];
  }
}

// Fonction pour afficher les cartes
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
      <p>Rareté : ${card.rarity || "Non spécifiée"}</p>
    `;

    cardContainer.appendChild(cardElement);
  });
}

// Fonction pour trier les cartes
function sortCollection(cards, category, order) {
  return cards.sort((a, b) => {
    let valueA, valueB;

    if (category === "name") {
      valueA = a.name.toLowerCase();
      valueB = b.name.toLowerCase();
    } else if (category === "rarity") {
      const rarityOrder = {
            "Common": 1,
            "Uncommon": 2,
            "Rare": 3,
            "Rare Shining": 4,
            "Illustration Rare": 5,
            "Shiny Rare": 6,
            "Rare Holo": 7,
            "Promo": 8,
            "Classic Collection": 9,
            "Rare VSTAR": 10,
            "Radiant Rare": 11,
            "Trainer Gallery Rare Holo": 12,
            "Rare Holo V": 13,
            "Rare Holo EX": 14,
            "Ultra Rare": 15,
            "Rare Holo Star": 16,
            "Rare Holo VSTAR": 17,
            "Rare Secret": 18,
            "Rare Holo GX": 19,
            "Rare Holo VMAX": 20,
            "Secret Rare": 21,
            "Rare Shiny GX": 22,
            "Rare Holo Star": 23,
            "Rare Holo LV.X": 24,
            "Double Rare": 25,
            "Special Illustration Rare": 26,
            "Hyper Rare": 27,
            "Rare Ultra": 28,
            "Rare Rainbow": 29,
            "Non spécifiée": 0
      };

      const getRarityRank = (rarity) => {
        return rarityOrder[rarity] || 0;
      };

      valueA = getRarityRank(a.rarity);
      valueB = getRarityRank(b.rarity);
    } else if (category === "type") {
      valueA = a.types ? a.types[0].toLowerCase() : "";
      valueB = b.types ? b.types[0].toLowerCase() : "";
    } else {
      return 0;
    }

    if (valueA < valueB) return order === "asc" ? -1 : 1;
    if (valueA > valueB) return order === "asc" ? 1 : -1;
    return 0;
  });
}

// Fonction pour charger les résultats de recherche et appliquer le tri
async function loadSearchResults() {
  const query = searchInput.value.trim();
  if (!query) return;

  const cards = await searchCards(query);

  // Récupérer les options de tri
  const sortCategory = document.getElementById("sortCategory").value;
  const sortOrder = document.getElementById("sortOrder").value;

  // Trier les cartes
  const sortedCards = sortCollection(cards, sortCategory, sortOrder);

  // Afficher les cartes triées
  displayCards(sortedCards);
}

// Ajouter un écouteur d'événements pour la recherche et le tri
searchButton.addEventListener("click", loadSearchResults);
document.getElementById("sortButton").addEventListener("click", loadSearchResults);

// Ajouter un événement "Enter" pour la recherche
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    loadSearchResults();
  }
});

// Charger les résultats de recherche à la soumission du formulaire
document.addEventListener("DOMContentLoaded", loadSearchResults);