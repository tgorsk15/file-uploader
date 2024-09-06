const { Router } = require('express');
const indexRouter = Router();

indexRouter.get("/", (req, res) => {
    res.send('hiya pal')
})

module.exports = indexRouter