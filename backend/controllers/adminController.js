const User = require('../models/userModel')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


const createToken = (_id) => {
    return jwt.sign({_id}, process.env.SECRET, {expiresIn: '1h'})
}


//Add a user method
const addUser = async (pseudonyme, password) => {
    

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

//create new user
const createUser = async (req, res) => {
    const {pseudonyme, password} = req.body
    
    //add doc to db
    try {
        const user = await addUser(pseudonyme, password)

        //create a token
        const token = createToken(user._id)

        res.status(200).json({user, token})
    } catch(error){
        res.status(400).json({error: error.message})
    }
}

//get all user
const getallUser = async(req, res) => {
    const allUser = await User.find({}).sort({createdAt: -1})
    res.status(200).json(allUser)
}

//get a user
const getUser = async(req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such user'})
    }
    const user = await User.findById(id)

    if (!user) {
        return res.status(404).json({error: 'No such user'})
    }

    res.status(200).json(user)
}

//delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params
    
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({error: 'No such user'})
    }

    const user = await User.findOneAndDelete({_id: id})
    if (!user) {
        return res.status(404).json({error: 'No such user'})
    }

    res.status(200).json(user)
}

module.exports = {
    getallUser,
    getUser,
    createUser,
    deleteUser
}