const pool = require('../utils/database');
module.exports = class Analytics {

    constructor(person_id) {
        this.person_id = person_id;
    }

    // owner analytics
    async get_owner_bookings() {
        var d = new Date;
        var year = d.getFullYear();
        return pool.query(`WITH buildings(building_id) AS 
        (SELECT building_id FROM building WHERE hostel_owner_id = $1),
        bookings(year, booking_id) AS
        (SELECT EXTRACT(YEAR FROM start_date) as year, booking_id
        FROM booking
        WHERE building_id IN (SELECT * FROM buildings) AND cancelled = false)
        SELECT year, count(booking_id) as num_bookings
        FROM bookings
        WHERE year > $2
        GROUP BY year
        ORDER BY year`, [this.person_id, year - 5]);
    }

    async get_owner_cancellation() {
        var d = new Date;
        var year = d.getFullYear();
        return pool.query(`WITH buildings(building_id) AS 
        (SELECT building_id FROM building WHERE hostel_owner_id = $1),
        bookings(year, booking_id) AS
        (SELECT EXTRACT(YEAR FROM start_date) as year, booking_id
        FROM booking
        WHERE building_id IN (SELECT * FROM buildings) AND cancelled = true)
        SELECT year, count(*) as num_cancel
        FROM bookings
        WHERE year > $2
        GROUP BY year
        ORDER BY year`, [this.person_id, year - 5]);
    }

    async get_owner_good_ratings() {
        var d = new Date;
        var year = d.getFullYear();
        return pool.query(`WITH buildings(building_id) AS 
        (SELECT building_id FROM building WHERE hostel_owner_id = $1),
        bookings(year, booking_id) AS
        (SELECT EXTRACT(YEAR FROM start_date) as year, booking_id, rating
        FROM booking
        WHERE building_id IN (SELECT * FROM buildings))
        SELECT year, count(*) as num_ratings
        FROM bookings
        WHERE year > $2 AND rating>=4
        GROUP BY year
        ORDER BY year`, [this.person_id, year - 5]);
    }

    async get_manager_hostels(city) {
        var d = new Date;
        var year = d.getFullYear();
        return pool.query(`SELECT count(*) as num_hostels FROM building 
        WHERE city = $1`, [city]);
    }

    async get_manager_bookings(city) {
        var d = new Date;
        var year = d.getFullYear();
        return pool.query(`WITH buildings(building_id) AS 
        (SELECT building_id FROM building WHERE city = $1),
        bookings(year, booking_id) AS
        (SELECT EXTRACT(YEAR FROM start_date) as year, booking_id
        FROM booking
        WHERE building_id IN (SELECT * FROM buildings) AND cancelled = false)
        SELECT year, count(booking_id)
        FROM bookings
        WHERE year > $2
        GROUP BY year
        ORDER BY year`, [city, year - 5]);
    }

    async get_manager_cancellation(city) {
        var d = new Date;
        var year = d.getFullYear();
        return pool.query(`WITH buildings(building_id) AS 
        (SELECT building_id FROM building WHERE city = $1),
        bookings(year, booking_id) AS
        (SELECT EXTRACT(YEAR FROM start_date) as year, booking_id
        FROM booking
        WHERE building_id IN (SELECT * FROM buildings) AND cancelled = true)
        SELECT year, count(*)
        FROM bookings
        WHERE year > $2
        GROUP BY year
        ORDER BY year`, [city, year - 5]);
    }



};