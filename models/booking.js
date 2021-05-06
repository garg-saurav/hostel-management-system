
const pool= require('../utils/database');
module.exports = class Booking{

    constructor(booking_id){
        this.booking_id = booking_id;
    }

    async get_all_details(){
        return pool.query("SELECT building_id, rooms_type_id, booking_id, room_no, customer_id, TO_CHAR(start_date, 'dd/mm/yyyy') as start_date, TO_CHAR(end_date, 'dd/mm/yyyy') as end_date, rating, review, cancelled, building_name, location_point, hostel_owner_id, city, addr, building_type, rent, num_beds, ac, start_date<NOW() as has_started, end_date<NOW() as has_ended  FROM booking NATURAL JOIN building NATURAL JOIN rooms_type WHERE booking_id=$1",[this.booking_id]);
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