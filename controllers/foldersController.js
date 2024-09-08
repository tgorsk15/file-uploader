const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient();


exports.homePageGet = async (req, res) => {
    console.log('here is home')
    console.log(req)
    console.log(req.body)
    console.log(req.user)
    res.render("home", {
        // need to pass in req.user here to show proper
        // home screen
        // ...waiting on rest of passport to be set up
    })
}