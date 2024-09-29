const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController.js')

router.get('/admin_panel', adminController.loadAdminDashboard)
router.get('/admin_panel/customers', adminController.loadAdminCustomers)
router.post('/admin_panel/customers', adminController.actionOnUser)

module.exports = router