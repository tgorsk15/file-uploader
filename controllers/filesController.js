const { response } = require('express');
const db = require('../db/fileQueries');
const folderDb = require('../db/folderQueries')
// const cloudinary = require('cloudinary').v2
const axios = require('axios')
const path = require('path')

// testing download:
// const path = require('path')
// const rootDir = path.resolve(__dirname, '..');
// const imageDir = path.join(rootDir, 'public', 'img');
// const imageDir = path.join(__dirname, '..', '..', 'pic.jpg');

exports.uploadFileGet = async (req, res) => {
    const homeFolder = await folderDb.findFolderByName('Home');
    const parentFolderId = req.params.folderId

    console.log('uploading file')

    res.render("upload", {
        title: 'Upload',
        homeFolder: homeFolder,
        homeChildren: homeFolder.children,
        parentId: parentFolderId
    })
}

exports.uploadFilePost = async (req, res) => {
    const parentFolderId = Number(req.params.folderId)
    // insert into DB:
    const newFile = await db.createNewFile(req.file, parentFolderId)
    console.log('here is new file', newFile)

    // add file to parent folder's children:
    const updateParent = await db.linkFileToFolder(newFile.id, parentFolderId)

    res.redirect(`/folder/library/${parentFolderId}`)
}

exports.viewFileGet = async (req, res) => {
    const homeFolder = await folderDb.findFolderByName('Home');

    const fileId = Number(req.params.fileId)
    const file = await db.findFileById(fileId)
    fileName = file.name
    console.log('viewing file', file)


    res.render("file", {
        title: file.name,
        fileName: fileName,
        file: file,
        homeFolder: homeFolder,
        homeChildren: homeFolder.children
    })
}


exports.deleteFile = async (req, res) => {
    const folderId = Number(req.params.folderId)
    const fileId = Number(req.params.fileId)
    console.log(folderId, fileId)

    await db.deleteFileById(fileId)

    res.redirect(`/folder/library/${folderId}`)
}


exports.downloadFileGet = async (req, res, next) => {
    try { 
        const fileId = Number(req.params.fileId)
        const currentFile = await db.findFileById(fileId)
        console.log(currentFile)

        // retrieve file from Cloudinary:
        const response = await axios({
            method: 'get',
            url: currentFile.path,
            responseType: 'stream'
        })

        console.log('response context', response.headers)

        const parsedURL= new URL(currentFile.path);
        const fileExt = path.extname(parsedURL.pathname)

        const fullFileName = currentFile.name + fileExt;

        // use setHeader to suggest download of file
        res.setHeader('Content-Disposition', `attachment; filename="${fullFileName}"`)
        res.setHeader('Content-Type', response.headers['content-type'])

        console.log('downloading')
        response.data.pipe(res)
        

        // res.redirect(`/file/view/${fileId}`)
    } catch (err) {
        next(new Error("Error downloading the file:" + err.message))
        res.redirect(`/file/view/${fileId}`)
    }
}


