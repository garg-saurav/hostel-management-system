const Building = require('../models/building');
const verify = require('../private/verify');

exports.get_hostel_details = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if (decoded) {
        var building_id = req.query.id;
        building = new Building(building_id);
        
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
            
            if (decoded.role == 'regional_manager') {
                res.render('hostel_details_manager', {
                    pageTitle: 'Hostel Details',
                    path: '/hostel_details_manager',
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