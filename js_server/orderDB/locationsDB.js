// orderDB/locationsDB.js
const LocationsBean = require('../orderBean/locationsBean');

class LocationsDB {
    
    static async getAllLocations() {
        try {
            const locations = await LocationsBean.find({});
            return {
                success: true,
                data: locations,
                count: locations.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getLocationsByCityId(cityId) {
        try {
            const locations = await LocationsBean.find({ cityId: cityId });
            return {
                success: true,
                data: locations,
                count: locations.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getLocationById(locationId) {
        try {
            const location = await LocationsBean.findOne({ _id: locationId });
            if (!location) {
                return {
                    success: false,
                    error: 'The location does not exist'
                };
            }
            return {
                success: true,
                data: location
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getLocationsByType(locationType) {
        try {
            const locations = await LocationsBean.find({ type: locationType });
            return {
                success: true,
                data: locations,
                count: locations.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getLocationsByAddress(addressKeyword) {
        try {
            const locations = await LocationsBean.find({ 
                address: { $regex: addressKeyword, $options: 'i' } 
            });
            return {
                success: true,
                data: locations,
                count: locations.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async insertLocation(locationData) {
        try {
            
            const existingLocation = await LocationsBean.findOne({ _id: locationData._id });
            if (existingLocation) {
                return {
                    success: false,
                    error: 'The location ID already exists.'
                };
            }

            const newLocation = new LocationsBean(locationData);
            const savedLocation = await newLocation.save();
            
            return {
                success: true,
                message: 'The location was successfully added.',
                data: savedLocation
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async updateLocation(locationId, updateData) {
        try {
            
            const existingLocation = await LocationsBean.findOne({ _id: locationId });
            if (!existingLocation) {
                return {
                    success: false,
                    error: 'The location does not exist'
                };
            }

            
            if (updateData._id) {
                delete updateData._id;
            }

            const updatedLocation = await LocationsBean.findOneAndUpdate(
                { _id: locationId },
                { $set: updateData },
                { new: true, runValidators: true } 
            );

            return {
                success: true,
                message: 'The location was successfully updated.',
                data: updatedLocation
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async deleteLocation(locationId) {
        try {
            
            const existingLocation = await LocationsBean.findOne({ _id: locationId });
            if (!existingLocation) {
                return {
                    success: false,
                    error: 'The location does not exist'
                };
            }

            const deletedLocation = await LocationsBean.findOneAndDelete({ _id: locationId });

            return {
                success: true,
                message: 'The location was successfully deleted.',
                data: deletedLocation
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async insertManyLocations(locationsArray) {
        try {
            const result = await LocationsBean.insertMany(locationsArray);
            
            return {
                success: true,
                message: `Insertion successful: ${result.length} locations added`,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    
    static async getLocationsCountByCity() {
        try {
            const result = await LocationsBean.aggregate([
                {
                    $group: {
                        _id: "$cityId",
                        count: { $sum: 1 },
                        locations: { $push: { id: "$_id", address: "$address", type: "$type" } }
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

    
    static async getLocationsCountByType() {
        try {
            const result = await LocationsBean.aggregate([
                {
                    $group: {
                        _id: "$type",
                        count: { $sum: 1 },
                        locations: { $push: { id: "$_id", address: "$address", cityId: "$cityId" } }
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

    
    static async getCityLocationsByType(cityId) {
        try {
            const result = await LocationsBean.aggregate([
                {
                    $match: { cityId: cityId }
                },
                {
                    $group: {
                        _id: "$type",
                        count: { $sum: 1 },
                        locations: { $push: { id: "$_id", address: "$address" } }
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

module.exports = LocationsDB;