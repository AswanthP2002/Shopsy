const express = require('express')
const usersController = require('../controllers/userController.js')
const router = express.Router()

router.get('/', usersController.loadUserHome)
router.get('/user/user_signup', usersController.loadSignup)
router.post('/user/user_signup', usersController.signup)

module.exports = router