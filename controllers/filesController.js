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
    console.log('uploaded file:', req.file)

    // will handle the logic of pushing the file to the
    // correct folder/user, while also adding the entries
    // to the DB
}