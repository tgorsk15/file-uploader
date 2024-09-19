const { Router } = require('express');
const fileRouter = Router();
const filesController = require("../controllers/filesController")
const path = require('path')

const multer = require('multer');
const maxFileSize = 13 * 1024 *1024 // 13MB

// import cloudinaryStorage:
const { cloudStorage } = require('../config/cloudinary')


function fileFilter(req, file, cb) {
    const allowedMimeTypes = [
        'image/png', 'image/jpeg', 'image/svg+xml',
        'video/mp4', 'audio/mp3',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel',  // .xls
        'application/msword',  // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.ms-powerpoint', // .ppt
        'application/pdf'  // pdf
    ]

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error(`Invalid file type: Excel, Word, PP, PDF, image, mp3 and mp4
            files are allowed`))
    }
}


const upload = multer({
    storage: cloudStorage,
    limits: maxFileSize,
    fileFilter: fileFilter
})

// uploading
fileRouter.get('/upload/:folderId', filesController.uploadFileGet)
fileRouter.post('/upload/:folderId', upload.single('userFile'), filesController.uploadFilePost)

// viewing
fileRouter.get('/view/:fileId', filesController.viewFileGet)


// deleting
fileRouter.get('/delete/:folderId/:fileId', filesController.deleteFile)

// download
fileRouter.get('/download/:fileId', filesController.downloadFileGet)

module.exports = fileRouter