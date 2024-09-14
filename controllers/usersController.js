const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const db = require('../db/userQueries')
const folderDb = require('../db/folderQueries');
const foldersController = require('./foldersController')
const bcrypt = require('bcryptjs')

const { body, validationResult } = require("express-validator")

const auth = require('../auth/auth')

const nameErr = "First and Last name both need to be between 2 and 20 characters"
const usernameErr = "Username must be between 5 and 25 characters"
const passwordErr = "Password must be at least 7 character long"

const validateUser = [
    body("firstName").trim()
        .isLength({ min: 2, max: 20 }).withMessage(nameErr),
    body("lastName").trim()
        .isLength({ min: 2, max: 20 }).withMessage(nameErr),
    body("username").trim()
        .isLength({ min: 5, max: 25}).withMessage(usernameErr),
    body("password").trim()
    .isLength({ min: 7 }).withMessage(passwordErr)
        .custom((value) => {
            const specialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
            if (!specialChar.test(value)){
                throw new Error("Password must include at least one special character")
            }
            return true
        })
]

exports.homePageGet = async (req, res) => {
    // have to potentially call a "getHomeFolder" function here...
    // this will pull in the initial Home folder, and if the Hoome folder
    // does not exist yet, "getHomeHolder" will take care of creating the home folder
    // ...so I will need to set up two sets of route handlers, 1 for creating
    // and posting a folder to the home folder, and 1 for creating and posting a folder
    // to a parent folder
    let homeFolder = await folderDb.findFolderByName('Home')
    const folderChildren = homeFolder.children
    console.log('before creation', homeFolder)
    if (!homeFolder) {
        const userId = req.user.id
        homeFolder = await folderDb.createHomeFolder(userId)
    }
    console.log('after creation:', homeFolder)
    console.log('here are home children:', homeFolder.children)
    // for deleting:
    // const folderId = homeFolder.id
    // console.log(folderId)
    // await folderDb.deleteFolderById(folderId)


    res.render("home", {
        title: 'Home',
        user: req.user,
        homeFolder: homeFolder,
        children: folderChildren
    })
}

exports.getUserSignUp = async (req, res) => {
    console.log('signing up')
    res.render("register", {
        title: 'Create Account'
    })
}

exports.postUserSignUp = [
    validateUser,
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            const info = req.body

            if (!errors.isEmpty()) {
                return res.status(400).render("register", {
                    title: "Create Account",
                    errors: errors.array()
                })
            };

            bcrypt.hash(info.password, 10, async (err, hashedPassword) => {
                console.log(hashedPassword)
                await db.insertUser(info, hashedPassword)
            })
            
            res.render("register", {
                title: 'Account Created',
                joined: true
            }) 


        } catch(err) {
            return next(err)
        }
        
    }
]


exports.getUserSignIn = async (req, res) => {

    res.render('login', {
        title: 'Sign In',
    })
}

exports.postUserSignIn = async (req, res, next) => {
    const user = req.body
    auth.authenticate(req, res, next)
}