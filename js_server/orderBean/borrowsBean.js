// orderBean/borrowsBean.js
const mongoose = require('mongoose');

const borrowsSchema = new mongoose.Schema({
    _id: Number,
    fromShopId: Number,
    toShopId: Number,
    fruitId: Number,
    quantity: Number,
    borrowDate: Date,
    returnDate: Date,
    status: String
}, {
    collection: 'borrows'
});

const BorrowsBean = mongoose.model('BorrowsBean', borrowsSchema);
module.exports = BorrowsBean;