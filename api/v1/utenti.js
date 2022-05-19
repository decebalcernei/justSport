const express = require('express');
const router = express.Router();
const Utente = require('../../models/Utente'); // ci serve per interagire con il db

// Inserimento utente


router.get("/add", (req, res) => {
    res.render("../views/add-utente");
})

router.post("/add", (req, res) => { // url come risorse
    const utente = new Utente({
        username: req.body.username,
        password: req.body.password
    });

    utente.save((err, doc) => {
        if (!err)
            res.redirect("/annunci");
        else
            res.send(err);
    })
})


module.exports = router;