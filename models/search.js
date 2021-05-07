const pool = require('../utils/database');
const wkt = require('wkt');
const { parse } = require('wkt');
module.exports = class Search {

    constructor(address, check_in_date, check_out_date, num_beds, min_rent, max_rent, AC, building_id, rooms_type_id) {
        this.address= address;
        this.check_in_date = check_in_date;
        this.check_out_date = check_out_date;
        this.num_beds = num_beds;
        this.min_rent = min_rent;
        this.max_rent = max_rent;
        this.AC = AC;
        this.building_id = building_id;
        this.rooms_type_id = rooms_type_id;
    }

    get_loc(addr) {
        return addr;
    }
    //building name, address text, rent, num_rooms, button to go to book room.
    async get_hostels() {
            // (p1,p2)= this.get_loc(this.address); //fill here
            // TODO : FIX THIS!!!!
            const p1 = 77;
            const p2 = 28;

            return pool.query("WITH rtype(building_id, rooms_type_id) AS (SELECT building_id, rooms_type_id, rent FROM rooms_type WHERE num_beds=$1 AND ac = $2 AND rent>= $3 AND rent <= $4), r_not_aval(bid,rno) AS (SELECT building_id, room_no FROM booking NATURAL JOIN rtype WHERE (not (end_date<$5 OR start_date > $6)) AND cancelled <> True) SELECT DISTINCT building_id, building_name, addr, rooms_type_id, rent, COUNT(room_no) AS num_rooms, additional_info, ST_Distance(location_point, ST_MakePoint($7, $8)) as dist FROM building NATURAL JOIN room NATURAL JOIN rtype WHERE (building_id,room_no) NOT IN (SELECT * FROM r_not_aval) AND available = True GROUP BY (building_id, rooms_type_id, rent) ORDER BY dist;", [this.num_beds, this.AC, this.min_rent, this.max_rent, this.check_in_date, this.check_out_date, p1, p2]);

    }

    async get_free_room() {
        return pool.query('SELECT MIN(room_no) AS room_num FROM room WHERE building_id = $1 AND rooms_type_id = $2 AND available = True AND NOT EXISTS(SELECT * FROM booking WHERE booking.room_no = room.room_no AND booking.rooms_type_id = room.rooms_type_id AND booking.building_id = room.building_id AND cancelled <> True AND NOT (start_date > $4 OR end_date < $3))',[this.building_id,this.rooms_type_id,this.check_in_date,this.check_out_date]);
    }
}
