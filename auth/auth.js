const passport = require('passport');

function authenticate(req, res, next) {
    passport.authenticate("local", async (err, user, info) => {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.render('login', {
                title: 'Sign In',
                message: info.message
            })
        }

        req.logIn(user, (err) => {
            console.log('user in custom auth', user, 'end')
            if (err) {
                return next(err)
            }

            // back to home if successful
            res.redirect('/')

        })

    })(req, res, next)

}

module.exports = { authenticate }