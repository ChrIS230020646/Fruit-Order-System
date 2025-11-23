// models/LocationsBean.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    _id: Number,
    cityId: Number,
    address: String,
    type: String
}, {
    collection: 'locations'
});

const LocationsBean = mongoose.model('LocationsBean', locationSchema);
module.exports = LocationsBean;