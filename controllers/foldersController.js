const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const { body, validationResult } = require("express-validator")


// exports.homePageGet = async (req, res) => {
//     console.log('here is home')
//     console.log(req)
//     console.log(req.body)
//     console.log(req.user)
//     res.render("home", {

//     })
// }