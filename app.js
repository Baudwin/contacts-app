const express = require("express")
const ejs = require("ejs")
// const session = require("express-session")
const login = require('./routes/login')
const signup = require('./routes/signup')
const contacts = require('./routes/contacts')
const database = require("./database")
const port = 4000
const app = express()


app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(__dirname + "/public"))


// app.use(session({
//     secret: 'mysecret',
//     resave: false,
//     saveUninitialized: false
// }))


app.use(login)
app.use(signup)
app.use(contacts)





app.listen(port, () => {
})