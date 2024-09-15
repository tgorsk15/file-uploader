const { Router } = require('express');
const fileRouter = Router();
const filesController = require("../controllers/filesController")

fileRouter.get('/upload/:folderId', filesController.uploadFileGet)

module.exports = fileRouter