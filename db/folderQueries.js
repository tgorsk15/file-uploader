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

async function changeFolderName(folderId, newName) {
    const changeName = await prisma.folder.update({
        where: {
            id: folderId
        },
        data: {
            name: newName 
        }
    })
}

async function findFolderByNameAndOwner(folderName, userId) {
    const folder = await prisma.folder.findFirst({
        where: {
            AND: [
                { name: folderName },
                { ownerId: userId }
            ]
        },
        include: {
            children: true,
            files: true
        }
    })
    return folder
}

async function findFolderById(folderId) {
    const folder = await prisma.folder.findUnique({
        where: {
            id: folderId
        },
        include: {
            children: true,
            files: true
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

// unneccessary, but will keep for reference and practice
async function removeFolderChildren(parentId, childId) {
    const removeChild = await prisma.folder.update({
        where: {
            id: parentId
        },
        data: {
            children: {
                disconnect: {
                    id: childId
                }
            }
        },
        include: {
            children: true
        }
    })
    return removeChild
}

module.exports = {
    createHomeFolder,
    createNewFolder,
    addFolderChildren,
    changeFolderName,
    findFolderByNameAndOwner,
    findFolderById,
    deleteFolderById,
    removeFolderChildren
}