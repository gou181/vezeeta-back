const Doctor = require('./doctorModel');
const bcrypt = require('bcrypt')
const util = require('util')
const jwt = require('jsonwebtoken')
const saltRounds = 10;

const asyncLogInDoctor = util.promisify(jwt.sign);
const asyncVerifyDoctor = util.promisify(jwt.verify);
const secretKey = 'mySecretKey'
const signUp = async (req, res, next) => {
    let doctor = new Doctor(req.body);
    doctor.password = await bcrypt.hash(doctor.password, saltRounds)
        try {
            await doctor.save();
            res.send(doctor);
        }catch(error){
            error.status = 500;
            next(error);
        }   
}

const logIn = async(req,res,next)=>{
    const {username, password} = req.body;
    try {
        const user = await Doctor.findOne({email:username});
        if(!user){
            throw new Error('invalid username or password');
        }
        const {password:hashedPassword} = user;
        const checkPassword = await bcrypt.compare(password, hashedPassword);
        if(!checkPassword){
            throw new Error('invalid username or password')
        }
        const token = await asyncLogInDoctor({
            id:user.id
        },secretKey)
        res.send({
            message:'logged in successfully',
            token
        })
    }
    catch (error) {
        error.status = 422;
        next(error)
    }
}

const findALLDoctors = async(req, res, next)=>{
    try {
        const doctors = await Doctor.find({});
        if(!doctors){
            res.send('no doctors found')
        }
        res.send(doctors)
    }
    catch (error){
        error.status = 422;
        next(error);
    }
    
}

const findDoctor = async (req, res, next) => {
    let {authorization} = req.headers
    try {
        const payload = await asyncVerifyDoctor(authorization,secretKey)
        const doctor = await Doctor.findById(payload.id)
        if(!doctor){
            throw new Error('no doctor found')
        }
        res.send(doctor)
    }
    catch(error){
        error.status = 404;
        next(error)
    }

    
}

const editDoctor = async(req, res, next) => {
    let user_id = req.params.id
    try{
        const doctor = await Doctor.updateOne(
            { _id: user_id },
            {
                $set: {
                    name : req.body.name,
                    email : req.body.email,
                    password: await bcrypt.hash(req.body.password, saltRounds),
                    specialization: req.body.specialization,
                    address:req.body.address,
                    tel:req.body.tel,
                    fees:req.body.fees
                }
            }
        )
        if(doctor.modifiedCount == 0){
            throw new Error('doctor not found')
        }
        res.send(doctor);
    }
    catch(error){
        error.status = 404;
        next(error);
    }
    
}

const deleteDoctor = async(req, res, next) => {
    let user_id = req.params.id
    try {
        const result = await Doctor.deleteOne({_id:user_id})
        if(result.deletedCount == 0){
            throw new Error('no doctor found')
        }
        res.send(result)
    }
    catch(error){
        error.status = 404;
        next(error)
    }
}

module.exports = {
    logIn,
    signUp,
    findALLDoctors,
    findDoctor,
    editDoctor,
    deleteDoctor
}