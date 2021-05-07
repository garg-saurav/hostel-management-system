const pool = require('../utils/database');
const Hostel = require('./hostel');
module.exports = class Room {
    constructor(building_id, rooms_type_id, rent, num_beds, ac, room_no, available) {
        this.building_id = building_id;
        this.rooms_type_id = rooms_type_id;
        this.rent = rent;
        this.num_beds = num_beds;
        this.ac = ac;
        this.room_no = room_no;
        this.available = available;
    }

    async get_roomtype_details() {
        return pool.query('SELECT building_name AS name, rent, num_beds, ac FROM rooms_type JOIN building ON rooms_type.building_id = building.building_id WHERE rooms_type.building_id = $1 AND rooms_type_id = $2;', [this.building_id, this.rooms_type_id]);
    }

    async get_rooms() {
        return pool.query('SELECT * FROM room WHERE building_id = $1 AND rooms_type_id = $2;', [this.building_id, this.rooms_type_id]);
    }

    async view_room_type() {
        return pool.query('SELECT * FROM rooms_type WHERE building_id = $1 ORDER BY rooms_type_id;', [this.building_id]);
    }

    async add_room() {
        try {
            await pool.query('BEGIN;');
            await pool.query('INSERT INTO room(building_id, rooms_type_id, room_no, available) VALUES($1, $2, $3, $4);', [this.building_id, this.rooms_type_id, this.room_no, true]);
            await pool.query('COMMIT;');
        }
        catch (e) {
            await pool.query('ROLLBACK;');
            throw e;
        }
    }

    async add_room_type() {
        try {
            await pool.query('BEGIN;');
            const res = await pool.query('SELECT COALESCE(MAX(rooms_type_id),0)+1 as id FROM rooms_type WHERE building_id=$1;', [this.building_id]);
            const id = res.rows[0].id;
            await pool.query('INSERT INTO rooms_type(building_id, rooms_type_id, rent, num_beds, ac) VALUES($1, $2, $3, $4, $5);', [this.building_id, id, this.rent, this.num_beds, this.ac]);
            await pool.query('COMMIT;');
        } catch (e) {
            await pool.query('ROLLBACK;');
            throw e;
        }
    }
    async get_residents() {
        const results = await pool.query('SELECT b.room_no, b.booking_id, bg.name, bg.dob, bg.phone_number FROM booking_guests as bg JOIN booking as b ON b.booking_id = bg.booking_id WHERE b.building_id = $1 AND b.rooms_type_id = $2 AND b.cancelled <> True AND b.start_date <= CURRENT_DATE AND b.end_date >= CURRENT_DATE ORDER BY bg.booking_id;',[this.building_id,this.rooms_type_id]);
        var grouped = {};
        var bookings = {};
        results.rows.forEach(function (x) {
            grouped[x.room_no] = grouped[x.room_no] || [];
            grouped[x.room_no].push({ "name": x.name, "dob": x.dob.toLocaleDateString(), "phone_number":x.phone_number });
            bookings[x.room_no] = x.booking_id;
        });
        return [grouped, bookings];
    }

    async get_services() {
        return pool.query('SELECT service_type,rate_per_month FROM services WHERE building_id = $1', [this.building_id]);
    }

    async book_room(guests, services, email, check_in_date, check_out_date) {
        try {
            await pool.query('BEGIN;');
            const id = (await pool.query('SELECT COALESCE(MAX(booking_id),0)+1 AS id FROM booking;')).rows[0].id;
            const cust_id = (await pool.query('SELECT person_id as id FROM person WHERE email_id = $1;', [email])).rows[0].id;
            await pool.query('INSERT INTO booking VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [id, this.building_id, this.rooms_type_id, this.room_no, cust_id, check_in_date, check_out_date, null, null, false]);
            for (let e in guests) {
                await pool.query('INSERT INTO booking_guests VALUES($1,$2,$3,$4);', [id, e[0], e[1], e[2]]);
            }
            for (let e in services) {
                await pool.query('INSERT INTO booking_services VALUES($1,$2);', [id, e]);
            }
            await pool.query('COMMIT;');
        }
        catch (e) {
            await pool.query('ROLLBACK;');
            throw e;
        }
    }
}