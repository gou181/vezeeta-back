const User = require('./userModel');
const bcrypt = require('bcrypt')
const util = require('util')
const jwt = require('jsonwebtoken')
const saltRounds = 10;

//make jason web token functions async using util
const asyncLogInUser = util.promisify(jwt.sign);
const asyncVerifyUser = util.promisify(jwt.verify);

// define secret key for my token
const secretKey = 'mySecretKey'

// sign up function expression
const signUp = async (req, res, next) => {

    //define instance to store signed up user data in the database
    let user = new User(req.body);  
    try {
        // hashing password with 10 saltrounds
        user.password = await bcrypt.hash(user.password, saltRounds)

        //saving signed up user data in the database
        await user.save();

        //sending response to the user
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

        // find user in the database with logged in username
        const user = await User.findOne({ email: username });

        // throw error if there is no matched username
        if (!user) {
            throw new Error('invalid username or password');
        }

        // prepare founded user password and compare it to logged in password
        const { password: hashedPassword } = user;
        const checkPassword = await bcrypt.compare(password, hashedPassword);

        // throw error if passwords did'nt match
        if (!checkPassword) {
            throw new Error('invalid username or password')
        }

        //create token to authorized user for further authentication
        const token = await asyncLogInUser({
            id: user.id
        }, secretKey)

        //send response to the user
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

// find all users function expression
const findALLUsers = async (req, res, next) => {
    try {
        const users = await User.find({},{password:0});

        // throw error if there is no users
        if (!users) {
            res.send('no users found')
        }
        res.send(users)
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

        // verify access token to make sure user have privilages and get token payload
        const payload = await asyncVerifyUser(authorization, secretKey)

        // get user data by id stored and encodded in access token
        const user = await User.findById(payload.id,{password:0})

        // throw error if there is no user found
        if (!user) {
            throw new Error('no user found')
        }

        //send back response with user data
        res.send(user)
    }
    catch (error) {
        error.status = 404;

        // send error to error handler middleware
        next(error)
    }
}

// edit user by id function expression
const editUser = async (req, res, next) => {

    // getting authorization access token from request headers
    let { authorization } = req.headers
    try {

        // verify access token to make sure user have privilages and get token payload
        const payload = await asyncVerifyUser(authorization, secretKey)

        // get user by id stored and encodded in access token to update his info
        const user = await User.updateOne(
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

        // throw error if there is no user found
        if (user.modifiedCount == 0) {
            throw new Error('user not found')
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

// delete user by id function expression
const deleteUser = async (req, res, next) => {

    // getting user id from request params to delete him
    let user_id = req.params.id
    try {
        const result = await User.deleteOne({ _id: user_id })

        // throw error if there is no user 
        if (result.deletedCount == 0) {
            throw new Error('no user found')
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
    signUp,
    logIn,
    findALLUsers,
    getProfileInfo,
    editUser,
    deleteUser
}