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

router.get("/add", (req, res)=>{
    res.render("../views/add-annuncio")
})

router.post("/add", (req, res)=>{
    var course = new Annuncio();
    course.partecipanti = req.body.partecipanti;
    course.attrezzatura_necessaria = req.body.attrezzatura_necessaria;
    course.costo = req.body.costo;
    course.data = Math.ceil(Math.random() * 1000) + "";

    course.save((err, doc)=>{
        if(!err){
            res.redirect("/annunci/list")
        }
        else{
            res.send(err)
        }
    })
})

module.exports = router;