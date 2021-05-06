const verify = require('../private/verify');
const Booking = require('../models/booking');

exports.get_bookingdetails = async (req, res, next) => {

    const decoded = verify.authenticate(req);
    if(decoded){
        var bookingid = req.query.id;
        booking = new Booking(bookingid);
        const details = await booking.get_all_details();
        const pics = await booking.get_photos();
        if(details.rowCount==0){
            return res.send('<script>alert("Details not found"); window.location.href = "/login";</script>');
        }else{
            if(decoded.role=='customer'){
                res.render('bookingdetails', {
                    pageTitle: 'Booking Details',
                    path: '/bookingdetails',
                    info: details.rows[0],
                    pics: pics.rows,
                });
            }
        }
    }else{
        return res.send('<script>alert("Please login first"); window.location.href = "/login";</script>');
    }
};

// exports.post_booking = async (req, res, next) => {
    
    

// }