// orderDB/deliveriesDB.js
const DeliveriesBean = require('../orderBean/deliveriesBean');

class DeliveriesDB {
    
    static async getAllDeliveries() {
        try {
            const deliveries = await DeliveriesBean.find({});
            return {
                success: true,
                data: deliveries,
                count: deliveries.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

  
    static async getDeliveryById(deliveryId) {
        try {
            const delivery = await DeliveriesBean.findOne({ _id: deliveryId });
            if (!delivery) {
                return {
                    success: false,
                    error: 'not find'
                };
            }
            return {
                success: true,
                data: delivery
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

  
    static async getDeliveriesByWarehouseId(warehouseId) {
        try {
            const deliveries = await DeliveriesBean.find({ 
                fromWarehouseId: warehouseId 
            });
            return {
                success: true,
                data: deliveries,
                count: deliveries.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

   
    static async getDeliveriesByLocationId(locationId) {
        try {
            const deliveries = await DeliveriesBean.find({ 
                toLocationId: locationId 
            });
            return {
                success: true,
                data: deliveries,
                count: deliveries.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

   
    static async getDeliveriesByFruitId(fruitId) {
        try {
            const deliveries = await DeliveriesBean.find({ 
                fruitId: fruitId 
            });
            return {
                success: true,
                data: deliveries,
                count: deliveries.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

   
    static async getDeliveriesByStatus(status) {
        try {
            const deliveries = await DeliveriesBean.find({ 
                status: status 
            });
            return {
                success: true,
                data: deliveries,
                count: deliveries.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getDeliveriesByDateRange(startDate, endDate) {
        try {
            const deliveries = await DeliveriesBean.find({
                deliveryDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            });
            return {
                success: true,
                data: deliveries,
                count: deliveries.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

   
    static async insertDelivery(deliveryData) {
        try {
            
            const existingDelivery = await DeliveriesBean.findOne({ _id: deliveryData._id });
            if (existingDelivery) {
                return {
                    success: false,
                    error: 'reID'
                };
            }

            const newDelivery = new DeliveriesBean(deliveryData);
            const savedDelivery = await newDelivery.save();
            
            return {
                success: true,
                message: 'succesful',
                data: savedDelivery
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async updateDelivery(deliveryId, updateData) {
        try {
            
            const existingDelivery = await DeliveriesBean.findOne({ _id: deliveryId });
            if (!existingDelivery) {
                return {
                    success: false,
                    error: 'not find'
                };
            }

            
            if (updateData._id) {
                delete updateData._id;
            }

            const updatedDelivery = await DeliveriesBean.findOneAndUpdate(
                { _id: deliveryId },
                { $set: updateData },
                { new: true, runValidators: true }
            );

            return {
                success: true,
                message: 'update succesful',
                data: updatedDelivery
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

   
    static async deleteDelivery(deliveryId) {
        try {
           
            const existingDelivery = await DeliveriesBean.findOne({ _id: deliveryId });
            if (!existingDelivery) {
                return {
                    success: false,
                    error: 'not find'
                };
            }

            const deletedDelivery = await DeliveriesBean.findOneAndDelete({ _id: deliveryId });

            return {
                success: true,
                message: 'delete succesful',
                data: deletedDelivery
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

   
    static async insertManyDeliveries(deliveriesArray) {
        try {
            const result = await DeliveriesBean.insertMany(deliveriesArray);
            
            return {
                success: true,
                message: `succesful ${result.length} `,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getDeliveryCountByWarehouse() {
        try {
            const result = await DeliveriesBean.aggregate([
                {
                    $group: {
                        _id: "$fromWarehouseId",
                        totalDeliveries: { $sum: 1 },
                        totalQuantity: { $sum: "$quantity" },
                        averageQuantity: { $avg: "$quantity" }
                    }
                },
                {
                    $sort: { _id: 1 }
                }
            ]);

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getDeliveryCountByLocation() {
        try {
            const result = await DeliveriesBean.aggregate([
                {
                    $group: {
                        _id: "$toLocationId",
                        totalDeliveries: { $sum: 1 },
                        totalQuantity: { $sum: "$quantity" }
                    }
                },
                {
                    $sort: { totalQuantity: -1 }
                }
            ]);

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getDeliverySummaryByFruit() {
        try {
            const result = await DeliveriesBean.aggregate([
                {
                    $group: {
                        _id: "$fruitId",
                        totalDeliveries: { $sum: 1 },
                        totalQuantity: { $sum: "$quantity" },
                        averageQuantity: { $avg: "$quantity" }
                    }
                },
                {
                    $sort: { totalQuantity: -1 }
                }
            ]);

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getDeliveryStatusSummary() {
        try {
            const result = await DeliveriesBean.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 },
                        totalQuantity: { $sum: "$quantity" }
                    }
                },
                {
                    $sort: { count: -1 }
                }
            ]);

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getMonthlyDeliveryReport(year) {
        try {
            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31, 23, 59, 59);

            const result = await DeliveriesBean.aggregate([
                {
                    $match: {
                        deliveryDate: {
                            $gte: startDate,
                            $lte: endDate
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            month: { $month: "$deliveryDate" },
                            fruitId: "$fruitId"
                        },
                        totalQuantity: { $sum: "$quantity" },
                        deliveryCount: { $sum: 1 }
                    }
                },
                {
                    $sort: { "_id.month": 1, totalQuantity: -1 }
                }
            ]);

            return {
                success: true,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getDelayedDeliveries() {
        try {
            const delayedDeliveries = await DeliveriesBean.find({
                status: { $ne: "Delivered" },
                estimatedArrivalDate: { $lt: new Date() }
            });

            return {
                success: true,
                data: delayedDeliveries,
                count: delayedDeliveries.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = DeliveriesDB;