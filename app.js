const express = require('express');
const app = express();
const path = require('path')
const session = require('express-session');
const passport = require('passport')
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient()
require('dotenv').config();

// maybe need to add this???:
require('./auth/passport')

// import routers here
const indexRouter = require('./routes/index')
const userRouter = require('./routes/user')
const folderRouter = require('./routes/folders')


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))

const sessionStore = new PrismaSessionStore(
    prisma,
    {
        checkPeriod: 2 * 60 * 1000,
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }
)

app.use(session({
    store: sessionStore,
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
}))

// trigger authentication
app.use(passport.session())

const assetsPath = path.join(__dirname, "public")
app.use(express.static(assetsPath))

// use routers here
app.use("/", indexRouter)
app.use("/user", userRouter)
app.use("/folder", folderRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`always watchin you on ${PORT}`))