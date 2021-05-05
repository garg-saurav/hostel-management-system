const pool = require('../utils/database');
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

    async static view_rooms() {
        return pool.query('SELECT * FROM room WHERE building_id = $1 AND rooms_type_id = $2;', [this.building_id, this.rooms_type_id]);
    }
}