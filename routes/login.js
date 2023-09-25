const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const database = require('../database')



// VIEW LOGIN PAGE
router.get("/", (req, res) => {
    res.render("login")
})


// LOGIN USER BY

router.post("/login", async (req, res) => {
    let { username, password } = req.body
    let users = await database.query(`SELECT * FROM user WHERE username = '${username}'`)
    users = users[0]
    if (users.length < 1) {
        let errmsg = "Incorrect Username or Password"

        return res.render("login", { errmsg: errmsg })
    }

    if (users.length > 0) {
        bcrypt.compare(password, users[0].password, function (err, result) {
            if (result === true) {

                return res.redirect(`/contacts/${users[0].userID}`)

            }
            else {
                let errmsg = "Incorrect Username or Password"
                return res.render("login", { errmsg: errmsg })
            }
        });
    }



})


module.exports = router