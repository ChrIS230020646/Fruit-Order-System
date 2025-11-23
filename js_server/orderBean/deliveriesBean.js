// orderBean/deliveriesBean.js
const mongoose = require('mongoose');

const deliveriesSchema = new mongoose.Schema({
    _id: Number,
    fromWarehouseId: Number,
    toLocationId: Number,
    fruitId:Number,
    quantity:Number,
    deliveryDate:Date,
    estimatedArrivalDate:Date,
    status:String
}, {
    collection: 'deliveries'
});

const DeliveriesBean = mongoose.model('DeliveriesBean', deliveriesSchema);
module.exports = DeliveriesBean;