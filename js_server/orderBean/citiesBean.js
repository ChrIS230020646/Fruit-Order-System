// orderBean/cityBean.js
const mongoose = require('mongoose');

const citySchema = new mongoose.Schema({
    _id: Number,
    countryId: Number,
    name: String
}, {
    collection: 'cities'
});

const CityBean = mongoose.model('CityBean', citySchema);
module.exports = CityBean;