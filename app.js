const express = require("express")
const app = express()
const passport = require('passport')
const ejs = require("ejs")
const session = require("express-session")
const login = require('./routes/login')
const signup = require('./routes/signup')
const contacts = require('./routes/contacts')
const database = require("./database")
const local = require("./strategies/local")
const port = 4000


app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}))

app.set("view engine", "ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(__dirname + "/public"))

app.get("/cntcts", async(req,res)=>{
    let cmd = `select * from contact`
    let [contacts] = await database.query(cmd)
    res.send(contacts)
})

app.get("/descr", async(req,res)=>{
    let cmd = `DESC contact`
    let [contacts] = await database.query(cmd)
    res.send(contacts)
})

app.use(login)

app.use(passport.initialize())
app.use(passport.session())

app.use(signup)

app.use((req,res,next)=>{
    if (req.user) {
        next()
    }else{
        res.redirect("/")
    }
})



app.use(contacts)





app.listen(port, () => {
})