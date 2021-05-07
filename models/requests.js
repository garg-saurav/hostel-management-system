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
            await pool.query('UPDATE request_new_hostel SET approval = True and comment = $2 WHERE request_id = $1;', [this.request_id, this.comment]);
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
            for (i=0;i<num_serv;i++){
                const stype = services.rows[i].service_type;
                const rate = services.rows[i].rate_per_month;
                await pool.query('INSERT INTO services(building_id, service_type, rate_per_month) VALUES($1, $2, $3);', [id,stype, rate]);
            }

            const pics = await pool.query('SELECT * FROM request_hostel_photos WHERE request_id=$1;', [this.request_id]);
            const num_pics = pics.rowCount;
            for (i=0;i<num_pics;i++){
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
            await pool.query('UPDATE request_new_hostel SET approval = False and comment = $2 WHERE request_id = $1;', [this.request_id, this.comment]);
        } catch (e) {
            throw e;
        }
    }
}