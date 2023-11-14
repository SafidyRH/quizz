const User = require('../models/userModel')
const mongoose = require('mongoose')

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
//create new user
const createUser = async (req, res) => {
    const {pseudonime, password} = req.body
    
    //add doc to db
    try {
        const user = await User.create({pseudonime, password})
        res.status(200).json(user)
    } catch(error){
        res.status(400).json({error: error.message})
    }
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