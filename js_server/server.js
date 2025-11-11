require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

const indexRoutes = require('./routes/index');
const citiesDBRoutes = require('./routes/cities'); 
const staffDBRoutes = require('./routes/staff'); 
const fruitsDBRoutes = require('./routes/fruits'); 
const inventoryDBRoutes = require('./routes/inventory');

const app = express();
const PORT = 3020;

// 添加 cookie-parser 中间件
app.use(cookieParser());

// 添加完整的 CORS 中间件
app.use((req, res, next) => {
    // 允许的前端地址
    const allowedOrigins = [
        'http://localhost:3000', 
        'http://localhost:3001',
        'http://127.0.0.1:3000'
    ];
    const origin = req.headers.origin;
    
    // 检查请求的 origin 是否在允许列表中
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

// 连接数据库
connectDB();

// 路由
app.use('/', indexRoutes);
app.use('/', citiesDBRoutes);  
app.use('/', staffDBRoutes);
app.use('/', fruitsDBRoutes);
app.use('/', inventoryDBRoutes);

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server API at http://localhost:${PORT}`);
    console.log(`CORS 配置: 允许携带凭证 (credentials)`);
    console.log(`允许的前端地址: http://localhost:3000, http://localhost:3001`);
});

module.exports = app;