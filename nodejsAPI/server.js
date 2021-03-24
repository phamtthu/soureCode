const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config({path: './config.env'})
const app = require('./app.js')

const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)
mongoose.connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then(conn => {
  //  console.log(conn.connection)
    console.log('DB connection successful')
})

//console.log(process.env)

console.log(app.get('env')) // return process.env.NODE_ENV
// 4. START SERVER----------------
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});
