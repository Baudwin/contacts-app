const express = require("express")
const mysql = require("mysql2")
const dotenv = require("dotenv")
dotenv.config()


const database = mysql.createPool({
    host: process.env.HOST_NAME,
    port: process.env.PORT,
    database: process.env.DB_NAME,
    user: process.env.USER_NAME,
    password: process.env.DB_PASSWORD,
    URL : process.env.URL

}).promise()




module.exports = database