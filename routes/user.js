const { Router } = require('express');
const userRouter = Router();
const usersController = require('../controllers/usersController')

userRouter.get("/signUp", usersController.getUserSignUp)
userRouter.post("/signUp", usersController.postUserSignUp)

// login
userRouter.get("/signIn", usersController.getUserSignIn)
userRouter.post("/signIn", usersController.postUserSignIn)

// logout
userRouter.get("/logOut", usersController.getLogOut)

module.exports = userRouter