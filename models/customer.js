
const pool= require('../utils/database');
module.exports = class Customer{

    constructor( name, email, dob, phone_no, addr, passwd){
        this.name = name;
        this.email = email;
        this.dob = dob;
        this.phone_no = phone_no;
        this.addr = addr;
        this.passwd = passwd;
    }

    async find_user(){
        return pool.query('SELECT * FROM person NATURAL JOIN customer WHERE email_id=$1',[this.email]);
    }

    async add_user(){
        try{
            await pool.query('BEGIN;');
            const res = await pool.query('SELECT COALESCE(MAX(person_id),0)+1 as id FROM person;');
            const new_id = res.rows[0].id;
            await pool.query('INSERT INTO person VALUES ($1, $2, $3, $4, $5, $6);',[new_id, this.name, this.email, this.dob, this.phone_no, this.addr]);
            await pool.query('INSERT INTO customer VALUES ($1, $2);',[new_id, this.passwd]);
            await pool.query('COMMIT;')
        }catch(e){
            await pool.query('ROLLBACK;');
            throw e;
        }
    }

    async get_bookings(){
        try{
            const res = await pool.query('SELECT person_id FROM person WHERE email_id=$1',[this.email]);
            const id = res.rows[0].person_id;
            return pool.query("SELECT building_id, booking_id, rooms_type_id, customer_id, cancelled, rating, review, building_name, city, addr, TO_CHAR(start_date, 'dd/mm/yyyy') as start_date, TO_CHAR(end_date, 'dd/mm/yyyy') as end_date FROM booking NATURAL JOIN building WHERE customer_id=$1 ORDER BY start_date DESC, end_date DESC;",[id]);
        }catch(e){
            throw e;
        }
    }

};