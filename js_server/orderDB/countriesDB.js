// orderDB/countriesDB.js
const CountriesBean = require('../orderBean/countriesBean');

class CountriesDB {
    
    static async getAllCountries() {
        try {
            const countries = await CountriesBean.find({});
            return {
                success: true,
                data: countries,
                count: countries.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getCountriesByContinentId(continentId) {
        try {
            const countries = await CountriesBean.find({ continentId: continentId });
            return {
                success: true,
                data: countries,
                count: countries.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getCountryById(countryId) {
        try {
            const country = await CountriesBean.findOne({ _id: countryId });
            if (!country) {
                return {
                    success: false,
                    error: 'The country does not exist'
                };
            }
            return {
                success: true,
                data: country
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getCountryByName(countryName) {
        try {
            const countries = await CountriesBean.find({ 
                name: { $regex: countryName, $options: 'i' } 
            });
            return {
                success: true,
                data: countries,
                count: countries.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async insertCountry(countryData) {
        try {
            
            const existingCountry = await CountriesBean.findOne({ _id: countryData._id });
            if (existingCountry) {
                return {
                    success: false,
                    error: 'The country ID already exists.'
                };
            }

            const newCountry = new CountriesBean(countryData);
            const savedCountry = await newCountry.save();
            
            return {
                success: true,
                message: 'The country was successfully added.',
                data: savedCountry
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async updateCountry(countryId, updateData) {
        try {
            
            const existingCountry = await CountriesBean.findOne({ _id: countryId });
            if (!existingCountry) {
                return {
                    success: false,
                    error: 'The country does not exist'
                };
            }

            
            if (updateData._id) {
                delete updateData._id;
            }

            const updatedCountry = await CountriesBean.findOneAndUpdate(
                { _id: countryId },
                { $set: updateData },
                { new: true, runValidators: true } 
            );

            return {
                success: true,
                message: 'The country was successfully updated.',
                data: updatedCountry
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async deleteCountry(countryId) {
        try {
            
            const existingCountry = await CountriesBean.findOne({ _id: countryId });
            if (!existingCountry) {
                return {
                    success: false,
                    error: 'The state does not exist'
                };
            }

            const deletedCountry = await CountriesBean.findOneAndDelete({ _id: countryId });

            return {
                success: true,
                message: 'The country was successfully deleted.',
                data: deletedCountry
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async insertManyCountries(countriesArray) {
        try {
            const result = await CountriesBean.insertMany(countriesArray);
            
            return {
                success: true,
                message: `Insertion successful: ${result.length} countries added`,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getCountriesCountByContinent() {
        try {
            const result = await CountriesBean.aggregate([
                {
                    $group: {
                        _id: "$continentId",
                        count: { $sum: 1 },
                        countries: { $push: "$name" }
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

module.exports = CountriesDB;