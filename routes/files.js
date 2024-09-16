const { Router } = require('express');
const fileRouter = Router();
const filesController = require("../controllers/filesController")
const path = require('path')

const multer = require('multer');
const maxFileSize = 13 * 1024 *1024 // 13MB

const rootDir = path.resolve(__dirname, '..');
const uploadDir = path.join(rootDir, 'public', 'uploads');

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        // cb(null, path.join(__dirname, 'public', 'uploads'))
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})



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
    storage: fileStorage,
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


module.exports = fileRouter