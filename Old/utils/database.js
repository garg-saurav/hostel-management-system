const { Pool } = require('pg');

const pool = new Pool({
    user: 'saurav',     //your postgres username
    host: 'localhost', 
    database: 'lab5db', //your local database 
    password: 'password', //your postgres user password
    port: 5432, //your postgres running port
});

pool.connect();


module.exports = pool;