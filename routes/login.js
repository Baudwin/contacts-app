const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const saltRounds = 10;
const database = require('../database')
const passport = require('passport')



// VIEW LOGIN PAGE
router.get("/", (req, res) => {
    res.render("login")
})


// LOGIN and AUTHENTICATE USER
router.post("/login", passport.authenticate('local',{failureRedirect:'/'}), async (req, res) => {
    res.redirect("/contacts")
})



router.post("/logout", (req,res,next)=>{
    req.session.destroy((err)=>{
       res.redirect("/") 
    })
    
})


module.exports = router