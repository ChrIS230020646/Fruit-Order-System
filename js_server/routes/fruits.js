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
                const fruitObj = fruit.toObject ? fruit.toObject() : fruit;
                return {
                    _id: fruitObj._id,
                    name: fruitObj.name,
                    originCountryId: fruitObj.originCountryId,
                    price: fruitObj.price,
                    unit: fruitObj.unit,
                    description: fruitObj.description,
                    imageURL: fruitObj.imageURL,
                    originCountryName: countryMap[fruitObj.originCountryId] || 'Unknown Country'
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



router.put('/fruits/:id', async (req, res) => {
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

router.delete('/fruits/:id', async (req, res) => {
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


router.post("/fruits", async (req, res) => {
    try {
        const { fruitsArray } = req.body;
        
        if (!fruitsArray || !Array.isArray(fruitsArray) || fruitsArray.length === 0) {
            return res.status(400).json({
                success: false,
                error: "fruits array is required and must not be empty"
            });
        }

        for (const fruits of fruitsArray) {
            if (!fruits.name) {
                return res.status(400).json({
                    success: false,
                    error: "Each fruits member must have name"
                });
            }
        }

        const result = await fruitDB.insertManyFruits(fruitsArray);
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(500).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
