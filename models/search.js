const pool = require('../utils/database');
module.exports = class Search {

    constructor(address, check_in_date, check_out_date, num_beds, min_rent, max_rent, AC) {
        this.address= address;
        this.check_in_date = check_in_date;
        this.check_out_date = check_out_date;
        this.num_beds = num_beds;
        this.min_rent = min_rent;
        this.max_rent = max_rent;
        this.AC = AC;
    }

    get_loc(addr) {
        return addr;
    }
    //building name, address text, rent, num_rooms, button to go to book room.
    async get_hostels() {
        try {
            // (p1,p2)= this.get_loc(this.address); //fill here
            const p1 = 77;
            const p2 = 28;
            return pool.query(`WITH rtype(building_id, rooms_type_id) AS
                (SELECT building_id, rooms_type_id, rent
                FROM rooms_type
                WHERE num_beds=$1 AND ac = $2 AND rent>= $3 AND rent <= $4),
                r_not_aval(bid,rno) AS
                (SELECT building_id, room_no
                FROM booking NATURAL JOIN rtype
                WHERE (not (end_date<$5 OR start_date > $6)) AND cancelled <> True)
                SELECT DISTINCT building_id, building_name, addr, rooms_type_id, rent, COUNT(room_no) AS num_rooms, 
                additional_info, location_point <-> 'SRID=4326; POINT($7 $8)'::geometry as dist
                FROM building NATURAL JOIN room NATURAL JOIN rtype
                WHERE (building_id,room_no) NOT IN (SELECT * FROM r_not_aval) AND available = True
                GROUP BY (building_id, rooms_type_id, rent)
                ORDER BY dist;`
                , [this.num_beds, this.AC, this.min_rent, this.max_rent, this.check_in_date, this.check_out_date, p1, p2]);
        } catch (e) {
            throw e;
        }
    }
}
