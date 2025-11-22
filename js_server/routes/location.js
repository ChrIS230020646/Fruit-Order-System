const express = require('express');
const router = express.Router();
const locationDB = require('../orderDB/locationsDB');

router.get('/locations', async (req, res) => {
    try {
        const result = await locationDB.getAllLocations();
        
        if (result.success) {
            res.json({
                collection: 'location',
                count: result.count,
                data: result.data
            });
        } else {
            res.status(500).json({
                error: 'Failed to retrieve city data',
                message: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
});

module.exports = router;