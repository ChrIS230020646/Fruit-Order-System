// orderDB/citiesDB.js
const CityBean = require('../orderBean/citiesBean');

class CityDB {
    // (SELECT * FROM cities)
    static async getAllCities() {
        try {
            const cities = await CityBean.find({});
            return {
                success: true,
                data: cities,
                count: cities.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 根据国家ID查询城市
    static async getCitiesByCountryId(countryId) {
        try {
            const cities = await CityBean.find({ countryId: countryId });
            return {
                success: true,
                data: cities,
                count: cities.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 根据城市ID查询
    static async getCityById(cityId) {
        try {
            const city = await CityBean.findOne({ _id: cityId });
            if (!city) {
                return {
                    success: false,
                    error: '城市不存在'
                };
            }
            return {
                success: true,
                data: city
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 根据城市名称查询
    static async getCityByName(cityName) {
        try {
            const cities = await CityBean.find({ 
                name: { $regex: cityName, $options: 'i' } // 不区分大小写
            });
            return {
                success: true,
                data: cities,
                count: cities.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // INSERT - 添加新城市
    static async insertCity(cityData) {
        try {
            // 检查城市ID是否已存在
            const existingCity = await CityBean.findOne({ _id: cityData._id });
            if (existingCity) {
                return {
                    success: false,
                    error: '城市ID已存在'
                };
            }

            const newCity = new CityBean(cityData);
            const savedCity = await newCity.save();
            
            return {
                success: true,
                message: '城市添加成功',
                data: savedCity
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // UPDATE - 更新城市信息
    static async updateCity(cityId, updateData) {
        try {
            // 检查城市是否存在
            const existingCity = await CityBean.findOne({ _id: cityId });
            if (!existingCity) {
                return {
                    success: false,
                    error: '城市不存在'
                };
            }

            // 不允许更新 _id
            if (updateData._id) {
                delete updateData._id;
            }

            const updatedCity = await CityBean.findOneAndUpdate(
                { _id: cityId },
                { $set: updateData },
                { new: true, runValidators: true } // 返回更新后的文档，运行验证
            );

            return {
                success: true,
                message: '城市更新成功',
                data: updatedCity
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // DELETE - 删除城市
    static async deleteCity(cityId) {
        try {
            // 检查城市是否存在
            const existingCity = await CityBean.findOne({ _id: cityId });
            if (!existingCity) {
                return {
                    success: false,
                    error: 'The city does not exist'
                };
            }

            const deletedCity = await CityBean.findOneAndDelete({ _id: cityId });

            return {
                success: true,
                message: 'City successfully deleted',
                data: deletedCity
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 批量插入城市
    static async insertManyCities(citiesArray) {
        try {
            const result = await CityBean.insertMany(citiesArray);
            
            return {
                success: true,
                message: `Successfully inserted ${result.length} cities`,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // 统计每个国家的城市数量
    static async getCitiesCountByCountry() {
        try {
            const result = await CityBean.aggregate([
                {
                    $group: {
                        _id: "$countryId",
                        count: { $sum: 1 },
                        cities: { $push: "$name" }
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

module.exports = CityDB;