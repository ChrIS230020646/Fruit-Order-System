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

// ==================== CORS配置 ====================
// 支持本地开发 + 云端部署
app.use((req, res, next) => {
    const origin = req.headers.origin;
    
    // 允许的来源列表
    const allowedOrigins = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        process.env.FRONTEND_URL,  // 从环境变量读取云端前端地址
    ].filter(Boolean); // 过滤掉undefined

    // 本地开发模式：允许所有192.168和172的局域网IP
    const isLocalNetwork = origin && (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('192.168.') ||
        origin.includes('172.')
    );

    // Vercel前端域名模式匹配
    const isVercelDomain = origin && origin.match(/https:\/\/.*\.vercel\.app$/);

    if (allowedOrigins.includes(origin) || isLocalNetwork || isVercelDomain) {
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

// Health check
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        time: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// ==================== 启动服务器 ====================
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
    console.log(`Server running on port ${PORT}`);
    console.log(`Local: http://localhost:${PORT}`);
    console.log(`Network: http://${HOST}:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
