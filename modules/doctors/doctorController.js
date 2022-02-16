const Doctor = require('./doctorModel');
const bcrypt = require('bcrypt')
const util = require('util')
const jwt = require('jsonwebtoken')
const saltRounds = 10;

//make jason web token functions async using util
const asyncLogInDoctor = util.promisify(jwt.sign);
const asyncVerifyDoctor = util.promisify(jwt.verify);

// define secret key for my token
const secretKey = 'mySecretKey'

// sign up function expression
const signUp = async (req, res, next) => {

    //define instance to store signed up doctor data in the database
    let doctor = new Doctor(req.body);
    try {
        // hashing password with 10 saltrounds
        doctor.password = await bcrypt.hash(doctor.password, saltRounds)

        //saving signed up doctor data in the database
        await doctor.save();

        //sending response to the doctor
        res.send("signed up successfully");

    } catch (error) {
        error.status = 500;
        // send catched error to error handler middleware
        next(error);
    }
}

//log in function expression
const logIn = async (req, res, next) => {

    // distruct request body to use in search
    const { username, password } = req.body;
    try {

        // find doctor in the database with logged in username
        const doctor = await Doctor.findOne({ email: username });

        // throw error if there is no matched username
        if (!doctor) {
            throw new Error('invalid username or password');
        }

        // prepare founded doctor password and compare it to logged in password
        const { password: hashedPassword } = doctor;
        const checkPassword = await bcrypt.compare(password, hashedPassword);

        // throw error if passwords did'nt match
        if (!checkPassword) {
            throw new Error('invalid username or password')
        }

        //create token to authorized doctor for further authentication
        const token = await asyncLogInDoctor({
            id: doctor.id
        }, secretKey)

        //send response to the doctor
        res.send({
            message: 'logged in successfully',
            token
        })
    }
    catch (error) {
        error.status = 422;

        //send error to error handler middleware
        next(error)
    }
}

// find all doctors function expression
const findALLDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find({},{password:0});

        // throw error if there is no doctors
        if (!doctors) {
            res.send('no doctors found')
        }
        res.send(doctors)
    }
    catch (error) {
        error.status = 422;

        // send error to error handler middleware
        next(error);
    }

}

// get profile info by token id function expression
const getProfileInfo = async (req, res, next) => {

    // getting authorization access token from request headers
    let { authorization } = req.headers
    try {

        // verify access token to make sure doctor have privilages and get token payload
        const payload = await asyncVerifyDoctor(authorization, secretKey)

        // get doctor data by id stored and encodded in access token
        const doctor = await Doctor.findById(payload.id,{password:0})

        // throw error if there is no doctor found
        if (!doctor) {
            throw new Error('no doctor found')
        }

        //send back response with doctor data
        res.send(doctor)
    }
    catch (error) {
        error.status = 404;

        // send error to error handler middleware
        next(error)
    }


}

// get doctor details by id function expression
const getDoctorDetails = async (req, res, next) => {
    const user_id = req.params.id;
    try {
        // get doctor data by id stored and encodded in access token
        const doctor = await Doctor.findById(user_id,{password:0})

        // throw error if there is no doctor found
        if (!doctor) {
            throw new Error('no doctor found')
        }

        //send back response with doctor data
        res.send(doctor)
    }
    catch (error) {
        error.status = 404;

        // send error to error handler middleware
        next(error)
    }


}

// edit doctor by id function expression
const editDoctor = async (req, res, next) => {

    // getting authorization access token from request headers
    let { authorization } = req.headers
    try {

        // verify access token to make sure doctor have privilages and get token payload
        const payload = await asyncVerifyDoctor(authorization, secretKey)

        // get doctor by id stored and encodded in access token to update his info
        const doctor = await Doctor.updateOne(
            { _id: payload.id },
            {
                $set: {
                    name: req.body.name,
                    email: req.body.email,

                    //hashing edited password and save it
                    password: await bcrypt.hash(req.body.password, saltRounds),
                    specialization: req.body.specialization,
                    address: req.body.address,
                    tel: req.body.tel,
                    fees: req.body.fees
                }
            }
        )

        // throw error if there is no doctor found
        if (doctor.modifiedCount == 0) {
            throw new Error('doctor not found')
        }

        // send response to doctor
        res.send("data updated successfully");
    }
    catch (error) {
        error.status = 404;

        // send error to error handler middleware
        next(error);
    }

}

// delete doctor by id function expression
const deleteDoctor = async (req, res, next) => {

    // getting doctor id from request params to delete him
    let user_id = req.params.id
    try {
        const result = await Doctor.deleteOne({ _id: user_id })

        // throw error if there is no doctor 
        if (result.deletedCount == 0) {
            throw new Error('no doctor found')
        }
        res.send(result)
    }
    catch (error) {
        error.status = 404;

        // send error to error handler middleware
        next(error)
    }
}

// export all function expressions
module.exports = {
    logIn,
    signUp,
    findALLDoctors,
    getProfileInfo,
    getDoctorDetails,
    editDoctor,
    deleteDoctor
}