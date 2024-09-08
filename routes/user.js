const { Router } = require('express');
const userRouter = Router();
const usersController = require('../controllers/usersController')

userRouter.get("/signUp", usersController.getUserSignUp)
userRouter.get("/signIn", usersController.getUserSignIn)

module.exports = userRouter