
const express = require('express');
const router = express.Router();
const DeliveriesDB = require('../orderDB/deliveriesDB');
const FruitsDB = require('../orderDB/fruitsDB');

router.get('/deliveries/list', async (req, res) => {
  try {
    const [deliveriesResult, fruitsResult] = await Promise.all([
      DeliveriesDB.getAllDeliveries(),
      FruitsDB.getAllFruits()
    ]);

    console.log('Deliveries result:', deliveriesResult);
    console.log('Fruits result:', fruitsResult);

    
    let deliveries = [];
    let fruits = [];

    
    if (Array.isArray(deliveriesResult)) {
      deliveries = deliveriesResult;
    } else if (deliveriesResult && typeof deliveriesResult === 'object') {
      if (Array.isArray(deliveriesResult.data)) {
        deliveries = deliveriesResult.data;
      } else if (Array.isArray(deliveriesResult.results)) {
        deliveries = deliveriesResult.results;
      } else {
        deliveries = Object.values(deliveriesResult);
      }
    }

    
    if (Array.isArray(fruitsResult)) {
      fruits = fruitsResult;
    } else if (fruitsResult && typeof fruitsResult === 'object') {
      if (Array.isArray(fruitsResult.data)) {
        fruits = fruitsResult.data;
      } else if (Array.isArray(fruitsResult.results)) {
        fruits = fruitsResult.results;
      } else {
        fruits = Object.values(fruitsResult);
      }
    }

    console.log('Processed deliveries:', deliveries);
    console.log('Processed fruits:', fruits);

    
    const fruitMap = {};
    fruits.forEach(fruit => {
      if (fruit && fruit._id) {
        fruitMap[fruit._id] = fruit;
      }
    });

    
    const deliveriesWithFruitInfo = deliveries.map(delivery => ({
      ...delivery,
      fruitName: fruitMap[delivery.fruitId]?.name || null
    }));

    res.json({
      success: true,
      data: deliveriesWithFruitInfo
    });

  } catch (error) {
    console.error('获取配送列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取配送列表失败: ' + error.message
    });
  }
});

router.get('/deliveries/report', async (req, res) => {
    try {
        
        const deliveriesResult = await DeliveriesDB.getAllDeliveries();
        const fruitsResult = await FruitsDB.getAllFruits();

        if (!deliveriesResult.success || !fruitsResult.success) {
            return res.status(500).json({
                success: false,
                message: '获取数据失败',
                error: deliveriesResult.error || fruitsResult.error
            });
        }

        const deliveries = deliveriesResult.data;
        const fruits = fruitsResult.data;

        
        const fruitMap = {};
        fruits.forEach(fruit => {
            fruitMap[fruit._id] = fruit.name.toLowerCase();
        });

        
        const months = [
            { value: '一月', label: 'January', en: 'January', monthNum: 1 },
            { value: '二月', label: 'February', en: 'February', monthNum: 2 },
            { value: '三月', label: 'March', en: 'March', monthNum: 3 },
            { value: '四月', label: 'April', en: 'April', monthNum: 4 },
            { value: '五月', label: 'May', en: 'May', monthNum: 5 },
            { value: '六月', label: 'June', en: 'June', monthNum: 6 },
            { value: '七月', label: 'July', en: 'July', monthNum: 7 },
            { value: '八月', label: 'August', en: 'August', monthNum: 8 },
            { value: '九月', label: 'September', en: 'September', monthNum: 9 },
            { value: '十月', label: 'October', en: 'October', monthNum: 10 },
            { value: '十一月', label: 'November', en: 'November', monthNum: 11 },
            { value: '十二月', label: 'December', en: 'December', monthNum: 12 }
        ];

        
        const monthlyData = {};
        months.forEach(month => {
            monthlyData[month.value] = {};
        });

        
        deliveries.forEach(delivery => {
            if (delivery.deliveryDate && delivery.status === 'Delivered') {
                const deliveryDate = new Date(delivery.deliveryDate);
                const monthIndex = deliveryDate.getMonth(); 
                const month = months[monthIndex];
                const fruitName = fruitMap[delivery.fruitId];

                if (month && fruitName) {
                    if (!monthlyData[month.value][fruitName]) {
                        monthlyData[month.value][fruitName] = 0;
                    }
                    monthlyData[month.value][fruitName] += delivery.quantity;
                }
            }
        });

        
        const report = {
            monthlyData: monthlyData,
            summary: {
                totalDeliveries: deliveries.length,
                deliveredCount: deliveries.filter(d => d.status === 'Delivered').length,
                totalFruits: fruits.length,
                reportYear: new Date().getFullYear()
            },
            fruits: fruits.map(fruit => ({
                id: fruit._id,
                name: fruit.name,
                price: fruit.price,
                imageURL: fruit.imageURL
            }))
        };

        res.json({
            success: true,
            data: report,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error generating deliveries report:', error);
        res.status(500).json({
            success: false,
            message: 'Data retrieval failed',
            error: error.message
        });
    }
});


router.get('/deliveries/annual-summary/:year', async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const monthlyReport = await DeliveriesDB.getMonthlyDeliveryReport(year);
        
        res.json({
            success: true,
            data: monthlyReport.data,
            year: year,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error fetching annual summary:', error);
        res.status(500).json({
            success: false,
            message: 'Data retrieval failed',
            error: error.message
        });
    }
});

router.delete('/deliveries/delete/:id', async (req, res) => {
  try {
    const deliveryId = req.params.id;

    
    if (!deliveryId) {
      return res.status(400).json({
        success: false,
        message: 'Delivery ID is required'
      });
    }

    
    const result = await DeliveriesDB.deleteDelivery(deliveryId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Delivery record not found'
      });
    }

    res.json({
      success: true,
      message: 'Delivery deleted successfully',
      data: result
    });

  } catch (error) {
    console.error('删除配送记录失败:', error);
    
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: '删除配送记录失败: ' + error.message
    });
  }
});

router.post('/deliveries/insert', async (req, res) => {
  try {
    const {
      fromWarehouseId,
      toLocationId,
      fruitId,
      quantity,
      deliveryDate,
      estimatedArrivalDate,
      status
    } = req.body;

    // 验证必填字段
    if (!fromWarehouseId || !toLocationId || !fruitId || !quantity || !deliveryDate || !estimatedArrivalDate) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const savedDelivery = await DeliveriesDB.insertDelivery({
      fromWarehouseId,
      toLocationId,
      fruitId,
      quantity: parseInt(quantity),
      deliveryDate: new Date(deliveryDate),
      estimatedArrivalDate: new Date(estimatedArrivalDate),
      status: status || 'Pending'
    });

    res.status(201).json({
      success: true,
      message: 'Delivery created successfully',
      data: savedDelivery
    });

  } catch (error) {
    console.error('创建配送记录失败:', error);
    res.status(500).json({
      success: false,
      message: '创建配送记录失败: ' + error.message
    });
  }
});

module.exports = router;