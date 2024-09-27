const bcrypt = require('bcrypt')
const nodeMailer = require('nodemailer')
const usersCollection = require('../models/user-model.js')
require('dotenv').config()

//temporary storage of otp
// let otpForValidation = {}

function generateOTP(){
    let otp = ""
    for(let i = 1; i <= 6; i++){
        let singleValue = Math.floor(Math.random() * 10)
        otp += singleValue
    }  
    return otp
}

async function sendEmail(email, otp){
    try {
        let transporter = nodeMailer.createTransport({
            service:'gmail',
            host:'smtp.gmail.com',
            port:465,
            secure:true,
            secureConnection:false,
            auth:{
                user: process.env.USER_EMAIL, 
                pass: process.env.USER_PASS
            },
            tls:{
                rejectUnauthorized:true
            }
        })

        let info = await transporter.sendMail({
            from:'officialpess94@gmail.com',
            to:email,   
            subject:'This is the otp for your email verification',
            text:`OTP for verification ${otp}`
        })
        
        // otpForValidation[email] = otp
        console.log(`OTP sent to ${email} || message id ${info.messageId}`)
        // console.log(otpForValidation)
    } catch (error) {
        console.log(error.message)
    }
    
}


const loadUserHome = (req, res) => {
    res.render('landingPage')
}

const loadSignup = (req, res) => {
    res.render('signup')
}

const signup = async (req, res) => {
        const {user_name, user_email, user_phone, user_password} = req.body
        const otp = generateOTP()
        await sendEmail(user_email, otp)
        const otpTimestamp = new Date()
        req.session.tempUserData = {user_name, user_email, user_phone, user_password, otp}
        console.log(req.session.tempUserData)
        res.redirect(`/verify_email?user_email=${encodeURIComponent(user_email)}`)
}

const loadLogin = (req, res) => {
    res.render('login')
}

const loadVerificationPage = (req, res) => {
    res.render('email_verify')
}

const emailVerification = async (req, res) => {
    const {otp} = req.body
    const tempUser = req.session.tempUserData
    console.log(tempUser)
    if(otp === tempUser.otp){
        console.log('OTP verifed successfully!')
        // res.send('Email verified')
        const hashedPassword = await bcrypt.hash(tempUser.user_password, 10)
        const userData = {
            name:tempUser.user_name,
            email:tempUser.user_email,
            phone:tempUser.user_phone,
            password:hashedPassword
        }
        
        try {
            await usersCollection.insertMany(userData)
        } catch (error) {
            console.log(error.message)
        }
        req.session.tempUserData = null
        res.redirect('/')
    }else{
        res.render('email_verify', {message:'Invalid OTP, please retry'})
    }
}

module.exports = {
    loadUserHome,
    loadSignup,
    signup,
    loadLogin,
    // requestOtp,
    emailVerification,
    loadVerificationPage
}