const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = 3000;
const API_KEY = 'd694d7b8-6ee3-4f18-aa55-4407cab4372f';
const BASE_URL = 'https://api.pokemontcg.io/v2';

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Route pour récupérer les cartes Pokémon
app.get('/api/cards', async (req, res) => {
  const { query } = req.query; // Optionnel : Filtrage basé sur le nom
  try {
    const response = await axios.get(`${BASE_URL}/cards`, {
      headers: { 'X-Api-Key': API_KEY },
      params: query ? { q: `name:${query}` } : {}, // Recherche par nom si disponible
    });
    res.json(response.data); // Retourne les données JSON des cartes
  } catch (error) {
    console.error('Erreur lors de la récupération des cartes:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des cartes.' });
  }
});

// Route pour récupérer les séries Pokémon
app.get('/api/sets', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/sets`, {
      headers: { 'X-Api-Key': API_KEY },
    });
    res.json(response.data); // Retourne les données JSON des séries
  } catch (error) {
    console.error('Erreur lors de la récupération des séries:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des séries.' });
  }
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});