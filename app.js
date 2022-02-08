const express = require('express')
const app = express()
const cors = require('cors')
const port = 3000
const mongoose = require('mongoose')
const morgan = require("morgan")
const todoRouter = require('./modules/doctors/doctorRouter')

app.use(cors())
app.use(morgan('combined'))
app.use(express.json());
app.use(express.urlencoded())

mongoose.connect('mongodb://localhost:27017/doctors');
app.use('/doctors', todoRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})