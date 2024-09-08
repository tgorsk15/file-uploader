const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


exports.homePageGet = async (req, res) => {
    console.log('here is home')
    res.render("home", {

    })
}