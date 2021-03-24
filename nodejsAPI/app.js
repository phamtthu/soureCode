const express = require('express');

const tourRouter = require('./routes/tourRouters.js')
const userRouter = require('./routes/userRouters.js')
const AppError = require('./utils/appError.js')
const globalErrorHandler = require('./controller/errorController.js')

const morgan = require('morgan')

const app = express();

// 1. MIDDLEWARE----------------
app.use(express.json())
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
app.use(express.static('public')) // middleware function to server static file (url: localhost:3000/overview.html)
app.use((req, res, next) => {
    console.log(`Middleware`)
    next()
})
app.use((req, res, next) => {
    // add requestTime property to req Object
    req.requestTime = new Date().toISOString()
    next()
})

// 3. ROUTES----------------
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)
// app.route('/').get(function())
app.all('*', (req, res, next) => {  // apply for all unhandle http method
    // res.status(404).json({
    //     status: 'fail',
    //     message: `Can't find ${req.originalUrl} on the server`
    // })
    // const err = new Error(`Can't find ${req.originalUrl} on the server`)
    // err.status = 'fail'
    // err.statusCode = 404
    const err = new AppError(`Can\'t find ${req.originalUrl} on the server`, 404)
    console.log(err.message)
    next(err) // jump into main error handle middleware function
})


app.use(globalErrorHandler)

module.exports = app
