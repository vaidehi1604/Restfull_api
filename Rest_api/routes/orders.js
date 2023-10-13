const express = require("express");
const router = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const checkAuth=require('../middleware/check-auth')

const order = require("../models/order");
const product = require("../models/product");
const OrdersController =require('../controllers/orders');

router.get("/",checkAuth,OrdersController.orders_get_all)



//handl incoming get request to /orders
router.get("/",checkAuth, (req, res, next) => {
  order.find()
    .select("product quantity _id")
    .populate('product','name')
    .exec()
    .then((docs) => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map((doc) => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: "GET",
              url: "http://localhost:3000/orders/" + doc._id,
            },
          };
        }),
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

//handle incomming post request
router.post("/",checkAuth, (req, res, next) => {
    product.findById(req.body.productId)
    .then(product=>{
        if(!product){
            return res.status(404).json({
                message:"Product not found"
            })
        }
        const Orders = new order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId,
          });
          return Orders.save();
    })
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "order stored",
        createdOrder:{
       _id:result._id,
        product:result.product,
        quantity:result.quantity
        },
        request: {
          type: "GET",
          url: "http://localhost:3000/orders/" + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:orderID", checkAuth,(req, res, next) => {
  
    order.findById(req.params.orderID)
    // .exec()
    .populate('product','name')
    .then(order=>{
        if(!order){
            return res.status(404).json({
                message:"order not found"
            })}

        res.status(200).json({
            order:order,
            request: {
                type: "GET",
                url: "http://localhost:3000/orders/",
            }
        })
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({
          error: err,
        });
      });
});

router.delete("/:orderID",checkAuth, (req, res, next) => {
  order.remove({_id:req.params.orderID})
  .exec()
  .then(orders=>{
   
    res.status(200).json({
      message:"order deleted",
        request: {
            type: "POST",
            url: "http://localhost:3000/orders/",
            body:{productID:'ID',quantity:"Number"}
        }
    })
})
  .catch()
});

module.exports = router;
