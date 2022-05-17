// Import the packages
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv/config'); // per usare file .env (non condividere i dati per accedere al db)
const expressHandlebars = require('express-handlebars');
const path = require("path");


const app = express();

// Middleware
app.use(bodyParser.json()); // per processare il body della richiesta
app.use(cors()); // per evitare errore cors domain (da un domain diverso non posso accedere alle API)

// console.log("hello develop branch");

app.set("views", path.join(__dirname, "/views/"));

app.engine("hbs", expressHandlebars.engine({
    extname : "hbs",
    dafaultLayout : "mainlayout",
    layoutsDir : __dirname + "/views/layouts"
}));

app.set("view engine", "hbs")

// Routes
app.get('/', (req, res) => {
	res.send("Homepage");
});

// Import Routes
const annunciRoutes = require('./routes/annunci');
const { application } = require('express');
app.use('/annunci', annunciRoutes);

//Connect to db
mongoose.connect(process.env.DB_CONNECTION, (res) => {
	if (!res)
		console.log("connected to db");
	else
		console.log("encountered an error: ", res);
});

app.listen(3000);