const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const database = require('../database')




router.get("/", (req, res) => {
    res.render("login")
})


router.post("/login", (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let command = `select * from user
    WHERE username = '${username}'`
    database.query(command, (err, users) => {


        if (users.length < 1) {
            let errmsg = "Incorrect Username or Password"
            return res.render("login", { errmsg: errmsg })
        }

        if (users.length > 0) {

            users.forEach(user => {

                bcrypt.compare(password, user.password, function (err, result) {
                    if (result === true) {
                        return res.redirect(`/contacts/${user.userID}`)

                    }
                    else {
                        let errmsg = "Incorrect Username or Password"
                        return res.render("login", { errmsg: errmsg })
                    }
                });
            });
        }



    })
})


module.exports = router