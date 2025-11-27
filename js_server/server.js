require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
const connectDB = require('./config/database');
const os = require('os');

const indexRoutes = require('./routes/index');
const citiesDBRoutes = require('./routes/cities');
const countriesDBRoutes = require('./routes/countries');
const staffDBRoutes = require('./routes/staff');
const fruitsDBRoutes = require('./routes/fruits');
const inventoryDBRoutes = require('./routes/inventory');
const borrowsDBRoutes = require('./routes/borrows');
const deliveriesDBRoutes = require('./routes/deliveries');
const locationsDBRoutes = require('./routes/location');

const app = express();

app.use(cookieParser());

// CORS middleware
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // Allowed frontend URLs (read from environment variables, multiple URLs can be separated by commas)
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim())
        : [];
    
    // Local development environment
    const isLocalDev = origin && (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('192.168.') ||
        origin.includes('172.')
    );
    
    // Render Environment or permitted domain names
    const isAllowedOrigin = origin && (
        isLocalDev ||
        allowedOrigins.includes(origin) ||
        (origin.includes('.onrender.com') && process.env.NODE_ENV === 'production')
    );

    if (isAllowedOrigin) {
        res.header('Access-Control-Allow-Origin', origin);
    }

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');

    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// Connect MongoDB
connectDB();

// Check your Google OAuth configuration (if using).
if (process.env.REACT_APP_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID) {
    const frontendClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const backendClientId = process.env.GOOGLE_CLIENT_ID;
    
    console.log('Google OAuth Configuration Check:');
    console.log('REACT_APP_GOOGLE_CLIENT_ID:', frontendClientId ? 'Already set' : 'Not set');
    console.log('GOOGLE_CLIENT_ID:', backendClientId ? 'Already set' : 'Not set');
    
    if (!frontendClientId || !backendClientId) {
        console.warn('Warning: Google OAuth environment variables are incomplete');
        console.warn('Note: You must set both REACT_APP_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID.');
    } else if (frontendClientId !== backendClientId) {
        console.error('Error: The values ​​of REACT_APP_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_ID are inconsistent!');
        console.error('This will cause Google OAuth login to fail (invalid_client error).');
        console.error('Please ensure that the values ​​of the two environmental variables are exactly the same.');
    } else {
        console.log('Google OAuth Correct configuration');
    }
}

// ----------------------
// STATIC FILES (Frontend) - Must be done before API routing
// ----------------------
// Serve front-end static files in the production environment (merge deployment)
// Check if the front-end build files exist.
const frontendBuildPath = path.join(__dirname, '..', 'Views', 'build');
const frontendExists = fs.existsSync(frontendBuildPath);
const shouldServeFrontend = process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true';

console.log('Front-end service checks:');
console.log('Constructing file paths:', frontendBuildPath);
console.log('Does the file exist:', frontendExists);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SERVE_FRONTEND:', process.env.SERVE_FRONTEND);
console.log('The service front end should be:', shouldServeFrontend);

if (frontendExists && shouldServeFrontend) {
    console.log('The front-end service is now enabled.');
    
    // List of API route prefixes (these routes should not return to the front-end page)
    const apiRoutes = [
        '/api/',
        '/api/info',  // Add a new API information endpoint
        '/server/',
        '/auth/',     // Authentication-related API routes
        '/cities',
        '/countries',
        '/staff',
        '/fruits',
        '/inventory',
        '/borrows',
        '/deliveries',
        '/locations'
    ];
    
    // Check if it is an API route
    const isApiRoute = (path) => {
        // Check health check points
        if (path === '/api/health') return true;
        // Check if it starts with any API route prefix.
        return apiRoutes.some(route => path.startsWith(route));
    };
    
    // First process the root path, then return index.html directly (to avoid being intercepted by other middleware).
    app.get('/', (req, res) => {
        const indexPath = path.join(frontendBuildPath, 'index.html');
        console.log('[Root Path] Returns to the front-end page, path:', indexPath);
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error('[Root Path] Error: Unable to send index.html:', err);
                res.status(500).send('Error loading application');
            } else {
                console.log('[Root Path] successfully sent index.html');
            }
        });
    });
    
    // Serve static files (CSS, JS, images, etc.)
    app.use(express.static(frontendBuildPath));
    
    // React Router supports returning index.html for all non-API routes.
    // Use app.use as a middleware to handle all requests, but prioritize API routing.
    app.use((req, res, next) => {
        // If it's an API route, skip it (let subsequent API routes handle it).
        if (isApiRoute(req.path)) {
            return next();
        }
        
        // Check if the file exists (static resource).
        const filePath = path.join(frontendBuildPath, req.path);
        if (fs.existsSync(filePath) && !req.path.endsWith('.html')) {
            // For static resource files, let express.static handle them.
            return next();
        }
        
        // For all other non-API GET requests, return the React application's index.html (React Router supported).
        if (req.method === 'GET') {
            const indexPath = path.join(frontendBuildPath, 'index.html');
            console.log('[React Router] Returns to the front-end page via the following path.:', req.path);
            return res.sendFile(indexPath, (err) => {
                if (err) {
                    console.error('[React Router] Error: Unable to send index.html:', err);
                    res.status(500).send('Error loading application');
                }
            });
        }
        
        next();
    });
} else {
    // If the front-end build files are missing, log a warning.
    if (!frontendExists) {
        console.warn('Warning: Front-end build files not found, path not found.:', frontendBuildPath);
        console.warn('Note: Ensure the build script is running and configured. SERVE_FRONTEND=true');
    } else {
        console.log('The frontend service is not enabled (set SERVE_FRONTEND=true to enable it).');
    }
}

// Register API Routes
// Note: Change indexRoutes to /api/info to avoid blocking the root path.
app.use('/api/info', indexRoutes);  // The original root path API is now located at /api/info
app.use('/', citiesDBRoutes);
app.use('/', countriesDBRoutes);
app.use('/', staffDBRoutes);
app.use('/', fruitsDBRoutes);
app.use('/', inventoryDBRoutes);
app.use('/', borrowsDBRoutes);
app.use('/', deliveriesDBRoutes);
app.use('/', locationsDBRoutes);

// Health check for Vercel
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// ----------------------
// SERVER STARTUP
// ----------------------
// If it's not a Vercel environment, then start the server (applicable to local development and rendering).
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3020;

    // Rendering environment: Direct monitoring port
    if (process.env.RENDER || process.env.NODE_ENV === 'production') {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } else {
        // Local development environment: Displays local and network IP addresses.
        function getLocalIP() {
            const interfaces = os.networkInterfaces();
            for (const interfaceName in interfaces) {
                for (const net of interfaces[interfaceName]) {
                    if (net.family === 'IPv4' && !net.internal && net.address.startsWith('192.168.')) {
                        return net.address;
                    }
                }
            }
            return 'localhost';
        }

        const HOST = getLocalIP();

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running`);
            console.log(`Local: http://localhost:${PORT}`);
            console.log(`Network: http://${HOST}:${PORT}`);
        });
    }
}

// Export for Vercel
module.exports = app;