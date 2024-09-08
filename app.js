const express = require('express');
const app = express();
const path = require('path')
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store')
const { PrismaClient } = require('@prisma/client');


const prisma = new PrismaClient()
require('dotenv').config();

// import routers here
const indexRouter = require('./routes/index')

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

// use routers here
app.use("/", indexRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`always watchin you on ${PORT}`))