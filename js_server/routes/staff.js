const express = require('express');
const staffDB = require('../orderDB/staffDB');
const { OAuth2Client } = require('google-auth-library'); 
const locationDB = require('../orderDB/locationsDB');
const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


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

router.post('/staff/google-login', async (req, res) => {
    try {
        const { credential } = req.body;

        console.log('1. Google login request received, credential length:', credential ? credential.length : 'null');

        if (!credential) {
            console.log('Missing Google credential');
            return res.status(400).json({
                success: false,
                error: 'Google credential is required'
            });
        }

        console.log('2. Checking Google Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Present' : 'MISSING');
        if (!process.env.GOOGLE_CLIENT_ID) {
            return res.status(500).json({
                success: false,
                error: 'Google OAuth configuration error: The backend environment variable GOOGLE_CLIENT_ID is not set. Please set GOOGLE_CLIENT_ID in the Render environment variables and ensure that its value is the same as REACT_APP_GOOGLE_CLIENT_ID.'
            });
        }

        const frontendClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
        if (frontendClientId && frontendClientId !== process.env.GOOGLE_CLIENT_ID) {
            console.error('Client ID mismatch: The front-end and back-end are using different Client IDs.');
            return res.status(500).json({
                success: false,
                error: 'Google OAuth configuration error: The front-end and back-end are using different Client IDs. Please ensure that the values ​​of REACT_APP_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID are exactly the same.'
            });
        }

        console.log('3. Verifying Google token...');
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        const { email, name, picture, sub: googleId } = payload;

        console.log('4. Google token verified for email:', email);

        console.log('5. Checking database for user:', email);
        const userResult = await staffDB.findStaffByEmail(email);

        if (!userResult.success) {
            console.log('6. User not found in database:', email);
            return res.status(401).json({
                success: false,
                error: 'User not registered. Please contact administrator.'
            });
        }

        console.log('6. User found in database:', userResult.data);

        const user = userResult.data;

        console.log('7. Setting cookie for user:', email);
        res.cookie('userEmail', email, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000,
            path: '/',
        });

        console.log('8. Google login successful');
        res.json({
            success: true,
            message: 'Google login successful',
            staff: user
        });

    } catch (error) {
        console.error('9. Google login ERROR - Full error details:');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);

        if (error.message.includes('Token used too late')) {
            return res.status(401).json({
                success: false,
                error: 'Google token expired. Please try again.'
            });
        }
        
        if (error.message.includes('Wrong number of segments')) {
            return res.status(400).json({
                success: false,
                error: 'Invalid Google token format.'
            });
        }

        if (error.message.includes('Audience mismatch')) {
            return res.status(400).json({
                success: false,
                error: 'Google Client ID mismatch. Please check server configuration.'
            });
        }

        if (error.message.includes('invalid_client') || 
            error.message.includes('OAuth client was not found') ||
            error.message.includes('OAuth client not found')) {
            return res.status(400).json({
                success: false,
                error: 'The Google OAuth Client ID is misconfigured. Please check that the environment variable GOOGLE_CLIENT_ID is set correctly and confirm that the Client ID exists in the Google Cloud Console.'
            });
        }

        res.status(500).json({
            success: false,
            error: 'Google login failed',
            message: error.message,
            details: 'Check server logs for more information'
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
                error: 'user not find'
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

router.put('/staff/:id', async (req, res) => {
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

router.post("/staff", async (req, res) => {
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

router.delete('/staff/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await staffDB.deleteStaff(id);

        if (result.success) {
            res.json({
                message: 'Staff deleted successfully',
                data: result.data
            });
        } else {
            res.status(400).json({
                error: 'Failed to delete staff',
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