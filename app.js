const express = require('express');
const app = express();
const path = require('path')
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);



require('dotenv').config();

// import routers here
const indexRouter = require('./routes/index')

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))

// use routers here
app.use("/", indexRouter)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`always watchin you on ${PORT}`))