const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const mongoose = require('mongoose')
const morgan = require("morgan")

const doctorRouter = require('./modules/doctors/doctorRouter')
const userRouter = require('./modules/users/userRouter')
const reservationRouter = require('./modules/reservations/resRouter')

// enable cors for my project
app.use(cors())

// middleware to move between middlewares without next
app.use(morgan('combined'))

// middlewares to handle request body
app.use(express.json());
app.use(express.urlencoded())

// connecting to database
mongoose.connect('mongodb://localhost:27017/vezeeta');

// doctors routing for my application
app.use('/doctors', doctorRouter)

// users routing for my application
app.use('/users', userRouter)

// reservation routing for my application
app.use('/reservations', reservationRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})