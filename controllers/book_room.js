const Search = require('../models/search');
const Room = require('../models/room');
const verify = require('../private/verify');

exports.get_book_room = async (req, res, next) => {
    const decoded = verify.authenticate(req);
    const building_id = req.query.building_id;
    const rooms_type_id = req.query.rooms_type_id;
    const check_in_date = req.query.check_in_date;
    const check_out_date = req.query.check_out_date;

    if (!decoded) {
        res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
        return;
    }

    const search = new Search(null, check_in_date, check_out_date, null, null, null, null, building_id, rooms_type_id);
    const room_no = (await search.get_free_room()).rows;

    const services = (await (new Room(building_id, null, null, null, null, null, null)).get_services()).rows;
    if (!room_no.length) {
        res.send('<script>alert("No such room exists"); window.location.href="/customer";</script>');
        return;
    }

    res.render('book_room', {
        pageTitle: 'Book Room',
        building_id: building_id,
        rooms_type_id: rooms_type_id,
        room_no: room_no[0].room_num,
        check_in_date: check_in_date,
        check_out_date: check_out_date,
        services: services
    });
}

exports.post_book_room = async (req, res, next) => {
    const decoded = verify.authenticate(req);
    const building_id = req.body.building_id;
    const rooms_type_id = req.body.rooms_type_id;
    const check_in_date = req.body.check_in_date;
    const check_out_date = req.body.check_out_date;
    const room_no = req.body.room_no;
    const guests = JSON.parse(req.body.guests);
    var services = req.body.services;

    console.log(services);

    if (!Array.isArray(services)) {
        services = [].concat(services);
    }

    if (!decoded) {
        res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
        return;
    }

    await ((new Room(building_id, rooms_type_id, null, null, null, room_no, null)).book_room(guests, services, decoded.email, check_in_date, check_out_date));
    res.redirect('/profile');
}