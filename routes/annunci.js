const express = require('express');
const router = express.Router();

// Get all posts
router.get('/', async (req, res) => {
    try{
        const annunci = await Annuncio.find();
        res.json(annunci);
        }catch(err){
            res.json({message: err})
        }
});

module.exports = router;