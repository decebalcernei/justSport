// Import the packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv/config'); // per usare file .env (non condividere i dati per accedere al db)

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // per evitare errore cors domain (da un domain diverso non posso accedere alle API)
app.use('/', express.static('static')); // expose static folder


const controlloToken = require("./controllo_token");

// Import Routes
const annunciRoutes = require('./api/v2/annunci');
const utentiRoutes = require('./api/v2/utenti');
const autenticazioneRoutes = require("./api/v2/autenticazione");

// routes per cui serve il token (middleware)
//app.use('/utenti', controlloToken);
//app.use('/annunci', controlloToken);

// autenticazione
app.use("/autenticazione", autenticazioneRoutes);

// accedere alle risorse
app.use("/utenti", utentiRoutes);
app.use("/annunci", annunciRoutes);

//Connect to db
mongoose.connect(process.env.DB_CONNECTION, (res) => {
	if (!res)
		console.log("connected to db");
	else
		console.log("encountered an error: ", res);
});

app.get('/favicon.ico', (req, res) => res.status(204));

if (process.env.NODE_ENV !== 'test') {
	app.listen(3000);
  }

module.exports = app;