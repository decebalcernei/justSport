// Import the packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv/config'); // per usare file .env (non condividere i dati per accedere al db)

const app = express();

// Middleware
app.use(bodyParser.json()); // per processare il body della richiesta
app.use(cors()); // per evitare errore cors domain (da un domain diverso non posso accedere alle API)

// console.log("hello develop branch");

// Routes
app.get('/', (req, res) => {
	res.send("Homepage");
});

//Connect to db
mongoose.connect(process.env.DB_CONNECTION, () => {
	console.log('Connected to db!');
});

app.listen(3000);