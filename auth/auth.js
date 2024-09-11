const passport = require('passport');

function authenticate(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
        console.log(err)
        console.log(user)
        console.log(info)
    })(req, res, next)

    console.log('authenticating')
}

module.exports = { authenticate }