const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient();

exports.getUserSignUp = async (req, res) => {
    console.log('signing up')
}

exports.getUserSignIn = async (req, res) => {
    console.log('signing in')
}