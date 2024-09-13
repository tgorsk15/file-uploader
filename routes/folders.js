const { Router } = require('express');
const folderRouter = Router();
const foldersController = require('../controllers/foldersController')

folderRouter.get("/create", foldersController.createFolderGet)
folderRouter.post("/create", foldersController.createFolderPost)

module.exports = folderRouter