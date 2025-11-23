// orderBean/countriesBean.js
const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    _id: Number,
    name: String
}, {
    collection: 'countries'
});

const CountriesBean = mongoose.model('CountriesBean', countrySchema);
module.exports = CountriesBean;