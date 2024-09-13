const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

const { body, validationResult } = require("express-validator")


exports.createFolderGet = async (req, res) => {
    console.log('folder created')
    res.render("newFolder", {
        title: 'Create Folder'
    })
    
}

exports.createFolderPost = async (req, res) => {
    console.log(req.body)
}

// idea for connecting folders to one another:
// On click of a folder on sidebar, user gets redirected to a route that
// containsthe folder's id in the PARAMS (or whatever it is)
// ... then in that specific folder's view, there can be a button in top
// right for "add subfolder". Clicking this will create a new folder where
// the parent folder is the same id as the folder the user is currently in