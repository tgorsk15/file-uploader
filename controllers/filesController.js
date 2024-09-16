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
    const newFile = await db.createNewFile(req.file.filename, parentFolderId)
    console.log('here is new file', newFile)
    // add file to parent folder's children:
    const updateParent = await db.linkFileToFolder(newFile.id, parentFolderId)
    console.log('folder after upload', updateParent)

    // left off here:
    // will handle the logic of pushing the file to the
    // correct folder/user, while also adding the entries
    // to the DB

    // redirect to home.ejs at the end to show new file
    res.redirect(`/folder/library/${parentFolderId}`)
}

exports.deleteFile = async (req, res) => {
    // work on this next
}