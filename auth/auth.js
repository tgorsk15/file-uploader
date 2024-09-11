const passport = require('passport');

function authenticate(req, res, next) {
    passport.authenticate("local", async (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            console.log(info)
            return res.render('login', {
                title: 'Sign In',
                message: info.message
            })
        }

        // TMW 9/11:  Continu to build this function out now that error
        // message works correctly

    })(req, res, next)

    console.log('authenticating')
}

module.exports = { authenticate }