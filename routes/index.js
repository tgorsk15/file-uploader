const { Router } = require('express');
const indexRouter = Router();
const usersController = require('../controllers/usersController')

indexRouter.get("/", usersController.homePageGet)

module.exports = indexRouter