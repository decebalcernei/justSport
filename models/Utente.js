const mongoose = require("mongoose");

const UtenteSchema = mongoose.Schema({
	username: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    annunci_pubblicati: {
        type: Array,
        value: []
    },

	iscrizione_annunci: {
        type: Array,
        value: []
    }
});

module.exports = mongoose.model('Utenti', UtenteSchema);