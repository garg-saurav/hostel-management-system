const Owner = require('../models/customer');
const Keys = require('../private/keys');
const jwt = require('jsonwebtoken');
const Person = require('../models/person');
const Hostel = require('../models/hostel');
const Room = require('../models/room');

const JWT_SECRET = Keys.JWT_SECRET;

exports.get_add_room = async (req, res, next) => {
    try {
        if (req.session.jwtoken) {
            let decoded;
            try {
                decoded = jwt.verify(req.session.jwtoken, JWT_SECRET);
            } catch (e) { // token verification failed
                req.session.jwtoken = null;
                return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
            }
            person = new Person(decoded.email);
            const user = await person.get_user();
            if (user.rowCount == 0) {
                return res.send('<script>alert("Details not found"); window.location.href = "/login";</script>');
            } else {
                Room.view_room_type().then(x => {
                    res.render('add_room', {
                        pageTitle: 'Add Room',
                        path: '/room/add_room',
                        services: [],
                        room_type: x.rows
                    }
                        //console.log(x.rows)
                    )
                });
            }
        } else {
            return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
        }
    } catch (e) {
        throw (e);
    }

}

exports.post_add_room = async (req, res, next) => {
    const rooms_type_id = req.body.rooms_type_id;
    const rent = req.body.rent;
    const num_beds = req.body.num_beds;
    const ac = req.body.ac;
    const room_no = req.body.room_no;
    const available = req.body.available;

    const decoded = verify.authenticate(req)

    if (decoded) {
        const person = new Person(decoded.email);
        const user = await person.get_user();
        if (user.rowCount == 0) {
            res.send('<script>alert("Details not found"); window.location.href = "/login";</script>');
        } else {
            const room = new Room(building_id, rooms_type_id, rent, num_beds, ac, room_no, available);
            await hostel.add_room();
            res.redirect('/owner/hostel');
            // TODO - redirect to /owner/hostel_request
        }
    }
    else {
        res.send('<script>alert("Please login first"); window.location.href = "/owner/login";</script>');
    }
}