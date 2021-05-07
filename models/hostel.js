const pool = require('../utils/database');
module.exports = class Hostel {

    constructor(building_id, name, city, owner_id, address, additional, services, photos) {
        this.building_id = building_id;
        this.name = name;
        this.city = city;
        this.owner_id = owner_id;
        this.address = address;
        this.additional = additional;
        this.services = services;
        this.photos = photos;
    }

    async get_owner() {
        return pool.query('SELECT email_id FROM building JOIN person ON building.hostel_owner_id = person.person_id AND building.building_id = $1', [this.building_id]);
    }

    async add_hostel_request() {
        try {
            await pool.query('BEGIN;');
            const res = await pool.query('SELECT COALESCE(MAX(request_id),0)+1 as id FROM request_new_hostel;');
            const id = res.rows[0].id;
            await pool.query('INSERT INTO request_new_hostel(request_id, building_name, city, hostel_owner_id, location_point, addr, building_type, additional_info, approval, comment) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);', [id, this.name, this.city, this.owner_id, 'SRID=4326;POINT(77.21654 28.64624)', this.address,'Hostel',this.additional,null,null]);
            for (const pic in this.photos) {
                await pool.query('INSERT INTO request_hostel_photos VALUES ($1,$2);', [id, pic]);
            }
            for (const tup in this.services) {
                await pool.query('INSERT INTO request_hostel_services VALUES ($1,$2,$3)', [id, tup.service_type, tup.rate_per_month]);
            }
            await pool.query('COMMIT;')
        } catch (e) {
            await pool.query('ROLLBACK;');
            throw e;
        }
    }

    async view_hostel_request(){
        return pool.query('SELECT * FROM request_new_hostel AS rh, request_hostel_services as rs, regional_manager AS rm WHERE rm.person_id=$1 and rh.city=rm.city and rh.request_id=rs.request_id;');
    }

    async view_hostel_request() {
        try {
            await pool.query('BEGIN;');
            await pool.query('UPDATE request_new_hostel SET approval=True and comment=$2 WHERE request_id=$1;');
            await pool.query('INSERT INTO building(building_name, hostel_owner_id, city, addr,building_type, additional_info) VALUES($1, $2, $3, $4, $5, $6);');
            await pool.query('INSERT INTO services(service_type, rate_per_month) VALUES($1, $2);');
            await pool.query('COMMIT;')
        } catch (e) {
            await pool.query('ROLLBACK;');
            throw e;
        }

    }

}
