const express = require('express')
const router = express.Router()
const database = require('../database')


// VIEW ALL CONTACTS BY USER ID
router.get("/contacts", async (req, res) => {

    let command = `select * from contact
    inner join user ON contact.user = user.userID
    where user = ?
    ORDER BY firstName ASC`

    let command2 = `select * from user
    where userID = ?`

    try {

        let [user] = await database.query(command2,req.user.userID)
        let [result] = await database.query(command,req.user.userID)

           res.render("contacts", { contact: result, user: user })    
    } 
    catch (error) {
        res.redirect("/")
    }


})


// ADD NEW CONTACT
router.get("/new-contact/:userID", (req, res) => {
    let userId = req.params.userID;
    res.render("new-contact", { userID: userId })
})

router.post("/add-contact", async (req, res) => {
    const {user,fName,mName,lName,number,email,address} = req.body
    const newContact = [user,fName,mName,lName,number,email,address]
    let command = `INSERT INTO Contact
    VALUES(contactID,? ,?, ?,?,?,?, ?, current_date(), current_time())`

    try {
        await database.query(command, newContact)
        res.redirect(`/contacts`)
    }
    catch (error) {
        res.redirect(`/contacts`)
    }

})


// VIEW SINGLE CONTACT INFO
router.get("/contact-info/:contactID", async (req, res) => {
    let id = req.params.contactID
    const dbQuery = `SELECT * FROM Contact WHERE contactID = ?`
    try {
        const [result] = await database.query(dbQuery, id)
       result.map(result=>{
        return res.render("contact-info", { contact: result })
       })
       
    }
    catch (error) {
        res.send(error)
    }

})

// EDIT CONTACT INFO PAGE
router.get("/edit-contact/:contactId", async (req, res) => {
    let id = req.params.contactId
    const dbQuery = `SELECT * FROM Contact WHERE contactID = ?`
    try {
        let result = await database.query(dbQuery, id)
        res.render("edit-contact", { contact: result[0] })
    }
    catch (error) {
        res.send(error)
    }


})


// UPDATE CONTACT INFO
router.post("/update-contact", async (req, res) => {

    const {fName,mName,lName,number,email,address,c_id} = req.body
    const contactUpdate = [fName,mName,lName, number, email, address, c_id]
    
    try {
        const command = `UPDATE Contact
        SET firstName = ?, middleName = ?, lastName = ?, 
        phoneNumber = ?, email = ?, address = ?
        WHERE contactID = ? `
        await database.query(command, contactUpdate)
        res.redirect(`/contact-info/${c_id}`)
    }
    catch (error) {
        res.send(error)
    }

})


// DELETE CONTACT
router.post("/delete", async (req, res) => {
    const {c_id} = req.body
    const dbQuery = `DELETE FROM Contact WHERE contactID = ?`
    try {
        await database.query(dbQuery, c_id)
        res.redirect(`/contacts`)
    }
    catch (error) {
        res.send(error)
    }


})





module.exports = router