const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

async function findUserByUsername(username) {
    // const users = await prisma.user.findMany();
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        }
    })
    // console.log('here is user:', user)
    return user
}

async function getAllUsers() {
    const users = await prisma.user.findMany();
    return users
}

async function getUserById(id) {
    const user = await prisma.user.findUnique({
        where: {
            id: id
        }
    })
    return user
}

async function insertUser(info, hashedPassword) {
    const user = await prisma.user.create({
        data: {
            email: info.email,
            firstName: info.firstName,
            lastName: info.lastName,
            username: info.username,
            password: hashedPassword,
        }
    })
}



module.exports = {
    findUserByUsername,
    getAllUsers,
    getUserById,
    insertUser
}