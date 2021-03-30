const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });
const mysql = require('mysql');

 
 // Connection
var pool = mysql.createPool({
    connectionLimit : 100,
    host            : process.env.RDS_HOSTNAME,
    port            : process.env.RDS_PORT,
    user            : process.env.RDS_USERNAME,
    password        : process.env.RDS_PASSWORD,
    database        : process.env.RDS_DB_NAME,

});

module.exports = pool;


