// URL de base de l'API et clé
const API_BASE_URL = "https://api.pokemontcg.io/v2";
const API_KEY = "ce5a3fd3-f53d-4f27-b929-2184b66a34d7";

// Élément pour afficher les résultats
const cardContainer = document.getElementById("cardContainer");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("searchButton");

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
  fetchCards(query);
});

// Charger les cartes par défaut (exemple : une recherche vide affiche les premières cartes)
fetchCards();