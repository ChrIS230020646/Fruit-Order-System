require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');
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
    
    // 允許的前端 URL（從環境變量讀取，支持多個用逗號分隔）
    const allowedOrigins = process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim())
        : [];
    
    // 本地開發環境
    const isLocalDev = origin && (
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('192.168.') ||
        origin.includes('172.')
    );
    
    // Render 環境或允許的域名
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

// ----------------------
// STATIC FILES (Frontend) - 必須在 API 路由之前
// ----------------------
// 在生產環境中服務前端靜態文件（合併部署）
// 檢查前端構建文件是否存在
const frontendBuildPath = path.join(__dirname, '..', 'Views', 'build');
const frontendExists = fs.existsSync(frontendBuildPath);
const shouldServeFrontend = process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true';

console.log('🔍 前端服務檢查:');
console.log('  - 構建文件路徑:', frontendBuildPath);
console.log('  - 文件是否存在:', frontendExists);
console.log('  - NODE_ENV:', process.env.NODE_ENV);
console.log('  - SERVE_FRONTEND:', process.env.SERVE_FRONTEND);
console.log('  - 應該服務前端:', shouldServeFrontend);

if (frontendExists && shouldServeFrontend) {
    console.log('✅ 前端服務已啟用');
    
    // API 路由前綴列表（這些路由不應該返回前端頁面）
    const apiRoutes = [
        '/api/',
        '/api/info',  // 添加新的 API 信息端點
        '/server/',
        '/auth/',     // 認證相關 API 路由
        '/cities',
        '/staff',
        '/fruits',
        '/inventory',
        '/borrows',
        '/deliveries',
        '/locations'
    ];
    
    // 檢查是否為 API 路由
    const isApiRoute = (path) => {
        // 檢查健康檢查端點
        if (path === '/api/health') return true;
        // 檢查是否以任何 API 路由前綴開頭
        return apiRoutes.some(route => path.startsWith(route));
    };
    
    // 先處理根路徑，直接返回 index.html（避免被其他中間件攔截）
    app.get('/', (req, res) => {
        const indexPath = path.join(frontendBuildPath, 'index.html');
        console.log('📄 [根路徑] 返回前端頁面，路徑:', indexPath);
        res.sendFile(indexPath, (err) => {
            if (err) {
                console.error('❌ [根路徑] 錯誤：無法發送 index.html:', err);
                res.status(500).send('Error loading application');
            } else {
                console.log('✅ [根路徑] 成功發送 index.html');
            }
        });
    });
    
    // 服務靜態文件（CSS, JS, images 等）
    app.use(express.static(frontendBuildPath));
    
    // React Router 支持：所有非 API 路由都返回 index.html
    // 使用 app.use 作為中間件來處理所有請求，但讓 API 路由優先
    app.use((req, res, next) => {
        // 如果是 API 路由，跳過（讓後面的 API 路由處理）
        if (isApiRoute(req.path)) {
            return next();
        }
        
        // 檢查文件是否存在（靜態資源）
        const filePath = path.join(frontendBuildPath, req.path);
        if (fs.existsSync(filePath) && !req.path.endsWith('.html')) {
            // 如果是靜態資源文件，讓 express.static 處理
            return next();
        }
        
        // 對於所有其他非 API 的 GET 請求，返回 React 應用的 index.html（支持 React Router）
        if (req.method === 'GET') {
            const indexPath = path.join(frontendBuildPath, 'index.html');
            console.log('📄 [React Router] 返回前端頁面，路徑:', req.path);
            return res.sendFile(indexPath, (err) => {
                if (err) {
                    console.error('❌ [React Router] 錯誤：無法發送 index.html:', err);
                    res.status(500).send('Error loading application');
                }
            });
        }
        
        next();
    });
} else {
    // 如果前端構建文件不存在，記錄警告
    if (!frontendExists) {
        console.warn('⚠️  警告：找不到前端構建文件，路徑:', frontendBuildPath);
        console.warn('⚠️  提示：確保已運行構建腳本並設置 SERVE_FRONTEND=true');
    } else {
        console.log('ℹ️  前端服務未啟用（設置 SERVE_FRONTEND=true 以啟用）');
    }
}

// Register API Routes
// 注意：將 indexRoutes 改為 /api/info，避免攔截根路徑
app.use('/api/info', indexRoutes);  // 原來的根路徑 API 現在在 /api/info
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
// SERVER STARTUP
// ----------------------
// 如果不是 Vercel 環境，則啟動服務器（適用於本地開發和 Render）
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3020;

    // Render 環境：直接監聽端口
    if (process.env.RENDER || process.env.NODE_ENV === 'production') {
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } else {
        // 本地開發環境：顯示本地和網絡 IP
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
