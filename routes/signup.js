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
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    bcrypt.hash(password, saltRounds, async (err, hash) => {
        const signnupDetails = [username,hash,email]
        let command = `INSERT INTO user
        VALUES(userID,?,?,?)`

        try {
            await database.query(command,signnupDetails)
            res.redirect("/")
        } catch (error) {
            return res.render("signup")
        }





    });


})






module.exports = router