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

module.exports = router;