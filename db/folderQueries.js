const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

async function createHomeFolder(userId) {
    console.log(userId)
    const homeFolder = await prisma.folder.create({
        data: {
            name: 'Home',
            user: {
                connect: {
                    id: userId
                }
            },
            // parent: null
        }
    })
    return homeFolder
}

async function createNewFolder(userId, folderName) {
    const folder = await prisma.folder.create({
        data: {
            name: folderName,
            user: userId,
            // need to come back to this:
            // parent: ?
        }
    })
}

async function findFolderByName(folderName) {
    const folder = await prisma.folder.findUnique({
        where: {
            name: folderName
        }
    })
    return folder
}

async function deleteFolderById(folderId) {
    const deletedFolder = await prisma.folder.delete({
        where: {
            id: folderId
        }
    });
}

module.exports = {
    createHomeFolder,
    createNewFolder,
    findFolderByName,
    deleteFolderById
}