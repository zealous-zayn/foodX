const mongoose = require('mongoose');
const shortId = require('shortid');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');
const time = require('../libs/timeLib');

const OrderModel = mongoose.model('Order')
const ProductModel = mongoose.model('Product')

let createOrder = async (req, res) => {
    let orderDetails = await new Promise(async (resolve, reject) => {
        let newOder = new OrderModel({
            order_id: shortId.generate(),
            customer_name: req.body.customerName,
            order_detials: req.body.orderDetails,
            total_cost: req.body.totalCost,
            created: time.now()
        })

        let order = await newOder.save()
        try {
            resolve(order)
        } catch (err) {
            logger.captureError(err.message, 'orderController: createOrder', 10)
            let apiResponse = response.generate(true, 'Failed To Update Details', 500, null)
            res.send(apiResponse)
        }
    })

    let createTillNowUpdate = await new Promise(async (resolve, reject) => {
        let successfulOrder = []
        await orderDetails.order_detials.forEach(async (product) => {
            await ProductModel.updateOne({ product_id: product.product_id }, { $inc: { created_till_now: product.quantity } })
            try {
                successfulOrder.push(product)
            } catch (err) {
                logger.captureError(err.message, 'orderController: createOrder', 10)
                let apiResponse = response.generate(true, `Failed To Update Product Quantity for ${product.product_name}`, 500, null)
                res.send(apiResponse)
            }
        });
        try {
            resolve(successfulOrder)
        } catch (err) {
            logger.captureError(err.message, 'orderController: createOrder', 10)
            let apiResponse = response.generate(true, 'Failed To Update product quantity', 500, null)
            res.send(apiResponse)
        }

    })
    let responseData = {
        order_id: orderDetails.order_id,
        product_details: createTillNowUpdate
    }
    let apiResponse = await response.generate(false, "Order Created Successfully", 200, responseData)
    await res.send(apiResponse)
}

module.exports = {
    createOrder : createOrder
}