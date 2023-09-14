const express = require('express')
const router = express.Router()
const database = require('../database')


router.get("/contacts/:userID", (req, res) => {
    let userid = req.params.userID

    let command = `select * from contact
    inner join user ON contact.user = user.userID
    where user = ${userid}
    ORDER BY firstName ASC`


    let command2 = `select * from user
    where userID = ${userid}`


    database.query(command, (err, result) => {
        database.query(command2, (err, user) => {
            res.render("contacts", { contact: result, user: user })

        })
    })

})



router.get("/new-contact/:userID", (req, res) => {
    let userId = req.params.userID;
    res.render("new-contact", { userID: userId })
})

router.post("/add-contact", (req, res) => {
    let user = req.body.user
    let fname = req.body.fName
    let mname = req.body.mName
    let lname = req.body.lName
    let number = req.body.number
    let email = req.body.email
    let address = req.body.address
    let command = `insert into Contact 
    values(contactID,${user} ,'${fname}', '${mname}','${lname}','${number}','${address}', '${email}', current_date(), current_time())`
    database.query(command, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/contacts/${user}`)
        }
    })

})



router.get("/contact-info/:contactID", (req, res) => {
    let id = req.params.contactID
    let command = `select * from Contact
    WHERE contactID = ${id}`
    database.query(command, (err, result) => {
        if (err) {
            console.log(err);
        }

        result.forEach(result => {
            res.render("contact-info", { contact: result })
        });
    })

})


router.get("/edit-contact/:contactId", (req, res) => {
    let id = req.params.contactId
    let command = `select * from Contact
   WHERE contactID = ${id}`

    let command2 = `select user from Contact
   WHERE contactID = ${id}`

    database.query(command, (err, result) => {
        database.query(command2, (err, user) => {

            res.render("edit-contact", { contact: result })
        })
    })
})


router.post("/update-contact", (req, res) => {
    let id = req.body.updatebtn
    let fname = req.body.fName
    let mname = req.body.mName
    let lname = req.body.lName
    let number = req.body.number
    let email = req.body.email
    let address = req.body.address
    let command = `update Contact
    SET firstName = "${fname}", middleName = "${mname}", lastName = "${lname}", 
    phoneNumber = "${number}", email = "${email}", address = "${address}"
    WHERE contactID = ${id} `
    database.query(command,  (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/contact-info/${id}`)
        }
    })
})



router.post("/delete", (req, res) => {
    let id = req.body.deletebtn
    let userID = req.body.userID
    let command = `delete from Contact
    WHERE contactID = ${id}`
    database.query(command, (err, result) => {
        if (err) {
            console.log(err);
        }
        res.redirect(`/contacts/${userID}`)
    })
})




module.exports = router