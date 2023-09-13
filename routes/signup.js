const express = require('express')
const router = express.Router()
const database = require('../database')


router.get("/signup", (req, res) => {
    res.render("signup")
})


router.post("/signup", async (req, res) => {
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password

    bcrypt.hash(password, saltRounds, function (err, hash) {

        let command = `insert into user
        values(userID,"${username}","${hash}","${email}")`

        database.query(command, (err, result) => {
            if (err) {
                return res.render("signup")
            }
            res.redirect("/")
        })

    });


})






module.exports = router