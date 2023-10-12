const express = require('express')
const router = express.Router()
const database = require('../database')


// VIEW ALL CONTACTS BY USER ID
router.get("/contacts/:userID", async (req, res) => {

    let userid = req.params.userID
    let command = `select * from contact
    inner join user ON contact.user = user.userID
    where user = ?
    ORDER BY firstName ASC`

    let command2 = `select * from user
    where userID = ?`

    try {

        let [user] = await database.query(command2,userid)
        let [result] = await database.query(command,userid)

         if (userid === JSON.stringify(req.user.userID)) {
           res.render("contacts", { contact: result, user: user })
        }else{
            res.redirect("/")
        }
        


    } catch (error) {
        res.send(error.message)
    }


})


// ADD NEW CONTACT
router.get("/new-contact/:userID", (req, res) => {
    let userId = req.params.userID;
    res.render("new-contact", { userID: userId })
})

router.post("/add-contact", async (req, res) => {
    const user = req.body.user
    const fname = req.body.fName
    const mname = req.body.mName
    const lname = req.body.lName
    const number = req.body.number
    const email = req.body.email
    const address = req.body.address
    const newContact = [user, fname, mname, lname, number, email, address]
    let command = `INSERT INTO Contact 
    VALUES(contactID,? ,?, ?,?,?,?, ?, current_date(), current_time())`

    try {

        await database.query(command, newContact)
        res.redirect(`/contacts/${user}`)

    } catch (error) {
        res.redirect(`/contacts/${user}`)
    }

})


// VIEW SINGLE CONTACT INFO
router.get("/contact-info/:contactID", async (req, res) => {
    let id = req.params.contactID
    const dbQuery = `SELECT * FROM Contact WHERE contactID = ?`
    try {
        const result = await database.query(dbQuery, id)
        result[0].forEach(result => {
            res.render("contact-info", { contact: result })
        });
    } catch (error) {
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
    } catch (error) {
        res.send(error)
    }


})


// UPDATE CONTACT INFO
router.post("/update-contact", async (req, res) => {
    const id = req.body.updatebtn
    const fname = req.body.fName
    const mname = req.body.mName
    const lname = req.body.lName
    const number = req.body.number
    const email = req.body.email
    const address = req.body.address
    const contactUpdate = [fname, mname, lname, number, email, address, id]
    console.log(contactUpdate);
    try {
        const command = `UPDATE Contact
        SET firstName = ?, middleName = ?, lastName = ?, 
        phoneNumber = ?, email = ?, address = ?
        WHERE contactID = ? `
        await database.query(command, contactUpdate)
        res.redirect(`/contact-info/${id}`)
    }
    catch (error) {
        res.send(error)
    }

})


// DELETE CONTACT
router.post("/delete", async (req, res) => {
    let id = req.body.deletebtn
    let userID = req.body.userID
    const dbQuery = `DELETE FROM Contact WHERE contactID = ?`
    try {
        await database.query(dbQuery, id)
        res.redirect(`/contacts/${userID}`)
    }
    catch (error) {
        res.send(error)
    }


})





module.exports = router