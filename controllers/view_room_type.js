const Room = require('../models/room');
const verify = require('../private/verify');

exports.view_rooms = async (req, res, next) => {
    const decoded = verify.authenticate(req);
    const building_id = req.params.building_id;
    const rooms_type_id = req.params.rooms_type_id;

    if (decoded) {
        const room_type = new Room(building_id, rooms_type_id, null, null, null, null, null);
        const details = (await room_type.get_roomtype_details()).rows;
        if (details.length) {
            const rooms = await room_type.get_rooms();
            res.render('view_room_type', {
                pageTitle: 'View Room Type',
                id: building_id,
                name: details[0].name,
                rooms_type: rooms_type_id,
                rent: details[0].rent,
                num_beds: details[0].num_beds,
                ac: details[0].ac,
                rooms: rooms.rows.forEach(e => e.room_no)
            });
        }
        else {
            res.send('<script>alert("Invalid details"); window.location.href = "/customer/";</script>');
        }
    }
    else {
        res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
}

exports.add_room = async (req, res, next) => {
    const decoded = verify.authenticate(req);
    const building_id = req.params.building_id;
    const rooms_type_id = req.params.rooms_type_id;
    if (decoded) {
        
    }
    else {
        res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
}