const sqlite3 = require('sqlite3').verbose();

let database = new sqlite3.Database("./server/db/book.db", function(err){
    if (err){
        console.log("Open Database", err.message)
    }
})

module.exports = {
    database
}