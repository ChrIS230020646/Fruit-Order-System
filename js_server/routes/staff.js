const express = require('express');
const staffDB = require('../orderDB/staffDB');
const locationDB = require('../orderDB/locationsDB');
const router = express.Router();

router.get('/staff', async (req, res) => {
    try {
        const result = await staffDB.getAllStaff();

        if (result.success) {
            res.json({
                collection: 'staff',
                count: result.count,
                data: result.data
            });
        } else {
            res.status(500).json({
                error: 'Failed to retrieve staff data',
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

router.get('/staff/login/:email/:password', async (req, res) => {
    try {
        const email = req.params.email;
        const password = req.params.password;

        const result = await staffDB.staffLogin(email, password);

        if (result.success) {
            res.json({
                message: 'true',
                staff: result.data
            });
        } else {
            res.status(401).json({
                error: 'false',
                message: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Failed to authenticate staff',
            message: error.message
        });
    }
});

router.post('/staff/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(' Login request:', { email, password: password ? '***' : 'undefined' });

        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const result = await staffDB.staffLogin(email, password);

        console.log(' Database response:', result);

        if (result.success) {
            res.cookie('userEmail', email, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000,
                path: '/',
            });

            console.log('Login successful, cookie set');
            res.json({
                success: true,
                message: 'Login successful',
                staff: result.data
            });
        } else {
            console.log('Login failed:', result.error);
            res.status(401).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error(' Server error:', error);
        res.status(500).json({
            success: false,
            error: 'Login failed',
            message: error.message
        });
    }
});

router.get('/auth/check', (req, res) => {
    const userEmail = req.cookies.userEmail;
    
    if (userEmail) {
        res.json({
            success: true,
            email: userEmail,
            isLoggedIn: true
        });
    } else {
        res.json({
            success: false,
            isLoggedIn: false
        });
    }
});

router.post('/auth/logout', (req, res) => {
    res.clearCookie('userEmail', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
    
    res.json({
        success: true,
        message: 'Logged out successfully'
    });
});

router.get('/staff/information/:email', async (req, res) => {
    try {
        const email = req.params.email;

        const result = await staffDB.getStaffByEmail(email);
        const locationResult = await locationDB.getLocationById(result.data.locationId);

        if (result.success) {
            res.json({
                message: 'true',
                staff: result.data,
                location: locationResult.data.address
            });
        } else {
            res.status(401).json({
                error: 'false',
                message: result.error
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Failed to retrieve staff information',
            message: error.message
        });
    }
});

router.put('/staff/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password, locationId, phone, job, status } = req.body;

        const result = await staffDB.updateStaff(id, {
            name: name,
            email: email,
            password: password,
            phone: phone,
            job: job,
            locationId: locationId,
            status: status
        });

        if (result.success) {
            res.json({
                message: 'Staff updated successfully',
                data: result.data
            });
        } else {
            res.status(400).json({
                error: 'Failed to update staff',
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

router.post("/staff/insert/", async (req, res) => {
    try {
        const { staffArray } = req.body;
        
        if (!staffArray || !Array.isArray(staffArray) || staffArray.length === 0) {
            return res.status(400).json({
                success: false,
                error: "Staff array is required and must not be empty"
            });
        }

        for (const staff of staffArray) {
            if (!staff.name || !staff.email || !staff.job) {
                return res.status(400).json({
                    success: false,
                    error: "Each staff member must have name, email, and job"
                });
            }
        }

        const result = await staffDB.insertManyStaff(staffArray);
        
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