// orderDB/staffDB.js
const StaffBean = require('../orderBean/staffBean');

class StaffDB {
    // (SELECT * FROM staff)
    static async getAllStaff() {
        try {
            const staff = await StaffBean.find({});
            return {
                success: true,
                data: staff,
                count: staff.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get staff by job
    static async getStaffByJob(job) {
        try {
            const staff = await StaffBean.find({ job: job });
            return {
                success: true,
                data: staff,
                count: staff.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get staff by location ID
    static async getStaffByLocationId(locationId) {
        try {
            const staff = await StaffBean.find({ locationId: locationId });
            return {
                success: true,
                data: staff,
                count: staff.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get staff by status
    static async getStaffByStatus(status) {
        try {
            const staff = await StaffBean.find({ status: status });
            return {
                success: true,
                data: staff,
                count: staff.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get staff by ID
    static async getStaffById(staffId) {
        try {
            const staff = await StaffBean.findOne({ _id: staffId });
            if (!staff) {
                return {
                    success: false,
                    error: 'Staff does not exist'
                };
            }
            return {
                success: true,
                data: staff
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get staff by name
    static async getStaffByName(staffName) {
        try {
            const staff = await StaffBean.find({ 
                name: { $regex: staffName, $options: 'i' } // case insensitive
            });
            return {
                success: true,
                data: staff,
                count: staff.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Get staff by email
    static async getStaffByEmail(email) {
        try {
            const staff = await StaffBean.findOne({ email: email });
            if (!staff) {
                return {
                    success: false,
                    error: 'Staff does not exist'
                };
            }
            return {
                success: true,
                data: staff
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // INSERT - Add new staff
    static async insertStaff(staffData) {
        try {
            // Check if staff ID already exists
            const existingStaff = await StaffBean.findOne({ _id: staffData._id });
            if (existingStaff) {
                return {
                    success: false,
                    error: 'Staff ID already exists'
                };
            }

            // Check if email already exists
            const existingEmail = await StaffBean.findOne({ email: staffData.email });
            if (existingEmail) {
                return {
                    success: false,
                    error: 'Email already exists'
                };
            }

            const newStaff = new StaffBean(staffData);
            const savedStaff = await newStaff.save();
            
            return {
                success: true,
                message: 'Staff added successfully',
                data: savedStaff
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

// UPDATE - Update staff information
static async updateStaff(staffId, updateData) {
    try {
        // Check if staff exists
        const existingStaff = await StaffBean.findOne({ _id: staffId });
        if (!existingStaff) {
            return {
                success: false,
                error: 'Staff does not exist'
            };
        }

        // Prevent updating _id
        if (updateData._id) {
            delete updateData._id;
        }

        const updatedStaff = await StaffBean.findOneAndUpdate(
            { _id: staffId },
            { $set: updateData },
            { new: true, runValidators: true } // Return updated document, run validators
        );

        return {
            success: true,
            message: 'Staff updated successfully',
            data: updatedStaff
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

    // DELETE - Delete staff
    static async deleteStaff(staffId) {
        try {
            // Check if staff exists
            const existingStaff = await StaffBean.findOne({ _id: staffId });
            if (!existingStaff) {
                return {
                    success: false,
                    error: 'Staff does not exist'
                };
            }

            const deletedStaff = await StaffBean.findOneAndDelete({ _id: staffId });

            return {
                success: true,
                message: 'Staff successfully deleted',
                data: deletedStaff
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Bulk insert staff
    static async insertManyStaff(staffArray) {
        try {
            const result = await StaffBean.insertMany(staffArray);
            
            return {
                success: true,
                message: `Successfully inserted ${result.length} staff`,
                data: result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Count staff by location
    static async getStaffCountByLocation() {
        try {
            const result = await StaffBean.aggregate([
                {
                    $group: {
                        _id: "$locationId",
                        count: { $sum: 1 },
                        staff: { $push: "$name" }
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

    // Count staff by job
    static async getStaffCountByJob() {
        try {
            const result = await StaffBean.aggregate([
                {
                    $group: {
                        _id: "$job",
                        count: { $sum: 1 },
                        staff: { $push: "$name" }
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

    // Staff login verification
    static async staffLogin(email, password) {
        try {
            const staff = await StaffBean.findOne({ 
                email: email, 
                password: password,
                status: true // Ensure staff status is active
            });
            
            if (!staff) {
                return {
                    success: false,
                    error: 'Invalid email or password, or account is disabled'
                };
            }

            return {
                success: true,
                message: 'Login successful',
                data: staff
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Search staff with multiple criteria
    static async searchStaff(criteria) {
        try {
            const query = {};
            
            if (criteria.name) {
                query.name = { $regex: criteria.name, $options: 'i' };
            }
            if (criteria.job) {
                query.job = criteria.job;
            }
            if (criteria.locationId) {
                query.locationId = criteria.locationId;
            }
            if (criteria.status !== undefined) {
                query.status = criteria.status;
            }
            if (criteria.email) {
                query.email = { $regex: criteria.email, $options: 'i' };
            }

            const staff = await StaffBean.find(query);
            return {
                success: true,
                data: staff,
                count: staff.length
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}

module.exports = StaffDB;