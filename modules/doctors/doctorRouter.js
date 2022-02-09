const express = require("express"); 
const doctorRouter = express.Router();
const { logIn } = require('./doctorController')
const { signUp } = require('./doctorController')
const { findALLDoctors } = require('./doctorController')
const { findDoctor } = require('./doctorController')
const { editDoctor } = require('./doctorController')
const { deleteDoctor } = require('./doctorController')
const { errorHandler } = require('./middlewares')

//doctor sign up
doctorRouter.post('/signUp', signUp)

//doctor log in
doctorRouter.post('/logIn', logIn)

//get all doctors
doctorRouter.get('/', findALLDoctors)

//get doctor by id
doctorRouter.get('/:id', findDoctor)

//edit doctor by id
doctorRouter.patch('/:id', editDoctor)

//delete doctor with id
doctorRouter.delete('/:id', deleteDoctor)

// error handling middleware
doctorRouter.use(errorHandler)

module.exports = doctorRouter