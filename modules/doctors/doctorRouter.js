const express = require("express"); 
const doctorRouter = express.Router();
const Doctor = require('./doctorModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//create new doctor
doctorRouter.post('/', async (req, res, next) => {
    let doctor = new Doctor(req.body);
    const {password} = doctor;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // Store hash in your password DB.
    });
        try {
            await doctor.save();
            res.send(doctor);
        }catch(error){
            error.status = 500;
            next(error);
        }   
})

//get doctor by status
doctorRouter.get('/', async (req, res) => {
    const filterd = await Doctor.find({ status: "in-progress" })
    res.send(filterd)
})

//get doctor by id
doctorRouter.get('/:id', async (req, res) => {
    let user_id = req.params.id
    const doctor = await Doctor.findById(user_id)
    res.send(doctor)
})

//edit doctor by id
doctorRouter.patch('/:id', async(req, res) => {
    let user_id = req.params.id
    const doctor = await Doctor.updateOne(
        { _id: user_id },
        {
            $set: {title : req.body.title, status : req.body.status}
        }
    )
    res.send(doctor);
})

//delete doctor with id
doctorRouter.delete('/:id', async(req, res) => {
    let user_id = req.params.id
    await Doctor.deleteOne({_id:user_id})
    res.send("deleted successfully")
})

doctorRouter.use((err, req, res, next) => {
    err.code = "somthing went wrong"
    res.send(err)
})
module.exports = doctorRouter