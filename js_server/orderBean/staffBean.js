// models/staffBean.js
const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    email: String,
    password: String,
    phone: String,
    job: String,
    locationId: Number,
    status: Boolean
}, {
    collection: 'staff'
});

const staffBean = mongoose.model('staffBean', staffSchema);
module.exports = staffBean;
