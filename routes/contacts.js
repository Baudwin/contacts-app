const express = require('express')
const router = express.Router()
const database = require('../database')

// VIEW ALL CONTACTS BY USER ID
router.get("/contacts/:userID", async (req, res) => {
    let userid = req.params.userID

    let command = `select * from contact
    inner join user ON contact.user = user.userID
    where user = ${userid}
    ORDER BY firstName ASC`

    let command2 = `select * from user
    where userID = ${userid}`

    try {

        let [user] = await database.query(command2)
        let [result] = await database.query(command)

        res.render("contacts", { contact: result, user: user })

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
    let user = req.body.user
    let fname = req.body.fName
    let mname = req.body.mName
    let lname = req.body.lName
    let number = req.body.number
    let email = req.body.email
    let address = req.body.address
    let command = `INSERT INTO Contact 
    VALUES(contactID,${user} ,'${fname}', '${mname}','${lname}','${number}','${address}', '${email}', current_date(), current_time())`

    try {

        await database.query(command)
        res.redirect(`/contacts/${user}`)

    } catch (error) {
        res.redirect(`/contacts/${user}`)
    }

})


// VIEW SINGLE CONTACT INFO
router.get("/contact-info/:contactID", async (req, res) => {
    let id = req.params.contactID
    let result = await database.query(`SELECT * FROM Contact WHERE contactID = ${id}`)
    result[0].forEach(result => {
        res.render("contact-info", { contact: result })
    });

})

// EDIT CONTACT INFO PAGE
router.get("/edit-contact/:contactId", async (req, res) => {
    let id = req.params.contactId
    let result = await database.query(`SELECT * FROM Contact WHERE contactID = ${id}`)
    res.render("edit-contact", { contact: result[0] })

})


// UPDATE CONTACT INFO
router.post("/update-contact", async (req, res) => {
    let id = req.body.updatebtn
    let fname = req.body.fName
    let mname = req.body.mName
    let lname = req.body.lName
    let number = req.body.number
    let email = req.body.email
    let address = req.body.address
    let command = `UPDATE Contact
    SET firstName = "${fname}", middleName = "${mname}", lastName = "${lname}", 
    phoneNumber = "${number}", email = "${email}", address = "${address}"
    WHERE contactID = ${id} `
    await database.query(command)
    res.redirect(`/contact-info/${id}`)

})


// DELETE CONTACT
router.post("/delete", async (req, res) => {
    let id = req.body.deletebtn
    let userID = req.body.userID

    await database.query(`DELETE FROM Contact WHERE contactID = ${id}`)
    res.redirect(`/contacts/${userID}`)

})





module.exports = router