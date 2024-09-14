const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const db = require('../db/folderQueries');
const { body, validationResult } = require("express-validator")


exports.createFolderGet = async (req, res) => {
    // maybe make this a separate function that only creates folders
    // that are coming from the Home directory?
    // this way I can pass in the root id
    const parentFolderId = req.params.folderId
    console.log('parentId', parentFolderId)
    res.render("newFolder", {
        title: 'Create Folder',
        parentId: parentFolderId
    })
    
}

exports.createFolderPost = async (req, res) => {
    const userId = req.user.id;
    const parentString = req.params.folderId
    const parentId = Number(parentString)
    console.log(parentId)

    // create new folder
    const newFolder = await db.createNewFolder(userId, parentId, req.body.folderName)


    // add to parent folder's children:
    const newFolderId = newFolder.id
    const updateParent = await db.addFolderChildren(parentId, newFolderId)

    // redirect to folder library view, which uses
    // the folderId to identify the specific folder

    // res.redirect("/folder/library/:folderId")
}

// idea for connecting folders to one another:
// On click of a folder on sidebar, user gets redirected to a route that
// containsthe folder's id in the PARAMS (or whatever it is)
// ... then in that specific folder's view, there can be a button in top
// right for "add subfolder". Clicking this will create a new folder where
// the parent folder is the same id as the folder the user is currently in