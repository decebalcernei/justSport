const express = require('express');
const router = express.Router();
const Utente = require('../../models/Utente'); // ci serve per interagire con il db

// Get all users
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
    console.log(req.body);
    console.log(utente);
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