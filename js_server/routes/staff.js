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

// 现有的 GET 接口保持不变（为了兼容性）
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
            error: 'Failed to update staff',
            message: error.message
        });
    }
});

// 新增 POST 接口支持 HttpOnly Cookie
router.post('/staff/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log('📧 登录请求:', { email, password: password ? '***' : 'undefined' });

        // 检查必要字段
        if (!email || !password) {
            console.log('❌ 缺少邮箱或密码');
            return res.status(400).json({
                success: false,
                error: '邮箱和密码不能为空'
            });
        }

        const result = await staffDB.staffLogin(email, password);

        console.log('🔍 数据库返回结果:', result);

        if (result.success) {
            // 设置 HttpOnly Cookie
            res.cookie('userEmail', email, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000, // 1天
                path: '/',
            });

            console.log('✅ 登录成功，设置 Cookie');
            res.json({
                success: true,
                message: '登录成功',
                staff: result.data
            });
        } else {
            console.log('❌ 登录失败:', result.error);
            res.status(401).json({
                success: false,
                error: result.error
            });
        }
    } catch (error) {
        console.error('💥 服务器错误:', error);
        res.status(500).json({
            success: false,
            error: '登录失败',
            message: error.message
        });
    }
});
// 检查认证状态
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

// 登出接口
router.post('/auth/logout', (req, res) => {
    res.clearCookie('userEmail', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
    });
    
    res.json({
        success: true,
        message: '已退出登录'
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
            error: 'Failed to update staff',
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