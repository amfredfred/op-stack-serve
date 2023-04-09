const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const app = express()
app.use(express.json())


app.use('/auth', require('./Routes/Authenticate'))
app.use('/posts', require('./Routes/Posts'))
app.use('/post', require('./Routes/Posts'))



mongoose.connect(process.env.DB_URL)
const DB = mongoose.connection
DB.on('error', error => console.log('DB |:| Connection Errored!'))
DB.once('open', opened => console.log(`DB |:| Connected Successfully! ${process.env.DB_URL}`))


app.listen(3000)