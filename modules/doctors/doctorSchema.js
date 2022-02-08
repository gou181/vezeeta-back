const mongoose = require('mongoose')

const doctorSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    } ,
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    specialization:String,
    address:String,
    tel:Number,
    fees:Number
});

module.exports = doctorSchema;
  