const doctorSchema = require('./doctorSchema');
const mongoose = require('mongoose')

// create table(model) - doctors inside database
const Doctor = mongoose.model('doctors', doctorSchema);

module.exports = Doctor;