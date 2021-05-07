
const pool= require('../utils/database');
module.exports = class Booking{

    constructor(booking_id){
        this.booking_id = booking_id;
    }

    async get_all_details(){
        return pool.query("SELECT building_id, rooms_type_id, booking_id, room_no, customer_id, TO_CHAR(start_date, 'dd/mm/yyyy') as start_date, TO_CHAR(end_date, 'dd/mm/yyyy') as end_date, rating, review, cancelled, building_name, location_point, hostel_owner_id, city, addr, building_type, rent, num_beds, ac, start_date<NOW() as has_started, end_date<NOW() as has_ended  FROM booking NATURAL JOIN building NATURAL JOIN rooms_type WHERE booking_id=$1",[this.booking_id]);
    }

    async get_booking_details() {
        return pool.query('SELECT * FROM booking WHERE booking_id = $1', [this.booking_id]);
    }

    async get_photos(){
        try{
            const res = await pool.query('SELECT * FROM booking WHERE booking_id=$1',[this.booking_id]);
            const b_id = res.rows[0].building_id;
            return pool.query('SELECT photo FROM building_photos WHERE building_id=$1',[b_id]);
        }catch(e){
            throw e;
        }
    }

    async add_rating(rating) {
        try {
            await pool.query('BEGIN;');
            await pool.query('UPDATE booking SET rating = $1 WHERE booking_id = $2;', [rating, this.booking_id]);
            await pool.query('COMMIT;');
        }
        catch (e) {
            await pool.query('ROLLBACK;');
            throw e;
        }
    }

    async add_review(review) {
        try {
            await pool.query('BEGIN;');
            await pool.query('UPDATE booking SET review = $1 WHERE booking_id = $2;', [review, this.booking_id]);
            await pool.query('COMMIT;');
        }
        catch (e) {
            await pool.query('ROLLBACK;');
            throw e;
        }
    }

    async check_modifications() {
        return pool.query('SELECT request_id FROM modification_request WHERE booking_id=$1 AND approval is null', [this.booking_id]);
    }

    async enter_cancel_booking() {
        try {
            await pool.query('BEGIN;');
            const details_res = await pool.query('SELECT * FROM booking WHERE booking_id = $1', [this.booking_id]);
            const details = details_res.rows[0];
            const start_date = details.start_date;
            const end_date = details.end_date;
            const res = await pool.query('SELECT COALESCE(MAX(request_id),0)+1 as id FROM modification_request;');
            const request_id = res.rows[0].id;
            await pool.query('INSERT INTO modification_request VALUES($1,$2,$3,$4,True,NOW(),null,null)', [request_id, this.booking_id, start_date, end_date]);
            await pool.query('COMMIT;');
        }
        catch (e) {
            await pool.query('ROLLBACK;');
            throw e;
        }

    }

    async enter_modification_request(check_in_date, check_out_date, services) {
        try {
            await pool.query('BEGIN;');
            const res = await pool.query('SELECT COALESCE(MAX(request_id),0)+1 as id FROM modification_request;');
            const request_id = res.rows[0].id;
            await pool.query('INSERT INTO modification_request VALUES($1,$2,$3,$4,False,NOW(),null,null)', [request_id, this.booking_id, check_in_date, check_out_date]);
            for (let i in services) {
                await pool.query('INSERT INTO services_modify VALUES ($1,$2)', [request_id, services[i]]);
            }
            await pool.query('COMMIT;');
        }
        catch (e) {
            await pool.query('ROLLBACK;');
            throw e;
        }

    }


    async get_customer_email(){
        try{
            const res = await pool.query('SELECT customer_id FROM booking WHERE booking_id=$1;',[this.booking_id]);
            const cust_id = res.rows[0].customer_id;
            return pool.query('SELECT email_id FROM person WHERE person_id = $1;',[cust_id]);
        }catch(e){
            throw e;
        }
    }

};