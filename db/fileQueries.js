const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

async function findFileById(fileId) {
    const file = await prisma.file.findUnique({
        where: {
            id: fileId
        }
    })
    return file
}

async function createNewFile(newFile, parentId) {
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
    findFileById,
    createNewFile,
    linkFileToFolder,
    deleteFileById,
}