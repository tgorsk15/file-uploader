const { Router } = require('express');
const folderRouter = Router();
const foldersController = require('../controllers/foldersController')

folderRouter.get("/create/:folderId", foldersController.createFolderGet)
folderRouter.post("/create/:folderId", foldersController.createFolderPost)

// viewing folders
folderRouter.get("/library/:folderId", foldersController.viewFolderGet)

// edit folder
folderRouter.get("/edit/:folderId", foldersController.updateFolderGet)
folderRouter.post("/edit/:folderId", foldersController.updateFolderPost)

// delete folder
folderRouter.get("/delete/:folderId", foldersController.deleteFolderGet)
// left off here, set up router and function, change schema

module.exports = folderRouter