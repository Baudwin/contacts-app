const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mysql = require("mysql2")
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express()
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname + "/public"))


const database = mysql.createConnection({
    host: "127.0.0.1",
    port: 3306,
    database: "contacts",
    user: "root",
    password: "Michealtutu123"
});

database.connect((err) => {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connection created with Mysql2 successfully");
    }
});




app.get("/", (req, res) => {
    res.render("login")
})

app.get("/signup", (req, res) => {
    res.render("signup")
})


app.post("/signup", async (req, res) => {
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


app.post("/login", (req, res) => {
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





app.get("/contacts/:userID", (req, res) => {
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




app.get("/new-contact/:userID", (req, res) => {
    let userId = req.params.userID;
    res.render("new-contact", { userID: userId })
})

app.post("/add-contact", (req, res) => {
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



app.get("/contact-info/:contactID", (req, res) => {
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


app.get("/edit-contact/:contactId", (req, res) => {
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

app.post("/update-contact", (req, res) => {
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
    database.query(command, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/contact-info/${id}`)
        }
    })
})



app.post("/delete", (req, res) => {
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









app.listen(4000, () => {
    console.log("Server started on port 4000");
})