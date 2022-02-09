// handle all request errors middleware
const errorHandler = (err, req, res, next) => {
    res.send({
        status: err.status,
        message: err.message,
        errors: err.errors || []
    });
}

module.exports = {
    errorHandler
}