
const FruitBean = require('../orderBean/fruitsBean');

class FruitDB {
    
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

    
    static async getFruitById(fruitId) {
        try {
            const fruit = await FruitBean.findOne({ _id: fruitId });
            if (!fruit) {
                return {
                    success: false,
                    error: 'not find'
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

    
    static async getFruitByName(fruitName) {
        try {
            const fruits = await FruitBean.find({ 
                name: { $regex: fruitName, $options: 'i' } 
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

    
    static async getFruitsByPriceRange(minPrice, maxPrice) {
        try {
            const fruits = await FruitBean.find({
                price: { $gte: minPrice, $lte: maxPrice }
            }).sort({ price: 1 }); 
            
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

    
    static async insertFruit(fruitData) {
        try {
            
            const existingFruit = await FruitBean.findOne({ _id: fruitData._id });
            if (existingFruit) {
                return {
                    success: false,
                    error: 'not find id'
                };
            }

            const newFruit = new FruitBean(fruitData);
            const savedFruit = await newFruit.save();
            
            return {
                success: true,
                message: 'sulccesful',
                data: savedFruit
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async updateFruit(fruitId, updateData) {
        try {
            
            const existingFruit = await FruitBean.findOne({ _id: fruitId });
            if (!existingFruit) {
                return {
                    success: false,
                    error: 'not find'
                };
            }

            
            if (updateData._id) {
                delete updateData._id;
            }

            const updatedFruit = await FruitBean.findOneAndUpdate(
                { _id: fruitId },
                { $set: updateData },
                { new: true, runValidators: true } 
            );

            return {
                success: true,
                message: 'update succesful',
                data: updatedFruit
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
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
                    error: 'false'
                };
            }

            return {
                success: true,
                message: 'update succsful',
                data: updatedFruit
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async deleteFruit(fruitId) {
        try {
            
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