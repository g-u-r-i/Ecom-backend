const mysql = require("mysql");

console.log("object",process.env.host)
const conn = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database
})
conn.connect(() => {
  try {
    console.log('Connected :)')
    console.log("oooo " ,process.env.password)
  } catch (err) {
    console.log(err);
  }

})
module.exports = conn