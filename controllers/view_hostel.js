const verify = require('../private/verify');
const Building = require('../models/building');

exports.get_view_hostel = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded) {
        var building_id = req.query.id;
        building = new Building(building_id);
        const owner_email = await building.get_owner_email();
        if (owner_email.rowCount == 0 || owner_email.rows[0].email_id != decoded.email) {
            return res.send('<script>alert("Details not found"); window.location.href = "/profile";</script>');
        }
        //building_id, building_name, address, average rating, photos, additional_info, add_rooms_type view_rooms_type
        const details = await building.get_all_details();
        const pics = await building.get_photos();
        const rating = await building.get_rating();
        if(rating.rowCount){
            rating_num = parseFloat(rating.rows[0].avg_rating);
        }else{
            rating_num = 0;
        }
        rating_num = Math.round(rating_num * 100) / 100;
        
        const rooms_type = await building.get_rooms_type();
        if (details.rowCount == 0) {
            return res.send('<script>alert("Details not found"); window.location.href = "/login";</script>');
        } else {
            
            if (decoded.role == 'hostel_owner') {
                res.render('hostel_details', {
                    pageTitle: 'Hostel Details',
                    path: '/hostel_details',
                    info: details.rows[0],
                    rating: rating_num,
                    pics: pics.rows,
                    rooms_type: rooms_type.rows,
                    num_rooms_type: rooms_type.rowCount,
                });
            }
        }
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
};

exports.new_rooms_type = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded) {
        const building_id = req.body.building_id;
        //todo: redirect building_id to the page for add_rooms_type
        console.log(building_id);
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
}

exports.view_rooms_type = async (req, res, next) => {
    const decoded = verify.authenticate(req);
    if (decoded) {
        const building_id = req.body.building_id;
        const rooms_type_id = req.body.rooms_type_id;
        res.redirect('/owner/room_type_details/' + building_id + '/' + rooms_type_id);
    } else {
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }

}