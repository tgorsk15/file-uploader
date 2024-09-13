const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

async function findUserByUsername(username) {
    console.log('in function', username)
    const users = await prisma.user.findMany();
    console.log(users)
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        }
    })
    console.log('here is user:', user)
    return user
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
    console.log('user created')
    // console.log('we are here', userInfo)
}



module.exports = {
    findUserByUsername,
    getUserById,
    insertUser
}