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
                error: 'Failed to retrieve location data',
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

router.post('/locations', async (req, res) => {
    try {
        const locationData = req.body;
        
        if (!locationData || Object.keys(locationData).length === 0) {
            return res.status(400).json({
                error: 'Location data is required'
            });
        }

        const result = await locationDB.insertLocation(locationData);
        
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

router.put('/locations/update/:id', async (req, res) => {
    try {
        const locationId = parseInt(req.params.id);
        const updateData = req.body;

        if (!updateData || Object.keys(updateData).length === 0) {
            return res.status(400).json({
                error: 'Update data is required'
            });
        }

        const result = await locationDB.updateLocation(locationId, updateData);
        
        if (result.success) {
            res.json({
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

router.delete('/locations/delete/:id', async (req, res) => {
    try {
        const locationId = parseInt(req.params.id);
        
        const result = await locationDB.deleteLocation(locationId);
        
        if (result.success) {
            res.json({
                message: result.message,
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

module.exports = router;