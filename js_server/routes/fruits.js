const express = require('express');
const fruitDB = require('../orderDB/fruitsDB');
const CountriesDB = require('../orderDB/countriesDB');
const router = express.Router();

router.get('/fruits', async (req, res) => {
    try {
        const result = await fruitDB.getAllFruits();
        const countriesResult = await CountriesDB.getAllCountries();
        
        if (result.success && countriesResult.success) {
            
            const countryMap = {};
            countriesResult.data.forEach(country => {
                countryMap[country._id] = country.name;
            });
            
            
            const processedFruits = result.data.map(fruit => {
                return {
                    ...fruit,
                    originCountryName: countryMap[fruit.originCountryId] || 'Unknown Country'
                };
            });
            
            res.json({
                collection: 'fruits',
                count: result.count,
                data: processedFruits
            });
        } else {
            res.status(500).json({
                error: 'Failed to retrieve data',
                message: result.error || countriesResult.error
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Server error',
            message: error.message
        });
    }
});



router.put('/fruits/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, originCountryId, price, imageURL } = req.body;

        const result = await fruitDB.updateFruit(id, {
            name: name,
            originCountryId: parseInt(originCountryId),
            price: parseFloat(price),
            imageURL: imageURL  
        });

        if (result.success) {
            res.json({
                message: 'Fruit updated successfully',
                data: result.data
            });
        } else {
            res.status(400).json({
                error: 'Failed to update fruit',
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

router.delete('/fruits/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await fruitDB.deleteFruit(id);

        if (result.success) {
            res.json({
                message: 'Fruit deleted successfully'
            });
        } else {
            res.status(400).json({
                error: 'Failed to delete fruit',
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