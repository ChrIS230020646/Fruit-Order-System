// orderDB/inventoryDB.js
const InventoryBean = require('../orderBean/inventoryBean');

class InventoryDB {
    // 获取所有库存记录
    static async getAllInventory() {
        try {
            const inventory = await InventoryBean.find({});
            return {
                success: true,
                data: inventory,
                count: inventory.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 根据水果ID查询库存
    static async getInventoryByFruitId(fruitId) {
        try {
            const inventory = await InventoryBean.find({ fruitId: fruitId });
            return {
                success: true,
                data: inventory,
                count: inventory.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 根据位置ID查询库存
    static async getInventoryByLocationId(locationId) {
        try {
            const inventory = await InventoryBean.find({ locationId: locationId });
            return {
                success: true,
                data: inventory,
                count: inventory.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 根据库存ID查询
    static async getInventoryById(inventoryId) {
        try {
            const inventory = await InventoryBean.findOne({ _id: inventoryId });
            if (!inventory) {
                return {
                    success: false,
                    error: 'not found inventory record'
                };
            }
            return {
                success: true,
                data: inventory
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 根据水果ID和位置ID查询特定库存
    static async getInventoryByFruitAndLocation(fruitId, locationId) {
        try {
            const inventory = await InventoryBean.findOne({ 
                fruitId: fruitId, 
                locationId: locationId 
            });
            if (!inventory) {
                return {
                    success: false,
                    error: 'not found inventory record'
                };
            }
            return {
                success: true,
                data: inventory
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // INSERT - 添加新库存记录
    static async insertInventory(inventoryData) {
        try {
            // 检查库存ID是否已存在
            const existingInventory = await InventoryBean.findOne({ _id: inventoryData._id });
            if (existingInventory) {
                return {
                    success: false,
                    error: 'not unique inventory ID'
                };
            }

            const newInventory = new InventoryBean(inventoryData);
            const savedInventory = await newInventory.save();
            
            return {
                success: true,
                message: 'inserted inventory successfully',
                data: savedInventory
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // UPDATE - 更新库存信息
    static async updateInventory(inventoryId, updateData) {
        try {
            // 检查库存记录是否存在
            const existingInventory = await InventoryBean.findOne({ _id: inventoryId });
            if (!existingInventory) {
                return {
                    success: false,
                    error: 'not found inventory record'
                };
            }

            // 不允许更新 _id
            if (updateData._id) {
                delete updateData._id;
            }

            const updatedInventory = await InventoryBean.findOneAndUpdate(
                { _id: inventoryId },
                { $set: updateData },
                { new: true, runValidators: true }
            );

            return {
                success: true,
                message: 'updated inventory successfully',
                data: updatedInventory
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // DELETE - 删除库存记录
    static async deleteInventory(inventoryId) {
        try {
            // 检查库存记录是否存在
            const existingInventory = await InventoryBean.findOne({ _id: inventoryId });
            if (!existingInventory) {
                return {
                    success: false,
                    error: 'The inventory record does not exist'
                };
            }

            const deletedInventory = await InventoryBean.findOneAndDelete({ _id: inventoryId });

            return {
                success: true,
                message: 'Inventory record successfully deleted',
                data: deletedInventory
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 批量插入库存记录
    static async insertManyInventory(inventoryArray) {
        try {
            const result = await InventoryBean.insertMany(inventoryArray);
            
            return {
                success: true,
                message: `Successfully inserted ${result.length} inventory records`,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 更新库存数量
    static async updateInventoryQuantity(fruitId, locationId, newQuantity) {
        try {
            const updatedInventory = await InventoryBean.findOneAndUpdate(
                { fruitId: fruitId, locationId: locationId },
                { $set: { quantity: newQuantity } },
                { new: true, runValidators: true }
            );

            if (!updatedInventory) {
                return {
                    success: false,
                    error: 'not found inventory record for the given fruitId and locationId'
                };
            }

            return {
                success: true,
                message: 'updated inventory quantity successfully',
                data: updatedInventory
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 统计每个位置的水果种类数量
    static async getFruitCountByLocation() {
        try {
            const result = await InventoryBean.aggregate([
                {
                    $group: {
                        _id: "$locationId",
                        fruitCount: { $sum: 1 },
                        totalQuantity: { $sum: "$quantity" },
                        fruits: { 
                            $push: {
                                fruitId: "$fruitId",
                                quantity: "$quantity"
                            }
                        }
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

    // 统计每个水果的库存分布
    static async getLocationCountByFruit() {
        try {
            const result = await InventoryBean.aggregate([
                {
                    $group: {
                        _id: "$fruitId",
                        locationCount: { $sum: 1 },
                        totalQuantity: { $sum: "$quantity" },
                        locations: { 
                            $push: {
                                locationId: "$locationId",
                                quantity: "$quantity"
                            }
                        }
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
}

module.exports = InventoryDB;