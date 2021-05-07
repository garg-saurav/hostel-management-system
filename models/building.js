
const pool = require('../utils/database');
module.exports = class Building {

    constructor(building_id) {
        this.building_id = building_id;
    }

    async get_all_details() {
        return pool.query("SELECT * from building WHERE building_id = $1", [this.building_id]);
    }

    async get_photos() {
        try {
            const b_id = this.building_id
            return pool.query('SELECT photo FROM building_photos WHERE building_id=$1', [b_id]);
        } catch (e) {
            throw e;
        }
    }

    async get_services() {
        return pool.query('SELECT service_type, rate_per_month FROM services WHERE building_id = $1', [this.building_id]);
    }

    async get_rooms_type() {
        return pool.query('SELECT * FROM rooms_type WHERE building_id = $1', [this.building_id]);
    }
    async get_owner_email() {
        try {
            const res = await pool.query('SELECT hostel_owner_id FROM building WHERE building_id=$1;', [this.building_id]);
            const owner_id = res.rows[0].hostel_owner_id;
            return pool.query('SELECT email_id FROM person WHERE person_id = $1;', [owner_id]);
        } catch (e) {
            throw e;
        }
    }

    async get_rating() {
        return pool.query('SELECT avg(rating) as avg_rating FROM booking WHERE building_id = $1 AND rating is not null GROUP BY building_id', [this.building_id]);
    }

};