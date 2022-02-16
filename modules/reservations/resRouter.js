const express = require('express');
const reservationRouter = express.Router();

const { createReservation } = require('./resController')
const { editReservation } = require('./resController')
const { deleteReservation } = require('./resController')

const { errorHandler } = require('../middlewares')

// create reservation
reservationRouter.post('/add', createReservation);

// edit reservation
reservationRouter.patch('/:id', editReservation)

// delete reservation
reservationRouter.delete('/:id', deleteReservation)

// handle error middleware
reservationRouter.use(errorHandler);

module.exports = reservationRouter

