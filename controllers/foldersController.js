const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const db = require('../db/folderQueries');
const { body, validationResult } = require("express-validator")


exports.createFolderGet = async (req, res) => {
    const homeFolder = await db.findFolderByName('Home');
    const parentFolderId = req.params.folderId
    console.log('parentId', parentFolderId)
    res.render("newFolder", {
        title: 'Create Folder',
        homeFolder: homeFolder,
        parentId: parentFolderId
    })
    
}

exports.createFolderPost = async (req, res) => {
    const userId = req.user.id;
    const parentString = req.params.folderId
    const parentId = Number(parentString)

    // create new folder
    const newFolder = await db.createNewFolder(userId, parentId, req.body.folderName)

    // add to parent folder's children:
    const newFolderId = newFolder.id
    const updateParent = await db.addFolderChildren(parentId, newFolderId)

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

    res.render("editFolder", {
        title: `Edit ${folder.name}`,
        folder: folder,
    })
}

exports.updateFolderPost = async (req, res) => {
    const folderId = Number(req.params.folderId)
    const newName = req.body.updatedName
    
    await db.changeFolderName(folderId, newName)

    res.redirect(`/folder/library/${folderId}`)
}

exports.deleteFolderGet = async (req, res) => {
    const folderId = Number(req.params.folderId)
    const folder = await db.findFolderById(folderId);
    const parentId = folder.parentId

    const updatedParent = await db.removeFolderChildren(parentId, folderId)
    console.log('updatedParent:', updatedParent)
    await db.deleteFolderById(folderId)

    res.redirect(`/folder/library/${parentId}`)
}
