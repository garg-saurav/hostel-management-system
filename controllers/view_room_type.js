const Room = require('../models/room');
const Hostel = require('../models/hostel');
const verify = require('../private/verify');

exports.view_rooms = async (req, res, next) => {
    const decoded = verify.authenticate(req);
    const building_id = req.params.building_id;
    const rooms_type_id = req.params.rooms_type_id;

    if (!decoded) {
        res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
        return;
    }
    const hostel = new Hostel(building_id, null, null, null, null, null, null, null);
    const rows = (await hostel.get_owner()).rows;

    if (!rows.length || rows[0].email_id != decoded.email) {
        res.send('<script>alert("Invalid hostel"); window.location.href = "../../";</script>');
        return;
    }
    const room_type = new Room(building_id, rooms_type_id, null, null, null, null, null);
    const details = (await room_type.get_roomtype_details()).rows;

    if (!details.length) {
        res.send('<script>alert("Invalid room type"); window.location.href = "../";</script>');
        return;
    }
    const rooms = (await room_type.get_rooms()).rows;
    const residents = (await room_type.get_residents());
    res.render('view_room_type', {
        pageTitle: 'View Room Type',
        name: details[0].name,
        rent: details[0].rent,
        num_beds: details[0].num_beds,
        ac: details[0].ac,
        rooms: rooms.map(e => e.room_no),
        residents: residents
    });
}

exports.add_room = async (req, res, next) => {
    const decoded = verify.authenticate(req);
    const building_id = req.params.building_id;
    const rooms_type_id = req.params.rooms_type_id;
    let room_no = req.body.room_no;

    if (!decoded) {
        res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
        return;
    }
    const hostel = new Hostel(building_id, null, null, null, null, null, null, null);
    const rows = (await hostel.get_owner()).rows;

    if (!rows.length || rows[0].email_id != decoded.email) {
        res.send('<script>alert("Invalid hostel"); window.location.href = "../../";</script>');
        return;
    }
    const room_type = new Room(building_id, rooms_type_id, null, null, null, room_no, null);
    const details = (await room_type.get_roomtype_details()).rows;

    if (!details.length) {
        res.send('<script>alert("Invalid room type"); window.location.href = "../";</script>');
        return;
    }

    if (!(/^\d+$/.test(room_no))) {
        res.send('<script>alert("Invalid room number"); window.location.href = window.location.href</script>');
        return;
    }
    room_no = parseInt(room_no);

    const rooms = (await room_type.get_rooms()).rows;
    if (rooms.map(e => e.room_no).includes(room_no)) {
        res.send('<script>alert("Already existing room number"); window.location.href = window.location.href</script>');
        return;
    }

    (await room_type.add_room());
    res.send('<script> window.location.href = window.location.href</script>');
}