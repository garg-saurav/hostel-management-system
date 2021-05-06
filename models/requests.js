const pool = require('../utils/database');
module.exports = class Request {

    constructor(comment) {
        this.comment = comment;
    }

    async view_hostel_request(){
        return pool.query('SELECT * FROM request_new_hostel AS rh, request_hostel_services as rs, regional_manager AS rm WHERE rm.person_id=$1 and rh.city=rm.city and rh.request_id=rs.request_id;');
    }

    async view_hostel_request() {
        try {
            await pool.query('BEGIN;');
            await pool.query('UPDATE request_new_hostel SET approval=True and comment=$2 WHERE request_id=$1;', [this.]);
            await pool.query('INSERT INTO building(building_name, hostel_owner_id, city, addr,building_type, additional_info) VALUES($1, $2, $3, $4, $5, $6);');
            await pool.query('INSERT INTO services(service_type, rate_per_month) VALUES($1, $2);');
            await pool.query('COMMIT;')
        } catch (e) {
            await pool.query('ROLLBACK;');
            throw e;
        }

    }

}