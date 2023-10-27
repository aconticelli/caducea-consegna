const express = require('express');
const axios = require('axios');
const cors = require('cors');
const haver = require('haversine');

const app = express();
const port = 3000;

// Middleware per il parsing del corpo della richiesta JSON
app.use(express.json());

// Middleware per accettare la richiesta dal client con diversa port ma stesso localhost
app.use(cors());

// Metodo POST che restituisce i professionisti facenti un certo lavoro in una certa area geografica.
// param1: latitudine
// param2: longitude
// param3: raggio
// param4: job
// error1: Parametri non validi
// error2: Errore con endpoint esterno
// error3: Errore interno al server 
app.post('/api/search/professionisti', async (req, res) => {
  try {
    const { latitude, longitude, raggio, job } = req.body;

    if (!latitude || !longitude || !raggio || !job) {
      res.status(400).json({ error: 'Parametri non validi' });
      return;
    }

    // Effettua una richiesta all'endpoint esterno, mediante axios piuttosto che fetch per universalità
    let professionisti;
    try {
      const response = await axios.get('https://65318a7d4d4c2e3f333d1e7a.mockapi.io/Professionisti');
      professionisti = response.data;
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Errore con endpoint esterno' });
      return;
    }

    // Filtra i professionisti in base alle coordinate e al lavoro
    const risultati = professionisti.filter(p => {
      const distanza = haver(
        { latitude, longitude },
        { latitude: parseFloat(p.latitude), longitude: parseFloat(p.longitude) }
      );
      return distanza <= raggio && p.job === job;
    });
    console.log(risultati)
    res.json(risultati);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Errore interno del server' });
  }
});

// Avvia il server
app.listen(port, () => {
  console.log(`Server in ascolto sulla porta ${port}`);
});