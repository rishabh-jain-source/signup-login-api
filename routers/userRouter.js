const express = require('express')
const userRoute = express.Router()
const userController = require('../controllers/user')

userRoute.get("/user", userController.user)

module.exports = { userRoute }