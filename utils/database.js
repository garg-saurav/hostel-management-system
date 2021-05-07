const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',     //your postgres username
    host: 'localhost', 
    database: 'hostel', //your local database 
    password: 'hellothere', //your postgres user password
    port: 5432, //your postgres running port
});

pool.connect();

module.exports = pool;