const express = require('express')
const hbs = require('hbs')
const db = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')
// const bcrypt = require('bcrypt')
const userRouter = require('./routes/users.js')
const PORT = 5000

const app = express()

app.set('view engine', 'hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.json())
app.use(session({
    secret:'mXplo454ra',
    resave:false,
    saveUninitialized:false,
    cookie:{
        httpOnly:true,
        sameSite:'strict'
    }
}))

app.use('/', userRouter)

db.connect('mongodb://127.0.0.1:27017/shopsy')
    .then(() => {
        console.log('Database connected successfully')
    })
    .catch((err) => {
        console.log('Error while connecting the database')
    })

app.listen(PORT || 5000, (err) => {
    if(!err){
        console.log(`Server connected to port ${PORT}`)
    }
})