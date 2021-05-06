const Room = require('../models/room');
const verify = require('../private/verify');

exports.view_rooms = async (req, res, next) => {
    const decoded = verify.authenticate(req);
    const building_id = 1;
    const rooms_type_id = 0;
    const rent = 12300;
    const num_beds = 2;
    const ac = true;

    if (decoded) {
        const room_type = new Room(building_id, rooms_type_id, null, null, null, null, null);
        const rooms = await room_type.get_rooms();
        const name = await room_type.get_hostel_name();

        res.render('view_room', {
            pageTitle: 'View Rooms',
            id: building_id,
            name: name.rows[0].name,
            rooms_type: rooms_type_id,
            rent: rent,
            num_beds: num_beds,
            ac: ac,
            rooms: rooms.rows.forEach(e => e.room_no)
        });
    }
    else {
        res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
}