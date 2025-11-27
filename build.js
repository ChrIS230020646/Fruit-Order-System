#!/usr/bin/env node

/**
 * 合併部署構建腳本
 * 此腳本用於在 Render 部署時構建前端並準備後端
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 開始構建前後端合併部署...\n');

// 檢查前端目錄是否存在
const viewsPath = path.join(__dirname, 'Views');
if (!fs.existsSync(viewsPath)) {
    console.error('❌ 錯誤：找不到 Views 目錄');
    process.exit(1);
}

// 檢查前端 package.json
const frontendPackageJson = path.join(viewsPath, 'package.json');
if (!fs.existsSync(frontendPackageJson)) {
    console.error('❌ 錯誤：找不到 Views/package.json');
    process.exit(1);
}

try {
    console.log('📦 步驟 1/3: 安裝前端依賴...');
    process.chdir(viewsPath);
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ 前端依賴安裝完成\n');

    console.log('🔨 步驟 2/3: 構建前端應用...');
    // 設置環境變量（如果存在）
    const env = { ...process.env };
    if (process.env.REACT_APP_API_URL) {
        env.REACT_APP_API_URL = process.env.REACT_APP_API_URL;
    }
    if (process.env.REACT_APP_GOOGLE_CLIENT_ID) {
        env.REACT_APP_GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    }
    
    execSync('npm run build', { stdio: 'inherit', env });
    console.log('✅ 前端構建完成\n');

    // 檢查構建輸出
    const buildPath = path.join(viewsPath, 'build');
    if (!fs.existsSync(buildPath)) {
        console.error('❌ 錯誤：前端構建失敗，找不到 build 目錄');
        process.exit(1);
    }

    console.log('📦 步驟 3/3: 安裝後端依賴...');
    process.chdir(path.join(__dirname, 'js_server'));
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ 後端依賴安裝完成\n');

    console.log('🎉 構建完成！前端已構建到 Views/build 目錄');
    console.log('💡 提示：確保設置環境變量 SERVE_FRONTEND=true 以啟用前端服務\n');
    
} catch (error) {
    console.error('❌ 構建失敗:', error.message);
    process.exit(1);
}

