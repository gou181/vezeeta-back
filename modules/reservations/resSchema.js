const mongoose = require('mongoose')

const resSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true
    },
    doctorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required:true
    },
    time:{
        type:Date,
        required:true
    }

})

module.exports = resSchema