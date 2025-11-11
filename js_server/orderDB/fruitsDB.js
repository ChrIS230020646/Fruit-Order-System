// fruitsDB/fruitsDB.js
const FruitBean = require('../orderBean/fruitsBean');

class FruitDB {
    // SELECT * FROM fruits
    static async getAllFruits() {
        try {
            const fruits = await FruitBean.find({});
            return {
                success: true,
                data: fruits,
                count: fruits.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 根据国家ID查询水果
    static async getFruitsByCountryId(countryId) {
        try {
            const fruits = await FruitBean.find({ originCountryId: countryId });
            return {
                success: true,
                data: fruits,
                count: fruits.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 根据水果ID查询
    static async getFruitById(fruitId) {
        try {
            const fruit = await FruitBean.findOne({ _id: fruitId });
            if (!fruit) {
                return {
                    success: false,
                    error: '水果不存在'
                };
            }
            return {
                success: true,
                data: fruit
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 根据水果名称查询
    static async getFruitByName(fruitName) {
        try {
            const fruits = await FruitBean.find({ 
                name: { $regex: fruitName, $options: 'i' } // 不区分大小写
            });
            return {
                success: true,
                data: fruits,
                count: fruits.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 根据价格范围查询水果
    static async getFruitsByPriceRange(minPrice, maxPrice) {
        try {
            const fruits = await FruitBean.find({
                price: { $gte: minPrice, $lte: maxPrice }
            }).sort({ price: 1 }); // 按价格升序排序
            
            return {
                success: true,
                data: fruits,
                count: fruits.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // INSERT - 添加新水果
    static async insertFruit(fruitData) {
        try {
            // 检查水果ID是否已存在
            const existingFruit = await FruitBean.findOne({ _id: fruitData._id });
            if (existingFruit) {
                return {
                    success: false,
                    error: '水果ID已存在'
                };
            }

            const newFruit = new FruitBean(fruitData);
            const savedFruit = await newFruit.save();
            
            return {
                success: true,
                message: '水果添加成功',
                data: savedFruit
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // UPDATE - 更新水果信息
    static async updateFruit(fruitId, updateData) {
        try {
            // 检查水果是否存在
            const existingFruit = await FruitBean.findOne({ _id: fruitId });
            if (!existingFruit) {
                return {
                    success: false,
                    error: '水果不存在'
                };
            }

            // 不允许更新 _id
            if (updateData._id) {
                delete updateData._id;
            }

            const updatedFruit = await FruitBean.findOneAndUpdate(
                { _id: fruitId },
                { $set: updateData },
                { new: true, runValidators: true } // 返回更新后的文档，运行验证
            );

            return {
                success: true,
                message: '水果更新成功',
                data: updatedFruit
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // UPDATE - 更新水果价格
    static async updateFruitPrice(fruitId, newPrice) {
        try {
            const updatedFruit = await FruitBean.findOneAndUpdate(
                { _id: fruitId },
                { $set: { price: newPrice } },
                { new: true }
            );

            if (!updatedFruit) {
                return {
                    success: false,
                    error: '水果不存在'
                };
            }

            return {
                success: true,
                message: '水果价格更新成功',
                data: updatedFruit
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // DELETE - 删除水果
    static async deleteFruit(fruitId) {
        try {
            // 检查水果是否存在
            const existingFruit = await FruitBean.findOne({ _id: fruitId });
            if (!existingFruit) {
                return {
                    success: false,
                    error: 'The fruit does not exist'
                };
            }

            const deletedFruit = await FruitBean.findOneAndDelete({ _id: fruitId });

            return {
                success: true,
                message: 'Fruit successfully deleted',
                data: deletedFruit
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 批量插入水果
    static async insertManyFruits(fruitsArray) {
        try {
            const result = await FruitBean.insertMany(fruitsArray);
            
            return {
                success: true,
                message: `Successfully inserted ${result.length} fruits`,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 统计每个国家的水果数量
    static async getFruitsCountByCountry() {
        try {
            const result = await FruitBean.aggregate([
                {
                    $group: {
                        _id: "$originCountryId",
                        count: { $sum: 1 },
                        fruits: { $push: { name: "$name", price: "$price" } }
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

    // 获取最贵的水果
    static async getMostExpensiveFruit() {
        try {
            const fruits = await FruitBean.find({})
                .sort({ price: -1 })
                .limit(1);
            
            return {
                success: true,
                data: fruits[0] || null
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 获取最便宜的水果
    static async getCheapestFruit() {
        try {
            const fruits = await FruitBean.find({})
                .sort({ price: 1 })
                .limit(1);
            
            return {
                success: true,
                data: fruits[0] || null
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 获取平均价格
    static async getAveragePrice() {
        try {
            const result = await FruitBean.aggregate([
                {
                    $group: {
                        _id: null,
                        averagePrice: { $avg: "$price" },
                        totalFruits: { $sum: 1 }
                    }
                }
            ]);

            return {
                success: true,
                data: result[0] || { averagePrice: 0, totalFruits: 0 }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = FruitDB;