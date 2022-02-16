const userSchema = require('./userSchema');
const mongoose = require('mongoose');

// create table(model) - doctors inside database
const User = mongoose.model('users',userSchema)

module.exports = User;