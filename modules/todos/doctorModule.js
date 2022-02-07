const doctorSchema = require('./doctorSchema');
const mongoose = require('mongoose')

const Doctor = mongoose.model('doctors', doctorSchema);

module.exports = Doctor;