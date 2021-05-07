const Building = require('../models/building');
const verify = require('../private/verify');
const Room = require('../models/room');

exports.get_add_room_type = async (req, res, next) => {
    const decoded = verify.authenticate(req);
    if (decoded) {
        const building_id = req.body.building_id;
        if (decoded.role == 'hostel_owner') {
            res.render('add_room_type', {
                pageTitle: 'Add New Room Type',
                path: '/add_room_type',
                info: building_id
            });
        }
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
    
}

exports.post_add_room_type = async (req, res, next) => {
    const decoded = verify.authenticate(req);

    if (decoded) {
        const building_id = req.body.building_id;
        const rent = req.body.rent;
        const num_beds = req.body.num_beds;
        const ac = req.body.approve_or_reject;
        const boo = true;
        if(ac=="non_ac"){
            boo = false;
        }
        room = new Room(building_id, null, rent, num_beds, boo, null, null);
        await room.add_room_type();
        res.redirect('/owner/hostel/?id='+building_id);
    }
    else {
        res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
}