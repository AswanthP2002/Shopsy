const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    status:{
        type:Boolean,
        required:true
    },
    createdAt:{
        type:Date,
        required:true
    }
})

const usersCollection = new mongoose.model('user',usersSchema,'users')

module.exports = usersCollection