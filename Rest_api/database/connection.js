
const mongoose=require('mongoose')
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
    try{
        // mongodb connection string
        const con = await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true
            
        })
    }catch(err){
        console.log(err);
      
    }
}
mongoose.Promise=global.Promise

module.exports=connectDB