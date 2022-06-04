const express = require('express');
const router = express.Router();
const Utente = require('../../models/Utente');

// Restituisce l'utente specifico
router.get('/:utenteId', async (req, res) => {
    try {
        const utente = await Utente.findById(req.params.utenteId);
        res.status(211).json(utente);
    } catch (err) {
        res.status(404).json({
            message: "utente inesistente"
        });
    }
});


// Inserimento utente
router.post('/', async (req, res) => {

    const utente = new Utente({
        username: req.body.username,
        password: req.body.password
    });
    try {
        const utenteSalvato = await utente.save();
        res.status(201).json(utenteSalvato)
    } catch (err) {
        res.status(400).json({
            message: err
        })
    }

});

module.exports = router;