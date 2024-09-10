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
    console.log('user created')
    // console.log('we are here', userInfo)
}



module.exports = {
    findUserByUsername,
    getUserById,
    insertUser
}