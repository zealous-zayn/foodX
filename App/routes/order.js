const orderController = require('./../controller/orderController')

module.exports.setRouter = (app) =>{
    app.post('/create-order', orderController.createOrder)

    app.get('/get-orders', orderController.getOrders)
}