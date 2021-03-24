const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Tour = require('./../../models/tourModel.js')

dotenv.config({path: './../../config.env'})


const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB,  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(conn => {
    //console.log(conn.connection)
    console.log('DB connection successful')
})

// READ DATA FROM JSON FILE
const tourJSON = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
const tours = JSON.parse(tourJSON)

// IMPORT DATA TO DB
const importData = async () => {
    try {
        await Tour.create(tours)
    } catch (err) {
        console.log(err)
    }
}

// DELETE ALL DATA FROM DB
const deleteData = async () => {
    try {
        await Tour.deleteMany()
    } catch (err) {
        console.log(err)
    }
}
deleteData().then(() => importData())
