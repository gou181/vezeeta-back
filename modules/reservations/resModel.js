const mongoose = require('mongoose');
const resSchema = require('./resSchema');

const userModel = mongoose.model('reservations', resSchema)

module.exports = userModel;