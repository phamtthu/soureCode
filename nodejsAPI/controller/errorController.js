module.exports =
    /**
     * @param {Error} err
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
        (err, req, res, next) => {
        console.log(err.stack)
        err.status = err.status || 'error'
        err.statusCode = err.statusCode || 500

        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        })
    }
// error handle middleware for entire application by express