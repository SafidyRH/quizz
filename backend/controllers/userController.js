require('dotenv').config()
const User = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '1h'})
}


//Register method
const register = async (pseudonyme, password) => {
    

    //validation
    if(!pseudonyme || !password) {
        throw Error('All fields must be filled')
    }


    //verify existance in db
    const exists = await User.findOne({ pseudonyme })
    if (exists) {
        throw Error('Pseudonyme already exists')
    }


    //hashing password
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await User.create({ pseudonyme, password: hash })

    return user
}

//Login method
const login = async (pseudonyme, password) => {

    //validation
    if(!pseudonyme || !password) {
        throw Error('All fields must be filled')
    }

    const user = await User.findOne({ pseudonyme })
    
    //verify existance in db
    if (!user) {
        throw Error('Incorrect pseudonyme')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        throw Error('Incorrect password')
    }

    return user
}



//register a user
const registerUser = async (req, res) => {
    
    const { pseudonyme, password } = req.body

    try {
        const user = await register(pseudonyme, password)

        //create a token
        const token = createToken(user._id)


        res.status(200).json({pseudonyme, token})
    } catch(error){
        res.status(400).json({error: error.message})
    }
    
}

//login a user
const loginUser = async (req, res) => {
    const { pseudonyme, password } = req.body

    try {

        const user = await login(pseudonyme, password)

        //create a token

        const token = createToken(user._id)

        res.status(200).json({pseudonyme, token})
    } catch(error) {
        res.status(400).json({error: error.message})
    }
}


module.exports = {
    loginUser,
    registerUser
}