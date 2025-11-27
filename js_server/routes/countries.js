const express = require('express');
const CountriesDB = require('../orderDB/countriesDB');
const router = express.Router();

router.get('/countries', async (req, res) => {
    try {
        const result = await CountriesDB.getAllCountries();
        
        if (result.success) {
            res.json({
                collection: 'countries',
                count: result.count,
                data: result.data
            });
        } else {
            res.status(500).json({
                error: 'Failed to retrieve countries data',
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

