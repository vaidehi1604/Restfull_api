const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express();
const multer = require("multer");
const checkAuth=require('../middleware/check-auth');
const storage = multer.diskStorage({
  //show image in upload folder
  destination: function (req, file, cb) {
    // call back to destination
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  //reject a file
  //storing file correct way using mimetype
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const product = require("../models/product");

router.get("/", (req, res, next) => {
  product
    .find()
    .select("name price _id productImage")
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            requesr: {
              type: "GET",
              url: "http://localhost:3000/products/" + doc._id,
            },
          };
        }),
      };

      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});


router.post("/",checkAuth,upload.single("productImage"),(req, res, next) => {
  console.log(req.file);
  const Product = new product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path,
  });
  Product.save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "handling post request",
        createdproduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get("/:productID",checkAuth, (req, res, next) => {
  const id = req.params.productID;
  product
    .findById(id)
    .select("name price _id productImage")
    .exec()
    .then((doc) => {
      console.log("From Database", doc);

      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: "GET",
            // description:'Get all',
            url: "http://localhost:3000/products/" + doc._id,
          },
        });
      } else {
        res.status(404).json({ message: "Invalid ID" });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.patch("/:productID", (req, res, next) => {
  const id = req.params.productID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  product
    .update({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "product updated",
        request: {
          type: "GET",
          url: "http://localhost:3000/products/" + id,
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

router.delete("/:productID", (req, res, next) => {
  const id = req.params.productID;
  product
    .remove({ _id: id })
    .exec()
    .then((result) => {
      // console.log(result)
      res.status(200).json({
        message: "product deleted",
        request: {
          type: "POST",
          url: "http://localhost:3000/products/" + id,
          body: { name: "String", price: "Number" },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

module.exports = router;
