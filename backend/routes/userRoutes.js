const express = require('express')
const router = express.Router()
const {
    createUser, 
    getallUser, 
    getUser,
    deleteUser
} = require('../controllers/userController')

//get all user
router.get('/', getallUser)

//get user
router.get('/:id', getUser)

//post a user
router.post('/', createUser)

//delete a user
router.delete('/:id', deleteUser)

module.exports = router