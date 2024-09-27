const db = require('../db/userQueries')
const folderDb = require('../db/folderQueries');
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
    // homePage/homefolder will be the unique, and default version of a "library" view
    let homeFolder;
    let folderChildren;
    let folderFiles;
    if (req.user) {
        homeFolder = await folderDb.findFolderByNameAndOwner('Home', req.user.id) 
        if (!homeFolder) {
            const userId = req.user.id
            homeFolder = await folderDb.createHomeFolder(userId)
        }

    }
    
    if (homeFolder) {
        folderChildren = homeFolder.children
        folderFiles = homeFolder.files  
    }

    res.render("home", {
        title: 'Home',
        user: req.user,
        homeFolder: homeFolder,
        homeChildren: folderChildren,
        folderFiles: folderFiles
    })
}


exports.getUserSignUp = async (req, res) => {
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

            // check for repeat
            const users = await db.getAllUsers()
            const userExists = users.find(user => user.username === info.username)
            if (userExists) {
                return res.status(400).render("register", {
                    title: "Create Account",
                    repeatError: "This username already exists"
                })
            }
        

            if (!errors.isEmpty()) {
                return res.status(400).render("register", {
                    title: "Create Account",
                    errors: errors.array()
                })
            };

            bcrypt.hash(info.password, 10, async (err, hashedPassword) => {
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

exports.getLogOut = async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect("/")
    })
}