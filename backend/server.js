require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')

const app = express()

app.use(express.json())

app.use((req, res, next) => {
    next()
})

//routes
app.use('/api/', userRoutes)

//connect to db
mongoose.connect(process.env.MONG_URI)
    .then(() => {
        //listen to req
        app.listen(process.env.PORT, () => {
            console.log('LISTENING ON PORT', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    })