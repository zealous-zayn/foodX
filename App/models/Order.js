const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    order_id : {type: String, unique: true, required: true},
    customer_name : {type: String, default:""},
    order_detials : [{
        product_id: {type: String, default:""},
        product_name: {type: String, default:""},
        quantity: {type: String, default:""}
    }],
    total_cost : {type: Number, default:0},
    created : {type: Date, default: Date.now()},
    updated : {type: Date, default: Date.now()}
})

module.exports = mongoose.model('Order', orderSchema)