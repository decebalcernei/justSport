const express = require('express');
const router = express.Router();
const Annuncio = require('../models/Annuncio'); // ci serve per interagire con il db

// Get all posts
router.get('/', async (req, res) => {
    try {
        const annunci = await Annuncio.find();
        res.json(annunci);
    } catch (err) {
        res.json({
            message: err
        })
    }
});

router.get("/add", (req, res) => {
    res.render("../views/add-annuncio")
})

router.post("/add", (req, res) => {
    var annuncio = new Annuncio();
    annuncio.partecipanti = req.body.partecipanti;
    annuncio.attrezzatura_necessaria = req.body.attrezzatura_necessaria;
    annuncio.costo = req.body.costo;
    annuncio.citta = req.body.citta;

    annuncio.save((err, doc) => {
        if (!err) {
            res.redirect("/annunci")
        } else {
            res.send(err)
        }
    })
})

module.exports = router;