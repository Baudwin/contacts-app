const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const database = require('../database')

// VIEW SIGNUP PAGE
router.get("/signup", (req, res) => {
    res.render("signup")
})

// NEW USER SIGNUP
router.post("/signup", async (req, res) => {
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password

    bcrypt.hash(password, saltRounds, async (err, hash) => {

        let command = `INSERT INTO user
        VALUES(userID,"${username}","${hash}","${email}")`

        try {
            await database.query(command)
            res.redirect("/")
        } catch (error) {
            return res.render("signup")
        }





    });


})






module.exports = router