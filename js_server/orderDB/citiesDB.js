// orderDB/citiesDB.js
const CityBean = require('../orderBean/citiesBean');

class CityDB {
    
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

    
    static async getCityById(cityId) {
        try {
            const city = await CityBean.findOne({ _id: cityId });
            if (!city) {
                return {
                    success: false,
                    error: 'city'
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

    
    static async getCityByName(cityName) {
        try {
            const cities = await CityBean.find({ 
                name: { $regex: cityName, $options: 'i' } 
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

    
    static async insertCity(cityData) {
        try {
            
            const existingCity = await CityBean.findOne({ _id: cityData._id });
            if (existingCity) {
                return {
                    success: false,
                    error: 'City ID already exists'
                };
            }

            const newCity = new CityBean(cityData);
            const savedCity = await newCity.save();
            
            return {
                success: true,
                message: 'City added successfully',
                data: savedCity
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async updateCity(cityId, updateData) {
        try {
            
            const existingCity = await CityBean.findOne({ _id: cityId });
            if (!existingCity) {
                return {
                    success: false,
                    error: 'The city does not exist'
                };
            }

            
            if (updateData._id) {
                delete updateData._id;
            }

            const updatedCity = await CityBean.findOneAndUpdate(
                { _id: cityId },
                { $set: updateData },
                { new: true, runValidators: true } 
            );

            return {
                success: true,
                message: 'Urban renewal successful',
                data: updatedCity
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async deleteCity(cityId) {
        try {
            
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