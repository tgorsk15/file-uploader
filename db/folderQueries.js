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

async function createNewFolder(userId, parentId, folderName) {
    console.log('here is the folder:', userId, parentId, folderName)
    const folder = await prisma.folder.create({
        data: {
            name: folderName,
            user: {
                connect: {
                    id: userId
                }
            },
            parent: {
                connect: {
                    id: parentId
                }
            }
        }
    })
    return folder
}

async function addFolderChildren(parentId, childFolderId) {
    const addChild = await prisma.folder.update({
        where: {
            id: parentId
        },
        data: {
            children: {
                connect: {
                    id: childFolderId
                }
            }
        },
        include: {
            children: true
        }
    })
    return addChild
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
    addFolderChildren,
    findFolderByName,
    deleteFolderById
}