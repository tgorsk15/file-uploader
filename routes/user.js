const { Router } = require('express');
const userRouter = Router();
const usersController = require('../controllers/usersController')

userRouter.get("/signUp", usersController.getUserSignUp)
userRouter.post("/signUp", usersController.postUserSignUp)

userRouter.get("/signIn", usersController.getUserSignIn)
userRouter.post("/signIn", usersController.postUserSignIn)

module.exports = userRouter