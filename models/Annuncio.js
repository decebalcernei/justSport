const mongoose = require("mongoose");

const AnnuncioSchema = mongoose.Schema({
	sport: {
		type: String,
		required: true
	},
	partecipanti: {
		type: Array,
		required: true
	},
	min_partecipanti: {
		type: Number,
		default: 2
	},
	max_partecipanti: {
		type: Number,
	},
	attrezzatura_necessaria: {
		type: Boolean,
		required: true
	},
	costo: {
		type: Number,
		required: true
	},
	data: {
		type: Date,
		default: Date.now
	},
	citta: {
		type: String,
		required: true
	}
});

module.exports = mongoose.model('Annunci', AnnuncioSchema);