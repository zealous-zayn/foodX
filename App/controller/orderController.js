const mongoose = require('mongoose');
const shortId = require('shortid');
const response = require('../libs/responseLib');
const logger = require('../libs/loggerLib');
const check = require('../libs/checkLib');
const time = require('../libs/timeLib');

const OrderModel = mongoose.model('Order')


let createOrder = async (req, res) => {
    let orders = JSON.parse(req.body.orderDetails)
    let orderDetails = await new Promise(async (resolve, reject) => {
        try {
        let newOder = new OrderModel({
            order_id: shortId.generate(),
            customer_name: req.body.customerName,
            order_detials: JSON.parse(req.body.orderDetails),
            total_cost: req.body.totalCost,
            created: time.now()
        })

        let order = await newOder.save()
            resolve(order)
        } catch (err) {
            logger.captureError(err.message, 'orderController: createOrder', 10)
            let apiResponse = response.generate(true, 'Failed To Place Order please try again', 500, null)
            res.send(apiResponse)
        }
    })

    let apiResponse = await response.generate(false, "Order Created Successfully", 200, orderDetails)
    await res.send(apiResponse)
}

let getOrders = async (req, res)=>{
    let result = await OrderModel.find()
    try{
        if(check.isEmpty(result)){
            logger.captureInfo('No Order Found', 'orderController: getOders')
            let apiResponse = response.generate(true, 'No Order Found', 404, null)
            res.send(apiResponse)
        } else {
            let apiResponse = response.generate(false, 'All Order Details', 200, result)
            res.send(apiResponse)
        }
    } catch(err){
        logger.captureError(err.message, 'orderController: getOrders', 10)
        let apiResponse = response.generate(true, 'Failed To Get orders', 500, null)
        res.send(apiResponse)
    }
}


module.exports = {
    createOrder : createOrder,
    getOrders : getOrders
}