const express = require('express');
const inventoryDB = require('../orderDB/inventoryDB');
const fruitsDB = require('../orderDB/fruitsDB');
const locationsDB = require('../orderDB/locationsDB');
const router = express.Router();

router.get('/inventory', async (req, res) => {
    try {
        const result = await inventoryDB.getAllInventory();
        
        if (result.success) {
            res.json({
                collection: 'inventory',
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

router.get('/inventory/list', async (req, res) => {
    try {
        const result = await inventoryDB.getAllInventory();
        const fruits = await fruitsDB.getAllFruits();
        const locations = await locationsDB.getAllLocations();
        if (result.success && fruits.success && locations.success) {

            const fruitIdToName = {};
            fruits.data.forEach(fruit => {
                fruitIdToName[fruit._id] = fruit.name;
            });

            const locationIdToName = {};
            locations.data.forEach(location => {
                locationIdToName[location._id] = location.address;
            });

            const inventoryList = result.data.map(item => ({
                _id: item._id,
                fruitId: item.fruitId,
                fruitName: fruitIdToName[item.fruitId] || 'Unknown Fruit',
                locationId: item.locationId,
                locationName: locationIdToName[item.locationId] || 'Unknown Location',
                quantity: item.quantity
            }));

            res.json({
                collection: 'inventory',
                count: inventoryList.length,
                data: inventoryList
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