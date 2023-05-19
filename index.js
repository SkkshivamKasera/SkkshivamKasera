const express = require('express')
const mongoose = require('mongoose')
const {body,  validationResult} = require('express-validator')

mongoose.connect('mongodb://localhost:27017/demo')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model('users', userSchema)

const app = express()

app.use(express.json())

app.get('/', [
    body('email').isEmail(),
    body('password').isLength({min: 5})
] ,async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success: false, error: errors.array()})
    }
    const {email, password} = req.body
    const user = await User.findOne({email, password})
    if(!user){
        res.json({success: false, error: errors.array()})
    }
    res.json({success: true})
})


app.listen(5000)