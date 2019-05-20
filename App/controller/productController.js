const mongoose = require('mongoose');
const shortId = require('shortid');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');
const time = require('../libs/timeLib');

const ProductModel = mongoose.model('Product')
const OrderModel = mongoose.model('Order')

let addProduct = async (req, res)=>{
    let newProduct = new ProductModel({
        product_id : shortId.generate(),
        product_name : req.body.productName,
        product_value : req.body.productValue,
        created : time.now()
    })

    let productDetails = await newProduct.save()
    try{
        let apiResponse = response.generate(false, "New Product Added", 200, productDetails);
        res.send(apiResponse)
    } catch(err){
        logger.captureError(err.message, 'Item Controller:addItem', 10)
        let apiResponse = response.generate(true, "Failed to add new Item", 500, null);
        res.send(apiResponse)
    }
}

let getAllProduct = async (req, res)=>{
    console.log(req.headers)
    let result = await ProductModel.find()
    try{
        if (check.isEmpty(result)) {
            logger.captureInfo('No Product Found', 'productController: getAllProduct')
            let apiResponse = response.generate(true, 'No Product Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'All Product Details Found', 200, result)
            res.send(apiResponse)
        }
    } catch(err){
        logger.captureError(err.message, 'productController: getAllProduct', 10)
        let apiResponse = response.generate(true, 'Failed To Find Product Details', 500, null)
        res.send(apiResponse)
    }
}

let predictionUpdate = async (req, res)=>{
    await ProductModel.updateOne({product_id : req.body.id},{predicted : req.body.predictedValue,created_till_now:0})
    try{
        let apiResponse = response.generate(false, 'The predicted value updated successfully', 200, null)
        res.send(apiResponse)
    } catch(err){   
        logger.captureError(err.message, 'productController: predictionUpdate', 10)
        let apiResponse = response.generate(true, 'Failed To Update Details', 500, null)
        res.send(apiResponse)
    }
}

let doneProduct = async (req, res)=>{
    let orderDone = await new Promise(async (resolve, reject)=>{
        await OrderModel.updateOne({"order_id":req.body.orderId,"order_detials.product_id":req.body.productId},{$set:{"order_detials.$.status":true}})
        try{
            resolve({product_id:req.body.productId, quantity: req.body.quantity})
        } catch(err){
            logger.captureError(err.message, 'orderController: doneProduct', 10)
            let apiResponse = response.generate(true, 'Failed To Update Order Status', 500, null)
            res.send(apiResponse)
        }
    })
    await ProductModel.updateOne({ product_id: orderDone.product_id }, { $inc: { created_till_now: orderDone.quantity} })
            try {
                let apiResponse = response.generate(false, 'Order Status Updated succesfully', 200, null)
                res.send(apiResponse)
            } catch (err) {
                logger.captureError(err.message, 'orderController: createOrder', 10)
                let apiResponse = response.generate(true, 'Failed To Update Product Quantity details', 500, null)
                res.send(apiResponse)
            }
}

module.exports = {
    addProduct : addProduct,
    getAllProduct : getAllProduct,
    predictionUpdate : predictionUpdate,
    doneProduct : doneProduct
}