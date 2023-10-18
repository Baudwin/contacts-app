const localStrategy = require('passport-local')
const passport = require('passport')
const db = require('../database')
const bcrypt = require('bcrypt')

passport.serializeUser((user, done) => {
    
    done(null, user.username)
   
})

passport.deserializeUser(async (username, done) => {
    try {

        const [user] = await db.query(`SELECT * FROM user
        WHERE username = ?`, username)
        if (user[0]) {
            done(null, user[0])
            
        }
        else {
            done(null, false)
        }

    } catch (error) {
        res.send(error)
    }

})


passport.use(new localStrategy(async (username, password, done) => {
try {
    
    const command = `SELECT * FROM user WHERE username = ?`
    const [user] = await db.query(command, username)
    if (user.length == 0) {
        done(null, false)
    }
    else {

        bcrypt.compare(password, user[0].password, (err, result) => {
            if (result === true) {
                done(null, user[0])
            } else {
                done(null, false)
            }

        })

    }


} catch (error) {
    done(error)
}


}))