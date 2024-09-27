const express = require('express')
const usersController = require('../controllers/userController.js')
const router = express.Router()

router.get('/', usersController.loadUserHome)
router.get('/user_login', usersController.loadLogin)
router.get('/user_signup', usersController.loadSignup)
router.get('/verify_email', usersController.loadVerificationPage)
router.post('/verify_email', usersController.emailVerification)
router.post('/user_signup', usersController.signup)
// router.get('/user/user_signup', usersController.loadSignup)
// router.post('/user/user_signup', usersController.signup)
// router.get('/user/user_login', usersController.loadLogin)

module.exports = router