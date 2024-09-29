const usersCollection = require('../models/user-model.js')


const loadAdminDashboard = async (req, res) => {
    res.render('admin_dashboard')
}
const loadAdminCustomers = async (req, res) => {
    const users = await usersCollection.find()
    console.log(users)
    res.render('admin_users', {users})
}
const actionOnUser = async (req, res) => {
    const {user_email, user_status} = req.body
    await usersCollection.updateOne({email:user_email},{$set:{status:user_status}}).catch((err) => console.error(err.message))
    res.redirect('/admin_panel/customers')
}


module.exports = {
    loadAdminDashboard,
    loadAdminCustomers,
    actionOnUser
}