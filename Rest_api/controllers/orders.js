const checkAuth = require("../middleware/check-auth");
const order=require('../models/order')
exports.orders_get_all=(req,res,next)=>{

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
}


exports.orders_create_order=(req,res,next)=>{
    product
}