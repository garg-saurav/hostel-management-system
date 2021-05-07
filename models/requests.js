const pool = require('../utils/database');
module.exports = class Request {

    constructor(request_id, email, city, approval, comment) {
        this.city = city;
        this.email = email;
        this.approval = approval;
        this.comment = comment;
        this.request_id = request_id;
    }

    async view_hostel_requests(){
        const res = await pool.query('SELECT * FROM person NATURAL JOIN regional_manager WHERE email_id=$1;',[this.email]);
        const city = res.rows[0].city;
        return pool.query("SELECT request_id, r.city as city, building_name, location_point, r.addr as addr, TO_CHAR(r.time_stamp, 'dd/mm/yyyy') as time_stamp, building_type, approval, comment, additional_info, p.name as name, p.phone_number as phone_number, p.email_id as email_id  FROM request_new_hostel AS r INNER JOIN person AS p ON r.hostel_owner_id=p.person_id WHERE r.city=$1 and approval is null ORDER BY time_stamp desc;", [city]);
    }

    async get_all_details() {
        return pool.query('SELECT * FROM request_new_hostel as r NATURAL JOIN request_hostel_services WHERE r.request_id=$1;', [this.request_id]);
    }

    async get_photos() {
        return pool.query('SELECT * FROM request_hostel_photos WHERE request_id=$1;', [this.request_id]);
    }

    async accept_hostel_request() {
        try {
            await pool.query('BEGIN;');

            const bid = await pool.query('SELECT COALESCE(MAX(building_id),0)+1 as b_id FROM building;');
            const id = bid.rows[0].b_id;
            const res = await pool.query('SELECT * FROM request_new_hostel WHERE request_id=$1;', [this.request_id]);
            await pool.query('UPDATE request_new_hostel SET approval = True, comment = $2 WHERE request_id = $1;', [this.request_id, this.comment]);
            const bname = res.rows[0].building_name;
            const lp = res.rows[0].location_point;
            const pid = res.rows[0].hostel_owner_id;
            const city = res.rows[0].city;
            const addr = res.rows[0].addr;
            const btype = res.rows[0].building_type;
            const ainfo = res.rows[0].additional_info;
            await pool.query('INSERT INTO building(building_id, building_name, location_point, hostel_owner_id, city, addr, building_type, additional_info) VALUES($1, $2, $3, $4, $5, $6, $7, $8);', [id, bname, lp, pid, city, addr, btype, ainfo]);

            const services = await pool.query('SELECT * FROM request_hostel_services WHERE request_id=$1;', [this.request_id]);
            const num_serv = services.rowCount;
            for (var i=0;i<num_serv;i++){
                const stype = services.rows[i].service_type;
                const rate = services.rows[i].rate_per_month;
                await pool.query('INSERT INTO services(building_id, service_type, rate_per_month) VALUES($1, $2, $3);', [id,stype, rate]);
            }

            const pics = await pool.query('SELECT * FROM request_hostel_photos WHERE request_id=$1;', [this.request_id]);
            const num_pics = pics.rowCount;
            for (var i=0;i<num_pics;i++){
                const pic = pics.rows[i].photo;
                await pool.query('INSERT INTO building_photos(building_id, photo) VALUES($1, $2);', [id, pic]);
            }
            await pool.query('COMMIT;')
        } catch (e) {
            await pool.query('ROLLBACK;');
            throw e;
        }
    }

    async reject_hostel_request() {
        try {
            await pool.query('UPDATE request_new_hostel SET approval = False, comment = $2 WHERE request_id = $1;', [this.request_id, this.comment]);
        } catch (e) {
            throw e;
        }
    }

    async view_modif_requests() {
        try{
            const res = await pool.query('SELECT person_id FROM person where email_id = $1;', [this.email]);
            const hid = res.rows[0].person_id;
            return pool.query("SELECT request_id, b.booking_id as booking_id, bd.building_id as building_id, building_name, room_no, TO_CHAR(time_stamp, 'dd/mm/yyyy') as time_stamp, TO_CHAR(start_date, 'dd/mm/yyyy') as start_date, TO_CHAR(end_date, 'dd/mm/yyyy') as end_date,TO_CHAR(new_start_date, 'dd/mm/yyyy') as new_start_date, TO_CHAR(new_end_date, 'dd/mm/yyyy') as new_end_date, location_point, bd.addr as addr, name, email_id, phone_number FROM (((modification_request as m INNER JOIN booking as b on m.booking_id=b.booking_id) INNER JOIN building as bd ON bd.building_id=b.building_id) INNER JOIN person as p ON b.customer_id=p.person_id) WHERE m.cancelled = True AND approval is null AND bd.hostel_owner_id=$1 ORDER BY time_stamp desc;", [hid]);
        } catch (e){
            throw e;
        }
    }

    async accept_modif_request() {
        try {
            await pool.query('BEGIN;');
            await pool.query('UPDATE modification_request SET approval = True, comment = $2 WHERE request_id = $1;', [this.request_id, this.comment]);
            const res = await pool.query('SELECT new_start_date, new_end_date, booking_id from modification_request WHERE request_id=$1;', [this.request_id]);
            const bid = res.rows[0].booking_id;
            const nsd = res.rows[0].new_start_date;
            const ned = res.rows[0].new_end_date;
            await pool.query('UPDATE booking SET start_date = $2, end_date = $3 WHERE booking_id = $1;', [bid, nsd, ned]);
            await pool.query('DELETE FROM booking_services WHERE booking_id = $1;', [bid]);

            const services = await pool.query('SELECT * FROM services_modify WHERE request_id=$1;', [this.request_id]);
            const num_serv = services.rowCount;
            for (var i=0;i<num_serv;i++){
                const stype = services.rows[i].service_type;
                await pool.query('INSERT INTO booking_services(booking_id, service_type) VALUES($1, $2);', [bid, stype]);
            }
            await pool.query('COMMIT;')
        } catch (e) {
            await pool.query('ROLLBACK;');
            throw e;
        }
    }

    async reject_modif_request() {
        try {
            await pool.query('UPDATE modification_request SET approval = False, comment = $2 WHERE request_id = $1;', [this.request_id, this.comment]);
        } catch (e) {
            throw e;
        }
    }

    async view_cancel_requests() {
        try{
            const res = await pool.query('SELECT person_id FROM person where email_id = $1;', [this.email]);
            const hid = res.rows[0].person_id;
            return pool.query("SELECT request_id, b.booking_id as booking_id, bd.building_id as building_id, building_name, room_no, TO_CHAR(time_stamp, 'dd/mm/yyyy') as time_stamp, TO_CHAR(start_date, 'dd/mm/yyyy') as start_date, TO_CHAR(end_date, 'dd/mm/yyyy') as end_date, location_point, bd.addr as addr, name, email_id, phone_number FROM (((modification_request as m INNER JOIN booking as b on m.booking_id=b.booking_id) INNER JOIN building as bd ON bd.building_id=b.building_id) INNER JOIN person as p ON b.customer_id=p.person_id) WHERE m.cancelled = True AND approval is null AND bd.hostel_owner_id=$1 ORDER BY time_stamp desc;", [hid]);
        } catch (e){
            throw e;
        }
    }
    async accept_cancel_request() {
        try {
            await pool.query('BEGIN;');
            await pool.query('UPDATE modification_request SET approval = True, comment = $2 WHERE request_id = $1;', [this.request_id, this.comment]);
            const res = await pool.query('SELECT booking_id from modification_request WHERE request_id=$1;', [this.request_id]);
            const bid = res.rows[0].booking_id;
            await pool.query('UPDATE booking SET cancelled = True WHERE booking_id = $1;', [bid]);
            await pool.query('COMMIT;')
        } catch (e) {
            await pool.query('ROLLBACK;');
            throw e;
        }
    }
    async reject_cancel_request() {
        try {
            await pool.query('UPDATE modification_request SET approval = False, comment = $2 WHERE request_id = $1;', [this.request_id, this.comment]);
        } catch (e) {
            throw e;
        }
    }
}