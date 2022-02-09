const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

//define static schema for all doctors
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

// doctorSchema.pre('save', async(next)=>{
//     const saltedRounds = 10;
//     this.password = await bcrypt.hash(this.password, saltedRounds)
//     next()
// })

module.exports = doctorSchema;
  