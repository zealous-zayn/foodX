    
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    product_id : {type: String, unique: true,  required: true},
    product_name : {type: String, required: true, default: ""},
    product_value : {type: Number, default: 0},
    created_till_now : {type: Number, default: 0},
    predicted : {type: Number, default:0},
    created : {type: Date, default: Date.now}
})

module.exports = mongoose.model('Product', productSchema)