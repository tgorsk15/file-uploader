const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const db = require('../db/userQueries')
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
    console.log('here is home')
    console.log(req.user)
    res.render("home", {
        // need to pass in req.user here to show proper
        // home screen
        // ...waiting on rest of passport to be set up
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
            console.log(req.body)
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

            // TMW 9/10:
            // continue to develop login form... see if user authentication
            // is working, try logging in...


        } catch(err) {
            return next(err)
        }
        
    }
]


exports.getUserSignIn = async (req, res) => {
    console.log(req.user)
    console.log('signing in')

    res.render('login', {
        title: 'Sign In',
    })
}

exports.postUserSignIn = async (req, res, next) => {
    const user = req.body
    // console.log(user)
    auth.authenticate(req, res, next)
}