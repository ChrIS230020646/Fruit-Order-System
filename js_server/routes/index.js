const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const collections = await db.listCollections().toArray();
        const collectionNames = collections.map(col => col.name);
        
        res.json({ 
            message: 'confirm',
            database: 'OrderDB',
            collections: collectionNames,
            endpoints: {
                allCities: '/cities',
            }
        });
    } catch (error) {
        res.status(500).json({
            error: 'not find',
            message: error.message
        });
    }
});

module.exports = router;