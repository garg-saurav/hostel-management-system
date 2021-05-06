const pool = require('../utils/database');
module.exports = class Owner {

    constructor(name, email, dob, phone_no, addr, passwd) {
        this.name = name;
        this.email = email;
        this.dob = dob;
        this.phone_no = phone_no;
        this.addr = addr;
        this.passwd = passwd;
    }

    async find_user() {
        return pool.query('SELECT * FROM person NATURAL JOIN hostel_owner WHERE email_id=$1', [this.email]);
    }

    async reg_as_customer(){
        try{
            await pool.query('BEGIN;');
            const res = await pool.query('SELECT * FROM person NATURAL JOIN hostel_owner WHERE email_id=$1;',[this.email]);
            const id = res.rows[0].person_id;
            const passwd = res.rows[0].passwd;
            await pool.query('INSERT INTO customer VALUES ($1, $2);',[id, passwd]);
            await pool.query('COMMIT;')
        }catch(e){
            await pool.query('ROLLBACK;');
            throw e;
        }
    }

    async add_user() {
        try {
            await pool.query('BEGIN;');
            const res = await pool.query('SELECT COALESCE(MAX(person_id),0)+1 as id FROM person;');
            const new_id = res.rows[0].id;
            await pool.query('INSERT INTO person VALUES ($1, $2, $3, $4, $5, $6);', [new_id, this.name, this.email, this.dob, this.phone_no, this.addr]);
            await pool.query('INSERT INTO hostel_owner VALUES ($1, $2);', [new_id, this.passwd]);
            await pool.query('COMMIT;')
        } catch (e) {
            await pool.query('ROLLBACK;');
            throw e;
        }
    }

    async is_a_customer(){
        try{
            const res = await pool.query('SELECT * FROM person NATURAL JOIN hostel_owner WHERE email_id=$1;',[this.email]);
            const id = res.rows[0].person_id;
            return pool.query('SELECT * FROM customer WHERE person_id=$1;',[id]);
        }catch(e){
            throw e;
        }
    }

};