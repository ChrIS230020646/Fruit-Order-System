
const express = require('express');
const CityDB = require('../orderDB/citiesDB');
const router = express.Router();


router.get('/cities', async (req, res) => {
    try {
        const result = await CityDB.getAllCities();
        
        if (result.success) {
            res.json({
                collection: 'cities',
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


router.get('/cities/country/:countryId', async (req, res) => {
    try {
        const countryId = parseInt(req.params.countryId);
        const result = await CityDB.getCitiesByCountryId(countryId);
        
        if (result.success) {
            res.json({
                countryId: countryId,
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

router.get('/cities/:id', async (req, res) => {
    try {
        const cityId = parseInt(req.params.id);
        const result = await CityDB.getCityById(cityId);
        
        if (result.success) {
            res.json({
                data: result.data
            });
        } else {
            res.status(404).json({
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
});


router.post('/cities', async (req, res) => {
    try {
        const cityData = req.body;
        const result = await CityDB.insertCity(cityData);
        
        if (result.success) {
            res.status(201).json({
                message: result.message,
                data: result.data
            });
        } else {
            res.status(400).json({
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
});


router.get('/cities/update/:id/:countryId/:name', async (req, res) => {
    try {
        const cityId = parseInt(req.params.id);
        const countryId = parseInt(req.params.countryId);
        const name = req.params.name;

        const updateData = {
            countryId: countryId,
            name: name
        };
        
        const result = await CityDB.updateCity(cityId, updateData);
        
        if (result.success) {
            res.json({
                message: result.message,
                updatedCity: result.data
            });
        } else {
            res.status(400).json({
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Failed to update city',
            message: error.message
        });
    }
});


router.get('/cities/delete/:id', async (req, res) => {
    try {
        const cityId = parseInt(req.params.id);
        
        const result = await CityDB.deleteCity(cityId);
        
        if (result.success) {
            res.json({
                message: result.message,
                deletedCity: result.data
            });
        } else {
            res.status(404).json({
                error: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Failed to delete city',
            message: error.message
        });
    }
});

router.get('/cities/stats/count-by-country', async (req, res) => {
    try {
        const result = await CityDB.getCitiesCountByCountry();
        
        if (result.success) {
            res.json({
                data: result.data
            });
        } else {
            res.status(500).json({
                error: 'Failed to retrieve statistics',
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