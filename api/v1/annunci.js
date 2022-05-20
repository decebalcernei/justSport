const express = require('express');
const router = express.Router();
const Annuncio = require('../../models/Annuncio'); // ci serve per interagire con il db

// Get all posts
router.get('', async (req, res) => {
    try {
        const annunci = await Annuncio.find();
        res.json(annunci);
    } catch (err) {
        res.json({
            message: err
        });
    }
});

router.post('', (req, res) => { // url come risorse
    var annuncio = new Annuncio({
        min_partecipanti: req.body.min_partecipanti,
        max_partecipanti: req.body.max_partecipanti,
        attrezzatura_necessaria: req.body.attrezzatura_necessaria,
        costo: req.body.costo,
        citta: req.body.citta,
    });

    annuncio.save((err, doc) => {
        if (!err)
            res.redirect("/annunci");
        else
            res.send(err);
    })
})

module.exports = router;