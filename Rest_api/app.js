const express=require('express');
const morgan=require('morgan');
const bodyparser= require('body-parser')
const mongoose=require('mongoose')
const dotenv = require("dotenv");
dotenv.config();
const app=express();

const productRoutes=require('../Rest_api/routes/products');
const orderRoutes=require('./routes/orders');
const userRoutes=require('./routes/user');
const connectDB = require('./database/connection');

connectDB();


app.use(morgan('dev'));
app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json());
app.use('./uploads',express.static('uploads'));

app.use((req,res,next)=>{
    res.header('Access-control-Allow-origin','*');
    res.header('Access-control-Allow-origin',
    "origin,content-Type,Accept,Authorization");
    if(req.method==='option'){
      res.header('Access-control-Allow-origin','PUT,POST,PATCH,DELETE,GET')  
      return res.status(200).json({});
    }
    next();
})

app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/user',userRoutes);
app.use((req,res)=>{
    const error=new Error('not found');
    error.status=404;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        message:error.message
    })
})


module.exports=app;