const db = require('../db/fileQueries');
const folderDb = require('../db/folderQueries')

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


exports.downloadFileGet = async (req, res) => {
    
}

