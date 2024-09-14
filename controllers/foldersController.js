const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const db = require('../db/folderQueries');
const { body, validationResult } = require("express-validator")


exports.createFolderGet = async (req, res) => {
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

    res.redirect(`/folder/library/${newFolderId}`)
}

exports.viewFolderGet = async (req, res) => {
    // get home folder contents for siedbar:
    const homeFolder = await db.findFolderByName('Home');
    const folderId = Number(req.params.folderId)
    const folder = await db.findFolderById(folderId)
    console.log('current folder:', folder)

    let parentFolder;
    // get parent folder:
    if (folder.parentId) {
        parentFolder = await db.findFolderById(folder.parentId)
    }
    

    res.render("library", {
        name: folder.name,
        homeFolder: homeFolder,
        homeChildren: homeFolder.children,
        currentFolder: folder,
        currentId: folderId,
        parentFolder: parentFolder
    })
}

exports.updateFolderGet = async (req, res) => {
    const folderId = Number(req.params.folderId);
    const folder = await db.findFolderById(folderId);
    console.log('to be updated:', folder)

    res.render("editFolder", {
        title: `Edit ${folder.name}`,
        folder: folder,
    })
}

exports.updateFolderPost = async (req, res) => {
    console.log('updated')
    // left off here... need to update folder in database,
    // then redirect to library view of folder
    // Next: need to work on delete
}
