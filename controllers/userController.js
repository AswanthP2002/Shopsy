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

async function resendOTP(req, res) {
    const user = req.query.user
    const otp = generateOTP()
    await sendEmail(user, otp)
    req.session.tempUserData.otp = otp
    req.session.tempUserData.otpSentTimeStamp = new Date()
    res.render('email_verify',{user})
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
        req.session.tempUserData = {user_name, user_email, user_phone, user_password, otp}
        req.session.tempUserData.otpSentTimeStamp = new Date()
        console.log(req.session.tempUserData)
        res.redirect(`/verify_email?user_email=${encodeURIComponent(user_email)}`)
}

const loadLogin = (req, res) => {
    res.render('login')
}

const loadVerificationPage = (req, res) => {
    const user = req.session.tempUserData.user_email
    res.render('email_verify', {user})
}

const emailVerification = async (req, res) => {
    const {otp} = req.body
    const otpSubmissionTimeStamp = new Date()
    const tempUser = req.session.tempUserData
    const {user_email} = tempUser
    // console.log(typeof otpSentTimeStamp)
    const otpSentTimeStamp = new Date(tempUser.otpSentTimeStamp)
    const difference = (otpSubmissionTimeStamp.getTime() - otpSentTimeStamp.getTime()) / 1000
    console.log(difference)
    if(difference > 30){
        res.render('email_verify', {user:user_email, message:'OTP has expired'})
    }else{
        if(otp === tempUser.otp){
        console.log('OTP verifed successfully!')
        // res.send('Email verified')
        const hashedPassword = await bcrypt.hash(tempUser.user_password, 10)
        const userData = {
            name:tempUser.user_name,
            email:tempUser.user_email,
            phone:tempUser.user_phone,
            password:hashedPassword,
            status:true,
            createdAt: new Date()
        }
        
        try {
            await usersCollection.insertMany(userData)
        } catch (error) {
            console.log(error.message)
        }
        req.session.tempUserData = null
        res.redirect('/')
        }else{
        res.render('email_verify', {user:user_email, message:'Invalid OTP, please retry'})
        }
    }
}

module.exports = {
    loadUserHome,
    loadSignup,
    signup,
    loadLogin,
    resendOTP,
    emailVerification,
    loadVerificationPage
}