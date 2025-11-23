
const StaffBean = require('../orderBean/staffBean');

class StaffDB {
    
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


    async getStaffByEmail(email) {
    return this.findStaffByEmail(email);
}
static async findStaffByEmail(email) {
    try {
        const staff = await StaffBean.findOne({ 
            email: email,
            status: true  
        });
        
        if (!staff) {
            return {
                success: false,
                error: 'Staff not found or account is disabled'
            };
        }

        
        const staffData = staff.toObject ? staff.toObject() : staff;
        const { password, ...staffWithoutPassword } = staffData;

        return {
            success: true,
            data: staffWithoutPassword
        };
    } catch (error) {
        console.error('findStaffByEmail error:', error);
        return {
            success: false,
            error: error.message
        };
    }
}
    
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

    
    static async getStaffByName(staffName) {
        try {
            const staff = await StaffBean.find({ 
                name: { $regex: staffName, $options: 'i' } 
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

    
    static async insertStaff(staffData) {
        try {
            
            const existingStaff = await StaffBean.findOne({ _id: staffData._id });
            if (existingStaff) {
                return {
                    success: false,
                    error: 'Staff ID already exists'
                };
            }

            
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


static async updateStaff(staffId, updateData) {
    try {
        
        const existingStaff = await StaffBean.findOne({ _id: staffId });
        if (!existingStaff) {
            return {
                success: false,
                error: 'Staff does not exist'
            };
        }

        
        if (updateData._id) {
            delete updateData._id;
        }

        const updatedStaff = await StaffBean.findOneAndUpdate(
            { _id: staffId },
            { $set: updateData },
            { new: true, runValidators: true } 
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

    
    static async deleteStaff(staffId) {
        try {
            
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

    
    static async staffLogin(email, password) {
        try {
            const staff = await StaffBean.findOne({ 
                email: email, 
                password: password,
                status: true 
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