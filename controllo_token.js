const jwt = require("jsonwebtoken");

require("dotenv/config");

const controllo_token = (req, res, next) => {
	var token = req.body.token || req.query.token || req.headers["x-access-token"];

	if (!token) {
		res.status(401).json({
			message: "niente token"
		});
		return;
	}

	jwt.verify(token, process.env.SEGRETO, (err, decoded) => {
		if (err) {
			res.status(403).json({
				message: "token non valido"
			});
		} else {
			req.loggedUser = decoded; // non penso che serva a noi
			next(); // passare alla pagina che l'utente cercava
		}
	});
};

module.exports = controllo_token;