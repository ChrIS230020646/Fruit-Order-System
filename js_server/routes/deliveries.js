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
    console.error('Failed to fetch delivery list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch delivery list: ' + error.message
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
                message: 'Failed to fetch data',
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
            { value: 'January', label: 'January', en: 'January', monthNum: 1 },
            { value: 'February', label: 'February', en: 'February', monthNum: 2 },
            { value: 'March', label: 'March', en: 'March', monthNum: 3 },
            { value: 'April', label: 'April', en: 'April', monthNum: 4 },
            { value: 'May', label: 'May', en: 'May', monthNum: 5 },
            { value: 'June', label: 'June', en: 'June', monthNum: 6 },
            { value: 'July', label: 'July', en: 'July', monthNum: 7 },
            { value: 'August', label: 'August', en: 'August', monthNum: 8 },
            { value: 'September', label: 'September', en: 'September', monthNum: 9 },
            { value: 'October', label: 'October', en: 'October', monthNum: 10 },
            { value: 'November', label: 'November', en: 'November', monthNum: 11 },
            { value: 'December', label: 'December', en: 'December', monthNum: 12 }
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
    console.error('Failed to delete delivery record:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'Invalid delivery ID format'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to delete delivery record: ' + error.message
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
    console.error('Failed to create delivery record:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create delivery record: ' + error.message
    });
  }
});

module.exports = router;