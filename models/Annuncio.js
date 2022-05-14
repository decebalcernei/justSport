const mongoose = require("mongoose");

const AnnuncioSchema = mongoose.Schema({
	partecipanti: {
		type: Array,
		required: true
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