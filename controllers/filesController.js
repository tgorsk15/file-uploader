const { response } = require('express');
const db = require('../db/fileQueries');
const folderDb = require('../db/folderQueries')
const axios = require('axios')
const path = require('path')


exports.uploadFileGet = async (req, res) => {
    const homeFolder = await folderDb.findFolderByNameAndOwner('Home', req.user.id);
    const parentFolderId = req.params.folderId

    res.render("upload", {
        title: 'Upload',
        homeFolder: homeFolder,
        homeChildren: homeFolder.children,
        parentId: parentFolderId
    })
}

exports.uploadFilePost = async (req, res) => {
    const fileName = req.body.fileName
    const parentFolderId = Number(req.params.folderId)
    const homeFolder = await folderDb.findFolderByNameAndOwner('Home', req.user.id);

    try {
        if (req.fileValidationError) {
            return res.status(400).render('upload', {
                title: 'Upload',
                homeFolder: homeFolder,
                homeChildren: homeFolder.children,
                parentId: parentFolderId,
                errMsg: req.fileValidationError
            });
        }
        // insert into DB:
        const newFile = await db.createNewFile(req.file, parentFolderId, fileName)
        console.log('here is new file', newFile)

        // add file to parent folder's children:
        const updateParent = await db.linkFileToFolder(newFile.id, parentFolderId)

        res.redirect(`/folder/library/${parentFolderId}`)


    } catch(err) {
        console.error('Error in uploadFilePost:', err);
        res.status(500).render('upload', {
            title: 'Upload',
            homeFolder: homeFolder,
            homeChildren: homeFolder.children,
            parentId: parentFolderId,
            errMsg: err
        });
    }

}

exports.viewFileGet = async (req, res) => {
    const homeFolder = await folderDb.findFolderByNameAndOwner('Home', req.user.id);

    const fileId = Number(req.params.fileId)
    const file = await db.findFileById(fileId)
    fileName = file.name
    const parentId = file.folderId

    res.render("file", {
        title: file.name,
        fileName: fileName,
        file: file,
        homeFolder: homeFolder,
        homeChildren: homeFolder.children,
        parentId: parentId
    })
}


exports.deleteFile = async (req, res) => {
    const folderId = Number(req.params.folderId)
    const fileId = Number(req.params.fileId)

    await db.deleteFileById(fileId)

    res.redirect(`/folder/library/${folderId}`)
}


// seemingly not able to download pdfs due to a Cloudinary issue
exports.downloadFileGet = async (req, res, next) => {
    const fileId = Number(req.params.fileId)
    try { 
        const currentFile = await db.findFileById(fileId)
        console.log('here is current', currentFile)

        // retrieve file from Cloudinary:
        const response = await axios({
            method: 'get',
            url: currentFile.path,
            responseType: 'stream'
        })

        const parsedURL= new URL(currentFile.path);
        const fileExt = path.extname(parsedURL.pathname)

        const fullFileName = currentFile.name + fileExt;

        // use setHeader to suggest download of file
        res.setHeader('Content-Disposition', `attachment; filename="${fullFileName}"`)
        res.setHeader('Content-Type', response.headers['content-type'])

        response.data.pipe(res)

    } catch (err) {
        console.log(err)
        next(new Error("Error downloading the file:" + err.message))
        res.redirect(`/file/view/${fileId}`)
    }
}


