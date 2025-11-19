
const BorrowsBean = require('../orderBean/borrowsBean');

class BorrowsDB {
    
    static async getAllBorrows() {
        try {
            const borrows = await BorrowsBean.find({});
            return {
                success: true,
                data: borrows,
                count: borrows.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getBorrowById(borrowId) {
        try {
            const borrow = await BorrowsBean.findOne({ _id: borrowId });
            if (!borrow) {
                return {
                    success: false,
                    error: '借还记录不存在'
                };
            }
            return {
                success: true,
                data: borrow
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getBorrowsByFromShopId(shopId) {
        try {
            const borrows = await BorrowsBean.find({ fromShopId: shopId });
            return {
                success: true,
                data: borrows,
                count: borrows.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getBorrowsByToShopId(shopId) {
        try {
            const borrows = await BorrowsBean.find({ toShopId: shopId });
            return {
                success: true,
                data: borrows,
                count: borrows.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getBorrowsByFruitId(fruitId) {
        try {
            const borrows = await BorrowsBean.find({ fruitId: fruitId });
            return {
                success: true,
                data: borrows,
                count: borrows.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getBorrowsByStatus(status) {
        try {
            const borrows = await BorrowsBean.find({ status: status });
            return {
                success: true,
                data: borrows,
                count: borrows.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getBorrowsByDateRange(startDate, endDate) {
        try {
            const borrows = await BorrowsBean.find({
                borrowDate: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            });
            return {
                success: true,
                data: borrows,
                count: borrows.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async insertBorrow(borrowData) {
        try {
            
            const existingBorrow = await BorrowsBean.findOne({ _id: borrowData._id });
            if (existingBorrow) {
                return {
                    success: false,
                    error: 'ID in'
                };
            }

            const newBorrow = new BorrowsBean(borrowData);
            const savedBorrow = await newBorrow.save();
            
            return {
                success: true,
                message: 'ok',
                data: savedBorrow
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async updateBorrow(borrowId, updateData) {
        try {
            
            const existingBorrow = await BorrowsBean.findOne({ _id: borrowId });
            if (!existingBorrow) {
                return {
                    success: false,
                    error: 'not find'
                };
            }

            
            if (updateData._id) {
                delete updateData._id;
            }

            const updatedBorrow = await BorrowsBean.findOneAndUpdate(
                { _id: borrowId },
                { $set: updateData },
                { new: true, runValidators: true }
            );

            return {
                success: true,
                message: '借还记录更新成功',
                data: updatedBorrow
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async deleteBorrow(borrowId) {
        try {
            
            const existingBorrow = await BorrowsBean.findOne({ _id: borrowId });
            if (!existingBorrow) {
                return {
                    success: false,
                    error: 'not find'
                };
            }

            const deletedBorrow = await BorrowsBean.findOneAndDelete({ _id: borrowId });

            return {
                success: true,
                message: 'delete',
                data: deletedBorrow
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async insertManyBorrows(borrowsArray) {
        try {
            const result = await BorrowsBean.insertMany(borrowsArray);
            
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

    
    static async getBorrowsCountByStatus() {
        try {
            const result = await BorrowsBean.aggregate([
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 },
                        totalQuantity: { $sum: "$quantity" }
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

    
    static async getBorrowsStatsByShop() {
        try {
            const result = await BorrowsBean.aggregate([
                {
                    $group: {
                        _id: {
                            fromShopId: "$fromShopId",
                            toShopId: "$toShopId"
                        },
                        borrowCount: { $sum: 1 },
                        totalQuantity: { $sum: "$quantity" }
                    }
                },
                {
                    $sort: { "_id.fromShopId": 1, "_id.toShopId": 1 }
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

    
    static async getPendingReturns() {
        try {
            const pendingReturns = await BorrowsBean.find({
                status: "borrowed",
                returnDate: { $lt: new Date() } 
            });

            return {
                success: true,
                data: pendingReturns,
                count: pendingReturns.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = BorrowsDB;