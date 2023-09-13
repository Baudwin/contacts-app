const express = require("express")
const mysql = require("mysql2")


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
        console.log("connection created with Database successfully");
    }
});


module.exports = database