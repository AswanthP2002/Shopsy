const bcrypt = require('bcrypt')
const usersCollection = require('../models/user-model.js')

const loadUserHome = (req, res) => {
    res.render('landingPage')
}

const loadSignup = (req, res) => {
    res.render('signup')
}

const signup = async (req, res) => {
    console.log(req.body)
    const data = {
        name:req.body.user_name,
        email:req.body.user_email,
        phone:req.body.user_phone,
        password:req.body.user_password
    }
    const hashedPassword = await bcrypt.hash(data.password,10)
    data.password = hashedPassword

    const userData = await usersCollection.insertMany(data)
    console.log(userData)
    res.send('Data sent successfully')
}
module.exports = {
    loadUserHome,
    loadSignup,
    signup
}