const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

async function createNewFile(newFile, parentId) {
    console.log('file info:', newFile, parentId)
    const file = await prisma.file.create({
        data: {
            name: newFile.filename,
            size: newFile.size,
            mimetype: newFile.mimetype,
            folder: {
                connect: {
                    id: parentId
                }
            }
        }
    })
    return file
}

async function linkFileToFolder(fileId, parentId) {
    const addFile = await prisma.folder.update({
        where: {
            id: parentId
        },
        data: {
            files: {
                connect: {
                    id: fileId
                }
            }
        },
        include: {
            files: true
        }
    })
    return addFile
}

async function deleteFileById(fileId) {
    const removedFile = await prisma.file.delete({
        where: {
            id: fileId
        }
    })
}


module.exports = {
    createNewFile,
    linkFileToFolder,
    deleteFileById,
}