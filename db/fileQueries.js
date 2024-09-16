const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

async function createNewFile(name, parentId) {
    console.log('file info:', name, parentId)
    const file = await prisma.file.create({
        data: {
            name: name,
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


module.exports = {
    createNewFile,
    linkFileToFolder
}