const express = require('express');
const router = express.Router();
const Utente = require('../../models/Utente'); // ci serve per interagire con il db

// Restituisce tutti gli utenti (per ora usata solo per testing)
router.get('', async (req, res) => {
    try {
        const utenti = await Utente.find();
        res.json(utenti);
    } catch (err) {
        res.json({
            message: err
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
        res.json(utenteSalvato)
    } catch (err) {
        res.json({
            message: err
        })
    }

});

module.exports = router;