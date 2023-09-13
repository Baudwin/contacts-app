const express = require("express")
const ejs = require("ejs")
const login = require('./routes/login')
const signup = require('./routes/signup')
const contacts = require('./routes/contacts')
const port = 4000
const app = express()


app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(__dirname + "/public"))

app.use(login)
app.use(signup)
app.use(contacts)







app.listen(port, () => {
    console.log("Server started on port 4000");
})