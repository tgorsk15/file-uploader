const { Router } = require('express');
const fileRouter = Router();
const filesController = require("../controllers/filesController")
const path = require('path')

const multer = require('multer');
const maxFileSize = 13 * 1024 *1024 // 13MB

// import cloudinaryStorage:
const { cloudStorage } = require('../config/cloudinary')

//error handler for upload:
const handleUploadError = (err, req, res, next) => {
    console.log('running through error function', err)
    if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            console.log('wrong size')
            req.fileValidationError = 'File size is too large. Maximum size is 13MB.';
        } else if (err.code === 'INVALID_FILE_TYPE') {
            console.log('wront type')
            req.fileValidationError = err;
        } else {
            console.log('some other error')
            req.fileValidationError = 'An error occurred during file upload.';
        }
    }
    next();
};

function fileFilter(req, file, cb) {
    const allowedMimeTypes = [
        'image/png', 'image/jpeg', 'image/svg+xml',
        'video/mp4', 'audio/mpeg',
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
        const error = new Error(`Invalid file type: Excel, Word, PP, PDF, image, mp3 and mp4
            files are allowed`)
            console.log(error)
        error.code = 'INVALID_FILE_TYPE'
        cb(error, false)

    }
}


const upload = multer({
    storage: cloudStorage,
    limits: maxFileSize,
    fileFilter: fileFilter
})

// uploading
fileRouter.get('/upload/:folderId', filesController.uploadFileGet)
fileRouter.post('/upload/:folderId', upload.single('userFile'),
    handleUploadError, filesController.uploadFilePost)

// viewing
fileRouter.get('/view/:fileId', filesController.viewFileGet)


// deleting
fileRouter.get('/delete/:folderId/:fileId', filesController.deleteFile)

// download
fileRouter.get('/download/:fileId', filesController.downloadFileGet)






module.exports = fileRouter