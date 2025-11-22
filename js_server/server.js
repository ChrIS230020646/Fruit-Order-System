require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const os = require('os');

const indexRoutes = require('./routes/index');
const citiesDBRoutes = require('./routes/cities');
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

    if (origin && (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('192.168.') ||
        origin.includes('172.')
    )) {
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

// Register Routes
app.use('/', indexRoutes);
app.use('/', citiesDBRoutes);
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
// LOCAL DEV MODE
// ----------------------
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3020;

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

// Export for Vercel
module.exports = app;

module.exports = app;
