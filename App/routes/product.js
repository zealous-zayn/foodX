const productController = require('./../controller/productController')

module.exports.setRouter = (app)=>{
    app.post('/get-all-products', productController.getAllProduct)

    app.post('/add-product', productController.addProduct)

    app.put('/prdiction-update', productController.predictionUpdate)

    app.post('/done-product', productController.doneProduct)
}