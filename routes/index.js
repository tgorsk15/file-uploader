const { Router } = require('express');
const indexRouter = Router();
const foldersController = require('../controllers/foldersController')

indexRouter.get("/", foldersController.homePageGet)

module.exports = indexRouter