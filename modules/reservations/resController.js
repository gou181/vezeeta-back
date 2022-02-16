const Reservation = require('./resModel');
const util = require('util')
const jwt = require('jsonwebtoken')

//make jason web token functions async using util
const asyncVerifyUser = util.promisify(jwt.verify);

// define secret key for my token
const secretKey = 'mySecretKey'


// create reservation function expression
const createReservation = async (req, res, next) => {
    // getting authorization access token from request headers
    let { authorization } = req.headers

    //define instance to store created reservation data in the database
    let reservation = new Reservation(req.body);
    try {
        // verify access token to make sure user have privilages
        await asyncVerifyUser(authorization, secretKey)

        //saving created reservation data in the database
        await reservation.save();

        //sending response to the user
        res.send("reservation made successfully");

    } catch (error) {
        error.status = 500;
        // send catched error to error handler middleware
        next(error);
    }
}

// edit reservation by id function expression
const editReservation = async (req, res, next) => {

    // getting reservation id from request params for editing
    let res_id = req.params.id

    // getting authorization access token from request headers
    let { authorization } = req.headers
    try {

        // verify access token to make sure user have privilages
        await asyncVerifyUser(authorization, secretKey)

        // get reservation by id fetched from request params
        const reservation = await Reservation.updateOne(
            { _id: res_id },
            {
                $set: {
                    time:req.body.time
                }
            }
        )

        // throw error if there is no reservation found
        if (reservation.modifiedCount == 0) {
            throw new Error('reservation not found')
        }

        // send response to user
        res.send("data updated successfully");
    }
    catch (error) {
        error.status = 404;

        // send error to error handler middleware
        next(error);
    }

}

// delete reservation by id function expression
const deleteReservation = async (req, res, next) => {

    // getting reservation id from request params for delete
    let res_id = req.params.id

    // getting authorization access token from request headers
    let { authorization } = req.headers
    try {

        // verify access token to make sure user have privilages
        await asyncVerifyUser(authorization, secretKey)

        // delete reservation by id fetched from request params
        const result = await Reservation.deleteOne({ _id: res_id })

        // throw error if there is no reservation 
        if (result.deletedCount == 0) {
            throw new Error('no reservation found')
        }
        res.send(result)
    }
    catch (error) {
        error.status = 404;

        // send error to error handler middleware
        next(error)
    }
}

module.exports = {
    createReservation,
    editReservation,
    deleteReservation
}