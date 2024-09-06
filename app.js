const express = require('express');
const app = express();
// import routers here

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))

// use routers here

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`always watchin you on ${PORT}`))