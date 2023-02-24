const express=require('express');
const { default: mongoose } = require('mongoose');
const router=express();
const multer=require('multer');
const user=require('../models/user');
const bcrypt=require('bcrypt')

router.post('/sign',(req,res,next)=>{
const User= new user({
    _id:new mongoose.Types.ObjectId(),
    email:req.body.email,
    password:req.body.password

})
})











module.exports=router;
