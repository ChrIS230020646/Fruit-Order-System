const express = require('express');
const fruitDB = require('../orderDB/fruitsDB');
const router = express.Router();

router.get('/fruits', async (req, res) => {
    try {
        const result = await fruitDB.getAllFruits();

        if (result.success) {
            res.json({
                collection: 'fruits',
                count: result.count,
                data: result.data
            });
        } else {
            res.status(500).json({
                error: 'Failed to retrieve fruit data',
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



router.put('/fruits/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, originCountryId, price, imageURL } = req.body;

        const result = await fruitDB.updateFruit(id, {
            name: name,
            originCountryId: parseInt(originCountryId),
            price: parseFloat(price),
            imageURL: imageURL  // 即使为空也会正常传递
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