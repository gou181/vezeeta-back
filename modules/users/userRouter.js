const express = require('express');
const userRouter = express.Router();

const { logIn } = require('./userController')
const { signUp } = require('./userController')
const { findALLUsers } = require('./userController')
const { getProfileInfo } = require('./userController')
const { editUser } = require('./userController')
const { deleteUser } = require('./userController')

const { errorHandler } = require('../middlewares')

//user sign up
userRouter.post('/signUp', signUp)

//user log in
userRouter.post('/logIn', logIn)

//get all users
userRouter.get('/', findALLUsers)

//get user profile by token id
userRouter.get('/profile', getProfileInfo)

//edit user by id
userRouter.patch('/', editUser)

//delete user with id
userRouter.delete('/:id', deleteUser)

// error handling middleware
userRouter.use(errorHandler)


module.exports = userRouter;