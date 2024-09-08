const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

async function findUserByUsername(username) {
    const user = await prisma.user.findFirst({
        where: {
            username: username,
        }
    })
    console.log(user)
}

async function getUserById(id) {
    const user = await prisma.user.findFirst({
        where: {
            id: id
        }
    })
    console.log(user)
}

module.exports = {
    findUserByUsername,
    getUserById
}