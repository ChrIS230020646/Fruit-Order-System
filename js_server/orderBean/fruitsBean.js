// models/fruitsBean.js
const mongoose = require('mongoose');

const fruitSchema = new mongoose.Schema({
    _id: Number,
    name: String,
    originCountryId: Number,
    price: Number,
    imageURL: String
}, {
    collection: 'fruits'
});

const FruitsBean = mongoose.model('FruitsBean', fruitSchema);
module.exports = FruitsBean;