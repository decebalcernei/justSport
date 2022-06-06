const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Utente = require("../../models/Utente");

require('dotenv/config');

router.post("", async (req, res) => {

	let user = await Utente.findOne({
		username: req.body.username
	}).exec();

	if (!user) {
		res.status(404).json({
			message: "utente non esiste"
		});
		return;
	}

	if (user.password != req.body.password) {
		res.status(401).json({
			message: "password sbagliata"
		});
		return;
	}

	// utente autenticato, creiamo un token
	var dati = {
		username: user.username,
		id: user._id
	};
	// magari sarebbe il caso di usare anche altri dati, perché con questa
	// implementazione il token sara' sempre uguale

	var impostazioni = {
		expiresIn: 86400
	}; // valido per 24 ore

	var token = jwt.sign(dati, process.env.SEGRETO, impostazioni); // creazione token

	res.status(240).json({
		message: "ecco a te un token",
		token: token,
		username: user.username,
		id: user._id,
		self: "api/v2/" + user._id
	});
});


router.delete("", async (req, res) => {
	token = req.body.token;
	// in realtà non facciamo nulla, mettiamo token=null e basta
	token = null;
	console.log('annullato il token');
	res.json({
		message: "logout eseguito correttamente",
		token: token
	});
});

module.exports = router;