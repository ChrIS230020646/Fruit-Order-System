// models/inventoryBean.js
const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
    _id: Number,
    fruitId: Number,
    locationId: Number,
    quantity: Number
}, {
    collection: 'inventory'
});

const inventoryBean = mongoose.model('inventoryBean', locationSchema);
module.exports = inventoryBean;