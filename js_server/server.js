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
const PORT = 3020;


function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const interface of interfaces[interfaceName]) {
            
            if (interface.family === 'IPv4' && !interface.internal) {
                
                if (interface.address.startsWith('192.168.')) {
                    return interface.address;
                }
            }
        }
    }
    
    
    for (const interfaceName in interfaces) {
        for (const interface of interfaces[interfaceName]) {
            if (interface.family === 'IPv4' && !interface.internal) {
                return interface.address;
            }
        }
    }
    
    return 'localhost'; 
}

const HOST = getLocalIP();


app.use(cookieParser());


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


connectDB();


app.use('/', indexRoutes);
app.use('/', citiesDBRoutes);  
app.use('/', staffDBRoutes);
app.use('/', fruitsDBRoutes);
app.use('/', inventoryDBRoutes);
app.use('/', borrowsDBRoutes);
app.use('/', deliveriesDBRoutes);
app.use('/', locationsDBRoutes);


app.get('/server/info', (req, res) => {
    const serverInfo = {
        host: HOST,
        port: PORT,
        localUrl: `http://localhost:${PORT}`,
        networkUrl: `http://${HOST}:${PORT}`,
        networkInterfaces: os.networkInterfaces(),
        platform: os.platform(),
        hostname: os.hostname(),
        timestamp: new Date().toISOString()
    };
    res.json(serverInfo);
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log(`Network: http://${HOST}:${PORT}`);
    console.log(`Server info: http://localhost:${PORT}/server/info`);
    console.log(`CORS: Enabled with credentials`);
    console.log(`Allowed origins:`);
    console.log(`   - http://localhost:3000`);
    console.log(`   - http://localhost:3001`);
    console.log(`   - http://${HOST}:3000`);
    console.log(`   - http://${HOST}:3001`);
});

module.exports = app;